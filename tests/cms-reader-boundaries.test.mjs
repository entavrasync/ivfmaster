import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createRequire, registerHooks } from 'node:module'
import test from 'node:test'
import { articleSlugs } from '../sanity/article-model.ts'
import { allProceduresQuery } from '../sanity/lib/procedure-query.ts'
import { doctorsQuery, clinicSettingsQuery } from '../sanity/lib/clinic-queries.ts'
import { homeFaqQuery, aboutInformationQuery, facilityGalleryQuery } from '../sanity/lib/editorial-queries.ts'
import { articlesQuery } from '../sanity/lib/article-query.ts'
import { doctorDocument } from '../sanity/lib/clinic-mapping.ts'

const messages = JSON.parse(readFileSync(new URL('../messages/en.json', import.meta.url), 'utf8'))
const require = createRequire(import.meta.url)
const groq = createRequire(require.resolve('sanity'))('groq-js')

test('all seven actual queries exclude drafts, releases and pending approval', async () => {
  for (const [type, query, id, slug] of [
    ['procedure', allProceduresQuery, 'ivf-record', 'ivf'], ['doctor', doctorsQuery, 'doctor-record', 'gorakh-mandrupkar'],
    ['clinicSettings', clinicSettingsQuery, 'clinicSettings'], ['homeFaq', homeFaqQuery, 'faq-record'],
    ['aboutInformation', aboutInformationQuery, 'about-record'], ['facilityGallery', facilityGalleryQuery, 'gallery-record'],
    ['article', articlesQuery, 'article-record', articleSlugs[0]],
  ]) {
    const doc = { _id: id, _type: type, reviewStatus: 'approved', slug: { current: slug }, order: 0 }
    const dataset = [doc, { ...doc, _id: `drafts.${id}` }, { ...doc, _id: `versions.release.${id}` }, { ...doc, _id: 'pending', reviewStatus: 'pendingReview' }]
    const result = await (await groq.evaluate(groq.parse(query), { dataset, params: { slug: 'ivf', slugs: ['gorakh-mandrupkar', ...articleSlugs] } })).get()
    assert.deepEqual(result.map((record) => record._id), [id], type)
  }
})

test('actual doctor validator accepts target assets, rejects source/foreign URLs and retains optional portrait fallback', () => {
  const t = messages.Team.doctors.gorakh
  const doc = { _id: 'doctor-record', reviewStatus: 'approved', slug: 'gorakh-mandrupkar', order: 0,
    ...Object.fromEntries(['name', 'title', 'essence', 'intro', 'biography', 'metaDescription'].map((field) => [field, { en: t[field] }])),
    credentials: t.credentials.map((en, index) => ({ en, _key: `credential-${index}` })),
  }
  assert(doctorDocument.safeParse(doc).success)
  const image = { alt: { en: 'Existing portrait' }, asset: { _id: 'image-abc123-100x100-jpg', url: 'https://cdn.sanity.io/images/4k9zwr7s/production/abc123-100x100.jpg', metadata: { dimensions: { width: 100, height: 100 }, lqip: 'data:image/jpeg;base64,AAAA' } } }
  assert(doctorDocument.safeParse({ ...doc, portrait: image }).success)
  for (const url of ['https://cdn.sanity.io/images/kj9188w7/production/abc123-100x100.jpg', 'https://example.com/image.jpg', 'https://cdn.sanity.io/images/4k9zwr7s/staging/abc123-100x100.jpg']) {
    const invalid = structuredClone(image); invalid.asset.url = url
    assert.equal(doctorDocument.safeParse({ ...doc, portrait: invalid }).success, false)
  }
})

test('real server readers forward published-cache policy and retain fallback on absent, invalid or failed reads', async (t) => {
  // Replace only framework server context; execute the real readers, client
  // configuration and mapping. The SDK fetch method is the network boundary.
  const hook = registerHooks({ resolve(specifier, context, nextResolve) {
    if (specifier === 'server-only') return { url: 'data:text/javascript,export {}', shortCircuit: true }
    if (specifier === 'next-intl/server') return { url: 'data:text/javascript,' + encodeURIComponent(`export const getMessages = async () => ({}); export const getTranslations = async () => {throw Error('Unexpected translation request')}`), shortCircuit: true }
    return nextResolve(specifier, context)
  } })
  t.after(() => hook.deregister())
  const { client } = await import('../sanity/lib/client.ts')
  const config = client.config()
  assert.equal(config.projectId, '4k9zwr7s'); assert.equal(config.dataset, 'production')
  assert.equal(config.perspective, 'published'); assert.equal(config.useCdn, false)
  assert.equal(config.token, undefined)
  const { getProcedures } = await import('../sanity/lib/procedures.ts')
  const { getDoctorContent, getClinicSettings } = await import('../sanity/lib/clinic.ts')
  const { getHomeFaq, getAboutInformation, getFacilityGallery } = await import('../sanity/lib/editorial.ts')
  const { getArticles } = await import('../sanity/lib/articles.ts')
  const readers = [
    [getProcedures, 'procedure:ivf', (result) => Array.isArray(result) && result.some((item) => item.slug === 'ivf')],
    [getDoctorContent, 'doctors', (result) => Array.isArray(result) && result.length === 0],
    [getClinicSettings, 'clinicSettings', (result) => result === null],
    [getHomeFaq, 'homeFaq', (result) => result === null],
    [getAboutInformation, 'aboutInformation', (result) => result === null],
    [getFacilityGallery, 'facilityGallery', (result) => result === null],
    [getArticles, 'articles', (result) => result.articles.length === 7],
  ]
  const originalFetch = client.fetch, originalError = console.error
  const diagnostics = []
  console.error = (...args) => diagnostics.push(args.join(' '))
  t.after(() => { client.fetch = originalFetch; console.error = originalError })
  for (const [reader, tag, fallback] of readers) {
    for (const mode of ['missing', 'invalid', 'error']) {
      let calls = 0
      client.fetch = async (query, params, options) => {
        calls++
        assert.equal(options.cache, 'force-cache')
        assert.deepEqual(options.next, { revalidate: 60, tags: [tag] })
        assert.equal(typeof query, 'string')
        if (mode === 'error') throw new Error('PRIVATE_UPSTREAM_BODY')
        return mode === 'missing' ? [] : [{ _id: 'broken' }]
      }
      for (const locale of ['en', 'mr']) assert(fallback(await reader(locale)), `${tag}/${locale}/${mode}`)
      assert.equal(calls, 2)
    }
  }
  assert(diagnostics.some((line) => line.includes('CMS read failed')))
  assert(diagnostics.every((line) => !line.includes('PRIVATE_UPSTREAM_BODY')))
})

test('the actual page reader keeps published 60-second revalidation and forwards replacement banners', async (t) => {
  const hook = registerHooks({ resolve(specifier, context, nextResolve) {
    if (specifier === 'server-only') return { url: 'data:text/javascript,export {}', shortCircuit: true }
    return nextResolve(specifier, context)
  } })
  t.after(() => hook.deregister())
  const { client } = await import('../sanity/lib/client.ts')
  const { getSiteContent } = await import('../sanity/lib/site-content.ts')
  const { resolveSiteChrome } = await import('../sanity/lib/site-content-mapping.ts')
  const originalFetch = client.fetch
  t.after(() => { client.fetch = originalFetch })
  let replacement = 'first'
  const image = () => ({ assetId: `image-${replacement}-100x100-png`, url: `https://cdn.sanity.io/images/4k9zwr7s/production/${replacement}-100x100.png`, dimensions: { width: 100, height: 100 }, alt: 'CMS banner' })
  const tags = []
  client.fetch = async (_query, params, options) => {
    assert(['en', 'mr'].includes(params.locale))
    assert.equal(options.cache, 'force-cache')
    assert.equal(options.next.revalidate, 60)
    tags.push(options.next.tags[0])
    return options.next.tags[0] === 'homePage' ? { hero: { desktopImage: image(), mobileImage: image() } } : null
  }
  for (const locale of ['en', 'mr']) {
    const first = await getSiteContent(locale)
    assert.match(resolveSiteChrome(null, first.home).hero.desktop.image.src, new RegExp(replacement + '-100x100'))
    replacement = 'replacement'
    const updated = await getSiteContent(locale)
    assert.match(resolveSiteChrome(null, updated.home).hero.desktop.image.src, /replacement-100x100/)
  }
  assert.deepEqual([...new Set(tags)].sort(), ['homePage', 'aboutPage', 'teamPage', 'proceduresPage', 'siteGlobals', 'contactPage'].sort())
})
