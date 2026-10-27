import { createImageUrlBuilder } from '@sanity/image-url'
import type { StaticImageData } from 'next/image'
import { createTranslator } from 'next-intl'
import { z } from 'zod'
import type { Locale } from '../../i18n/routing.ts'
import { dataset, projectId } from '../project.ts'
import { resolvePageSeo } from './seo-mapping.ts'

const text = z.string().refine((s) => s.trim().length > 0)
const localized = z.object({ en: text, mr: z.string().nullish() })
const item = localized.extend({ _key: text })
const items = z.array(item).min(1)
export const doctorQualification = z.object({
  _key: text, text: localized,
  institution: z.string().max(200).nullish(), awardingBody: z.string().max(200).nullish(),
  year: z.number().int().min(1900).max(new Date().getFullYear()).nullish(),
})
const credentials = z.array(z.union([doctorQualification, item])).max(20).nullish().transform(value => value ?? [])
const publishedId = text.refine((s) => !s.startsWith('drafts.') && !s.startsWith('versions.'))
const fraction = z.number().min(0).max(1)
const image = z.object({
  alt: localized,
  crop: z.object({ left: fraction, right: fraction, top: fraction, bottom: fraction }).refine((c) => c.left + c.right < 1 && c.top + c.bottom < 1).nullish(),
  hotspot: z.object({ x: fraction, y: fraction, width: fraction.positive(), height: fraction.positive() }).nullish(),
  asset: z.object({
    _id: text.regex(/^image-[a-zA-Z0-9]+-\d+x\d+-(jpg|png|webp|avif)$/),
    url: z.url().refine((url) => url.startsWith(`https://cdn.sanity.io/images/${projectId}/${dataset}/`)),
    metadata: z.object({ dimensions: z.object({ width: z.number().int().positive(), height: z.number().int().positive() }), lqip: text.regex(/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/).nullish() }),
  }),
})

function validBiography(value: z.infer<typeof localized>): boolean {
  try {
    for (const locale of ['en', 'mr'] as const) {
      const copy = value[locale]
      if (!copy?.trim()) continue
      const t = createTranslator({ locale, messages: { biography: copy }, onError: (error) => { throw error } })
      t.rich('biography', { br: () => '', b: (chunks) => chunks, link: (chunks) => chunks })
    }
    return true
  } catch { return false }
}

export const doctorDocument = z.object({
  _id: publishedId, reviewStatus: z.literal('approved'),
  slug: z.enum(['gorakh-mandrupkar', 'saie-mandrupkar']), order: z.number().int().nonnegative(),
  name: localized, title: localized, essence: localized, intro: localized,
  biography: localized.refine(validBiography, 'Use only existing b, br and link biography tags, without message variables.'),
  // Legacy published profiles stay readable; Studio requires qualifications on the next publish.
  credentials, specializations: z.array(item).max(20).nullish().transform(value => value ?? []), metaDescription: localized, portrait: image.nullish(),
  home: z.object({ essence: localized, intro: localized, credentials }).nullish(),
  about: z.object({ role: localized, pullQuote: localized, paragraphs: items, evidence: localized }).nullish(),
})

export function localize(value: z.infer<typeof localized>, locale: Locale): string {
  return locale === 'mr' && value.mr?.trim() ? value.mr : value.en
}

function mapDoctor(doc: z.infer<typeof doctorDocument>, locale: Locale, rawSeo?: unknown) {
  const read = (value: z.infer<typeof localized>) => localize(value, locale)
  const qualificationText = (value: z.infer<typeof credentials>[number]) => 'text' in value
    ? [read(value.text), value.institution?.trim(), value.awardingBody?.trim(), value.year].filter(value => value != null && value !== '').join(' · ')
    : read(value)
  let portrait: { photo: StaticImageData; alt: string; position?: string } | undefined
  if (doc.portrait) {
    const p = doc.portrait
    const dimensions = p.asset.metadata.dimensions
    const crop = p.crop ?? { left: 0, right: 0, top: 0, bottom: 0 }
    const width = Math.max(1, Math.round(dimensions.width * (1 - crop.left - crop.right)))
    const height = Math.max(1, Math.round(dimensions.height * (1 - crop.top - crop.bottom)))
    const clamp = (n: number) => Math.max(0, Math.min(100, n))
    portrait = {
      photo: { src: createImageUrlBuilder({ projectId, dataset }).image({ asset: { _ref: p.asset._id }, crop: p.crop ?? undefined, hotspot: p.hotspot ?? undefined }).width(1200).auto('format').url(), width, height, ...(p.asset.metadata.lqip ? { blurDataURL: p.asset.metadata.lqip } : {}) },
      alt: read(p.alt),
      position: p.hotspot ? `${clamp((p.hotspot.x - crop.left) / (1 - crop.left - crop.right) * 100)}% ${clamp((p.hotspot.y - crop.top) / (1 - crop.top - crop.bottom) * 100)}%` : undefined,
    }
  }
  return {
    slug: doc.slug, order: doc.order, name: read(doc.name), title: read(doc.title), essence: read(doc.essence),
    intro: read(doc.intro), biography: read(doc.biography), credentials: doc.credentials.map(qualificationText), specializations: doc.specializations.map(item => ({ _key: item._key, text: read(item) })), metaDescription: read(doc.metaDescription), portrait,
    pageSeo: resolvePageSeo(rawSeo, locale),
    home: doc.home ? { essence: read(doc.home.essence), intro: read(doc.home.intro), credentials: doc.home.credentials.map(qualificationText) } : undefined,
    about: doc.about ? { role: read(doc.about.role), pullQuote: read(doc.about.pullQuote), paragraphs: doc.about.paragraphs.map(read), evidence: read(doc.about.evidence) } : undefined,
  }
}
export type DoctorContent = ReturnType<typeof mapDoctor>

export function resolveDoctors(input: unknown, locale: Locale): { doctors: DoctorContent[]; status: string } {
  const parsed = z.array(doctorDocument).max(2).safeParse(input)
  if (!parsed.success) return { doctors: [], status: 'invalid' }
  if (new Set(parsed.data.map((d) => d.slug)).size !== parsed.data.length || new Set(parsed.data.map((d) => d.order)).size !== parsed.data.length) return { doctors: [], status: 'ambiguous' }
  try {
    return { doctors: parsed.data.map((doc, index) => mapDoctor(doc, locale, Array.isArray(input) ? Reflect.get(Object(input[index]), 'seo') : undefined)).sort((a, b) => a.order - b.order || a.slug.localeCompare(b.slug)), status: parsed.data.length ? 'sanity' : 'missing' }
  } catch { return { doctors: [], status: 'invalid' } }
}

const httpsHost = (hosts: string[]) => z.url().refine((value) => {
  const url = new URL(value)
  return url.protocol === 'https:' && hosts.includes(url.hostname) && !url.username && !url.password
})
export const settingsDocument = z.object({
  _id: z.literal('clinicSettings'), reviewStatus: z.literal('approved'),
  telephone: text.regex(/^\+?[0-9 ()-]{7,24}$/).refine((s) => s.replace(/\D/g, '').length >= 7),
  whatsappNumber: text.regex(/^[1-9][0-9]{6,14}$/), email: z.email(), displayAddress: localized,
  address: z.object({ streetAddress: text, addressLocality: text, addressRegion: text, postalCode: text, addressCountry: text.regex(/^[A-Z]{2}$/) }),
  mapUrl: httpsHost(['maps.app.goo.gl', 'maps.google.com', 'www.google.com', 'google.com']),
  latitude: z.number().min(-90).max(90), longitude: z.number().min(-180).max(180),
  instagram: httpsHost(['www.instagram.com', 'instagram.com']),
})
export type ClinicSettings = Omit<z.infer<typeof settingsDocument>, 'displayAddress'> & { displayAddress: string }

export function resolveClinicSettings(input: unknown, locale: Locale): { settings: ClinicSettings | null; status: string } {
  if (!Array.isArray(input)) return { settings: null, status: 'invalid' }
  if (input.length === 0) return { settings: null, status: 'missing' }
  if (input.length > 1) return { settings: null, status: 'ambiguous' }
  const parsed = settingsDocument.safeParse(input[0])
  return parsed.success ? { settings: { ...parsed.data, displayAddress: localize(parsed.data.displayAddress, locale) }, status: 'sanity' } : { settings: null, status: 'invalid' }
}
