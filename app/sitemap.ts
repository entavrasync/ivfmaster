import type { MetadataRoute } from 'next'

import { getLocalizedSitemapEntries } from '@/lib/seo/sitemap'
import { getSitemapOverrides } from '@/sanity/lib/seo-sitemap'
import { getArticles } from '@/sanity/lib/articles'
import { getPublications } from '@/sanity/lib/publications'
import { resolvePageSeo } from '@/sanity/lib/seo-mapping'
import { routing } from '@/i18n/routing'
import { buildAbsoluteUrl, buildLocalizedPath, getLocalizedAlternates } from '@/lib/seo/routes'

export const revalidate = 60

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [overrides, { articles }, news, events] = await Promise.all([getSitemapOverrides(), getArticles('en'), getPublications('news', true), getPublications('event', true)])
  const existing = await getLocalizedSitemapEntries({ ...overrides, extraArticleSlugs: articles.map((article) => article.slug) })
  const docs = [...news.documents, ...events.documents].filter(doc => (doc._type !== 'news' || Date.parse(doc.publishedAt) <= Date.now()))
  const entries = docs.flatMap(doc => routing.locales.flatMap(locale => {
    const seo = resolvePageSeo(doc.seo, locale)
    if (seo?.noIndex || seo?.canonicalPath) return []
    const path = `/${doc._type === 'news' ? 'news' : 'events'}/${doc.slug.current}`
    return [{ url: buildAbsoluteUrl(buildLocalizedPath(locale, path)), lastModified: new Date(doc._updatedAt), alternates: { languages: getLocalizedAlternates(path) } }]
  }))
  const indexes = ['/news', '/events'].flatMap(path => routing.locales.map(locale => ({ url: buildAbsoluteUrl(buildLocalizedPath(locale, path)), alternates: { languages: getLocalizedAlternates(path) } })))
  return [...existing, ...indexes, ...entries]
}
