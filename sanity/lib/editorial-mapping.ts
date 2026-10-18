import { createImageUrlBuilder } from '@sanity/image-url'
import type { StaticImageData } from 'next/image'
import { z } from 'zod'
import type { Locale } from '../../i18n/routing.ts'
import { localize } from './clinic-mapping.ts'
import { dataset, projectId } from '../project.ts'

const text = z.string().refine((value) => value.trim().length > 0 && !/<\/?[A-Za-z][^>]*>/.test(value), 'Use nonblank plain text.')
const localized = z.object({ en: text, mr: z.string().nullish() }).refine((value) => !value.mr?.trim() || text.safeParse(value.mr).success)
const key = z.string().trim().min(1)
const uniqueKeys = <T extends { _key: string }>(items: readonly T[]) => new Set(items.map((item) => item._key)).size === items.length
const localizedItem = localized.safeExtend({ _key: key })
// Existing About rows use visible copy as React keys; validate both fallback locales.
const uniqueCopy = (items: readonly z.infer<typeof localized>[]) => (['en', 'mr'] as const).every((locale) =>
  new Set(items.map((item) => localize(item, locale).trim().toLowerCase())).size === items.length)

export const homeFaqContent = z.object({
  eyebrow: localized, heading: localized, body: localized, closeBody: localized,
  faqs: z.array(z.object({ _key: key, question: localized, answer: localized })).min(1).max(20)
    .refine(uniqueKeys).refine((items) => new Set(items.map((item) => item.question.en.trim().toLowerCase())).size === items.length),
})
export const aboutInformationContent = z.object({
  origin: z.object({ eyebrow: localized, title: localized, quote: localized, note: localized,
    paragraphs: z.array(localizedItem).min(1).max(10).refine(uniqueKeys).refine(uniqueCopy) }),
  care: z.object({ eyebrow: localized, title: localized, intro: localized,
    steps: z.array(z.object({ _key: key, title: localized, body: localized })).length(4).refine(uniqueKeys) }),
  trust: z.object({ eyebrow: localized, title: localized, intro: localized,
    points: z.array(z.object({ _key: key, label: localized, title: localized, body: localized })).min(1).max(10).refine(uniqueKeys).refine((points) => uniqueCopy(points.map((point) => point.title))) }),
})

export const facilityAreas = ['reception', 'consultation', 'laboratory', 'waiting'] as const
const fraction = z.number().min(0).max(1)
const galleryImage = z.object({
  _key: key,
  crop: z.object({ left: fraction, right: fraction, top: fraction, bottom: fraction }).refine((c) => c.left + c.right < 1 && c.top + c.bottom < 1).nullish(),
  hotspot: z.object({ x: fraction, y: fraction, width: fraction.positive(), height: fraction.positive() }).nullish(),
  asset: z.object({
    _id: text.regex(/^image-[a-zA-Z0-9]+-\d+x\d+-(jpg|png|webp|avif)$/),
    url: z.url().refine((value) => value.startsWith(`https://cdn.sanity.io/images/${projectId}/${dataset}/`)),
    metadata: z.object({ dimensions: z.object({ width: z.number().int().positive(), height: z.number().int().positive() }), lqip: text.regex(/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/) }),
  }),
})
export const facilityGalleryContent = z.object({
  eyebrow: localized, heading: localized, lead: localized,
  areas: z.array(z.object({ _key: key, area: z.enum(facilityAreas), caption: localized, imageAlt: localized,
    images: z.array(galleryImage).min(1).max(10).refine(uniqueKeys).nullish() }))
    .length(4).refine(uniqueKeys).refine((areas) => areas.every((area, i) => area.area === facilityAreas[i]), 'Keep the four existing areas in their current order.'),
})

const published = z.object({ _id: key.refine((id) => !id.startsWith('drafts.') && !id.startsWith('versions.')), reviewStatus: z.literal('approved') })
export const homeFaqDocument = published.extend(homeFaqContent.shape)
export const aboutInformationDocument = published.extend(aboutInformationContent.shape)
export const facilityGalleryDocument = published.extend(facilityGalleryContent.shape)

function readOne<T>(input: unknown, schema: z.ZodType<T>): { document: T | null; status: 'missing' | 'invalid' | 'ambiguous' | 'sanity' } {
  if (!Array.isArray(input)) return { document: null, status: 'invalid' }
  if (input.length === 0) return { document: null, status: 'missing' }
  if (input.length > 1) return { document: null, status: 'ambiguous' }
  const parsed = schema.safeParse(input[0])
  return parsed.success ? { document: parsed.data, status: 'sanity' } : { document: null, status: 'invalid' }
}
export function resolveHomeFaq(input: unknown, locale: Locale) {
  const { document: doc, status } = readOne(input, homeFaqDocument)
  const read = (value: z.infer<typeof localized>) => localize(value, locale)
  return { status, content: doc ? {
    eyebrow: read(doc.eyebrow), heading: read(doc.heading), body: read(doc.body), closeBody: read(doc.closeBody),
    faqs: doc.faqs.map((item) => ({ id: item._key, q: read(item.question), a: read(item.answer) })),
  } : null }
}
export type HomeFaqContent = NonNullable<ReturnType<typeof resolveHomeFaq>['content']>

export function resolveAboutInformation(input: unknown, locale: Locale) {
  const { document: doc, status } = readOne(input, aboutInformationDocument)
  const read = (value: z.infer<typeof localized>) => localize(value, locale)
  return { status, content: doc ? {
    origin: { eyebrow: read(doc.origin.eyebrow), title: read(doc.origin.title), quote: read(doc.origin.quote), note: read(doc.origin.note), paragraphs: doc.origin.paragraphs.map(read) },
    care: { eyebrow: read(doc.care.eyebrow), title: read(doc.care.title), intro: read(doc.care.intro), steps: doc.care.steps.map((step, i) => ({ number: String(i + 1).padStart(2, '0'), title: read(step.title), body: read(step.body) })) },
    trust: { eyebrow: read(doc.trust.eyebrow), title: read(doc.trust.title), intro: read(doc.trust.intro), points: doc.trust.points.map((point) => ({ label: read(point.label), title: read(point.title), body: read(point.body) })) },
  } : null }
}
export type AboutInformation = NonNullable<ReturnType<typeof resolveAboutInformation>['content']>

export type FacilityImage = StaticImageData & { position?: string }
function mapImage(image: z.infer<typeof galleryImage>): FacilityImage {
  const crop = image.crop ?? { left: 0, right: 0, top: 0, bottom: 0 }
  const dimensions = image.asset.metadata.dimensions
  const clamp = (value: number) => Math.max(0, Math.min(100, value))
  return {
    src: createImageUrlBuilder({ projectId, dataset }).image({ asset: { _ref: image.asset._id }, crop: image.crop ?? undefined, hotspot: image.hotspot ?? undefined }).auto('format').url(),
    width: Math.max(1, Math.round(dimensions.width * (1 - crop.left - crop.right))), height: Math.max(1, Math.round(dimensions.height * (1 - crop.top - crop.bottom))),
    blurDataURL: image.asset.metadata.lqip,
    ...(image.hotspot ? { position: `${clamp((image.hotspot.x - crop.left) / (1 - crop.left - crop.right) * 100)}% ${clamp((image.hotspot.y - crop.top) / (1 - crop.top - crop.bottom) * 100)}%` } : {}),
  }
}
export function resolveFacilityGallery(input: unknown, locale: Locale) {
  const { document: doc, status } = readOne(input, facilityGalleryDocument)
  const read = (value: z.infer<typeof localized>) => localize(value, locale)
  try {
    return { status, content: doc ? {
      eyebrow: read(doc.eyebrow), heading: read(doc.heading), lead: read(doc.lead),
      areas: doc.areas.map((area) => ({ area: area.area, caption: read(area.caption), imageAlt: read(area.imageAlt), images: area.images?.map(mapImage) })),
    } : null }
  } catch { return { status: 'invalid' as const, content: null } }
}
