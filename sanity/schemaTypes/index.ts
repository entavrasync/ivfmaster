import { defineField, type SchemaTypeDefinition, type Rule } from 'sanity'
import { localizedString, localizedText, procedure } from './procedure'
import { doctor } from './doctor'
import { clinicSettings } from './clinic-settings'
import { article } from './article'
import { homeFaq, aboutInformation, facilityGallery } from './editorial'
import { schemaTypes as referenceTypes } from '../reference/schemaTypes'
import { approvalField } from './editorial-fields'
import initialContent from '../reference/initial-content.json' with { type: 'json' }

// Keep established target records authoritative. Reuse the reference's page and
// object definitions, rather than replacing procedure/doctor document contracts.
const reusedTypes: SchemaTypeDefinition[] = referenceTypes
  .map((type) => {
    if (type.name === 'seo' && 'fields' in type && type.fields) return { ...type, fields: type.fields.map((field) => ['canonicalUrl', 'noIndex', 'ogImage'].includes(field.name) ? { ...field, readOnly: true, description: 'Preserved for compatibility. Target canonicals, indexing and social images remain controlled by its existing SEO builders.' } : field) } as SchemaTypeDefinition
    if (type.type !== 'document' || !('fields' in type) || !type.fields) return type
    const review = { ...approvalField, ...('groups' in type && type.groups?.length ? { group: type.groups[0].name } : {}) }
    const fields = type.fields.map((field) => field.name === 'reviewStatus' ? review : field)
    if (type.name === 'homePage') {
      const index = fields.findIndex((field) => field.name === 'mythsFacts')
      const myths = fields[index]
      if (myths && 'fields' in myths && myths.fields) fields[index] = { ...myths, fields: [
        defineField({ name: 'faqReferences', title: 'Shared questions (optional)', type: 'array', of: [{ type: 'reference', to: [{ type: 'faq' }], options: { filter: 'reviewStatus == "approved" && isPublished == true' } }], validation: (rule) => rule.max(20).unique(), description: 'Select approved, published Question records instead of duplicating answers. Leave unset to use this page’s inline items. Existing Homepage questions documents take precedence.' }),
        ...myths.fields.map((field) => field.name === 'items' ? { ...field, validation: (rule: Rule) => rule.custom((value, context) => Array.isArray((context.parent as { faqReferences?: unknown[] } | undefined)?.faqReferences) && ((context.parent as { faqReferences: unknown[] }).faqReferences.length > 0) || Array.isArray(value) && value.length > 0 && value.length <= 20 || 'Provide inline questions or select approved shared questions.') } : field),
      ] }
    }
    if (!fields.some((field) => field.name === 'reviewStatus')) fields.unshift(review)
    const initialValue = initialContent.singletons[type.name as keyof typeof initialContent.singletons]
    // Initial values only initialize new documents; they never patch saved content.
    const defaults = initialValue ? { initialValue: () => structuredClone(initialValue) } : {}
    if (type.name === 'siteSettings') return { ...type, ...defaults,
      description: 'Brand and SEO presentation. Existing Shared clinic settings remains authoritative for contacts/location. Hours and headline statistics await clinic confirmation and remain read-only.',
      fields: fields.map((field) => ['name', 'contact', 'address', 'displayAddress', 'geo', 'hours', 'hoursSummary', 'holidays', 'stats', 'timezone', 'legalName', 'siteUrl', 'social'].includes(field.name) ? { ...field, readOnly: true, validation: undefined, description: 'Preserved legacy field. The target reads this fact from code or Shared clinic settings; it is not duplicated into editable page content.' } : field),
    } as SchemaTypeDefinition
    return { ...type, ...defaults, fields } as SchemaTypeDefinition
  })

const targetTypes: SchemaTypeDefinition[] = [localizedString, localizedText, procedure, doctor, clinicSettings, article, homeFaq, aboutInformation, facilityGallery]
export const schemaTypes: SchemaTypeDefinition[] = [...targetTypes.map((type) => {
  const value = initialContent.legacy[type.name as keyof typeof initialContent.legacy]
  return value ? { ...type, initialValue: () => structuredClone(value) } as SchemaTypeDefinition : type
}), ...reusedTypes]
