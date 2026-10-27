import { createElement as h } from 'react'
import type { ArrayOfObjectsInputProps } from 'sanity'

/** Keep native item editing, ordering, keyed patches and validation markers. */
export function BacklinksInput(props: ArrayOfObjectsInputProps) {
  return props.renderDefault({
    ...props,
    arrayFunctions: () => h('button', {
      type: 'button', disabled: props.readOnly,
      style: { padding: '8px 12px', border: '1px solid var(--card-border-color, #ccc)', borderRadius: 4, background: 'var(--card-bg-color, transparent)', color: 'inherit', cursor: 'pointer' },
      onClick: () => {
        if (props.readOnly) return
        const entry = { _key: crypto.randomUUID(), _type: 'backlink', url: '' }
        props.onItemAppend(entry)
      },
    }, '+ Add backlink'),
  })
}
