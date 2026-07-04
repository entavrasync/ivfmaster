import type { MetadataRoute } from 'next'

import { getLocalizedSitemapEntries } from '@/lib/seo/sitemap'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return getLocalizedSitemapEntries()
}
