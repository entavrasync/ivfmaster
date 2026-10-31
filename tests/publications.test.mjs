import assert from 'node:assert/strict'
import test from 'node:test'
import { createRequire, registerHooks } from 'node:module'
import { createSchema, validateDocument } from 'sanity'
import config from '../sanity.config.ts'
import { eventLifecycle, localizePublication, localizePublicationBody, resolvePublications } from '../sanity/lib/publication-model.ts'
import { parsePublicationMedia, youtubeThumbnail } from '../sanity/lib/publication-media.ts'
import { publicationsQuery } from '../sanity/lib/publication-query.ts'
import { globalsQuery } from '../sanity/reference/queries/globals.ts'
import { resolveSiteChrome } from '../sanity/lib/site-content-mapping.ts'
import { resolveSiteImage } from '../sanity/lib/site-content-mapping.ts'
import { blocks, newsFixture, eventFixture, newsCategory, eventCategory } from './publication-fixtures.mjs'
import { createPublicationDemo, mockArtwork } from './publication-demo-content.mjs'
import { orderPublications } from '../components/publications/listing-order.ts'

const require = createRequire(import.meta.url)
const groq = createRequire(require.resolve('sanity'))('groq-js')
const schema = createSchema({ name: 'publication-workflow', types: config.schema.types })
const evaluate = async (source, dataset, params) => (await groq.evaluate(groq.parse(source), { dataset, params })).get()
const project = async (dataset, type = 'news', preview = false) => evaluate(publicationsQuery, dataset, { type, preview })
const dataset = [newsCategory, eventCategory, newsFixture, eventFixture]
const nativeClient = { withConfig() { return this }, fetch: async (source, params) => source.startsWith('!defined') ? true : source.includes('publicationCategory') ? [newsCategory, eventCategory].some(item => item._id === params.id && item.scope === params.scope) : source.startsWith('count') ? false : null }
const validate = async doc => (await validateDocument({ document: doc, workspace: { schema }, getClient: () => nativeClient, getDocumentExists: async () => true })).filter(marker => marker.level === 'error')

test('native Studio models validate complete stories/events/categories and field-specific editorial errors', async () => {
  assert.deepEqual(schema._validation, [])
  for (const doc of dataset) assert.deepEqual(await validate(doc), [], doc._type)
  const invalid = { ...eventFixture, endAt: eventFixture.startAt, reviewStatus: 'pendingReview', venue: { en: '' }, timezone: 'not/a/timezone' }
  const paths = (await validate(invalid)).map(marker => marker.path.join('.'))
  for (const field of ['endAt', 'reviewStatus', 'venue', 'timezone']) assert(paths.some(path => path.startsWith(field)), field)
  const newsErrors = await validate({ ...newsFixture, title: { en: ' ' }, summary: undefined, body: { en: [] } })
  for (const field of ['title', 'summary', 'body']) assert(newsErrors.some(error => error.path[0] === field), field)
  assert((await validate({ ...eventFixture, attendanceMode: 'online', venue: undefined, onlineUrl: 'javascript:alert(1)' })).some(error => error.path[0] === 'onlineUrl'))
  assert((await validate({ ...newsFixture, category: { _type: 'reference', _ref: eventCategory._id } })).some(error => error.path[0] === 'category'))
})

test('actual GROQ and runtime readers isolate drafts, approvals, invalid siblings and duplicate URLs', async () => {
  const rows = await project([...dataset, { ...newsFixture, _id: 'drafts.secret', slug: { current: 'secret' } }, { ...newsFixture, _id: 'pending', reviewStatus: 'pendingReview' }, { ...newsFixture, _id: 'versions.release.story' }])
  assert.equal(rows.length, 1)
  assert.equal(resolvePublications(rows)[0].slug.current, newsFixture.slug.current)
  assert.equal(resolvePublications(await project(dataset, 'event'))[0]._type, 'event')
  assert.equal(resolvePublications([...rows, { ...rows[0], _id: 'broken', title: {} }]).length, 1)
  assert.equal(resolvePublications([...rows, { ...rows[0], _id: 'duplicate' }]).length, 0)
  const draft = { ...rows[0], _id: 'drafts.story', reviewStatus: 'pendingReview' }
  assert.equal(resolvePublications([draft]).length, 0)
  assert.equal(resolvePublications([draft], true).length, 1)
  const wrongCategory = { ...rows[0], category: eventCategory }
  assert.equal(resolvePublications([wrongCategory]).length, 0)
})

test('localized copy and body fall back to English without changing Article contracts', () => {
  assert.equal(localizePublication({ en: 'English', mr: '  ' }, 'mr'), 'English')
  assert.equal(localizePublication({ en: 'English', mr: 'मराठी' }, 'mr'), 'मराठी')
  assert.deepEqual(localizePublicationBody({ en: blocks }, 'mr'), blocks)
})

test('published addresses remain stable and optional SEO/author fields can be cleared', async () => {
  const original = nativeClient.fetch
  try {
    nativeClient.fetch = async (source, params) => source.startsWith('*[_id == $id]') ? 'old-address' : original(source, params)
    assert((await validate(newsFixture)).some(error => error.path[0] === 'slug' && error.message.includes('Keep the published address')))
  } finally { nativeClient.fetch = original }
  assert.deepEqual(await validate({ ...newsFixture, author: { en: '', mr: '' }, seo: { metaTitle: { en: '' }, metaDescription: { en: '' } } }), [])
  const rows = await project(dataset)
  assert.equal(resolvePublications([{ ...rows[0], author: { en: '' } }]).length, 1)
})

test('actual media projection retains native fallback assets, replacement and removal', async () => {
  const asset = { _id: 'image-fallback-1200x800-jpg', _type: 'sanity.imageAsset', url: 'https://cdn.sanity.io/images/4k9zwr7s/production/fallback-1200x800.jpg', metadata: { dimensions: { width: 1200, height: 800 } } }
  const replacement = { ...asset, _id: 'image-replacement-1200x800-jpg', url: 'https://cdn.sanity.io/images/4k9zwr7s/production/replacement-1200x800.jpg' }
  const doc = structuredClone(newsFixture)
  doc.media = [{ _key: 'social', url: 'https://www.instagram.com/p/ABC_123-/', thumbnail: { _type: 'publicationImage', asset: { _type: 'reference', _ref: asset._id }, alt: { en: 'Editor fallback' } } }]
  const image = async () => (await project([newsCategory, doc, asset, replacement]))[0].media[0].thumbnail
  const first = await image()
  assert.match(resolveSiteImage({ ...first, alt: first.alt.en }).image.src, /fallback-1200x800/)
  doc.media[0].thumbnail.asset._ref = replacement._id
  assert.match((await image()).url, /replacement-1200x800/)
  delete doc.media[0].thumbnail
  assert.equal(await image(), null)
})

test('events move at absolute boundaries and statuses suppress registration consistently', () => {
  const event = { ...eventFixture, startAt: '2026-10-27T10:00:00+05:30', endAt: '2026-10-27T11:00:00+05:30' }
  assert.equal(eventLifecycle(event, Date.parse('2026-10-27T04:29:59Z')).state, 'scheduled')
  assert.equal(eventLifecycle(event, Date.parse('2026-10-27T04:30:00Z')).state, 'inProgress')
  assert.equal(eventLifecycle(event, Date.parse('2026-10-27T05:30:00Z')).group, 'past')
  assert.equal(eventLifecycle(event, Date.parse('2026-10-27T05:30:00Z')).canRegister, false)
  for (const status of ['cancelled', 'held', 'postponed']) assert.equal(eventLifecycle({ ...event, status }, 0).canRegister, false)
  assert.equal(eventLifecycle({ ...event, status: 'held' }, 0).group, 'past')
  assert.equal(eventLifecycle({ ...event, status: 'postponed' }, Date.parse('2040-01-01T00:00:00Z')).group, 'upcoming')
  assert.equal(eventLifecycle({ ...event, status: 'cancelled' }, Date.parse(event.endAt)).group, 'past')
  // A daylight-saving transition is still two absolute instants, not local string comparison.
  assert.equal(eventLifecycle({ ...event, startAt: '2026-11-01T01:30:00-04:00', endAt: '2026-11-01T01:30:00-05:00' }, Date.parse('2026-11-01T06:00:00Z')).state, 'inProgress')
})

test('event discovery prioritizes attendable sessions and orders absolute dates across timezones', async () => {
  const [base] = resolvePublications(await project(dataset, 'event'))
  const now = Date.parse('2026-10-27T05:00:00Z')
  const events = [
    { ...base, _id: 'postponed', status: 'postponed', startAt: '2026-01-01T09:00:00Z' },
    { ...base, _id: 'cancelled', status: 'cancelled', startAt: '2026-10-28T09:00:00Z' },
    { ...base, _id: 'later', status: 'scheduled', startAt: '2026-10-29T09:00:00+01:00' },
    { ...base, _id: 'earlier', status: 'scheduled', startAt: '2026-10-29T10:00:00+05:30' },
    { ...base, _id: 'live', status: 'scheduled', startAt: '2026-10-27T04:30:00Z', endAt: '2026-10-27T06:00:00Z' },
  ]
  assert.deepEqual(orderPublications(events, 'upcoming', now).map(doc => doc._id), ['live', 'earlier', 'later', 'cancelled', 'postponed'])
  assert.equal(events[0]._id, 'postponed', 'Sorting must not mutate cached CMS records')
  assert.deepEqual(orderPublications([
    { ...base, _id: 'older', endAt: '2026-10-26T11:00:00+05:30' },
    { ...base, _id: 'newer', endAt: '2026-10-26T09:00:00Z' },
  ], 'past', now).map(doc => doc._id), ['newer', 'older'])
})

test('expanded editorial demo covers three categories per type and pagination-sized event lifecycles', async () => {
  const now = Date.parse('2026-10-27T06:00:00Z'), demo = createPublicationDemo({ now })
  const published = demo.documents.map(doc => ({ ...doc, _id: doc._id.slice(7), _updatedAt: new Date(now).toISOString(), reviewStatus: 'approved' }))
  const news = resolvePublications(await project(published, 'news'))
  const events = resolvePublications(await project(published, 'event'))
  assert.equal(news.length, 16)
  assert.equal(events.length, 28)
  assert.equal(new Set(news.map(doc => doc.category.slug.current)).size, 3)
  assert.equal(new Set(events.map(doc => doc.category.slug.current)).size, 3)
  assert.equal(events.filter(doc => eventLifecycle(doc, now).group === 'upcoming').length, 14)
  assert.equal(events.filter(doc => eventLifecycle(doc, now).group === 'past').length, 14)
  for (const state of ['scheduled', 'inProgress', 'held', 'cancelled', 'postponed']) assert(events.some(doc => eventLifecycle(doc, now).state === state), state)
  assert(news.some(doc => doc.media?.some(item => item.url.includes('instagram'))))
  assert(news.some(doc => doc.media?.some(item => item.url.includes('youtu.be'))))
})

test('all enriched mock documents pass native Studio validation when approved locally with their categories', async () => {
  const now = Date.parse('2026-10-27T06:00:00Z')
  const assets = mockArtwork.map((art, index) => ({
    _id: `image-mock${index}-1600x900-png`, _type: 'sanity.imageAsset',
    originalFilename: `ivfmaster-mock-${art.key}.png`,
    url: `https://cdn.sanity.io/images/4k9zwr7s/production/mock${index}-1600x900.png`,
    dimensions: { width: 1600, height: 900 }, metadata: { dimensions: { width: 1600, height: 900 } },
  }))
  const demo = createPublicationDemo({ assets, now })
  const published = demo.documents.map(doc => ({ ...doc, _id: doc._id.slice(7), _updatedAt: new Date(now).toISOString(), reviewStatus: doc._type === 'publicationCategory' ? undefined : 'approved' }))
  const records = [...published, ...assets]
  const reader = { withConfig() { return this }, fetch: (source, params) => evaluate(source, records, params) }
  for (const document of published) {
    const errors = (await validateDocument({ document, workspace: { schema }, getClient: () => reader, getDocumentExists: async ({ id }) => records.some(record => record._id === id) })).filter(marker => marker.level === 'error')
    assert.deepEqual(errors.map(marker => ({ path: marker.path, message: marker.message })), [], document.slug.current)
  }
  const stories = [...demo.news, ...demo.events]
  assert.equal(new Set(stories.map(doc => doc.title.en)).size, 44)
  assert.equal(new Set(stories.map(doc => doc.summary.en)).size, 44)
  assert(stories.every(doc => doc.reviewStatus === 'pendingReview' && doc.seo.noIndex && doc.seo.visibilityReason))
  assert.equal(stories.filter(doc => doc.body.mr).length, 4)
  assert(stories.some(doc => !doc.coverImage && !doc.media && !doc.author))
  assert(stories.some(doc => doc.body.en.some(block => block.listItem === 'bullet')))
  assert(demo.events.some(doc => doc.timezone === 'America/New_York'))
  assert(demo.events.some(doc => doc.recap && doc.gallery && doc.recordingUrl))
  const media = demo.news.flatMap(doc => doc.media ?? [])
  for (const form of ['watch?', 'youtu.be/', '/shorts/', '/live/', 'instagram.com/']) assert(media.some(item => item.url.includes(form)), form)
  assert(media.some(item => !item.thumbnail))
  assert(media.filter(item => item.thumbnail).every(item => item.thumbnail.asset._ref === assets.at(-1)._id))
  const withoutAssets = createPublicationDemo({ now })
  assert(withoutAssets.news.every(doc => !doc.coverImage && (doc.media ?? []).every(item => !item.thumbnail)))
  assert.equal(resolvePublications(await project(records, 'news')).length, 16)
  assert.equal(resolvePublications(await project(records, 'event')).length, 28)
})

test('media accepts supported YouTube/Instagram forms and rejects host spoofing and unsupported URLs', () => {
  for (const url of ['https://youtube.com/watch?v=M7lc1UVf-VE&t=3', 'https://youtu.be/M7lc1UVf-VE', 'https://www.youtube.com/shorts/M7lc1UVf-VE', 'https://m.youtube.com/live/M7lc1UVf-VE', 'https://www.youtube-nocookie.com/embed/M7lc1UVf-VE']) assert.equal(parsePublicationMedia(url)?.id, 'M7lc1UVf-VE')
  assert.equal(youtubeThumbnail('M7lc1UVf-VE'), 'https://i.ytimg.com/vi/M7lc1UVf-VE/hqdefault.jpg')
  for (const type of ['p', 'reel', 'tv']) assert.equal(parsePublicationMedia(`https://instagram.com/${type}/ABC_123-/?utm_source=copy`)?.url, `https://www.instagram.com/${type}/ABC_123-/`)
  for (const url of ['http://youtu.be/M7lc1UVf-VE', 'https://youtube.com.evil.test/watch?v=M7lc1UVf-VE', 'https://youtube.com@evil.test/watch?v=M7lc1UVf-VE', 'https://youtube.com/playlist?list=abc', 'https://instagram.com/stories/person/123', 'javascript:alert(1)', 'https://localhost/private', 'https://youtube.com:444/watch?v=M7lc1UVf-VE']) assert.equal(parsePublicationMedia(url), null, url)
})

test('CMS nested navigation passes actual projection/mapping and stays within one level', async () => {
  const navigation = { _id: 'navigation', _type: 'navigation', reviewStatus: 'approved', items: [{ _key: 'publication', label: { en: 'News & Events', mr: 'बातम्या आणि कार्यक्रम' }, link: { kind: 'internal', internalPath: '/news' }, children: [
    { _key: 'news', label: { en: 'News' }, link: { kind: 'internal', internalPath: '/news' } },
    { _key: 'events', label: { en: 'Events' }, link: { kind: 'internal', internalPath: '/events' } },
    { _key: 'education', label: { en: 'Articles' }, link: { kind: 'internal', internalPath: '/educate-ivf' } },
  ] }] }
  const mapped = resolveSiteChrome(await evaluate(globalsQuery, [navigation], { locale: 'mr' })).navigation
  assert.equal(mapped[0].label, 'बातम्या आणि कार्यक्रम')
  assert.deepEqual(mapped[0].children.map(item => item.href), ['/news', '/events', '/educate-ivf'])
})

test('dropdown-only headers publish without a destination and ignore retained hidden paths', async () => {
  const initial = config.schema.types.find(type => type.name === 'navigation').initialValue()
  const dropdown = { _key: 'publications', _type: 'navItem', behavior: 'dropdown', label: { en: 'News & Events', mr: 'बातम्या आणि कार्यक्रम' }, children: [
    { _key: 'news', _type: 'navDestination', label: { en: 'News', mr: 'बातम्या' }, link: { kind: 'internal', internalPath: '/news' } },
    { _key: 'events', _type: 'navDestination', label: { en: 'Events', mr: 'कार्यक्रम' }, link: { kind: 'internal', internalPath: '/events' } },
  ] }
  const doc = { ...structuredClone(initial), _id: 'navigation', _type: 'navigation', reviewStatus: 'approved', items: [...initial.items.slice(0, 4), dropdown] }
  assert.deepEqual(await validate(doc), [])
  for (const stale of [{ kind: 'internal', internalPath: '/news-events' }, { kind: 'internal', internalPath: '/en/news' }, { kind: 'external', externalUrl: 'invalid' }, { kind: 'anchor', anchor: '' }]) {
    dropdown.link = stale
    assert.deepEqual(await validate(doc), [], JSON.stringify(stale))
  }
  const mapped = resolveSiteChrome(await evaluate(globalsQuery, [doc], { locale: 'en' })).navigation.at(-1)
  assert.equal(mapped.behavior, 'dropdown')
  assert.equal(mapped.href, undefined)
  assert.deepEqual(mapped.children.map(item => item.href), ['/news', '/events'])
  dropdown.children = []
  assert((await validate(doc)).some(marker => marker.path.at(-1) === 'children'))
  dropdown.children = [{ _key: 'invalid', label: { en: 'Invalid', mr: 'चुकीचा' }, link: { kind: 'internal', internalPath: '/news-events' } }]
  assert((await validate(doc)).some(marker => marker.path.includes('children')))
  assert.equal(resolveSiteChrome(await evaluate(globalsQuery, [doc], { locale: 'en' })).navigation.some(item => item.key === dropdown._key), false)
  dropdown.behavior = 'link'; dropdown.link = { kind: 'internal', internalPath: '/news-events' }; dropdown.children = []
  assert((await validate(doc)).some(marker => marker.path.includes('link')))
})

test('actual server reader forwards published cache policy, uncached authenticated previews, and isolated failures', async t => {
  const hook = registerHooks({ resolve(specifier, context, nextResolve) {
    if (specifier === 'server-only') return { url: 'data:text/javascript,export {}', shortCircuit: true }
    if (specifier === 'next/headers') return { url: 'data:text/javascript,export const draftMode = async () => ({isEnabled: globalThis.__publicationPreview === true})', shortCircuit: true }
    return nextResolve(specifier, context)
  } })
  t.after(() => { hook.deregister(); delete globalThis.__publicationPreview })
  const { client } = await import('../sanity/lib/client.ts')
  const { getPublications } = await import('../sanity/lib/publications.ts')
  const originalFetch = client.fetch, originalConfig = client.withConfig, originalError = console.error, originalToken = process.env.SANITY_API_READ_TOKEN
  t.after(() => { client.fetch = originalFetch; client.withConfig = originalConfig; console.error = originalError; if (originalToken === undefined) delete process.env.SANITY_API_READ_TOKEN; else process.env.SANITY_API_READ_TOKEN = originalToken })
  const rows = await project(dataset)
  client.fetch = async (_source, params, options) => {
    assert.equal(params.preview, false)
    assert.deepEqual(options, { cache: 'force-cache', next: { revalidate: 60, tags: ['news', 'publications'] } })
    return rows
  }
  assert.equal((await getPublications('news')).documents.length, 1)
  globalThis.__publicationPreview = true
  delete process.env.SANITY_API_READ_TOKEN
  assert.equal((await getPublications('news')).error, true)
  process.env.SANITY_API_READ_TOKEN = 'local-fixture-never-sent'
  client.withConfig = options => {
    assert.equal(options.perspective, 'drafts')
    return { fetch: async (_source, params, options) => { assert.equal(params.preview, true); assert.deepEqual(options, { cache: 'no-store' }); return [{ ...rows[0], reviewStatus: 'pendingReview' }] } }
  }
  assert.equal((await getPublications('news')).documents.length, 1)
  globalThis.__publicationPreview = false
  console.error = () => {}
  client.fetch = async () => { throw new Error('PRIVATE_UPSTREAM_BODY') }
  assert.equal((await getPublications('news')).error, true)
})
