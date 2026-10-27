import { z } from 'zod'
import type { Locale } from '../../i18n/routing.ts'
import { PROCEDURES, type Procedure, type ProcedureImage } from '../../lib/procedures.ts'
import { resolveSiteImage } from './site-content-mapping.ts'
import { resolvePageSeo, type PageSeo } from './seo-mapping.ts'

const text = z.string().refine((value) => value.trim().length > 0)
const localized = z.object({ en: text, mr: z.string().nullish() })
const key = z.object({ _key: text })

export const procedureDocument = z.object({
  _id: text.refine((id) => !id.startsWith('drafts.') && !id.startsWith('versions.')),
  slug: z.literal('ivf'),
  reviewStatus: z.literal('approved'),
  name: localized,
  fullName: localized,
  oneLiner: localized,
  heroDescription: localized,
  quickFacts: z.array(key.extend({ label: localized, value: localized })).min(1).max(4),
  whoItsFor: z.array(key.extend(localized.shape)).min(1),
  process: z.array(key.extend({ title: localized, detail: localized })).min(1),
  whatToExpect: localized,
  faqs: z.array(key.extend({ q: localized, a: localized })).min(1),
  seo: z.object({ metaTitle: z.object({ en: z.string().nullish(), mr: z.string().nullish() }).nullish(), metaDescription: z.object({ en: z.string().nullish(), mr: z.string().nullish() }).nullish() }).nullish(),
})

export type ProcedureDocument = z.infer<typeof procedureDocument>
// Preserve the existing IVF contract while accepting any route-safe slug, so a
// procedure added in the Studio gets its own page, card and menu entry.
const cmsImage = z.object({ alt: localized.partial().nullish() }).passthrough().nullish()
const supportedProcedureDocument = procedureDocument.extend({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  cardImage: cmsImage,
  bannerImage: cmsImage,
})
export type CmsProcedure = Procedure & {
  readonly seo?: { readonly title?: string; readonly description?: string }
  readonly pageSeo?: PageSeo
}

function localize(value: z.infer<typeof localized>, locale: Locale): string {
  return locale === 'mr' && value.mr?.trim() ? value.mr : value.en
}

function procedureImage(input: z.infer<typeof cmsImage>, locale: Locale): ProcedureImage | undefined {
  if (!input) return undefined
  const alt = (locale === 'mr' && input.alt?.mr?.trim()) || input.alt?.en || input.alt?.mr
  const resolved = resolveSiteImage({ ...input, alt })
  return resolved ? { src: resolved.image.src, alt: resolved.alt, ...(resolved.position ? { position: resolved.position } : {}) } : undefined
}

// Accent pairs reused, in order, for procedures that exist only in the CMS.
const ACCENTS = PROCEDURES.map(({ accentEdge, accentBg }) => ({ accentEdge, accentBg }))

/** Website defaults for a CMS-only procedure; every content field is replaced by the document. */
function newProcedureBase(slug: string, index: number): Procedure {
  return { slug, name: slug, fullName: slug, oneLiner: '', heroDescription: '', ...ACCENTS[index % ACCENTS.length], quickFacts: [], whoItsFor: [], process: [], whatToExpect: '', faqs: [] }
}

/** Reject the whole document when incomplete; never pair clinical sections from different sources. */
export function mapProcedureDocument(input: unknown, original: Procedure, locale: Locale): CmsProcedure | null {
  const parsed = supportedProcedureDocument.safeParse(input)
  if (!parsed.success || parsed.data.slug !== original.slug) return null
  const doc = parsed.data
  const read = (value: z.infer<typeof localized>) => localize(value, locale)
  const pageSeo = resolvePageSeo(input && typeof input === 'object' ? Reflect.get(input, 'seo') : undefined, locale)
  // Either image fills in for the other, so one upload serves both screens.
  const card = procedureImage(doc.cardImage, locale), banner = procedureImage(doc.bannerImage, locale)
  return {
    ...original,
    ...(card ?? banner ? { cardImage: card ?? banner } : {}),
    ...(banner ?? card ? { bannerImage: banner ?? card } : {}),
    name: read(doc.name),
    fullName: read(doc.fullName),
    oneLiner: read(doc.oneLiner),
    heroDescription: read(doc.heroDescription),
    quickFacts: doc.quickFacts.map((fact) => ({ label: read(fact.label), value: read(fact.value) })),
    whoItsFor: doc.whoItsFor.map(read),
    process: doc.process.map((step) => ({ title: read(step.title), detail: read(step.detail) })),
    whatToExpect: read(doc.whatToExpect),
    faqs: doc.faqs.map((faq) => ({ q: read(faq.q), a: read(faq.a) })),
    seo: {
      title: pageSeo?.title,
      description: pageSeo?.description,
    },
    // The parsed document keeps only the validated title/description; read the rest from the raw record.
    ...(pageSeo ? { pageSeo } : {}),
  }
}

export function resolveProcedures(input: unknown, originals: ReadonlyArray<Procedure>, locale: Locale): {
  procedures: ReadonlyArray<CmsProcedure>
  status: 'sanity' | 'missing' | 'invalid' | 'ambiguous'
} {
  if (!Array.isArray(input)) return { procedures: originals, status: 'invalid' }
  if (input.length === 0) return { procedures: originals, status: 'missing' }
  const mapped = new Map<string, CmsProcedure>()
  const ids = new Set<string>()
  for (const value of input) {
    const parsed = supportedProcedureDocument.safeParse(value)
    if (!parsed.success) return { procedures: originals, status: 'invalid' }
    const doc = parsed.data
    if (mapped.has(doc.slug) || ids.has(doc._id)) return { procedures: originals, status: 'ambiguous' }
    const original = originals.find((procedure) => procedure.slug === doc.slug) ?? newProcedureBase(doc.slug, mapped.size)
    const procedure = mapProcedureDocument(value, original, locale)
    if (!procedure) return { procedures: originals, status: 'invalid' }
    mapped.set(doc.slug, procedure); ids.add(doc._id)
  }
  const added = [...mapped.values()].filter((procedure) => !originals.some((original) => original.slug === procedure.slug))
  return { procedures: [...originals.map((procedure) => mapped.get(procedure.slug) ?? procedure), ...added], status: 'sanity' }
}
