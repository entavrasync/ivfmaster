import 'server-only'
import type { Locale } from '../../i18n/routing'
import { client } from './client'
import { aboutInformationQuery, facilityGalleryQuery, homeFaqQuery } from './editorial-queries'
import { resolveAboutInformation, resolveFacilityGallery, resolveHomeFaq } from './editorial-mapping'

async function readEditorial<T>(query: string, tag: string, locale: Locale, resolve: (input: unknown, locale: Locale) => { content: T | null; status: string }): Promise<T | null> {
  try {
    const input = await client.fetch<unknown>(query, {}, { cache: 'force-cache', next: { revalidate: 60, tags: [tag] } })
    const result = resolve(input, locale)
    if (result.status === 'invalid' || result.status === 'ambiguous') console.error(`[${tag}] Invalid or ambiguous approved CMS content; retaining existing content.`)
    return result.content
  } catch {
    console.error(`[${tag}] CMS read failed; retaining existing content.`)
    return null
  }
}
export const getHomeFaq = (locale: Locale) => readEditorial(homeFaqQuery, 'homeFaq', locale, resolveHomeFaq)
export const getAboutInformation = (locale: Locale) => readEditorial(aboutInformationQuery, 'aboutInformation', locale, resolveAboutInformation)
export const getFacilityGallery = (locale: Locale) => readEditorial(facilityGalleryQuery, 'facilityGallery', locale, resolveFacilityGallery)
