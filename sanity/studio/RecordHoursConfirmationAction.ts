import { useDocumentOperation, type DocumentActionComponent } from 'sanity'
import { availabilitySnapshot } from '../lib/availability-mapping'

export const RecordHoursConfirmationAction: DocumentActionComponent = props => {
  const { patch } = useDocumentOperation(props.id, props.type)
  const current = props.draft ?? props.published
  const snapshot = availabilitySnapshot(current)
  const confirmed = snapshot && current?.confirmedSnapshot === snapshot && current?.confirmedAt
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
