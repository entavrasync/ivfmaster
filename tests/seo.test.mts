import assert from 'node:assert/strict'
import test from 'node:test'

import {
  buildAbsoluteUrl,
  buildLocalizedPath,
  getLocalizedAlternates,
} from '../lib/seo/routes.ts'
import { buildPageMetadata } from '../lib/seo/metadata.ts'
import { getLocalizedSitemapPaths } from '../lib/seo/sitemap.ts'

test('builds canonical URLs with clean default-locale paths', () => {
  assert.equal(buildLocalizedPath('mr', '/contact'), '/contact')
  assert.equal(buildLocalizedPath('en', '/contact'), '/en/contact')
  assert.equal(buildAbsoluteUrl('/en/contact'), 'https://www.ivfmaster.in/en/contact')
})

test('builds hreflang alternates for every configured locale', () => {
  assert.deepEqual(getLocalizedAlternates('/procedures/ivf'), {
    mr: 'https://www.ivfmaster.in/procedures/ivf',
    en: 'https://www.ivfmaster.in/en/procedures/ivf',
  })
})

test('enumerates all localized routes used by the sitemap', async () => {
  const localizedRoutes = await getLocalizedSitemapPaths()

  assert(localizedRoutes.includes('/contact'))
  assert(localizedRoutes.includes('/en/contact'))
  assert(localizedRoutes.includes('/educate-ivf/what-ivf-really-is'))
  assert(localizedRoutes.includes('/en/procedures/ivf'))
  assert(localizedRoutes.includes('/team/gorakh-mandrupkar'))
})

test('builds route-specific canonical and social metadata', () => {
  const metadata = buildPageMetadata({
    locale: 'en',
    path: '/contact',
    title: 'Contact IVF Master',
    description: 'Contact the clinic.',
  })

  assert.deepEqual(metadata.title, { absolute: 'Contact IVF Master' })
  assert.equal(metadata.alternates?.canonical, 'https://www.ivfmaster.in/en/contact')
  assert.deepEqual(metadata.alternates?.languages, {
    mr: 'https://www.ivfmaster.in/contact',
    en: 'https://www.ivfmaster.in/en/contact',
    'x-default': 'https://www.ivfmaster.in/contact',
  })
  assert.equal(metadata.openGraph?.url, 'https://www.ivfmaster.in/en/contact')
})
