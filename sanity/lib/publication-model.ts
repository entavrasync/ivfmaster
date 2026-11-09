import { z } from 'zod'
import { parsePublicationMedia } from './publication-media.ts'

/** Maximum featured speeches per speech type; also the number of top cards on a listing. */
export const FEATURED_LIMIT = 3
export const publicationSlug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(96)
export const publicationCopy = z.object({ en: z.string().trim().min(1), mr: z.string().nullish() })
const optionalCopy = publicationCopy.nullish().catch(null)
export const safeWebUrl = z.url().refine(value => {
  const url = new URL(value)
  return url.protocol === 'https:' && !url.username && !url.password
}, 'Use a complete HTTPS web address.')

const span = z.object({ _type: z.literal('span'), _key: z.string(), text: z.string(), marks: z.array(z.string()).default([]) })
export const publicationBlock = z.object({
  _type: z.literal('block'), _key: z.string(),
  style: z.enum(['normal', 'h2', 'h3', 'blockquote']).default('normal'),
  listItem: z.enum(['bullet', 'number']).optional(), level: z.number().int().min(1).max(1).optional(),
  children: z.array(span).min(1),
  markDefs: z.array(z.object({ _key: z.string(), _type: z.literal('link'), href: safeWebUrl })).default([]),
})
export const publicationBlocks = z.array(publicationBlock).min(1).refine(blocks => blocks.some(block => block.children.some(child => child.text.trim())), 'Write some content.')
export const publicationBody = z.object({ en: publicationBlocks, mr: publicationBlocks.nullish() })
export type PublicationBlock = z.infer<typeof publicationBlock>

const category = z.object({ _id: z.string(), title: publicationCopy, slug: z.object({ current: publicationSlug }), scope: z.enum(['news', 'event']) })
const media = z.object({ _key: z.string(), url: z.string().refine(value => !!parsePublicationMedia(value)), thumbnail: z.unknown().optional() })
const common = {
  _id: z.string().min(1), _updatedAt: z.iso.datetime({ offset: true }),
  reviewStatus: z.enum(['approved', 'pendingReview']),
  title: publicationCopy, slug: z.object({ current: publicationSlug }),
  summary: publicationCopy, body: publicationBody, category: category.nullish(),
  coverImage: z.unknown().optional(), featured: z.boolean().nullish(),
  featuredPosition: z.number().int().min(1).max(FEATURED_LIMIT).nullish().catch(null),
  media: z.array(media).nullish().catch(null), seo: z.unknown().optional(),
}
const creditShape = {
  author: optionalCopy,
  authorKind: z.enum(['Person', 'Organization']).nullish(),
  relatedLinks: z.array(z.object({ _key: z.string(), label: publicationCopy, url: safeWebUrl })).nullish().catch(null),
}
// Medical (`news`) and patient (`event`) speeches share one shape; only the stored type differs.
const speechShape = { ...common, publishedAt: z.iso.datetime({ offset: true }), ...creditShape }
export const newsDocument = z.object({ ...speechShape, _type: z.literal('news') })
export const eventDocument = z.object({ ...speechShape, _type: z.literal('event') })
export type NewsDocument = z.infer<typeof newsDocument>
export type EventDocument = z.infer<typeof eventDocument>
export type PublicationDocument = NewsDocument | EventDocument

export function localizePublication(value: z.infer<typeof publicationCopy>, locale: string): string {
  return locale === 'mr' && value.mr?.trim() ? value.mr.trim() : value.en.trim()
}
export function localizePublicationBody(value: z.infer<typeof publicationBody>, locale: string): PublicationBlock[] {
  return locale === 'mr' && value.mr?.length ? value.mr : value.en
}

/** Quarantine invalid/duplicate URLs rather than choosing an arbitrary document. */
export function resolvePublications(input: unknown, preview = false): PublicationDocument[] {
  if (!Array.isArray(input)) return []
  const valid = input.flatMap(value => {
    const result = z.union([newsDocument, eventDocument]).safeParse(value)
    if (!result.success) return []
    const doc = result.data
    if ((!preview && (doc.reviewStatus !== 'approved' || doc._id.startsWith('drafts.'))) || doc._id.startsWith('versions.')) return []
    if (doc.category && doc.category.scope !== doc._type) return []
    return [doc]
  })
  const counts = new Map<string, number>()
  for (const doc of valid) { const key = `${doc._type}/${doc.slug.current}`; counts.set(key, (counts.get(key) ?? 0) + 1) }
  return valid.filter(doc => counts.get(`${doc._type}/${doc.slug.current}`) === 1)
}
