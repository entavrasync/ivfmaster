import { defineField, getPublishedId } from 'sanity'
import { apiVersion } from '../project.ts'

// Keep the existing localized object names so existing procedure content needs no migration.
export const localizedField = (name: string, title: string, paragraph = false, required = true) => defineField({
  name, title, type: paragraph ? 'procedureLocalizedText' : 'procedureLocalizedString',
  ...(required ? { validation: (r: import('sanity').Rule) => r.required() } : {}),
})

export const approvalField = defineField({
  name: 'reviewStatus', title: 'Content approval', type: 'string', initialValue: 'pendingReview',
  description: 'Only approve after the clinic verifies all populated languages, credentials and portraits. Approval is a manual editorial status.',
  options: { list: [{ title: 'Pending clinic review', value: 'pendingReview' }, { title: 'Approved', value: 'approved' }] },
  validation: (r) => r.required().custom((value) => value === 'approved' || 'Clinic approval is required before publishing.'),
})

export const stableDoctorSlug = defineField({
  name: 'slug', title: 'Existing profile URL slug', type: 'slug',
  description: 'Phase 3 supports gorakh-mandrupkar and saie-mandrupkar. Do not rename a published URL.',
  validation: (r) => r.required().custom(async (value, context) => {
    if (!value?.current) return true
    if (!['gorakh-mandrupkar', 'saie-mandrupkar'].includes(value.current)) return 'Use an existing production doctor slug.'
    if (!context.document?._id) return true
    try {
      const previous = await context.getClient({ apiVersion }).withConfig({ perspective: 'published' })
        .fetch<string | null>('*[_id == $id][0].slug.current', { id: getPublishedId(context.document._id) })
      return !previous || previous === value.current || 'Keep the published profile URL.'
    } catch {
      return 'Could not verify the published slug. Check access and retry.'
    }
  }),
})
