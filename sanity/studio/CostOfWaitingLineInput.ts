import { set, type ObjectInputProps } from 'sanity'
import { createElement } from 'react'

export function CostOfWaitingLineInput(props: ObjectInputProps) {
  return createElement('div', null,
    props.renderDefault(props),
    createElement('button', { type: 'button', disabled: props.readOnly, style: { marginTop: 12, padding: '8px 12px', cursor: props.readOnly ? 'not-allowed' : 'pointer' }, onClick: () => {
      if (props.readOnly) return
      props.onChange(set('costOfWaitingLine', ['_type']))
    } }, 'Add desktop and mobile photos'),
  )
}
