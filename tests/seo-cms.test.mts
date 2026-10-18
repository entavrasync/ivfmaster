import assert from 'node:assert/strict'
import test from 'node:test'

import { buildPageMetadata } from '../lib/seo/metadata.ts'
import { buildArticleJsonLd, buildPhysicianJsonLd, buildProcedureJsonLd, buildRootJsonLd } from '../lib/seo/jsonLd.ts'
import { getLocalizedSitemapPaths } from '../lib/seo/sitemap.ts'
import { runSeoChecks, truncateForPreview } from '../sanity/lib/seo-checks.ts'
import { resolvePageSeo } from '../sanity/lib/seo-mapping.ts'

const cdnImage = { alt: { en: 'Clinic', mr: 'क्लिनिक' }, url: 'https://cdn.sanity.io/images/4k9zwr7s/production/abc-1200x630.jpg', dimensions: { width: 1200, height: 630 } }
const trail = [{ name: 'Home', path: '/' }, { name: 'Procedures', path: '/procedures' }, { name: 'IVF', path: '/procedures/ivf' }]

test('keyword checks report missing placements and good lengths', () => {
  const checks = runSeoChecks({
    keyword: 'IVF treatment',
    title: 'IVF treatment in Sangli | IVF Master',
    description: 'Gentle, step-by-step fertility care for couples, explained in plain language by the doctors at IVF Master in Urun-Ishwarpur.',
    slug: 'ivf',
    body: 'IVF is the most comprehensive fertility treatment we offer.',
  })
  const status = Object.fromEntries(checks.map((check) => [check.id, check.status]))

  assert.equal(status['keyword-title'], 'good')
  assert.equal(status['keyword-description'], 'improve')
  assert.equal(status['keyword-url'], 'improve')
  assert.equal(status['keyword-intro'], 'improve')
  assert.equal(status['title-length'], 'good')
  assert.equal(status['description-length'], 'good')
})

test('keyword checks ask for a keyword and preview text is truncated', () => {
  const checks = runSeoChecks({ title: '', description: '' })

  assert.equal(checks[0].id, 'keyword')
  assert.equal(truncateForPreview('a'.repeat(70), 60).length, 60)
})

test('page SEO resolves the visitor locale and rejects foreign images and canonicals', () => {
  const seo = resolvePageSeo({
    metaTitle: { en: 'IVF in Sangli', mr: 'सांगलीत IVF' }, focusKeyword: 'IVF Sangli', secondaryKeywords: ['test tube baby', 'IVF Sangli'],
    ogImage: cdnImage, noIndex: true, canonicalUrl: 'https://www.ivfmaster.in/procedures/ivf', structuredData: false,
  }, 'mr')

  assert.equal(seo?.title, 'सांगलीत IVF')
  assert.deepEqual(seo?.keywords, ['IVF Sangli', 'test tube baby'])
  assert.equal(seo?.ogImage?.alt, 'क्लिनिक')
  assert.equal(seo?.canonicalPath, '/procedures/ivf')
  assert.equal(seo?.noIndex, true)
  assert.equal(seo?.structuredData, false)

  const foreign = resolvePageSeo({ ogImage: { ...cdnImage, url: 'https://example.com/a.jpg' }, canonicalUrl: 'https://example.com/x' }, 'en')
  assert.equal(foreign?.ogImage, undefined)
  assert.equal(foreign?.canonicalPath, undefined)
  assert.equal(resolvePageSeo(null, 'en'), undefined)
})

test('metadata without editor SEO is unchanged', () => {
  const base = { locale: 'en' as const, path: '/procedures/ivf', title: 'IVF', description: 'About IVF' }

  assert.deepEqual(buildPageMetadata({ ...base, seo: resolvePageSeo({}, 'en') }), buildPageMetadata(base))
})

test('metadata applies editor overrides for title, social, keywords, robots and canonical', () => {
  const metadata = buildPageMetadata({
    locale: 'en', path: '/procedures/ivf', title: 'IVF', description: 'About IVF',
    seo: resolvePageSeo({ metaTitle: 'IVF in Sangli', metaDescription: 'Search copy', ogTitle: 'Share title', ogImage: cdnImage, focusKeyword: 'IVF Sangli', noIndex: true, canonicalUrl: '/procedures/icsi' }, 'en'),
  })

  assert.deepEqual(metadata.title, { absolute: 'IVF in Sangli | IVF Master' })
  assert.equal(metadata.description, 'Search copy')
  assert.deepEqual(metadata.keywords, ['IVF Sangli'])
  assert.deepEqual(metadata.robots, { index: false, follow: true })
  assert.equal(metadata.alternates?.canonical, 'https://www.ivfmaster.in/en/procedures/icsi')
  assert.equal((metadata.openGraph as { title?: string }).title, 'Share title | IVF Master')
  assert.equal((metadata.openGraph as { images?: { url: string }[] }).images?.[0].url, cdnImage.url)
})

test('site-wide social image is the fallback for pages without their own', () => {
  const metadata = buildPageMetadata({ locale: 'mr', path: '/about', title: 'About', description: 'd', fallbackSeo: resolvePageSeo({ ogImage: cdnImage }, 'mr') })

  assert.equal((metadata.twitter as { images?: { url: string }[] }).images?.[0].url, cdnImage.url)
})

test('sitemap adds CMS procedures and drops hidden or canonicalized pages', async () => {
  const paths = await getLocalizedSitemapPaths({ extraProcedureSlugs: ['egg-freezing', 'ivf'], excludedPaths: new Set(['/team/saie-mandrupkar']) })

  assert(paths.includes('/procedures/egg-freezing'))
  assert(paths.includes('/en/procedures/egg-freezing'))
  assert.equal(paths.filter((path) => path === '/procedures/ivf').length, 1)
  assert(!paths.includes('/team/saie-mandrupkar'))
})

test('procedure JSON-LD lists only the visible FAQs and links to the clinic', () => {
  const data = buildProcedureJsonLd({ locale: 'en', trail, name: 'IVF', alternateName: 'In vitro fertilisation', description: 'd', faqs: [{ q: 'Does it hurt?', a: 'Mild discomfort.' }] })
  const graph = data['@graph'] as Record<string, unknown>[]
  const faq = graph.find((node) => node['@type'] === 'FAQPage') as { mainEntity: unknown[] }

  assert.equal(faq.mainEntity.length, 1)
  assert.deepEqual((graph.find((node) => node['@type'] === 'MedicalProcedure') as { provider: unknown }).provider, { '@id': 'https://www.ivfmaster.in/#medical-clinic' })
  assert.equal((graph.at(-1) as { itemListElement: { item: string }[] }).itemListElement[2].item, 'https://www.ivfmaster.in/en/procedures/ivf')
  assert.equal(buildProcedureJsonLd({ locale: 'en', trail, name: 'IVF', alternateName: 'x', description: 'd', faqs: [] })['@graph'].some((node) => node['@type'] === 'FAQPage'), false)
})

test('doctor JSON-LD extends the clinic-level Physician node and articles credit the clinic', () => {
  const doctor = buildPhysicianJsonLd({ locale: 'mr', trail, slug: 'gorakh-mandrupkar', name: 'Dr. Gorakh Mandrupkar', jobTitle: 'IVF specialist', description: 'd' })
  const rootIds = (buildRootJsonLd()['@graph'] as readonly { '@id'?: string }[]).map((node) => node['@id'])
  const physician = (doctor['@graph'] as { '@type': string; '@id'?: string }[]).find((node) => node['@type'] === 'Physician')

  assert(rootIds.includes(physician?.['@id']))
  const article = buildArticleJsonLd({ locale: 'en', trail, headline: 'PCOS', description: 'd', datePublished: '2026-01-01' })
  assert.equal((article['@graph'][0] as { '@type': string })['@type'], 'BlogPosting')
})
