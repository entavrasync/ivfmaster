import type { MetadataRoute } from 'next'

import { routing } from '@/i18n/routing'
import {
  buildAbsoluteUrl,
  buildLocalizedPath,
  getLocalizedAlternates,
  sitemapRoutes,
} from '@/lib/seo/routes'

export default function sitemap(): MetadataRoute.Sitemap {
  return sitemapRoutes.flatMap((route) =>
    routing.locales.map((locale) => ({
      url: buildAbsoluteUrl(buildLocalizedPath(locale, route.path)),
      lastModified: route.lastModified ?? new Date(),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: {
        languages: getLocalizedAlternates(route.path),
      },
    }))
  )
}
