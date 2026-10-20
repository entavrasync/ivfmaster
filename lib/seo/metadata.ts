import type { Metadata } from 'next'

import { siteConfig } from '../../config/site.ts'
import { routing, type Locale } from '../../i18n/routing.ts'
import {
  buildAbsoluteUrl,
  buildLocalizedPath,
  getLocalizedAlternates,
} from './routes.ts'
import type { PageSeo } from '../../sanity/lib/seo-mapping.ts'

type PageMetadataOptions = {
  readonly locale: Locale
  readonly path: string
  readonly title: string
  readonly description: string
  readonly type?: 'website' | 'article'
  readonly publishedTime?: string
  /** This page's editor-controlled SEO; each field overrides the defaults below. */
  readonly seo?: PageSeo
  /** Site-wide SEO defaults (social image and text) used when the page leaves a field empty. */
  readonly fallbackSeo?: PageSeo
}

function ensureBrandedTitle(title: string): string {
  return title.includes(siteConfig.name) ? title : title + ' | ' + siteConfig.name
}

export function buildPageMetadata({
  locale,
  path,
  title,
  description,
  type = 'website',
  publishedTime,
  seo,
  fallbackSeo,
}: PageMetadataOptions): Metadata {
  const canonical = buildAbsoluteUrl(buildLocalizedPath(locale, seo?.canonicalPath ?? path))
  const brandedTitle = ensureBrandedTitle(seo?.title ?? title)
  const pageDescription = seo?.description ?? description
  const shareTitle = seo?.ogTitle ? ensureBrandedTitle(seo.ogTitle) : brandedTitle
  const shareDescription = seo?.ogDescription ?? pageDescription
  const shareImage = seo?.ogImage ?? fallbackSeo?.ogImage
  const languages = {
    ...getLocalizedAlternates(path),
    'x-default': buildAbsoluteUrl(path),
  }
  const commonOpenGraph = {
    url: canonical,
    title: shareTitle,
    description: shareDescription,
    siteName: siteConfig.name,
    locale: locale + '_IN',
    alternateLocale: routing.locales
      .filter((alternateLocale) => alternateLocale !== locale)
      .map((alternateLocale) => alternateLocale + '_IN'),
    images: shareImage ? [shareImage] : [],
  }
  const keywords = seo?.keywords?.length ? { keywords: [...seo.keywords] } : {}
  const robots = seo?.noIndex || seo?.noFollow ? { robots: { index: !seo.noIndex, follow: !seo.noFollow } } : {}

  return {
    title: { absolute: brandedTitle },
    description: pageDescription,
    ...keywords,
    ...robots,
    alternates: {
      canonical,
      languages,
    },
    openGraph:
      type === 'article'
        ? {
            ...commonOpenGraph,
            type: 'article',
            publishedTime,
          }
        : {
            ...commonOpenGraph,
            type: 'website',
          },
    twitter: {
      card: shareImage ? 'summary_large_image' : 'summary',
      title: shareTitle,
      description: shareDescription,
      images: shareImage ? [shareImage] : [],
    },
  }
}
