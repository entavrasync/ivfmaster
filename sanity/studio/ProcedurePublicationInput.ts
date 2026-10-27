import { createElement as h } from 'react'
import { useFormCallbacks, useValidationStatus, type ObjectInputProps } from 'sanity'

/** Expose the existing approval and exact native field errors without creating another review workflow. */
export function ProcedurePublicationInput(props: ObjectInputProps) {
  const current = props.value
  const { validation, isValidating, revision } = useValidationStatus(typeof current?._id === 'string' ? current._id : '', 'procedure', true)
  const { onFieldGroupSelect, onPathOpen, onPathFocus } = useFormCallbacks()
  const checking = isValidating || !revision || revision !== current?._rev
  const errors = validation.filter(marker => marker.level === 'error').filter((marker, index, all) => all.findIndex(other => other.message === marker.message && JSON.stringify(other.path) === JSON.stringify(marker.path)) === index)
  const titles: Record<string, string> = { slug: 'Procedure web address', reviewStatus: 'Clinical approval', name: 'Short title', fullName: 'Full title', oneLiner: 'Summary', heroDescription: 'Introduction', quickFacts: 'Quick facts', label: 'Label', value: 'Value', whoItsFor: 'Indications', process: 'Steps', title: 'Step heading', detail: 'Step description', whatToExpect: 'Expectations', faqs: 'FAQs', q: 'Question', a: 'Answer', cardImage: 'Card image', bannerImage: 'Banner image', seo: 'SEO', en: 'English', mr: 'Marathi' }
  const open = (path: typeof errors[number]['path']) => {
    const field = String(path[0])
    const group = ['slug', 'reviewStatus', 'name', 'fullName'].includes(field) ? 'identity' : ['oneLiner', 'heroDescription', 'quickFacts'].includes(field) ? 'hero' : field === 'faqs' ? 'faqs' : ['cardImage', 'bannerImage'].includes(field) ? 'images' : field === 'seo' ? 'seo' : 'content'
    onFieldGroupSelect([], group); onPathOpen(path); onPathFocus(path)
  }
  const button = { padding: '8px 12px', border: '1px solid currentColor', borderRadius: 6, background: 'transparent', color: 'inherit', font: 'inherit', cursor: 'pointer' }
  return h('div', {},
    h('aside', { style: { padding: 16, marginBottom: 16, border: '1px solid currentColor', borderRadius: 6 } },
      h('strong', { role: 'status' }, checking ? 'Checking procedure fields…' : errors.length ? `${errors.length} procedure field${errors.length === 1 ? '' : 's'} to finish` : 'Procedure fields passed validation'),
      h('p', {}, 'Complete English content and any Marathi translations used. Ask the clinic to check the copy and images, then choose Clinically approved in Clinical approval. That choice saves in the draft automatically; Publish is a separate step.'),
      h('button', { type: 'button', style: button, onClick: () => open(['reviewStatus']) }, 'Open clinical approval'),
      !checking && errors.length > 0 ? h('details', {}, h('summary', {}, 'Show fields to fix'), h('ul', {}, ...errors.map(marker => h('li', { key: JSON.stringify([marker.path, marker.message]) },
        h('button', { type: 'button', style: button, onClick: () => open(marker.path) }, marker.path.filter((part): part is string => typeof part === 'string').map(part => titles[part] ?? part).join(' → ') || 'Procedure content'), ': ', marker.message)))) : null),
    props.renderDefault(props))
}
