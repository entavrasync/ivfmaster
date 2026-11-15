import assert from 'node:assert/strict'
import test from 'node:test'
import { createRequire, registerHooks } from 'node:module'
import { createSchema, validateDocument } from 'sanity'
import config from '../sanity.config.ts'
import { localizePublication, localizePublicationBody, resolvePublications } from '../sanity/lib/publication-model.ts'
import { parsePublicationMedia, youtubeThumbnail } from '../sanity/lib/publication-media.ts'
import { publicationsQuery } from '../sanity/lib/publication-query.ts'
import { globalsQuery } from '../sanity/reference/queries/globals.ts'
import { resolveSiteChrome } from '../sanity/lib/site-content-mapping.ts'
import { resolveSiteImage } from '../sanity/lib/site-content-mapping.ts'
import { blocks, newsFixture, eventFixture, newsCategory, eventCategory } from './publication-fixtures.mjs'
import { createPublicationDemo, mockArtwork } from './publication-demo-content.mjs'
import { orderPublications, spotlightPublications } from '../components/publications/listing-order.ts'
import { featuredHolders } from '../sanity/studio/FeaturedSlots.ts'

const require = createRequire(import.meta.url)
const groq = createRequire(require.resolve('sanity'))('groq-js')
const schema = createSchema({ name: 'publication-workflow', types: config.schema.types })
const evaluate = async (source, dataset, params) => (await groq.evaluate(groq.parse(source), { dataset, params })).get()
const project = async (dataset, type = 'news', preview = false) => evaluate(publicationsQuery, dataset, { type, preview })
const dataset = [newsCategory, eventCategory, newsFixture, eventFixture]
// Other published featured speeches, as `{ title, position }`, returned to the featured-position check.
let featuredOthers = []
const nativeClient = { withConfig() { return this }, fetch: async (source, params) => source.includes('featured == true') ? featuredOthers : source.startsWith('!defined') ? true : source.includes('publicationCategory') ? [newsCategory, eventCategory].some(item => item._id === params.id && item.scope === params.scope) : source.startsWith('count') ? false : null }
const validate = async doc => (await validateDocument({ document: doc, workspace: { schema }, getClient: () => nativeClient, getDocumentExists: async () => true })).filter(marker => marker.level === 'error')

test('native Studio models validate complete speeches/categories and field-specific editorial errors', async () => {
  assert.deepEqual(schema._validation, [])
  for (const doc of dataset) assert.deepEqual(await validate(doc), [], doc._type)
  for (const fixture of [newsFixture, eventFixture]) {
    const errors = await validate({ ...fixture, title: { en: ' ' }, summary: undefined, body: { en: [] }, publishedAt: undefined, reviewStatus: 'pendingReview' })
    for (const field of ['title', 'summary', 'body', 'publishedAt', 'reviewStatus']) assert(errors.some(error => error.path[0] === field), `${fixture._type}: ${field}`)
  }
  assert((await validate({ ...newsFixture, category: { _type: 'reference', _ref: eventCategory._id } })).some(error => error.path[0] === 'category'))
  assert((await validate({ ...eventFixture, category: { _type: 'reference', _ref: newsCategory._id } })).some(error => error.path[0] === 'category'))
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

test('patient speeches use exactly the medical-speech form and keep their credit and sources', async () => {
  const news = schema.get('news'), event = schema.get('event')
  const fields = type => type.fields.map(field => [field.name, field.type.name, field.group])

  assert.deepEqual(fields(event), fields(news))
  assert.deepEqual(event.groups.map(group => group.name), news.groups.map(group => group.name))
  const credited = { ...eventFixture, author: { en: 'IVFMaster' }, authorKind: 'Organization', relatedLinks: [{ _key: 'source', label: { en: 'Programme' }, url: 'https://www.ivfmaster.in/about' }] }
  assert.deepEqual(await validate(credited), [])
  const [resolved] = resolvePublications(await project([eventCategory, credited], 'event'))
  assert.equal(resolved.author.en, 'IVFMaster')
  assert.equal(resolved.relatedLinks[0].url, 'https://www.ivfmaster.in/about')
})

test('Studio names each speech audience in the form, Create menu, previews and categories', () => {
  const news = schema.get('news'), event = schema.get('event'), category = schema.get('publicationCategory')
  const subtitle = (type, value) => type.preview.prepare(value).subtitle

  assert.equal(news.title, 'Speech for Medical Professionals')
  assert.equal(event.title, 'Speech for Patients')
  assert.notEqual(news.icon, event.icon)
  assert.notEqual(news.components.input, event.components.input)
  assert.equal(subtitle(event, { title: 'T', date: '2026-11-01T00:00:00Z', featured: true, position: 2 }), 'Patients · Featured #2 · 2026-11-01')
  assert.equal(subtitle(news, { title: 'T', date: '2026-11-01T00:00:00Z' }), 'Medical professionals · 2026-11-01')
  assert.equal(subtitle(category, { title: 'C', scope: 'event' }), 'For patients')
  assert.equal(subtitle(category, { title: 'C', scope: 'news' }), 'For medical professionals')
})

test('featured-spot panel uses each speech’s latest edit and excludes the open speech', () => {
  const rows = [
    { _id: 'a', title: 'Live first', featured: true, featuredPosition: 1 },
    { _id: 'b', title: 'Live second', featured: true, featuredPosition: 2 },
    { _id: 'drafts.b', title: 'Live second', featured: false, featuredPosition: null },
    { _id: 'drafts.c', title: 'New third', featured: true, featuredPosition: 3 },
    { _id: 'self', title: 'Open speech', featured: true, featuredPosition: 2 },
    { _id: 'd', title: 'Not featured', featured: false },
  ]

  const holders = featuredHolders(rows, 'self')

  assert.deepEqual(holders.map(holder => [holder.id, holder.position, holder.live, holder.unpublishedChange]), [['a', 1, true, false], ['c', 3, false, true]])
})

test('both speech pages offer an editable heading and the shared SEO object', () => {
  for (const name of ['medicalSpeechesPage', 'patientSpeechesPage']) {
    const page = schema.get(name), fields = Object.fromEntries(page.fields.map(field => [field.name, field.type.name]))

    assert.equal(fields.heading, 'localizedString', name)
    assert.equal(fields.intro, 'localizedText', name)
    assert.equal(fields.seo, 'seo', name)
    assert.equal(page.initialValue().reviewStatus, 'pendingReview', name)
  }
  assert.equal(schema.get('medicalSpeechesPage').initialValue().heading.en, 'Speeches for Medical Professionals')
  assert.equal(schema.get('patientSpeechesPage').initialValue().heading.en, 'Speeches for Patients')
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

test('patient speech readers drop retired event fields from stored documents', async () => {
  const legacy = { ...eventFixture, startAt: '2030-11-01T04:30:00Z', status: 'scheduled', venue: { en: 'Old venue' }, registrationUrl: 'https://example.com/register' }

  const [resolved] = resolvePublications(await project([eventCategory, legacy], 'event'))

  assert.equal(resolved.publishedAt, eventFixture.publishedAt)
  for (const field of ['startAt', 'status', 'venue', 'registrationUrl']) assert.equal(field in resolved, false, field)
})

test('Studio allows at most three featured speeches, each with its own position', async () => {
  const positionErrors = async (doc, others) => {
    featuredOthers = others
    try { return (await validate(doc)).filter(error => error.path[0] === 'featuredPosition').map(error => error.message) } finally { featuredOthers = [] }
  }

  const missing = await positionErrors({ ...newsFixture, featuredPosition: undefined }, [])
  const taken = await positionErrors({ ...newsFixture, featuredPosition: 2 }, [{ title: 'Earlier speech', position: 2 }])
  const full = await positionErrors({ ...newsFixture, featuredPosition: 3 }, [1, 2, 3].map(position => ({ title: `Speech ${position}`, position: position === 3 ? null : position })))
  const free = await positionErrors({ ...newsFixture, featuredPosition: 3 }, [{ title: 'One', position: 1 }, { title: 'Two', position: 2 }])
  const notFeatured = await positionErrors({ ...newsFixture, featured: false, featuredPosition: undefined }, [1, 2, 3].map(position => ({ title: 'x', position })))

  assert.match(missing[0], /Choose a featured position from 1 to 3/)
  assert.match(taken[0], /Position 2 is already used by “Earlier speech”/)
  assert.match(full[0], /3 speeches are already featured/)
  assert.deepEqual(free, [])
  assert.deepEqual(notFeatured, [])
})

test('top cards follow featured positions, then fill empty slots with the newest speeches', async () => {
  const [base] = resolvePublications(await project(dataset))
  const doc = (id, publishedAt, featuredPosition) => ({ ...base, _id: id, publishedAt, featured: featuredPosition != null, featuredPosition })
  const ordered = orderPublications([
    doc('newest', '2026-10-30T00:00:00Z'), doc('second-pick', '2026-10-01T00:00:00Z', 2),
    doc('first-pick', '2026-09-01T00:00:00Z', 1), doc('older', '2026-08-01T00:00:00Z'),
  ])

  const twoFeatured = spotlightPublications(ordered).map(item => item._id)
  const noneFeatured = spotlightPublications(ordered.map(item => ({ ...item, featured: false }))).map(item => item._id)

  assert.deepEqual(twoFeatured, ['first-pick', 'second-pick', 'newest'])
  assert.deepEqual(noneFeatured, ['newest', 'second-pick', 'first-pick'])
})

test('speech listings order newest first by absolute publication time without mutating cached records', async () => {
  const [base] = resolvePublications(await project(dataset, 'event'))
  const speeches = [
    { ...base, _id: 'older', publishedAt: '2026-10-26T11:00:00+05:30' },
    { ...base, _id: 'newer', publishedAt: '2026-10-26T09:00:00Z' },
    { ...base, _id: 'b-tie', publishedAt: '2026-10-20T00:00:00Z' },
    { ...base, _id: 'a-tie', publishedAt: '2026-10-20T00:00:00Z' },
  ]

  const ordered = orderPublications(speeches).map(doc => doc._id)

  assert.deepEqual(ordered, ['newer', 'older', 'a-tie', 'b-tie'])
  assert.equal(speeches[0]._id, 'older', 'Sorting must not mutate cached CMS records')
})

test('expanded editorial demo covers three categories per speech type', async () => {
  const now = Date.parse('2026-10-27T06:00:00Z'), demo = createPublicationDemo({ now })
  const published = demo.documents.map(doc => ({ ...doc, _id: doc._id.slice(7), _updatedAt: new Date(now).toISOString(), reviewStatus: 'approved' }))
  const news = resolvePublications(await project(published, 'news'))
  const events = resolvePublications(await project(published, 'event'))
  assert.equal(news.length, 16)
  assert.equal(events.length, 28)
  assert.equal(new Set(news.map(doc => doc.category.slug.current)).size, 3)
  assert.equal(new Set(events.map(doc => doc.category.slug.current)).size, 3)
  assert(events.every(doc => Date.parse(doc.publishedAt) < now), 'Demo patient speeches are already published')
  assert(events.some(doc => doc.media?.some(item => item.url.includes('youtu.be'))))
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
  assert.equal(mapped[0].href, '/speeches/medical-professionals', 'Published pre-rename paths map to the current address')
  assert.deepEqual(mapped[0].children.map(item => item.href), ['/speeches/medical-professionals', '/speeches/patients', '/educate-ivf'])
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
  const mapped = resolveSiteChrome(await evaluate(globalsQuery, [doc], { locale: 'en' })).navigation
  assert.deepEqual(mapped.find(item => item.key === dropdown._key).children.map(item => item.href), ['/speeches/medical-professionals', '/speeches/patients'])
  dropdown.children = [{ _key: 'patients', _type: 'navDestination', label: { en: 'For Patients', mr: 'रुग्णांसाठी' }, link: { kind: 'internal', internalPath: '/speeches/patients' } }]
  assert.deepEqual(await validate(doc), [], 'Current speech paths validate in Studio')
  assert.deepEqual(resolveSiteChrome(await evaluate(globalsQuery, [doc], { locale: 'en' })).navigation.at(-1).children.map(item => item.href), ['/speeches/patients'])
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
