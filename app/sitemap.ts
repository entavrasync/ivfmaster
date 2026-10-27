import type { MetadataRoute } from 'next'

import { getLocalizedSitemapEntries } from '@/lib/seo/sitemap'
import { getSitemapOverrides } from '@/sanity/lib/seo-sitemap'
import { getArticles } from '@/sanity/lib/articles'

export const revalidate = 60

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [overrides, { articles }] = await Promise.all([getSitemapOverrides(), getArticles('en')])
  return getLocalizedSitemapEntries({ ...overrides, extraArticleSlugs: articles.map((article) => article.slug) })
}
