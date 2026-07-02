import type { Metadata } from 'next'

import { siteConfig } from '../../config/site.ts'
import { routing, type Locale } from '../../i18n/routing.ts'
import {
  buildAbsoluteUrl,
  buildLocalizedPath,
  getLocalizedAlternates,
} from './routes.ts'

type PageMetadataOptions = {
  readonly locale: Locale
  readonly path: string
  readonly title: string
  readonly description: string
  readonly type?: 'website' | 'article'
  readonly publishedTime?: string
}

const socialImage = {
  url: buildAbsoluteUrl('/hero-bg-desktop.png'),
  width: 1672,
  height: 941,
  alt: siteConfig.name,
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
}: PageMetadataOptions): Metadata {
  const canonical = buildAbsoluteUrl(buildLocalizedPath(locale, path))
  const brandedTitle = ensureBrandedTitle(title)
  const languages = {
    ...getLocalizedAlternates(path),
    'x-default': buildAbsoluteUrl(path),
  }
  const commonOpenGraph = {
    url: canonical,
    title: brandedTitle,
    description,
    siteName: siteConfig.name,
    locale: locale + '_IN',
    alternateLocale: routing.locales
      .filter((alternateLocale) => alternateLocale !== locale)
      .map((alternateLocale) => alternateLocale + '_IN'),
    images: [socialImage],
  }

  return {
    title: { absolute: brandedTitle },
    description,
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
      card: 'summary_large_image',
      title: brandedTitle,
      description,
      images: [socialImage],
    },
  }
}
