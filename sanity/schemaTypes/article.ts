import { BookOpen } from 'lucide-react'
import { defineArrayMember, defineField, defineType, getPublishedId, type FieldDefinition } from 'sanity'
import { articleModels, isArticleSlug, articleSlugPattern, reservedArticleSlugs, type ArticleContract, type ArticleField } from '../article-model.ts'
import { articleBodySchema, articleDocument, newArticleContent, optionalArticleCopy } from '../lib/article-mapping.ts'
import { apiVersion } from '../project.ts'
import { approvalField, localizedField } from './editorial-fields.ts'
import { SEO_FIELDSETS, seoAdvancedFields } from '../reference/schemaTypes/objects/seo.ts'
import { SeoPanel } from '../studio/SeoPanel.ts'
import { OptionalImageInput, localized } from '../reference/schemaTypes/shared/fields'
import { validateWebsiteImage } from '../lib/image-validation'

const required = (name: string, type = 'text') => defineField({ name, type, validation: (r) => r.required() })
// These values reach next-intl's plain string API. Match the published reader
// here so editors can correct invalid copy before publication falls back silently.
const articleCopy = (name: string, title: string, paragraph = false, requiredValue = true) => defineField({
  ...(requiredValue ? localizedField(name, title, paragraph) : localized(name, { title, type: paragraph ? 'localizedText' : 'localizedString', translation: 'optional' })),
  description: 'Use plain text, without message variables or HTML/rich-text tags. English is required; blank Marathi uses English.',
  validation: (r) => (requiredValue ? r.required() : r).custom((value) => value == null || (requiredValue ? articleDocument.shape.title : optionalArticleCopy).safeParse(value).success || 'Use complete English and plain article copy without message variables or rich-text tags in either language.'),
})
const stringList = (name: string, requiredValue = false) => defineField({
  name, type: 'array', of: [defineArrayMember({ type: 'string', validation: (r) => r.required() })],
  validation: (r) => requiredValue ? r.required().min(1) : r.min(1),
})
const sectionFields = [
  defineField({ name: 'heading', type: 'string' }), defineField({ name: 'intro', type: 'text' }),
  defineField({ name: 'body', type: 'text' }), stringList('items'),
  defineField({ name: 'table', type: 'object', fields: [
    defineField({ ...stringList('headers', true), validation: (r) => r.required().length(2) }),
    defineField({ name: 'rows', type: 'array', of: [defineArrayMember({ name: 'articleTableRow', type: 'object', fields: [
      defineField({ ...stringList('cells', true), validation: (r) => r.required().length(2) }),
    ] })], validation: (r) => r.required().min(1) }),
  ] }),
]
function contentArray(name: string, kind: Exclude<ArticleField, object | 'text'>, requiredValue: boolean): FieldDefinition {
  if (kind === 'list') return stringList(name, requiredValue)
  const fields = kind === 'phases' ? [
    required('heading', 'string'), required('intro'), defineField({ name: 'intro2', type: 'text' }), defineField({ name: 'note', type: 'text' }),
    defineField({ name: 'items', type: 'array', of: [defineArrayMember({ name: 'articleDefinition', type: 'object', fields: [required('label', 'string'), required('body')] })], validation: (r) => r.required().min(1) }),
  ] : kind === 'myths' ? [required('myth'), required('fact')] : kind === 'sections' ? sectionFields.filter((field) => field.name !== 'table') : sectionFields
  return defineField({ name, type: 'array', of: [defineArrayMember({ name: `article${kind}`, type: 'object', fields })], validation: (r) => requiredValue ? r.required().min(1) : r.min(1) })
}
function bodyFields(contract: ArticleContract): FieldDefinition[] {
  return Object.entries(contract).map(([name, field]) => {
    if (typeof field !== 'string') return defineField({ name, type: 'object', fields: bodyFields(field), validation: (r) => r.required() })
    if (field === 'text') return localizedField(name, name, true)
    return defineField({ name, type: 'object', description: 'English required; Marathi is an optional complete list. Lists may differ by language; an absent Marathi list uses English.',
      fields: [contentArray('en', field, true), contentArray('mr', field, false)], validation: (r) => r.required(),
    })
  })
}

const languages = [['en', 'English'], ['mr', 'Marathi (optional; uses English when empty)']] as const
const newContentFields = [
  defineField({ name: 'intro', title: 'Opening paragraph', type: 'object', fields: languages.map(([name, title]) => defineField({ name, title, type: 'text', rows: 5 })) }),
  defineField({ name: 'sections', title: 'Article sections', type: 'object', description: 'Add at least one English section. Each section has a heading and text. Use a blank line between paragraphs. Marathi sections are optional; add a complete translated set if you use them.', fields: languages.map(([name, title]) => defineField({ name, title, type: 'array', of: [defineArrayMember({ type: 'object', fields: [defineField({ name: 'heading', title: 'Section heading', type: 'string' }), defineField({ name: 'body', title: 'Section text', type: 'text', rows: 8 })], preview: { select: { title: 'heading', subtitle: 'body' } } })] })) }),
  defineField({ name: 'keyTakeaways', title: 'Key points to remember (optional)', type: 'object', description: 'Leave this whole field empty, or add 1–20 English points. Marathi can have its own translated list.', fields: languages.map(([name, title]) => defineField({ name, title, type: 'array', of: [defineArrayMember({ type: 'string' })] })) }),
]

export const article = defineType({
  name: 'article', title: 'Education article', type: 'document', icon: BookOpen,
  groups: [
    { name: 'identity', title: 'Identity & approval', default: true },
    { name: 'listing', title: 'Listing & cover' },
    { name: 'content', title: 'Article content' },
    { name: 'related', title: 'Related articles' },
    { name: 'seo', title: 'SEO' },
  ],
  initialValue: { reviewStatus: 'pendingReview' },
  description: 'Create a new education article or edit an existing one. Write English content and optional Marathi translations. New articles appear on the education page after clinic approval and publishing.',
  fields: [
    defineField({ name: 'slug', title: 'Article web address', type: 'slug', options: { source: 'title.en', maxLength: 96 }, description: 'Enter the English article title, then click Generate here. Example: preparing-for-your-first-ivf-visit. This becomes /educate-ivf/preparing-for-your-first-ivf-visit. Do not change the address of a published article.',
      validation: (r) => r.custom(async (value, context) => {
        if (!value?.current) return 'Enter the English title, then click Generate in Article web address.'
        if (!articleSlugPattern.test(value.current) || value.current.length > 96) return 'Use lowercase English letters, numbers and single hyphens, up to 96 characters. Example: preparing-for-ivf.'
        if (reservedArticleSlugs.some((slug) => slug === value.current)) return 'This address redirects to an existing article. Generate a different address from your new article title.'
        if (!context.document?._id) return true
        try {
          const previous = await context.getClient({ apiVersion }).withConfig({ perspective: 'published' }).fetch<string | null>('*[_id == $id][0].slug.current', { id: getPublishedId(context.document._id) })
          return !previous || previous === value.current || `This article is already published at /educate-ivf/${previous}. Keep that address so readers’ links continue working.`
        } catch { return 'Could not verify the published slug. Check access and retry.' }
      }),
    }),
    approvalField, articleCopy('title', 'Listing / related-card title'), articleCopy('excerpt', 'Listing excerpt', true),
    defineField({ name: 'category', type: 'string', description: 'Choose the topic that best fits your new article. For one of the original seven articles, keep its existing category.', options: { list: ['Conditions', 'Understanding IVF', 'Myths'] }, validation: (r) => r.required().custom((value, context) => {
      const slug = (context.document?.slug as { current?: string } | undefined)?.current
      if (!slug || !isArticleSlug(slug)) return true
      const expected = slug === 'ivf-myths-vs-facts' ? 'Myths' : ['what-ivf-really-is', 'age-and-ivf-success'].includes(slug) ? 'Understanding IVF' : 'Conditions'
      return value === expected || `Keep the existing ${expected} category.`
    }) }),
    required('date', 'date'), defineField({ name: 'readTime', title: 'Reading time (minutes)', type: 'number', validation: (r) => r.required().integer().min(1).max(120) }),
    defineField({ name: 'coverImage', title: 'Article cover image (optional)', type: 'image', options: { hotspot: true }, components: { input: OptionalImageInput }, fields: [localizedField('alt', 'Describe this picture')],
      description: 'Upload a permitted landscape picture, ideally 1600 × 900 pixels or larger. Keep the main subject near the centre and avoid text at the edges; cards and the article page crop differently. Describe the picture in English, with optional Marathi. Without a picture, the website shows its existing lettered placeholder.',
      validation: (r) => [r.assetRequired(), r.custom(validateWebsiteImage)] }),
    defineField({ name: 'seo', title: 'SEO', type: 'object', description: 'Every field is optional: empty fields keep the article title and excerpt.', fieldsets: SEO_FIELDSETS, components: { input: SeoPanel },
      fields: [articleCopy('metaTitle', 'SEO title', false, false), articleCopy('metaDescription', 'SEO description', true, false), ...seoAdvancedFields()] }),
    defineField({ name: 'related', title: 'Related articles (optional override)', type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'article' }], options: { filter: ({ document }) => ({ filter: 'reviewStatus == "approved" && _id != $id', params: { id: getPublishedId(document._id) } }) } })],
      validation: r => r.max(6).unique().custom((value, context) => {
        if (!value || !context.document?._id) return true
        const self = getPublishedId(context.document._id)
        const invalid = value.flatMap((entry, index) => {
          if (!entry || typeof entry !== 'object' || !('_ref' in entry) || typeof entry._ref !== 'string' || getPublishedId(entry._ref) !== self) return []
          return [[('_key' in entry && typeof entry._key === 'string') ? { _key: entry._key } : index]]
        })
        return invalid.length ? { message: 'Choose another article. An article cannot list itself as related.', paths: invalid } : true
      }), description: 'Leave unset to retain existing relationships. Choose other approved articles and publish those first.' }),
    defineField({ name: 'content', title: 'Write your new article', type: 'object', fields: newContentFields, hidden: ({ document }) => {
      const slug = (document?.slug as { current?: string } | undefined)?.current
      return !!slug && isArticleSlug(slug)
    } }),
    ...Object.values(articleModels).map((model) => defineField({ name: model.field, title: `${model.field} content`, type: 'object',
      fields: bodyFields(model.contract), hidden: ({ document }) => {
        const slug = (document?.slug as { current?: string } | undefined)?.current
        return !slug || !isArticleSlug(slug) || articleModels[slug].field !== model.field
      },
    })),
  ].map((field) => ({ ...field, group: ['slug', 'reviewStatus', 'category', 'date', 'readTime'].includes(field.name) ? 'identity' : ['title', 'excerpt', 'coverImage'].includes(field.name) ? 'listing' : field.name === 'related' ? 'related' : field.name === 'seo' ? 'seo' : 'content' })),
  validation: (r) => r.custom((value) => {
    const doc = value as Record<string, unknown> | undefined
    const slug = (doc?.slug as { current?: string } | undefined)?.current
    if (!doc || !slug) return true
    if (!isArticleSlug(slug)) {
      const result = newArticleContent.safeParse(doc.content)
      if (result.success) return true
      return result.error.issues.map((issue) => {
        let current: unknown = doc.content
        const path = issue.path.map((segment) => {
          if (typeof segment === 'number' && Array.isArray(current)) {
            current = current[segment]
            if (current && typeof current === 'object' && '_key' in current && typeof current._key === 'string') return { _key: current._key }
          } else current = current && typeof current === 'object' ? Reflect.get(current, segment) : undefined
          return typeof segment === 'symbol' ? String(segment) : segment
        })
        const field = issue.path.at(-1)
        const message = !doc.content ? 'Open Write your new article. Add an English opening paragraph and at least one section with a heading and text.' : field === 'heading' ? 'Write a heading for this section.' : field === 'body' ? 'Write the text for this section. Use a blank line between paragraphs.' : issue.path.includes('sections') ? 'Add at least one complete section with a heading and text. If you add Marathi, complete its sections too.' : issue.path.includes('intro') ? 'Write the opening paragraph in English. Marathi is optional. Use normal text without HTML or message variables.' : 'Add complete English key points, or leave Key points to remember empty. Do not add blank items.'
        return { message, path: ['content', ...path] }
      })
    }
    const model = articleModels[slug]
    const result = articleBodySchema(model.contract).safeParse(doc[model.field])
    if (result.success) return true
    return result.error.issues.map(issue => {
      let current: unknown = doc[model.field]
      const path = issue.path.map(segment => {
        if (typeof segment === 'number' && Array.isArray(current)) {
          current = current[segment]
          if (current && typeof current === 'object' && '_key' in current && typeof current._key === 'string') return { _key: current._key }
        } else current = current && typeof current === 'object' ? Reflect.get(current, segment) : undefined
        return typeof segment === 'symbol' ? String(segment) : segment
      })
      return { message: `Complete this ${issue.path.includes('mr') ? 'Marathi' : 'English'} article field. Use nonblank plain text, complete lists, and two-column tables where shown.`, paths: [[model.field, ...path]] }
    })
  }),
  preview: { select: { title: 'title.en', subtitle: 'slug.current', media: 'coverImage' } },
})
