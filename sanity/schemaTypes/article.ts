import { BookOpen } from 'lucide-react'
import { defineArrayMember, defineField, defineType, getPublishedId, type FieldDefinition } from 'sanity'
import { articleModels, articleSlugs, isArticleSlug, type ArticleContract, type ArticleField } from '../article-model.ts'
import { articleBodySchema, articleDocument } from '../lib/article-mapping.ts'
import { apiVersion } from '../project.ts'
import { approvalField, localizedField } from './editorial-fields.ts'
import { SEO_FIELDSETS, seoAdvancedFields } from '../reference/schemaTypes/objects/seo.ts'
import { SeoPanel } from '../studio/SeoPanel.ts'

const required = (name: string, type = 'text') => defineField({ name, type, validation: (r) => r.required() })
// These values reach next-intl's plain string API. Match the published reader
// here so editors can correct invalid copy before publication falls back silently.
const articleCopy = (name: string, title: string, paragraph = false) => defineField({
  ...localizedField(name, title, paragraph),
  description: 'Use plain text, without message variables or HTML/rich-text tags. English is required; blank Marathi uses English.',
  validation: (r) => r.required().custom((value) => value == null || articleDocument.shape.title.safeParse(value).success || 'Use complete English and plain article copy without message variables or rich-text tags in either language.'),
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

export const article = defineType({
  name: 'article', title: 'Education article', type: 'document', icon: BookOpen,
  groups: [
    { name: 'identity', title: 'Identity & approval', default: true },
    { name: 'listing', title: 'Listing & cover' },
    { name: 'content', title: 'Article content' },
    { name: 'related', title: 'Related articles' },
    { name: 'seo', title: 'SEO' },
  ],
  description: 'Existing production articles only. Keep layout, legacy URLs and system labels in code. Do not approve or publish without clinic review.',
  fields: [
    defineField({ name: 'slug', type: 'slug', description: 'Use one of the seven existing production slugs. Published URLs cannot be renamed.',
      validation: (r) => r.required().custom(async (value, context) => {
        if (!value?.current) return true
        if (!isArticleSlug(value.current)) return 'Use an existing production article slug.'
        if (!context.document?._id) return true
        try {
          const previous = await context.getClient({ apiVersion }).withConfig({ perspective: 'published' }).fetch<string | null>('*[_id == $id][0].slug.current', { id: getPublishedId(context.document._id) })
          return !previous || previous === value.current || 'Keep the published article URL.'
        } catch { return 'Could not verify the published slug. Check access and retry.' }
      }),
    }),
    approvalField, articleCopy('title', 'Listing / related-card title'), articleCopy('excerpt', 'Listing excerpt', true),
    defineField({ name: 'category', type: 'string', description: 'Keep the existing category; bespoke renderers own the matching style and localized label.', options: { list: ['Conditions', 'Understanding IVF', 'Myths'] }, validation: (r) => r.required().custom((value, context) => {
      const slug = (context.document?.slug as { current?: string } | undefined)?.current
      if (!slug || !isArticleSlug(slug)) return true
      const expected = slug === 'ivf-myths-vs-facts' ? 'Myths' : ['what-ivf-really-is', 'age-and-ivf-success'].includes(slug) ? 'Understanding IVF' : 'Conditions'
      return value === expected || `Keep the existing ${expected} category.`
    }) }),
    required('date', 'date'), defineField({ name: 'readTime', title: 'Reading time (minutes)', type: 'number', validation: (r) => r.required().integer().min(1).max(120) }),
    defineField({ name: 'coverImage', title: 'Optional replacement cover', type: 'image', options: { hotspot: true }, fields: [localizedField('alt', 'Alternative text')],
      description: 'Use an authorized image relevant to this article, with room around the subject for listing, related-card and detail crops. Preserve the high-resolution original and set its hotspot/crop; avoid embedded text near edges. Leave the whole field unset to retain the static cover. Supply English alt text; Marathi falls back to English.',
      validation: (r) => r.assetRequired() }),
    defineField({ name: 'seo', title: 'SEO', type: 'object', description: 'Every field is optional: empty fields keep the article title and excerpt.', fieldsets: SEO_FIELDSETS, components: { input: SeoPanel },
      fields: [articleCopy('metaTitle', 'SEO title'), articleCopy('metaDescription', 'SEO description', true), ...seoAdvancedFields()] }),
    defineField({ name: 'related', title: 'Related articles (optional override)', type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'article' }], options: { filter: 'reviewStatus == "approved" && slug.current in $slugs', filterParams: { slugs: articleSlugs } } })],
      validation: (r) => r.max(6).unique(), description: 'Leave unset to retain existing relationships. Referenced articles must be approved and published before the override is eligible.' }),
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
    if (!doc || !slug || !isArticleSlug(slug)) return true
    const model = articleModels[slug]
    const result = articleBodySchema(model.contract).safeParse(doc[model.field])
    return result.success || `Complete the ${model.field} content, including valid English text/lists and two-column tables where used.`
  }),
  preview: { select: { title: 'title.en', subtitle: 'slug.current', media: 'coverImage' } },
})
