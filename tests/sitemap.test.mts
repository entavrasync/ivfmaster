import assert from 'node:assert/strict'
import test from 'node:test'

import { siteConfig } from '../config/site.ts'
import { routing, type Locale } from '../i18n/routing.ts'
import { ARTICLES } from '../lib/articles.ts'
import { doctors } from '../lib/content/team.ts'
import { PROCEDURES } from '../lib/procedures.ts'
import { getLocalizedSitemapEntries } from '../lib/seo/sitemap.ts'

const VALID_CHANGE_FREQUENCIES = new Set([
  'always',
  'hourly',
  'daily',
  'weekly',
  'monthly',
  'yearly',
  'never',
])

const STATIC_INDEXABLE_PATHS = [
  '/',
  '/about',
  '/contact',
  '/procedures',
  '/educate-ivf',
  '/team',
] as const

const SITE_CONTENT_REVIEWED_AT = '2026-07-02T00:00:00.000Z'

async function getSitemapEntries() {
  return getLocalizedSitemapEntries()
}

function normalizePath(path: string): string {
  if (path === '/') return '/'
  return `/${path.replace(/^\/+|\/+$/g, '')}`
}

function localizedPath(locale: Locale, path: string): string {
  const normalizedPath = normalizePath(path)
  if (locale === routing.defaultLocale) return normalizedPath
  if (normalizedPath === '/') return `/${locale}`
  return `/${locale}${normalizedPath}`
}

function absoluteUrl(path: string): string {
  const normalizedPath = normalizePath(path)
  if (normalizedPath === '/') return siteConfig.url
  return `${siteConfig.url}${normalizedPath}`
}

function localizedUrl(locale: Locale, path: string): string {
  return absoluteUrl(localizedPath(locale, path))
}

function isoDate(value: Date | string | undefined): string {
  assert(value, 'Expected lastModified to be present')
  return new Date(value).toISOString()
}

test('sitemap includes every canonical localized public page and excludes non-routes', async () => {
  const entries = await getSitemapEntries()
  const canonicalPaths = [
    ...STATIC_INDEXABLE_PATHS,
    ...PROCEDURES.map((procedure) => `/procedures/${procedure.slug}`),
    ...ARTICLES.map((article) => `/educate-ivf/${article.slug}`),
    ...doctors.map((doctor) => `/team/${doctor.slug}`),
  ]
  const expectedUrls = canonicalPaths.flatMap((path) =>
    routing.locales.map((locale) => localizedUrl(locale, path))
  )

  assert.deepEqual(
    entries.map((entry) => entry.url).sort(),
    expectedUrls.sort()
  )

  const excludedPathFragments = [
    '/our-team',
    '/blog',
    '/faq',
    '/privacy-policy',
    '/terms-and-conditions',
    '/motion-test',
    '/style-guide',
    '/api/',
    '?',
  ]

  for (const fragment of excludedPathFragments) {
    assert.equal(
      entries.some((entry) => entry.url.includes(fragment)),
      false,
      `Unexpected sitemap URL containing ${fragment}`
    )
  }
})

test('sitemap uses stable meaningful lastModified dates instead of build time', async () => {
  const entries = await getSitemapEntries()
  const byUrl = new Map(entries.map((entry) => [entry.url, entry]))

  assert.equal(
    isoDate(byUrl.get(siteConfig.url)?.lastModified),
    SITE_CONTENT_REVIEWED_AT
  )
  assert.equal(
    isoDate(byUrl.get(absoluteUrl('/procedures/ivf'))?.lastModified),
    SITE_CONTENT_REVIEWED_AT
  )
  assert.equal(
    isoDate(byUrl.get(absoluteUrl('/team/dr-sharma'))?.lastModified),
    SITE_CONTENT_REVIEWED_AT
  )

  const article = ARTICLES[0]
  assert(article, 'Expected at least one article fixture')
  assert.equal(
    isoDate(byUrl.get(absoluteUrl(`/educate-ivf/${article.slug}`))?.lastModified),
    new Date(article.date).toISOString()
  )
})

test('sitemap priorities and change frequencies follow the SEO taxonomy', async () => {
  const entries = await getSitemapEntries()
  const byUrl = new Map(entries.map((entry) => [entry.url, entry]))

  for (const entry of entries) {
    assert.equal(entry.url.startsWith('https://'), true, `${entry.url} must be HTTPS`)
    assert.equal(entry.url.endsWith('/') && entry.url !== siteConfig.url, false)
    assert.equal(typeof entry.priority, 'number', `${entry.url} missing priority`)
    assert(entry.priority! >= 0 && entry.priority! <= 1, `${entry.url} priority out of range`)
    assert(
      VALID_CHANGE_FREQUENCIES.has(entry.changeFrequency),
      `${entry.url} has invalid changeFrequency ${entry.changeFrequency}`
    )
  }

  assert.equal(byUrl.get(siteConfig.url)?.priority, 1)
  assert.equal(byUrl.get(siteConfig.url)?.changeFrequency, 'weekly')

  assert.equal(byUrl.get(absoluteUrl('/contact'))?.priority, 0.9)
  assert.equal(byUrl.get(absoluteUrl('/procedures'))?.priority, 0.9)
  assert.equal(byUrl.get(absoluteUrl('/educate-ivf'))?.priority, 0.75)
  assert.equal(byUrl.get(absoluteUrl('/team'))?.priority, 0.85)

  assert.equal(byUrl.get(absoluteUrl('/procedures/ivf'))?.priority, 0.88)
  assert.equal(byUrl.get(absoluteUrl('/team/dr-sharma'))?.priority, 0.85)

  const article = ARTICLES[0]
  assert(article, 'Expected at least one article fixture')
  assert.equal(byUrl.get(absoluteUrl(`/educate-ivf/${article.slug}`))?.priority, 0.7)
})

test('sitemap emits hreflang alternates for every supported locale', async () => {
  const entries = await getSitemapEntries()
  const hiProcedure = entries.find(
    (entry) => entry.url === localizedUrl('hi', '/procedures/ivf')
  )

  assert(hiProcedure, 'Expected Hindi IVF procedure sitemap entry')
  assert.deepEqual(hiProcedure.alternates?.languages, {
    en: localizedUrl('en', '/procedures/ivf'),
    hi: localizedUrl('hi', '/procedures/ivf'),
    mr: localizedUrl('mr', '/procedures/ivf'),
  })
})
