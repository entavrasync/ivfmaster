import { resolveSiteImage } from '@/sanity/lib/site-content-mapping'
import { localizePublication, type PublicationDocument } from '@/sanity/lib/publication-model'
import { publicationCopy } from '@/sanity/lib/publication-model'
import { parsePublicationMedia, youtubeThumbnail } from '@/sanity/lib/publication-media'
import type { PublicationImageValue } from './publication-image'

export function publicationImage(input: unknown, locale: 'en' | 'mr'): PublicationImageValue[] {
  if (!input || typeof input !== 'object') return []
  const alt = publicationCopy.safeParse(Reflect.get(input, 'alt'))
  const localizedAlt = alt.success ? localizePublication(alt.data, locale) : ''
  const value = resolveSiteImage({ ...input, alt: localizedAlt })
  if (!value) return []
  const url = new URL(value.image.src)
  url.searchParams.set('w', '1600'); url.searchParams.set('fit', 'max')
  return [{ src: url.href, alt: value.alt, position: value.position, width: value.image.width, height: value.image.height }]
}
export function mediaImages(url: string, thumbnail: unknown, locale: 'en' | 'mr'): PublicationImageValue[] {
  const source = parsePublicationMedia(url)
  return [...(source?.provider === 'youtube' ? [{ src: youtubeThumbnail(source.id), alt: 'YouTube', width: 480, height: 360 }] : []), ...publicationImage(thumbnail, locale)]
}
export function coverImages(doc: PublicationDocument, locale: 'en' | 'mr') {
  // Editorial covers are deliberate selections. Video thumbnails stay with
  // their media block rather than becoming an unrelated full-width cover.
  return publicationImage(doc.coverImage, locale)
}
export function publicationDate(value: string, locale: string, timezone = 'Asia/Kolkata', includeTime = false) {
  return new Intl.DateTimeFormat(locale === 'mr' ? 'mr-IN' : 'en-IN', { timeZone: timezone, day: 'numeric', month: 'long', year: 'numeric', ...(includeTime ? { hour: 'numeric', minute: '2-digit' } as const : {}) }).format(new Date(value))
}
