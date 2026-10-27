'use client'

import { defineConfig, getPublishedId, useDocumentOperation, type DocumentActionComponent } from 'sanity'
import { structureTool } from 'sanity/structure'
import { Plus } from 'lucide-react'
import { z } from 'zod'
import { schemaTypes } from './sanity/schemaTypes'
import { projectId, dataset, apiVersion } from './sanity/project'
import { SINGLETONS, SINGLETON_TYPES } from './sanity/reference/schemaTypes/shared/singletons'
import initialContent from './sanity/reference/initial-content.json' with { type: 'json' }
import { RecordHoursConfirmationAction } from './sanity/studio/RecordHoursConfirmationAction'

// Superseded by the page singletons and the shared Question type; schemas stay
// registered so any stored documents remain readable, but editors no longer see them.
const LEGACY_TYPES = new Set(['homeFaq', 'aboutInformation', 'facilityGallery', 'testimonial'])

// The website's current wording/facts per editable singleton. Approval is never filled in.
const WEBSITE_VALUES: Record<string, Record<string, unknown>> = { clinicSettings: initialContent.legacy.clinicSettings, ...initialContent.singletons }

const visibleDeleteActions = new WeakMap<DocumentActionComponent, DocumentActionComponent>()
// Keep an unopened/unsaved profile on the same random ID while Studio resolves panes again.
const newDoctorDocumentIds = new Map<string, string>()

/** Show the native action in both menus; retain its permission checks and confirmation dialog. */
function visibleContentDelete(Action: DocumentActionComponent): DocumentActionComponent {
  const cached = visibleDeleteActions.get(Action)
  if (cached) return cached
  const DeleteContentAction: DocumentActionComponent = props => {
    const state = Action(props)
    return state ? { ...state, group: ['default', 'paneActions'], label: state.label === 'Delete' ? props.type === 'procedure' ? 'Delete procedure' : 'Delete article' : state.label } : state
  }
  DeleteContentAction.action = Action.action
  visibleDeleteActions.set(Action, DeleteContentAction)
  return DeleteContentAction
}

export function procedureWebsiteValues(document: Record<string, unknown>): Record<string, unknown> | undefined {
  const slug = document.slug
  if (!slug || typeof slug !== 'object' || !('current' in slug)) return undefined
  return initialContent.procedures.find((entry) => entry.slug === slug.current)?.value
}

export function doctorWebsiteValues(document: Record<string, unknown>): Record<string, unknown> | undefined {
  const slug = document.slug
  if (!slug || typeof slug !== 'object' || !('current' in slug)) return undefined
  const value = initialContent.doctors.find(entry => entry.slug === slug.current)?.value
  return value ? { credentials: value.credentials, specializations: value.specializations } : undefined
}

/** Arrays and explicitly stored blanks are editorial values, not gaps to overwrite. */
export function missingWebsiteFields(current: Record<string, unknown>, values: Record<string, unknown>, prefix = '', fillEmptyLists: readonly string[] = []): Record<string, unknown> {
  const missing: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(values)) {
    if (key.startsWith('_') || key === 'reviewStatus') continue
    const path = prefix ? `${prefix}.${key}` : key
    if (!Object.hasOwn(current, key)) missing[path] = structuredClone(value)
    else {
      const existing = current[key]
      if (fillEmptyLists.includes(path) && Array.isArray(value) && value.length > 0 && (existing == null || Array.isArray(existing) && existing.length === 0)) missing[path] = structuredClone(value)
      else if (existing && value && typeof existing === 'object' && typeof value === 'object' && !Array.isArray(existing) && !Array.isArray(value)) {
        Object.assign(missing, missingWebsiteFields(existing as Record<string, unknown>, value as Record<string, unknown>, path, fillEmptyLists))
      }
    }
  }
  return missing
}

/** Lets an editor restore missing fields from the website's current content into the draft; existing values are never touched. */
function fillFromWebsite(source: Record<string, unknown> | typeof procedureWebsiteValues, fillEmptyLists: readonly string[] = []): DocumentActionComponent {
  const FillFromWebsiteAction: DocumentActionComponent = (props) => {
    const { patch } = useDocumentOperation(props.id, props.type)
    const current = (props.draft ?? props.published ?? {}) as Record<string, unknown>
    const values = typeof source === 'function' ? source(current) : source
    const missing = values ? missingWebsiteFields(current, values, '', fillEmptyLists) : {}
    const hasMissing = Object.keys(missing).length > 0
    const readOnly = 'readOnly' in props && props.readOnly === true
    return {
      label: fillEmptyLists.length ? 'Copy missing qualifications and specializations' : 'Fill empty fields from website',
      group: fillEmptyLists.length ? ['default', 'paneActions'] : undefined,
      title: !values ? 'Choose an existing profile or procedure first.' : hasMissing ? fillEmptyLists.length ? 'Copies existing website details into empty lists. Your saved entries and clinic approval are kept.' : 'Copies missing website fields into this draft. Existing text, blanks, arrays, URL and approval are kept.' : 'Every field already has content.',
      disabled: readOnly || !hasMissing || Boolean(patch.disabled),
      onHandle: () => {
        if (readOnly || !hasMissing || patch.disabled) return
        patch.execute([fillEmptyLists.length ? { set: missing } : { setIfMissing: missing }])
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
    S.listItem().id('clinicAvailability').title('Clinic hours & availability').child(S.document().schemaType('clinicAvailability').documentId('clinicAvailability').initialValueTemplate('clinicAvailability')),
    ...SINGLETONS.map((singleton) => S.listItem().id(singleton.id).title(singleton.title).child(S.document().schemaType(singleton.type).documentId(singleton.id).title(singleton.title))),
    S.divider(),
    S.listItem().id('procedure').title('Procedures — treatment details').schemaType('procedure').child(
      S.list().title('Procedures — treatment details')
        .menuItems([S.menuItem().title('Add new procedure').icon(Plus).intent({ type: 'create', params: { type: 'procedure', template: 'procedure' } }).showAsAction(true)])
        .items([
        S.documentTypeListItem('procedure').id('all-procedures').title('All saved procedures'),
        ...initialContent.procedures.map((entry) => S.listItem().id(entry.slug).title(`${entry.value.name.en} — ${entry.title}`).schemaType('procedure').child(
          S.documentTypeList('procedure').id(entry.slug).title(entry.title).apiVersion(apiVersion)
            .filter('_type == "procedure" && slug.current == $slug').params({ slug: entry.slug })
            .initialValueTemplates([S.initialValueTemplateItem(`procedure-${entry.slug}`)]),
        )),
      ]),
    ),
    S.listItem().id('article').title('Articles — add or edit').schemaType('article').child(
      S.documentTypeList('article').title('Education articles')
        .menuItems([S.menuItem().title('Add new article').icon(Plus).intent({ type: 'create', params: { type: 'article', template: 'new-article' } }).showAsAction(true)])
        // Sanity 5 re-infers templates on subsequent builder clones; set these last.
        .initialValueTemplates([S.initialValueTemplateItem('new-article').title('Add new article')]),
    ),
    S.listItem().id('doctor').title('Doctor — edit profiles').schemaType('doctor').child(
      S.list().title('Doctor profiles').items([
        S.documentTypeListItem('doctor').id('all-doctors').title('All saved doctor profiles'),
        ...initialContent.doctors.map(entry => S.listItem().id(entry.slug).title(entry.title).schemaType('doctor').child(async (_id, { structureContext }) => {
          let ids: string[]
          try {
            const input = await structureContext.getClient({ apiVersion }).withConfig({ perspective: 'raw', useCdn: false }).fetch<unknown>(
              '*[_type == "doctor" && slug.current == $slug && !(_id in path("versions.**"))][0...3]._id', { slug: entry.slug },
            )
            ids = [...new Set(z.array(z.string().min(1)).max(3).parse(input).map(id => getPublishedId(id)))]
          } catch {
            throw new Error('Could not check saved doctor profiles. Check your connection, or open All saved doctor profiles and try again.')
          }
          if (ids.length === 1) return S.document().id(entry.slug).schemaType('doctor').documentId(ids[0]).title(entry.title)
          // Never pick an arbitrary record or create another when duplicates already exist.
          if (ids.length > 1) return S.documentTypeList('doctor').title(`Choose the saved profile for ${entry.title}`).apiVersion(apiVersion)
            .filter('_type == "doctor" && slug.current == $slug').params({ slug: entry.slug }).initialValueTemplates([])
          const documentId = newDoctorDocumentIds.get(entry.slug) ?? crypto.randomUUID()
          newDoctorDocumentIds.set(entry.slug, documentId)
          return S.documentWithInitialValueTemplate(`doctor-${entry.slug}`).documentId(documentId).title(entry.title)
        })),
      ]),
    ),
    ...S.documentTypeListItems().filter((item) => !['clinicSettings', 'clinicAvailability', 'procedure', 'article', 'doctor'].includes(item.getId() ?? '') && !SINGLETON_TYPES.has(item.getId() ?? '') && !LEGACY_TYPES.has(item.getId() ?? '')),
  ]) })],
  schema: { types: schemaTypes, templates: (prev) => [
    ...prev,
    { id: 'new-article', schemaType: 'article', title: 'Add new article', value: () => ({ reviewStatus: 'pendingReview' }) },
    ...(['procedure', 'doctor', 'article'] as const).flatMap((schemaType) => {
      const entries = schemaType === 'procedure' ? initialContent.procedures : schemaType === 'doctor' ? initialContent.doctors : initialContent.articles
      return entries.map((entry) => ({ id: `${schemaType}-${entry.slug}`, schemaType, title: `${entry.title} — current website copy`, value: () => structuredClone(entry.value) }))
    }),
  ] },
  document: {
    // The fixed-ID editor still needs its template to initialize a missing document.
    newDocumentOptions: (prev) => prev.filter((option) => !['clinicSettings', 'clinicAvailability'].includes(option.templateId) && !SINGLETON_TYPES.has(option.templateId) && !LEGACY_TYPES.has(option.templateId)),
    actions: (prev, context) => {
      if (context.schemaType === 'clinicAvailability') return [...prev.filter(action => action.action !== 'duplicate' && action.action !== 'delete'), RecordHoursConfirmationAction]
      if (context.schemaType === 'procedure' || context.schemaType === 'article') {
        const actions = prev.map(action => action.action === 'delete' ? visibleContentDelete(action) : action)
        return context.schemaType === 'procedure' ? [...actions, fillFromWebsite(procedureWebsiteValues)] : actions
      }
      if (context.schemaType === 'doctor') return [...prev, fillFromWebsite(doctorWebsiteValues, ['credentials', 'specializations'])]
      if (context.schemaType !== 'clinicSettings' && !SINGLETON_TYPES.has(context.schemaType)) return prev
      const kept = prev.filter((action) => action.action !== 'duplicate' && action.action !== 'delete')
      const values = WEBSITE_VALUES[context.schemaType]
      return values ? [...kept, fillFromWebsite(values)] : kept
    },
  },
})
