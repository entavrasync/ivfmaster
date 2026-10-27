import { UserRound } from 'lucide-react'
import { defineArrayMember, defineField, defineType, type Rule } from 'sanity'
import { approvalField, localizedField, stableDoctorSlug } from './editorial-fields.ts'
import { doctorDocument } from '../lib/clinic-mapping.ts'
import { SEO_FIELDSETS, seoAdvancedFields } from '../reference/schemaTypes/objects/seo.ts'
import { SeoPanel } from '../studio/SeoPanel.ts'
import { credential } from '../reference/schemaTypes/objects/home'
import { OptionalImageInput, localized } from '../reference/schemaTypes/shared/fields'
import { validateWebsiteImage } from '../lib/image-validation'

export { OptionalImageInput as DoctorPortraitInput }

// One minimum check avoids duplicate native required/type errors for a stored null array.
const credentialsField = (title: string, required = false) => defineField({
  name: 'credentials', title, type: 'array', description: `${required ? 'Add at least one qualification before publishing.' : 'Optional shorter list for Home.'} Choose Qualification for new entries. Existing text entries stay editable. Drag to reorder; enter only clinic-verified credentials.`,
  of: [defineArrayMember({ ...credential, name: 'doctorCredential', title: 'Qualification', type: 'object', fields: [
    ...credential.fields.filter(field => field.name === 'text').map(field => ({ ...field, title: 'Qualification name', description: 'Required in English. Marathi is optional.',
      validation: (r: Rule) => r.custom(value => value && typeof value === 'object' && 'en' in value && typeof value.en === 'string' && value.en.trim().length > 0 ? true : { message: 'Enter the qualification name in English. Marathi is optional.', paths: [['en']] }),
    })),
    defineField({ name: 'institution', title: 'Institution (optional)', type: 'string', validation: r => r.max(200).error('Keep the institution name within 200 characters.') }),
    defineField({ name: 'awardingBody', title: 'Awarding body (optional)', type: 'string', validation: r => r.max(200).error('Keep the awarding body within 200 characters.') }),
    defineField({ name: 'year', title: 'Year awarded (optional)', type: 'number', validation: r => r.integer().min(1900).max(new Date().getFullYear()).error('Enter the four-digit year the qualification was awarded, no later than this year.') }),
  ] }), defineArrayMember({ type: 'procedureLocalizedText', title: 'Existing text credential' })],
  validation: r => required ? [r.custom(value => value == null || Array.isArray(value) && value.length === 0 ? 'Add at least one clinic-verified qualification before publishing.' : true), r.max(20).error('Keep no more than 20 qualifications. Remove extra entries.')] : r.max(20).error('Keep no more than 20 qualifications. Remove extra entries.'),
})

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
    defineField({ name: 'specializations', title: 'Specializations (optional)', type: 'array',
      description: 'Add one clinic-verified area of practice per item. English is required; Marathi is optional. Drag to reorder. Shown on Team and the doctor profile.',
      of: [defineArrayMember({ type: 'procedureLocalizedText', title: 'Specialization' })],
      validation: r => r.max(20).error('Keep no more than 20 specializations. Remove extra entries.'),
    }),
    localizedField('essence', 'Team quotation'), localizedField('intro', 'Team introduction', true),
    defineField({ ...localizedField('biography', 'Profile biography', true),
      description: 'Use the existing b, br and link formatting tags only. Message variables and other tags cannot be rendered by the profile.',
      validation: (r) => r.required().custom((value) => value == null || doctorDocument.shape.biography.safeParse(value).success || 'Use complete English copy and only b, br and link tags, without message variables.'),
    }),
    credentialsField('Qualifications (required before publishing)', true),
    localizedField('metaDescription', 'Profile SEO description', true),
    defineField({ name: 'seo', title: 'SEO (title, keywords, sharing, visibility)', type: 'object', fieldsets: SEO_FIELDSETS, components: { input: SeoPanel },
      description: 'Optional. Empty fields keep the doctor name as the title and the profile SEO description above.',
      fields: [localized('metaTitle', { title: 'Search result title', translation: 'optional' }), ...seoAdvancedFields()] }),
    defineField({
      name: 'portrait', type: 'image', title: 'Doctor photo (optional)', options: { hotspot: true, accept: 'image/jpeg,image/png,image/webp,image/avif' },
      components: { input: OptionalImageInput },
      description: 'Upload a permitted photo of this doctor, ideally 1200px tall with space around the face. Set the hotspot on the face. Used on Home, About, Team and the profile. Removing it leaves the portrait area empty.',
      validation: r => [r.assetRequired().error('Upload or select a doctor photo, or remove the whole photo field.'), r.custom(validateWebsiteImage)],
      fields: [localizedField('alt', 'Alternative text')],
    }),
    defineField({
      name: 'home', title: 'Homepage summary (optional)', type: 'object',
      description: 'Optional quotation and introduction for the Home cards. A Home-page introduction takes precedence when supplied there.',
      fields: [localizedField('essence', 'Homepage quotation'), localizedField('intro', 'Homepage introduction', true), { ...credentialsField('Previous Homepage qualifications (compatibility)'), readOnly: true, description: 'Retained for existing records. The current Home cards do not display qualifications; edit the Team and profile qualifications above.' }],
    }),
    defineField({
      name: 'about', title: 'About doctor story (optional)', type: 'object',
      description: 'Separate story paragraphs, quotation and evidence. Existing CTA labels and URLs stay in code.',
      fields: [localizedField('role', 'About professional title'), localizedField('pullQuote', 'About quotation', true), localizedItems('paragraphs', 'Story paragraphs'), localizedField('evidence', 'Evidence statement', true)],
    }),
  ].map((field) => ({ ...field, group: ['slug', 'reviewStatus', 'order', 'name', 'title'].includes(field.name) ? 'identity' : field.name === 'home' ? 'home' : field.name === 'about' ? 'about' : field.name === 'portrait' ? 'media' : ['metaDescription', 'seo'].includes(field.name) ? 'seo' : 'profile' })),
  orderings: [{ title: 'Display order', name: 'order', by: [{ field: 'order', direction: 'asc' }, { field: 'slug.current', direction: 'asc' }] }],
  preview: { select: { title: 'name.en', subtitle: 'slug.current', media: 'portrait' } },
})
