import { createImageUrlBuilder } from '@sanity/image-url'
import { createTranslator, type AbstractIntlMessages } from 'next-intl'
import { z } from 'zod'
import type { Article } from '../../lib/articles.ts'
import type { Locale } from '../../i18n/routing.ts'
import { dataset, projectId } from '../project.ts'
import { articleModels, articleSlugs, type ArticleContract, type ArticleField } from '../article-model.ts'

const text = z.string().refine((s) => s.trim().length > 0)
// Content is passed through next-intl's string API: reject ICU markup/variables,
// rather than silently rendering broken messages or accepting arbitrary HTML.
const copy = text.refine((s) => {
  if (/[{}]|<\/?[A-Za-z][^>]*>/.test(s)) return false
  try { return createTranslator({ locale: 'en', messages: { value: s }, onError: (error) => { throw error } })('value') === s }
  catch { return false }
}, 'Use plain article copy without ICU variables or rich-text tags.')
const strings = z.array(copy).min(1)
const table = z.object({ headers: strings.min(2).max(2), rows: z.array(z.object({ _key: text, cells: strings.min(2).max(2) })).min(1) })
const section = z.object({
  _key: text, heading: copy.nullish(), intro: copy.nullish(), body: copy.nullish(), items: strings.nullish(), table: table.nullish(),
}).refine((s) => !!(s.intro || s.body || s.items || s.table), 'A section needs content.')
const phase = z.object({
  _key: text, heading: copy, intro: copy, intro2: copy.nullish(), note: copy.nullish(),
  items: z.array(z.object({ _key: text, label: copy, body: copy })).min(1),
})
const leafSchemas = {
  text: copy,
  list: strings,
  phases: z.array(phase).min(1),
  myths: z.array(z.object({ _key: text, myth: copy, fact: copy })).min(1),
  sections: z.array(section.safeExtend({ table: z.null().optional() })).min(1),
  tableSections: z.array(section).min(1),
} as const

function localizedSchema(field: Exclude<ArticleField, object>) {
  return z.object({ en: leafSchemas[field], mr: field === 'text' ? z.string().nullish() : leafSchemas[field].nullish() })
    .refine((v) => field !== 'text' || !v.mr || typeof v.mr === 'string' && (!v.mr.trim() || copy.safeParse(v.mr).success))
}
export function articleBodySchema(contract: ArticleContract): z.ZodType<Record<string, unknown>> {
  return z.object(Object.fromEntries(Object.entries(contract).map(([name, field]) => [name,
    typeof field === 'string' ? localizedSchema(field) : articleBodySchema(field),
  ])))
}

const fraction = z.number().min(0).max(1)
const coverImage = z.object({
  alt: z.object({ en: text, mr: z.string().nullish() }),
  crop: z.object({ left: fraction, right: fraction, top: fraction, bottom: fraction }).refine((c) => c.left + c.right < 1 && c.top + c.bottom < 1).nullish(),
  hotspot: z.object({ x: fraction, y: fraction, width: fraction.positive(), height: fraction.positive() }).nullish(),
  asset: z.object({
    _id: text.regex(/^image-[a-zA-Z0-9]+-\d+x\d+-(jpg|png|webp|avif)$/),
    url: z.url().refine((s) => s.startsWith(`https://cdn.sanity.io/images/${projectId}/${dataset}/`)),
    metadata: z.object({ dimensions: z.object({ width: z.number().int().positive(), height: z.number().int().positive() }), lqip: text.regex(/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/) }),
  }),
})
const localizedText = localizedSchema('text')
export const articleDocument = z.object({
  _id: text.refine((s) => !s.startsWith('drafts.') && !s.startsWith('versions.')),
  reviewStatus: z.literal('approved'), slug: z.enum(articleSlugs as [typeof articleSlugs[number], ...typeof articleSlugs[number][]]),
  title: localizedText, excerpt: localizedText,
  category: z.enum(['Conditions', 'Understanding IVF', 'Myths']),
  date: z.iso.date(), readTime: z.number().int().positive().max(120),
  related: z.array(z.object({ _key: text, slug: text, reviewStatus: z.literal('approved') })).max(6).nullish(),
  seo: z.object({ metaTitle: localizedText, metaDescription: localizedText }).nullish(),
  coverImage: coverImage.nullish(),
  ...Object.fromEntries(Object.values(articleModels).map((model) => [model.field, z.unknown().optional()])),
})

function choose(value: { en: unknown; mr?: unknown }, locale: Locale): unknown {
  return locale === 'mr' && value.mr != null && (typeof value.mr !== 'string' || value.mr.trim()) ? value.mr : value.en
}
function withoutKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(withoutKeys)
  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>
    if (Object.hasOwn(record, 'cells')) return record.cells
    return Object.fromEntries(Object.entries(record).filter(([k, v]) => k !== '_key' && v != null).map(([k, v]) => [k, withoutKeys(v)]))
  }
  return value
}
export function localizeArticleBody(contract: ArticleContract, body: Record<string, unknown>, locale: Locale): AbstractIntlMessages {
  return Object.fromEntries(Object.entries(contract).map(([name, field]) => {
    const v = body[name] as Record<string, unknown>
    return [name, typeof field === 'string' ? withoutKeys(choose(v as { en: unknown; mr?: unknown }, locale)) : localizeArticleBody(field, v, locale)]
  })) as AbstractIntlMessages
}
const read = (value: { en: unknown; mr?: unknown }, locale: Locale) => choose(value, locale) as string
export type CmsArticle = Article & { seo?: { metaTitle: string; metaDescription: string } }

export function mergeArticleMessages(base: AbstractIntlMessages, overrides: AbstractIntlMessages): AbstractIntlMessages {
  const out = { ...base }
  for (const [key, value] of Object.entries(overrides)) {
    const old = out[key]
    out[key] = value && typeof value === 'object' && !Array.isArray(value) && old && typeof old === 'object' && !Array.isArray(old)
      ? mergeArticleMessages(old, value) : value
  }
  return out
}

export function resolveArticles(input: unknown, fallback: readonly Article[], locale: Locale): { articles: readonly CmsArticle[]; overrides: AbstractIntlMessages; status: string } {
  const fail = (status: string) => ({ articles: fallback, overrides: {}, status })
  const parsed = z.array(articleDocument).max(articleSlugs.length).safeParse(input)
  if (!parsed.success) return fail('invalid')
  if (parsed.data.length === 0) return fail('missing')
  if (new Set(parsed.data.map((d) => d.slug)).size !== parsed.data.length) return fail('ambiguous')
  try {
    let overrides: AbstractIntlMessages = {}
    const articles = fallback.map((original): CmsArticle => {
      const doc = parsed.data.find((d) => d.slug === original.slug)
      if (!doc) return original
      const model = articleModels[doc.slug]
      const body = articleBodySchema(model.contract).parse((doc as Record<string, unknown>)[model.field])
      const related = doc.related?.map((r) => r.slug)
      if (related && (related.includes(doc.slug) || new Set(related).size !== related.length || related.some((s) => !articleSlugs.includes(s as typeof doc.slug)))) throw new Error('Invalid article relationship')
      const title = read(doc.title, locale), excerpt = read(doc.excerpt, locale)
      const localizedBody = localizeArticleBody(model.contract, body, locale)
      const listing = { title, excerpt }
      const messageUpdate = model.namespace === 'EducateIVF'
        ? { EducateIVF: { articles: { [doc.slug]: { ...listing, ...localizedBody } } } }
        : { EducateIVF: { articles: { [doc.slug]: listing } }, [model.namespace]: localizedBody }
      overrides = mergeArticleMessages(overrides, messageUpdate)
      // Existing bespoke renderers own their category styling and translated labels.
      if (doc.category !== original.category) throw new Error('Unsupported category change')
      const result: CmsArticle = { ...original, title, excerpt, category: doc.category, date: doc.date, readTime: doc.readTime,
        ...(related ? { relatedSlugs: related } : {}),
        ...(doc.seo ? { seo: { metaTitle: read(doc.seo.metaTitle, locale), metaDescription: read(doc.seo.metaDescription, locale) } } : {}),
      }
      if (doc.coverImage) {
        const p = doc.coverImage, c = p.crop ?? { left: 0, right: 0, top: 0, bottom: 0 }, d = p.asset.metadata.dimensions
        const clamp = (v: number) => Math.max(0, Math.min(100, v))
        return { ...result,
          coverImage: { src: createImageUrlBuilder({ projectId, dataset }).image({ asset: { _ref: p.asset._id }, crop: p.crop ?? undefined, hotspot: p.hotspot ?? undefined }).auto('format').url(), width: Math.max(1, Math.round(d.width * (1 - c.left - c.right))), height: Math.max(1, Math.round(d.height * (1 - c.top - c.bottom))), blurDataURL: p.asset.metadata.lqip },
          coverImageAlt: read(p.alt, locale),
          ...(p.hotspot ? { coverPosition: `${clamp((p.hotspot.x - c.left) / (1 - c.left - c.right) * 100)}% ${clamp((p.hotspot.y - c.top) / (1 - c.top - c.bottom) * 100)}%` } : {}),
        }
      }
      return result
    })
    return { articles, overrides, status: parsed.data.length ? 'sanity' : 'missing' }
  } catch { return fail('invalid') }
}
