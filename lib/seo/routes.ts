import { routing, type Locale } from '../../i18n/routing.ts'
import { siteConfig } from '../../config/site.ts'

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
