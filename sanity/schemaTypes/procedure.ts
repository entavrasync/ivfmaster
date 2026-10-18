import { ClipboardList } from 'lucide-react'
import { defineArrayMember, defineField, defineType, getPublishedId } from 'sanity'
import { apiVersion } from '../project.ts'
import { defineImageField } from '../reference/schemaTypes/shared/fields.ts'

const nonBlank = (value: string | undefined) =>
  value === undefined || value.trim().length > 0 || 'Enter text rather than whitespace.'

export const localizedString = defineType({
  name: 'procedureLocalizedString',
  title: 'Localized text',
  type: 'object',
  fields: [
    defineField({ name: 'en', title: 'English', type: 'string', validation: (r) => r.required().custom(nonBlank) }),
    defineField({ name: 'mr', title: 'Marathi (optional; falls back to English)', type: 'string' }),
  ],
})

export const localizedText = defineType({
  name: 'procedureLocalizedText',
  title: 'Localized paragraph',
  type: 'object',
  fields: [
    defineField({ name: 'en', title: 'English', type: 'text', rows: 4, validation: (r) => r.required().custom(nonBlank) }),
    defineField({ name: 'mr', title: 'Marathi (optional; falls back to English)', type: 'text', rows: 4 }),
  ],
})

export const procedure = defineType({
  name: 'procedure',
  title: 'Procedure',
  type: 'document',
  icon: ClipboardList,
  groups: [
    { name: 'identity', title: 'Identity & approval', default: true },
    { name: 'hero', title: 'Introduction & quick facts' },
    { name: 'content', title: 'Explanation & steps' },
    { name: 'faqs', title: 'Questions' },
    { name: 'images', title: 'Images' },
    { name: 'seo', title: 'SEO' },
  ],
  description: 'One document per procedure page, shared across English and Marathi. A new approved, published procedure also appears on /procedures and in the navigation menu.',
  fields: [
    defineField({
      name: 'slug',
      title: 'Stable URL slug',
      type: 'slug',
      description: 'Use the existing route slug (ivf for this workflow). Never generate this from a translated title. A published slug cannot be renamed here.',
      validation: (rule) => rule.required().custom(async (value, context) => {
        if (!value?.current) return true
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.current)) return 'Use lowercase letters, numbers and single hyphens.'
        const id = context.document?._id ? getPublishedId(context.document._id) : undefined
        if (!id) return true
        try {
          const previous = await context.getClient({ apiVersion }).withConfig({ perspective: 'published' })
            .fetch<string | null>('*[_id == $id][0].slug.current', { id })
          return !previous || previous === value.current || 'Keep the published slug; a URL change requires a separately reviewed redirect.'
        } catch {
          return 'Could not verify the published slug. Check project access and retry.'
        }
      }),
    }),
    defineField({
      name: 'reviewStatus',
      title: 'Clinical approval',
      type: 'string',
      initialValue: 'pendingReview',
      description: 'Only mark approved after the clinic has reviewed all populated languages. Unapproved documents never replace the current website copy.',
      options: { list: [{ title: 'Pending clinical review', value: 'pendingReview' }, { title: 'Clinically approved', value: 'approved' }], layout: 'radio' },
      validation: (r) => r.required().custom((value) => value === 'approved' || 'Clinical approval is required before publishing.'),
    }),
    defineField({ name: 'name', title: 'Short title', type: 'procedureLocalizedString', description: 'Page/card name, such as IVF. Does not change navigation labels.', validation: (r) => r.required() }),
    defineField({ name: 'fullName', title: 'Full title', type: 'procedureLocalizedString', validation: (r) => r.required() }),
    defineField({ name: 'oneLiner', title: 'Summary', type: 'procedureLocalizedText', description: 'Procedure cards and default SEO description. Navigation has separate copy.', validation: (r) => r.required() }),
    defineField({ name: 'heroDescription', title: 'Introduction', type: 'procedureLocalizedText', validation: (r) => r.required() }),
    defineField({
      name: 'quickFacts', title: 'Quick facts', type: 'array',
      of: [defineArrayMember({
        name: 'procedureQuickFact', type: 'object',
        fields: [
          defineField({ name: 'label', type: 'procedureLocalizedString', validation: (r) => r.required() }),
          defineField({ name: 'value', type: 'procedureLocalizedString', validation: (r) => r.required() }),
        ],
        preview: { select: { title: 'label.en', subtitle: 'value.en' } },
      })],
      validation: (r) => r.required().min(1).max(4),
    }),
    defineField({
      name: 'whoItsFor', title: 'Indications — who it is for', type: 'array',
      of: [defineArrayMember({ type: 'procedureLocalizedString' })],
      validation: (r) => r.required().min(1),
    }),
    defineField({
      name: 'process', title: 'Steps (in display order)', type: 'array',
      of: [defineArrayMember({
        name: 'procedureStep', type: 'object',
        fields: [
          defineField({ name: 'title', type: 'procedureLocalizedString', validation: (r) => r.required() }),
          defineField({ name: 'detail', type: 'procedureLocalizedText', validation: (r) => r.required() }),
        ],
        preview: { select: { title: 'title.en' } },
      })],
      validation: (r) => r.required().min(1),
    }),
    defineField({ name: 'whatToExpect', title: 'Expectations', type: 'procedureLocalizedText', validation: (r) => r.required() }),
    defineField({
      name: 'faqs', title: 'FAQs', type: 'array',
      of: [defineArrayMember({
        name: 'procedureFaq', type: 'object',
        fields: [
          defineField({ name: 'q', title: 'Question', type: 'procedureLocalizedString', validation: (r) => r.required() }),
          defineField({ name: 'a', title: 'Answer', type: 'procedureLocalizedText', validation: (r) => r.required() }),
        ],
        preview: { select: { title: 'q.en' } },
      })],
      validation: (r) => r.required().min(1),
    }),
    {
      ...defineImageField({ name: 'cardImage', title: 'Card image (optional)' }),
      description: 'Shown on the procedure card at /procedures. Landscape photo, at least 1200×800 (3:2); set the hotspot on the subject. If empty, the banner image is used.',
    },
    {
      ...defineImageField({ name: 'bannerImage', title: 'Banner image (optional)' }),
      description: 'Shown at the top of this procedure page. Photo at least 1500×1200 (5:4), subject centred. If empty, the card image is used.',
    },
    defineField({
      name: 'seo', title: 'SEO overrides (optional)', type: 'object',
      description: 'Leave empty to use the page title and summary. Canonicals, language alternates and social images remain controlled by the existing metadata helper.',
      fields: [
        defineField({ name: 'metaTitle', title: 'Search title', type: 'procedureLocalizedString', description: 'Shown as the page title in search results. About 50–60 characters.' }),
        defineField({ name: 'metaDescription', title: 'Search description', type: 'procedureLocalizedText', description: 'Shown under the title in search results. About 140–160 characters.' }),
      ],
    }),
  ].map((field) => ({ ...field, group: ['slug', 'reviewStatus', 'name', 'fullName'].includes(field.name) ? 'identity' : ['oneLiner', 'heroDescription', 'quickFacts'].includes(field.name) ? 'hero' : field.name === 'faqs' ? 'faqs' : field.name === 'seo' ? 'seo' : ['cardImage', 'bannerImage'].includes(field.name) ? 'images' : 'content' })),
  preview: { select: { title: 'name.en', subtitle: 'slug.current' } },
})
