import assert from 'node:assert/strict'
import test from 'node:test'

import {
  buildAbsoluteUrl,
  buildLocalizedPath,
  getLocalizedAlternates,
  localizedRoutes,
} from '../lib/seo/routes.ts'
import { buildPageMetadata } from '../lib/seo/metadata.ts'

test('builds canonical URLs with clean default-locale paths', () => {
  assert.equal(buildLocalizedPath('en', '/contact'), '/contact')
  assert.equal(buildLocalizedPath('hi', '/contact'), '/hi/contact')
  assert.equal(buildLocalizedPath('mr', '/contact'), '/mr/contact')
  assert.equal(buildAbsoluteUrl('/hi/contact'), 'https://ivfmaster.in/hi/contact')
})

test('builds hreflang alternates for every configured locale', () => {
  assert.deepEqual(getLocalizedAlternates('/procedures/ivf'), {
    en: 'https://ivfmaster.in/procedures/ivf',
    hi: 'https://ivfmaster.in/hi/procedures/ivf',
    mr: 'https://ivfmaster.in/mr/procedures/ivf',
  })
})

test('enumerates all localized routes used by the sitemap', () => {
  assert(localizedRoutes.includes('/contact'))
  assert(localizedRoutes.includes('/hi/contact'))
  assert(localizedRoutes.includes('/mr/contact'))
  assert(localizedRoutes.includes('/educate-ivf/what-ivf-really-is'))
  assert(localizedRoutes.includes('/hi/procedures/ivf'))
  assert(localizedRoutes.includes('/mr/team/dr-sharma'))
})

test('builds route-specific canonical and social metadata', () => {
  const metadata = buildPageMetadata({
    locale: 'hi',
    path: '/contact',
    title: 'Contact IVF Master',
    description: 'Contact the clinic.',
  })

  assert.deepEqual(metadata.title, { absolute: 'Contact IVF Master' })
  assert.equal(metadata.alternates?.canonical, 'https://ivfmaster.in/hi/contact')
  assert.deepEqual(metadata.alternates?.languages, {
    en: 'https://ivfmaster.in/contact',
    hi: 'https://ivfmaster.in/hi/contact',
    mr: 'https://ivfmaster.in/mr/contact',
    'x-default': 'https://ivfmaster.in/contact',
  })
  assert.equal(metadata.openGraph?.url, 'https://ivfmaster.in/hi/contact')
})
