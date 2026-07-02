import { routing, type Locale } from '../../i18n/routing.ts'
import { siteConfig } from '../../config/site.ts'
import { ARTICLES } from '../articles.ts'
import { PROCEDURES } from '../procedures.ts'
import { doctors } from '../content/team.ts'

type ChangeFrequency =
  | 'always'
  | 'hourly'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'yearly'
  | 'never'

export type SitemapRoute = {
  readonly path: string
  readonly priority: number
  readonly changeFrequency: ChangeFrequency
  readonly lastModified?: Date
}

const staticRoutes: readonly SitemapRoute[] = [
  { path: '/', priority: 1, changeFrequency: 'weekly' },
  { path: '/about', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/contact', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/procedures', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/educate-ivf', priority: 0.85, changeFrequency: 'weekly' },
  { path: '/team', priority: 0.75, changeFrequency: 'monthly' },
]

const procedureRoutes: readonly SitemapRoute[] = PROCEDURES.map((procedure) => ({
  path: `/procedures/${procedure.slug}`,
  priority: 0.82,
  changeFrequency: 'monthly' as const,
}))

const articleRoutes: readonly SitemapRoute[] = ARTICLES.map((article) => ({
  path: `/educate-ivf/${article.slug}`,
  priority: 0.72,
  changeFrequency: 'monthly' as const,
  lastModified: new Date(article.date),
}))

const doctorRoutes: readonly SitemapRoute[] = doctors.map((doctor) => ({
  path: `/team/${doctor.slug}`,
  priority: 0.65,
  changeFrequency: 'monthly' as const,
}))

export const sitemapRoutes: readonly SitemapRoute[] = [
  ...staticRoutes,
  ...procedureRoutes,
  ...articleRoutes,
  ...doctorRoutes,
]

export function normalizePath(path: string): string {
  if (!path || path === '/') return '/'
  const withLeadingSlash = path.startsWith('/') ? path : `/${path}`
  return withLeadingSlash.replace(/\/+$/, '')
}

export function buildLocalizedPath(locale: Locale, path: string): string {
  const normalizedPath = normalizePath(path)
  if (locale === routing.defaultLocale) return normalizedPath
  if (normalizedPath === '/') return `/${locale}`
  return `/${locale}${normalizedPath}`
}

export function buildAbsoluteUrl(path: string): string {
  const normalizedPath = normalizePath(path)
  if (normalizedPath === '/') return siteConfig.url
  return `${siteConfig.url}${normalizedPath}`
}

export function getLocalizedAlternates(path: string): Record<Locale, string> {
  return Object.fromEntries(
    routing.locales.map((locale) => [
      locale,
      buildAbsoluteUrl(buildLocalizedPath(locale, path)),
    ])
  ) as Record<Locale, string>
}

export const localizedRoutes: readonly string[] = sitemapRoutes.flatMap((route) =>
  routing.locales.map((locale) => buildLocalizedPath(locale, route.path))
)
