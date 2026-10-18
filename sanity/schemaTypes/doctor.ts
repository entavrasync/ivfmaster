import { UserRound } from 'lucide-react'
import { defineArrayMember, defineField, defineType } from 'sanity'
import { approvalField, localizedField, stableDoctorSlug } from './editorial-fields.ts'
import { doctorDocument } from '../lib/clinic-mapping.ts'
import { SEO_FIELDSETS, seoAdvancedFields } from '../reference/schemaTypes/objects/seo.ts'
import { SeoPanel } from '../studio/SeoPanel.ts'

const localizedItems = (name: string, title: string, minimum = 1) => defineField({
  name, title, type: 'array', of: [defineArrayMember({ type: 'procedureLocalizedText' })],
  validation: (r) => r.required().min(minimum),
})

export const doctor = defineType({
  name: 'doctor', title: 'Doctor', type: 'document', icon: UserRound,
  // Adapt the reference Studio's identity/profile/SEO groups without merging
  // the target's distinct homepage and About narratives into profile copy.
  groups: [
    { name: 'identity', title: 'Identity & approval', default: true },
    { name: 'profile', title: 'Team & profile' },
    { name: 'home', title: 'Homepage summary' },
    { name: 'about', title: 'About story' },
    { name: 'media', title: 'Portrait' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    stableDoctorSlug, approvalField,
    defineField({ name: 'order', title: 'Display order', type: 'number', validation: (r) => r.required().integer().min(0) }),
    localizedField('name', 'Name'), localizedField('title', 'Specialty / professional title'),
    localizedField('essence', 'Team quotation'), localizedField('intro', 'Team introduction', true),
    defineField({ ...localizedField('biography', 'Profile biography', true),
      description: 'Use the existing b, br and link formatting tags only. Message variables and other tags cannot be rendered by the profile.',
      validation: (r) => r.required().custom((value) => value == null || doctorDocument.shape.biography.safeParse(value).success || 'Use complete English copy and only b, br and link tags, without message variables.'),
    }),
    localizedItems('credentials', 'Team/profile credentials (currently empty on the website)', 0),
    localizedField('metaDescription', 'Profile SEO description', true),
    defineField({ name: 'seo', title: 'SEO (title, keywords, sharing, visibility)', type: 'object', fieldsets: SEO_FIELDSETS, components: { input: SeoPanel },
      description: 'Optional. Empty fields keep the doctor name as the title and the profile SEO description above.',
      fields: [localizedField('metaTitle', 'Search result title', false, false), ...seoAdvancedFields()] }),
    defineField({
      name: 'portrait', type: 'image', title: 'Shared portrait (optional)', options: { hotspot: true },
      description: 'Use an authorized photograph of this doctor, with the face clear and space around the head/shoulders for the existing portrait crops. Keep the high-resolution original; use hotspot/crop to set the focal point. Leave the whole field unset to retain the existing photograph. Supply English alt text; Marathi falls back to English.',
      validation: (r) => r.assetRequired(),
      fields: [localizedField('alt', 'Alternative text')],
    }),
    defineField({
      name: 'home', title: 'Homepage summary (optional)', type: 'object',
      description: 'Separate editorial copy; do not replace this with the longer Team copy. Existing CTAs and credential emphasis stay in code.',
      fields: [localizedField('essence', 'Homepage quotation'), localizedField('intro', 'Homepage introduction', true), localizedItems('credentials', 'Homepage credentials')],
    }),
    defineField({
      name: 'about', title: 'About doctor story (optional)', type: 'object',
      description: 'Separate story paragraphs, quotation and evidence. Existing CTA labels and URLs stay in code.',
      fields: [localizedField('role', 'About professional title'), localizedField('pullQuote', 'About quotation', true), localizedItems('paragraphs', 'Story paragraphs'), localizedField('evidence', 'Evidence statement', true)],
    }),
  ].map((field) => ({ ...field, group: ['slug', 'reviewStatus', 'order', 'name', 'title'].includes(field.name) ? 'identity' : field.name === 'home' ? 'home' : field.name === 'about' ? 'about' : field.name === 'portrait' ? 'media' : ['metaDescription', 'seo'].includes(field.name) ? 'seo' : 'profile' })),
  validation: (r) => r.custom((doc) => {
    const value = doc as { slug?: { current?: string }; home?: { credentials?: unknown[] } } | undefined
    if (!value?.home) return true
    const expected = value.slug?.current === 'gorakh-mandrupkar' ? 4 : 3
    return value.home.credentials?.length === expected || `Homepage currently renders ${expected} credential lines for this doctor.`
  }),
  orderings: [{ title: 'Display order', name: 'order', by: [{ field: 'order', direction: 'asc' }, { field: 'slug.current', direction: 'asc' }] }],
  preview: { select: { title: 'name.en', subtitle: 'slug.current', media: 'portrait' } },
})
