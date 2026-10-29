'use client'

import { useTransition } from 'react'
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
    <label htmlFor="publication-category">{label}</label>
    <select id="publication-category" value={value} disabled={pending} onChange={event => {
      const destination = options.find(option => option.value === event.target.value)
      if (destination) startTransition(() => router.push(destination.href, { scroll: false }))
    }}>{options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select>
    <span role="status" className={styles.filterProgress}>{pending ? pendingLabel : ''}</span>
  </div>
}
