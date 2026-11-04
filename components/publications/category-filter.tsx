'use client'

import { useTransition } from 'react'
import { Select } from '@base-ui/react/select'
import { Check, ChevronDown } from 'lucide-react'
import { useRouter } from '@/i18n/navigation'
import styles from './publication-design.module.css'

export function CategoryFilter({ value, options, label, pendingLabel }: {
  value: string
  options: { value: string; label: string; href: string }[]
  label: string
  pendingLabel: string
}) {
  const router = useRouter(), [pending, startTransition] = useTransition()
  return <div className={styles.categoryFilter} aria-busy={pending}>
    <label id="publication-category-label" htmlFor="publication-category">{label}</label>
    <Select.Root items={options} value={value} readOnly={pending} modal={false} onValueChange={nextValue => {
      const destination = options.find(option => option.value === nextValue)
      if (destination && destination.value !== value) startTransition(() => router.push(destination.href, { scroll: false }))
    }}>
      <Select.Trigger id="publication-category" aria-labelledby="publication-category-label" aria-disabled={pending} className={styles.categoryTrigger}>
        <Select.Value className={styles.categoryValue} />
        <Select.Icon className={styles.categoryChevron}><ChevronDown size={16} aria-hidden="true" /></Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner side="bottom" align="start" sideOffset={8} collisionPadding={16} alignItemWithTrigger={false} className={styles.categoryPositioner}>
          <Select.Popup className={styles.categoryPopup}>
            <Select.List className={styles.categoryOptions}>
              {options.map(option => <Select.Item key={option.value} value={option.value} label={option.label} className={styles.categoryOption}>
                <Select.ItemText className={styles.categoryOptionLabel}>{option.label}</Select.ItemText>
                <Select.ItemIndicator className={styles.categoryCheck}><Check size={16} strokeWidth={2} aria-hidden="true" /></Select.ItemIndicator>
              </Select.Item>)}
            </Select.List>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
    <span role="status" className={styles.filterProgress}>{pending ? pendingLabel : ''}</span>
  </div>
}
