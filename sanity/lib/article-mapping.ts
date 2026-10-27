import { createImageUrlBuilder } from '@sanity/image-url'
import { createTranslator, type AbstractIntlMessages } from 'next-intl'
import { z } from 'zod'
import type { Article } from '../../lib/articles.ts'
import type { Locale } from '../../i18n/routing.ts'
import { dataset, projectId } from '../project.ts'
import { resolvePageSeo, type PageSeo } from './seo-mapping.ts'
import { articleModels, isArticleSlug, reservedArticleSlugs, articleSlugPattern, maxArticles, type ArticleContract, type ArticleField } from '../article-model.ts'

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
    metadata: z.object({ dimensions: z.object({ width: z.number().int().positive(), height: z.number().int().positive() }), lqip: text.regex(/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/).nullish() }),
  }),
})
const localizedText = localizedSchema('text')
const optionalCopy = z.string().refine(value => !value.trim() || copy.safeParse(value).success).nullish()
export const optionalArticleCopy = z.object({ en: optionalCopy, mr: optionalCopy })
const newSections = z.array(z.object({ _key: text, heading: copy, body: copy })).min(1).max(100)
  .refine((items) => new Set(items.map((item) => item._key)).size === items.length, 'Each section must be a separate item.')
export const newArticleContent = z.object({
  intro: localizedText,
  sections: z.object({ en: newSections, mr: newSections.nullish() }),
  keyTakeaways: z.object({ en: strings.max(20), mr: strings.max(20).nullish() }).nullish(),
})
export const articleDocument = z.object({
  _id: text.refine((s) => !s.startsWith('drafts.') && !s.startsWith('versions.')),
  reviewStatus: z.literal('approved'), slug: text.max(96).regex(articleSlugPattern).refine((slug) => !reservedArticleSlugs.some((reserved) => reserved === slug), 'This address belongs to an existing article redirect.'),
  title: localizedText, excerpt: localizedText,
  category: z.enum(['Conditions', 'Understanding IVF', 'Myths']),
  date: z.iso.date(), readTime: z.number().int().positive().max(120),
  related: z.array(z.object({ _key: text, slug: text, reviewStatus: z.literal('approved') })).max(6).nullish(),
  // Either override may be set alone; keyword, social and visibility fields are read from the raw record.
  seo: z.object({ metaTitle: optionalArticleCopy.nullish(), metaDescription: optionalArticleCopy.nullish() }).nullish(),
  coverImage: coverImage.nullish(),
  content: z.unknown().optional(),
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
export type CmsArticle = Article & { pageSeo?: PageSeo }

function withCover(result: CmsArticle, image: z.infer<typeof coverImage> | null | undefined, locale: Locale): CmsArticle {
  if (!image) return result
  const c = image.crop ?? { left: 0, right: 0, top: 0, bottom: 0 }, d = image.asset.metadata.dimensions
  const clamp = (v: number) => Math.max(0, Math.min(100, v))
  return { ...result,
    coverImage: { src: createImageUrlBuilder({ projectId, dataset }).image({ asset: { _ref: image.asset._id }, crop: image.crop ?? undefined, hotspot: image.hotspot ?? undefined }).auto('format').url(), width: Math.max(1, Math.round(d.width * (1 - c.left - c.right))), height: Math.max(1, Math.round(d.height * (1 - c.top - c.bottom))), ...(image.asset.metadata.lqip ? { blurDataURL: image.asset.metadata.lqip } : {}) },
    coverImageAlt: read(image.alt, locale),
    ...(image.hotspot ? { coverPosition: `${clamp((image.hotspot.x - c.left) / (1 - c.left - c.right) * 100)}% ${clamp((image.hotspot.y - c.top) / (1 - c.top - c.bottom) * 100)}%` } : {}),
  }
}

export function mergeArticleMessages(base: AbstractIntlMessages, overrides: AbstractIntlMessages): AbstractIntlMessages {
  const out = { ...base }
  for (const [key, value] of Object.entries(overrides)) {
    const old = out[key]
    out[key] = value && typeof value === 'object' && !Array.isArray(value) && old && typeof old === 'object' && !Array.isArray(old)
      ? mergeArticleMessages(old, value) : value
  }
  return out
}

function pageSeoFor(input: unknown, slug: string, locale: Locale): { pageSeo?: PageSeo } {
  const raw = Array.isArray(input) ? input.find((record) => record && typeof record === 'object' && Reflect.get(record, 'slug') === slug) : undefined
  const pageSeo = raw ? resolvePageSeo(Reflect.get(raw, 'seo'), locale) : undefined
  return pageSeo ? { pageSeo } : {}
}

export function resolveArticles(input: unknown, fallback: readonly Article[], locale: Locale): { articles: readonly CmsArticle[]; overrides: AbstractIntlMessages; status: string } {
  const fail = (status: string) => ({ articles: fallback, overrides: {}, status })
  const parsed = z.array(articleDocument).max(maxArticles).safeParse(input)
  if (!parsed.success) return fail('invalid')
  if (parsed.data.length === 0) return fail('missing')
  if (new Set(parsed.data.map((d) => d.slug)).size !== parsed.data.length) return fail('ambiguous')
  try {
    const eligible = new Set([...fallback.map((article) => article.slug), ...parsed.data.map((doc) => doc.slug)])
    const relatedFor = (doc: z.infer<typeof articleDocument>) => {
      const related = doc.related?.map((item) => item.slug)
      if (related && (related.includes(doc.slug) || new Set(related).size !== related.length || related.some((slug) => !eligible.has(slug)))) throw new Error('Invalid article relationship')
      return related
    }
    let overrides: AbstractIntlMessages = {}
    const articles = fallback.map((original): CmsArticle => {
      const doc = parsed.data.find((d) => d.slug === original.slug)
      if (!doc) return original
      if (!isArticleSlug(doc.slug)) throw new Error('Unexpected legacy article')
      const model = articleModels[doc.slug]
      const body = articleBodySchema(model.contract).parse((doc as Record<string, unknown>)[model.field])
      const related = relatedFor(doc)
      const title = read(doc.title, locale), excerpt = read(doc.excerpt, locale)
      const localizedBody = localizeArticleBody(model.contract, body, locale)
      const listing = { title, excerpt }
      const messageUpdate = model.namespace === 'EducateIVF'
        ? { EducateIVF: { articles: { [doc.slug]: { ...listing, ...localizedBody } } } }
        : { EducateIVF: { articles: { [doc.slug]: listing } }, [model.namespace]: localizedBody }
      overrides = mergeArticleMessages(overrides, messageUpdate)
      // Existing bespoke renderers own their category styling and translated labels.
      if (doc.category !== original.category) throw new Error('Unsupported category change')
      const result: CmsArticle = { ...original, coverImage: undefined, coverImageAlt: undefined, coverPosition: undefined, title, excerpt, category: doc.category, date: doc.date, readTime: doc.readTime,
        ...(related ? { relatedSlugs: related } : {}),
        ...(pageSeoFor(input, doc.slug, locale)),
      }
      return withCover(result, doc.coverImage, locale)
    })
    for (const doc of parsed.data.filter((record) => !isArticleSlug(record.slug))) {
      const content = newArticleContent.parse(doc.content)
      const related = relatedFor(doc)
      articles.push(withCover({ slug: doc.slug, title: read(doc.title, locale), excerpt: read(doc.excerpt, locale), category: doc.category, date: doc.date, readTime: doc.readTime,
        intro: read(content.intro, locale), sections: choose(content.sections, locale) as Article['sections'],
        ...(content.keyTakeaways ? { keyTakeaways: choose(content.keyTakeaways, locale) as string[] } : {}),
        ...(related ? { relatedSlugs: related } : {}), ...pageSeoFor(input, doc.slug, locale),
      }, doc.coverImage, locale))
    }
    return { articles, overrides, status: parsed.data.length ? 'sanity' : 'missing' }
  } catch { return fail('invalid') }
}
