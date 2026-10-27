import { createElement as h } from 'react'
import { getPublishedId, useDocumentOperation, useFormValue, type DocumentActionComponent, type ObjectInputProps } from 'sanity'
import { availabilityDocument, availabilitySnapshot } from '../lib/availability-mapping'

export function hoursConfirmationState(current: unknown) {
  const snapshot = availabilitySnapshot(current)
  const record = current && typeof current === 'object' ? current : {}
  const confirmed = !!snapshot && availabilityDocument.safeParse({ ...record, _id: 'clinicAvailability' }).success
  return { snapshot, confirmed }
}

/** Keep the action beside the editing instructions, as well as in the document menu. */
export function HoursConfirmationInput(props: ObjectInputProps) {
  const current = useFormValue([]) as Record<string, unknown> | undefined
  const id = typeof current?._id === 'string' ? getPublishedId(current._id) : 'clinicAvailability'
  const { patch } = useDocumentOperation(id, 'clinicAvailability')
  const { snapshot, confirmed } = hoursConfirmationState(current)
  const disabled = !!props.readOnly || !!patch.disabled || !snapshot || confirmed
  return h('div', { style: { display: 'grid', gap: 16 } },
    h('section', { 'aria-label': 'Steps to publish clinic hours', style: { border: '1px solid var(--card-border-color)', borderRadius: 6, padding: 16 } },
      h('strong', {}, 'Update and publish clinic hours'),
      h('ol', { style: { paddingLeft: 20, lineHeight: 1.6 } },
        h('li', {}, 'Edit Weekly hours and any Dated closures.'),
        h('li', {}, 'Ask the clinic to check them. In Clinic confirmation, write who confirmed them and when, then press the button below.'),
        h('li', {}, 'In Clinic confirmation, select Approved under Clinic approval. Then click Publish.')),
      h('p', { role: 'status' }, confirmed ? 'Confirmation recorded for these exact hours. You can publish once Clinic approval is Approved and there are no other errors.' : snapshot ? 'Ready to record confirmation. Only press this after the clinic has checked the current hours and closures.' : 'Complete the hours and the confirmation reference first. The field errors show what is missing.'),
      h('button', { type: 'button', disabled, style: { padding: '10px 14px', borderRadius: 6, border: '1px solid var(--card-border-color)', color: 'var(--card-fg-color)', background: 'var(--card-bg-color)', cursor: disabled ? 'default' : 'pointer' }, onClick: () => {
        if (!disabled && snapshot) patch.execute([{ set: { confirmedAt: new Date().toISOString(), confirmedSnapshot: snapshot } }])
      } }, confirmed ? 'Hours confirmation recorded' : 'Record hours confirmation'),
      h('p', { style: { fontSize: 13 } }, 'Changing hours, closures or the confirmation reference means the clinic must check them again. This button does not approve or publish anything.')),
    props.renderDefault(props))
}

export const RecordHoursConfirmationAction: DocumentActionComponent = props => {
  const { patch } = useDocumentOperation(props.id, props.type)
  const current = props.draft ?? props.published
  const { snapshot, confirmed } = hoursConfirmationState(current)
  return {
    label: 'Record hours confirmation',
    title: !snapshot ? 'Complete all seven days, dated closures and the clinic confirmation reference first.' : confirmed ? 'This exact schedule already has a recorded confirmation.' : 'Use only after the clinic confirms this exact schedule. Saves the confirmation to your draft; does not approve or publish it.',
    disabled: !snapshot || Boolean(confirmed) || Boolean(patch.disabled),
    onHandle: () => {
      if (!snapshot || confirmed || patch.disabled) return
      patch.execute([{ set: { confirmedAt: new Date().toISOString(), confirmedSnapshot: snapshot } }])
      props.onComplete()
    },
  }
}
