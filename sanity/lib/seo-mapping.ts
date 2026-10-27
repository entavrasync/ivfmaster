import { localizedValue } from './localized-query'
import { z } from 'zod'

import { siteConfig } from '../../config/site.ts'
import type { Locale } from '../../i18n/routing.ts'
import { dataset, projectId } from '../project.ts'
import { resolveSiteImage } from './site-content-mapping'
import { resolveBacklinks, type Backlink } from './backlinks'

/** Editor-controlled SEO for one page, already resolved to the visitor's locale. */
export type PageSeo = {
  readonly backlinks?: readonly Backlink[]
  readonly title?: string
  readonly description?: string
  readonly keywords?: readonly string[]
  readonly ogTitle?: string
  readonly ogDescription?: string
  readonly ogImage?: { readonly url: string; readonly width: number; readonly height: number; readonly alt: string }
  readonly noIndex: boolean
  readonly noFollow: boolean
  /** Site-relative path of another page that should rank instead. */
  readonly canonicalPath?: string
  readonly structuredData: boolean
}

// Readers project text either per locale (a string) or as the stored { en, mr } pair.
const text = z.union([z.string(), z.object({ en: z.string().nullish(), mr: z.string().nullish() })]).nullish()
const seoInput = z.object({
  backlinks: z.unknown().optional(),
  metaTitle: text, metaDescription: text, ogTitle: text, ogDescription: text,
  focusKeyword: z.string().nullish(),
  secondaryKeywords: z.array(z.string()).nullish(),
  ogImage: z.object({
    alt: text,
    assetId: z.string().nullish(), crop: z.unknown().optional(), hotspot: z.unknown().optional(),
    url: z.url().refine((url) => url.startsWith(`https://cdn.sanity.io/images/${projectId}/${dataset}/`)),
    dimensions: z.object({ width: z.number().positive(), height: z.number().positive() }),
  }).nullish().catch(null),
  noIndex: z.boolean().nullish(),
  noFollow: z.boolean().nullish(),
  canonicalUrl: z.string().nullish(),
  structuredData: z.boolean().nullish(),
})

function localize(value: z.infer<typeof text>, locale: Locale): string | undefined {
  if (value == null) return undefined
  const resolved = typeof value === 'string' ? value : locale === 'mr' ? value.mr?.trim() ? value.mr : value.en : value.en?.trim() ? value.en : value.mr
  return resolved?.trim() || undefined
}

/** Accepts only pages on this site; anything else is ignored rather than trusted. */
function canonicalPath(value: string | null | undefined): string | undefined {
  if (!value) return undefined
  const path = value.startsWith(siteConfig.url) ? value.slice(siteConfig.url.length) || '/' : value
  return /^\/[a-z0-9\-/]*$/.test(path) ? path.replace(/\/+$/, '') || '/' : undefined
}

/** Maps a projected SEO object; malformed input yields undefined so pages keep their defaults. */
export function resolvePageSeo(input: unknown, locale: Locale): PageSeo | undefined {
  if (input == null) return undefined
  const parsed = seoInput.safeParse(input)
  if (!parsed.success) return undefined
  const seo = parsed.data
  const keywords = [seo.focusKeyword, ...(seo.secondaryKeywords ?? [])].map((keyword) => keyword?.trim()).filter((keyword): keyword is string => Boolean(keyword))
  const alt = localize(seo.ogImage?.alt, locale) ?? siteConfig.name
  const cropped = seo.ogImage && (seo.ogImage.crop || seo.ogImage.hotspot) ? resolveSiteImage({ ...seo.ogImage, alt }) : null
  const ogImage = cropped ? { url: cropped.image.src, width: cropped.image.width, height: cropped.image.height, alt }
    : seo.ogImage && !seo.ogImage.crop && !seo.ogImage.hotspot ? { url: seo.ogImage.url, width: seo.ogImage.dimensions.width, height: seo.ogImage.dimensions.height, alt } : undefined
  const fields = {
    backlinks: seo.backlinks == null ? undefined : resolveBacklinks(seo.backlinks, siteConfig.url),
    title: localize(seo.metaTitle, locale),
    description: localize(seo.metaDescription, locale),
    keywords: keywords.length ? [...new Set(keywords)] : undefined,
    ogTitle: localize(seo.ogTitle, locale),
    ogDescription: localize(seo.ogDescription, locale),
    ogImage,
    canonicalPath: canonicalPath(seo.canonicalUrl),
  }
  return {
    ...Object.fromEntries(Object.entries(fields).filter(([, value]) => value !== undefined)),
    noIndex: seo.noIndex === true,
    noFollow: seo.noFollow === true,
    structuredData: seo.structuredData !== false,
  }
}

/**
 * GROQ projection of the advanced SEO fields, resolved to `$locale`, for page
 * singletons. Their queries already project `ogImage`, `canonicalUrl` and `noIndex`.
 */
export const SEO_LOCALIZED_PROJECTION = `backlinks[]{_key,url}, "ogTitle": ${localizedValue('ogTitle')},
    "ogDescription": ${localizedValue('ogDescription')},
    focusKeyword, secondaryKeywords, noFollow, structuredData`

/** GROQ projection of a whole SEO object with stored { en, mr } text, for collection documents. */
export const SEO_RAW_PROJECTION = `seo{metaTitle{en, mr}, metaDescription{en, mr}, ogTitle{en, mr}, ogDescription{en, mr},
    backlinks[]{_key,url},
    focusKeyword, secondaryKeywords, noIndex, noFollow, canonicalUrl, structuredData,
    "ogImage": ogImage{alt{en, mr}, crop, hotspot, "assetId": asset->_id, "url": asset->url, "dimensions": asset->metadata.dimensions}}`
