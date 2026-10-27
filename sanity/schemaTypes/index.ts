import { defineField, type SchemaTypeDefinition, type Rule } from 'sanity'
import { localizedString, localizedText, procedure } from './procedure'
import { doctor } from './doctor'
import { clinicSettings } from './clinic-settings'
import { clinicAvailability } from './clinic-availability'
import { article } from './article'
import { teamValues } from './team-values'
import { educationPage } from './education-page'
import { homeFaq, aboutInformation, facilityGallery } from './editorial'
import { schemaTypes as referenceTypes } from '../reference/schemaTypes'
import { approvalField } from './editorial-fields'
import initialContent from '../reference/initial-content.json' with { type: 'json' }

// Keep established target records authoritative. Reuse the reference's page and
// object definitions, rather than replacing procedure/doctor document contracts.
const reusedTypes: SchemaTypeDefinition[] = referenceTypes
  .map((type) => {
    if (type.type !== 'document' || !('fields' in type) || !type.fields) return type
    const review = { ...approvalField, ...('groups' in type && type.groups?.length ? { group: type.groups[0].name } : {}) }
    const fields = type.fields.map((field) => field.name === 'reviewStatus' ? review : field)
    if (type.name === 'homePage') {
      const index = fields.findIndex((field) => field.name === 'mythsFacts')
      const myths = fields[index]
      if (myths && 'fields' in myths && myths.fields) fields[index] = { ...myths, fields: [
        defineField({ name: 'faqReferences', title: 'Shared questions (optional)', type: 'array', of: [{ type: 'reference', to: [{ type: 'faq' }], options: { filter: 'reviewStatus == "approved" && isPublished == true' } }], validation: (rule) => rule.max(20).unique(), description: 'Select approved, published Question records instead of duplicating answers. Leave unset to use this page’s inline items.' }),
        ...myths.fields.map((field) => field.name === 'items' ? { ...field, validation: (rule: Rule) => rule.custom((value, context) => Array.isArray((context.parent as { faqReferences?: unknown[] } | undefined)?.faqReferences) && ((context.parent as { faqReferences: unknown[] }).faqReferences.length > 0) || Array.isArray(value) && value.length > 0 && value.length <= 20 || 'Provide inline questions or select approved shared questions.') } : field),
      ] }
    }
    if (!fields.some((field) => field.name === 'reviewStatus')) fields.unshift(review)
    const initialValue = initialContent.singletons[type.name as keyof typeof initialContent.singletons]
    // Initial values only initialize new documents; they never patch saved content.
    const defaults = initialValue ? { initialValue: () => structuredClone(initialValue) } : {}
    // Legacy clinic facts stay in the schema so stored values remain readable, but are hidden:
    // the website reads them from Shared clinic settings and Clinic hours & availability.
    if (type.name === 'siteSettings') return { ...type, ...defaults,
      description: 'Clinic identity, site description, Home headline numbers and site-wide SEO defaults. Edit contact details and address in Shared clinic settings, and opening hours in Clinic hours & availability.',
      preview: { select: { id: '_id' }, prepare: () => ({ title: 'Site settings' }) },
      fields: fields.map((field) => ['name', 'legalName'].includes(field.name) ? {
        ...field,
        description: field.name === 'name' ? 'The clinic brand in the header, footer and search metadata. Publish Site settings after editing.' : 'The registered clinic name used in structured data. Publish Site settings after editing.',
        validation: (rule: Rule) => rule.max(field.name === 'name' ? 60 : 120).custom(value => value == null || typeof value === 'string' && value.trim().length > 0 && !/[<>{}]/.test(value) || 'Enter a nonblank clinic name without HTML.'),
      } : ['contact', 'address', 'displayAddress', 'geo', 'hours', 'hoursSummary', 'holidays', 'timezone', 'siteUrl', 'social'].includes(field.name) ? { ...field, hidden: true, readOnly: true, validation: undefined } : field),
    } as SchemaTypeDefinition
    return { ...type, ...defaults, fields } as SchemaTypeDefinition
  })

const targetTypes: SchemaTypeDefinition[] = [localizedString, localizedText, procedure, doctor, clinicSettings, clinicAvailability, article, teamValues, educationPage, homeFaq, aboutInformation, facilityGallery]
export const schemaTypes: SchemaTypeDefinition[] = [...targetTypes.map((type) => {
  const value = initialContent.legacy[type.name as keyof typeof initialContent.legacy]
  return value ? { ...type, initialValue: () => structuredClone(value) } as SchemaTypeDefinition : type
}), ...reusedTypes]
