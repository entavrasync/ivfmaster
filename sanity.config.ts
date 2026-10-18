'use client'

import { defineConfig, useDocumentOperation, type DocumentActionComponent } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './sanity/schemaTypes'
import { projectId, dataset, apiVersion } from './sanity/project'
import { SINGLETONS, SINGLETON_TYPES } from './sanity/reference/schemaTypes/shared/singletons'
import initialContent from './sanity/reference/initial-content.json' with { type: 'json' }

// Superseded by the page singletons and the shared Question type; schemas stay
// registered so any stored documents remain readable, but editors no longer see them.
const LEGACY_TYPES = new Set(['homeFaq', 'aboutInformation', 'facilityGallery', 'testimonial'])

// The website's current wording/facts per editable singleton. Approval is never filled in.
const WEBSITE_VALUES: Record<string, Record<string, unknown>> = { clinicSettings: initialContent.legacy.clinicSettings, ...initialContent.singletons }

export function procedureWebsiteValues(document: Record<string, unknown>): Record<string, unknown> | undefined {
  const slug = document.slug
  if (!slug || typeof slug !== 'object' || !('current' in slug)) return undefined
  return initialContent.procedures.find((entry) => entry.slug === slug.current)?.value
}

/** Arrays and explicitly stored blanks are editorial values, not gaps to overwrite. */
export function missingWebsiteFields(current: Record<string, unknown>, values: Record<string, unknown>, prefix = ''): Record<string, unknown> {
  const missing: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(values)) {
    if (key.startsWith('_') || key === 'reviewStatus') continue
    const path = prefix ? `${prefix}.${key}` : key
    if (!Object.hasOwn(current, key)) missing[path] = structuredClone(value)
    else {
      const existing = current[key]
      if (existing && value && typeof existing === 'object' && typeof value === 'object' && !Array.isArray(existing) && !Array.isArray(value)) {
        Object.assign(missing, missingWebsiteFields(existing as Record<string, unknown>, value as Record<string, unknown>, path))
      }
    }
  }
  return missing
}

/** Lets an editor restore missing fields from the website's current content into the draft; existing values are never touched. */
function fillFromWebsite(source: Record<string, unknown> | typeof procedureWebsiteValues): DocumentActionComponent {
  const FillFromWebsiteAction: DocumentActionComponent = (props) => {
    const { patch } = useDocumentOperation(props.id, props.type)
    const current = (props.draft ?? props.published ?? {}) as Record<string, unknown>
    const values = typeof source === 'function' ? source(current) : source
    const missing = values ? missingWebsiteFields(current, values) : {}
    const hasMissing = Object.keys(missing).length > 0
    return {
      label: 'Fill empty fields from website',
      title: !values ? 'Choose an existing procedure URL or its current-website-copy template first.' : hasMissing ? 'Copies missing website fields into this draft. Existing text, blanks, arrays, URL and approval are kept.' : 'Every field already has content.',
      disabled: !hasMissing || Boolean(patch.disabled),
      onHandle: () => {
        if (!hasMissing || patch.disabled) return
        patch.execute([{ setIfMissing: missing }])
        props.onComplete()
      },
    }
  }
  return FillFromWebsiteAction
}

export default defineConfig({
  name: 'ivfmaster',
  title: 'IVF Master Studio',
  basePath: '/ivfmaster-studio',
  projectId,
  dataset,
  plugins: [structureTool({ structure: (S) => S.list().title('IVF Master').items([
    S.listItem().title('Shared clinic settings').child(S.document().schemaType('clinicSettings').documentId('clinicSettings')),
    ...SINGLETONS.map((singleton) => S.listItem().id(singleton.id).title(singleton.title).child(S.document().schemaType(singleton.type).documentId(singleton.id).title(singleton.title))),
    S.divider(),
    S.listItem().id('procedure').title('Procedures — treatment details').schemaType('procedure').child(
      S.list().title('Procedures — treatment details').items([
        S.documentTypeListItem('procedure').id('all-procedures').title('All saved procedures'),
        ...initialContent.procedures.map((entry) => S.listItem().id(entry.slug).title(`${entry.value.name.en} — ${entry.title}`).schemaType('procedure').child(
          S.documentTypeList('procedure').id(entry.slug).title(entry.title).apiVersion(apiVersion)
            .filter('_type == "procedure" && slug.current == $slug').params({ slug: entry.slug })
            .initialValueTemplates([S.initialValueTemplateItem(`procedure-${entry.slug}`)]),
        )),
      ]),
    ),
    ...S.documentTypeListItems().filter((item) => !['clinicSettings', 'procedure'].includes(item.getId() ?? '') && !SINGLETON_TYPES.has(item.getId() ?? '') && !LEGACY_TYPES.has(item.getId() ?? '')),
  ]) })],
  schema: { types: schemaTypes, templates: (prev) => [
    ...prev,
    ...(['procedure', 'doctor', 'article'] as const).flatMap((schemaType) => {
      const entries = schemaType === 'procedure' ? initialContent.procedures : schemaType === 'doctor' ? initialContent.doctors : initialContent.articles
      return entries.map((entry) => ({ id: `${schemaType}-${entry.slug}`, schemaType, title: `${entry.title} — current website copy`, value: () => structuredClone(entry.value) }))
    }),
  ] },
  document: {
    // The fixed-ID editor still needs its template to initialize a missing document.
    newDocumentOptions: (prev) => prev.filter((option) => option.templateId !== 'clinicSettings' && !SINGLETON_TYPES.has(option.templateId) && !LEGACY_TYPES.has(option.templateId)),
    actions: (prev, context) => {
      if (context.schemaType === 'procedure') return [...prev, fillFromWebsite(procedureWebsiteValues)]
      if (context.schemaType !== 'clinicSettings' && !SINGLETON_TYPES.has(context.schemaType)) return prev
      const kept = prev.filter((action) => action.action !== 'duplicate' && action.action !== 'delete')
      const values = WEBSITE_VALUES[context.schemaType]
      return values ? [...kept, fillFromWebsite(values)] : kept
    },
  },
})
