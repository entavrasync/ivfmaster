'use client'

import { useId, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { ArrowDown, ArrowUp } from 'lucide-react'
import { getListVisibility, LIST_STEP } from './list-visibility'
import styles from './publication-design.module.css'

export function LoadMoreList({ items, featuredCount, className, loadMoreLabel, showLessLabel, showingLabel }: {
  items: { id: string; content: ReactNode }[]
  featuredCount: number
  className?: string
  loadMoreLabel: string
  showLessLabel: string
  showingLabel: string
}) {
  const [requestedShown, setRequestedShown] = useState(LIST_STEP)
  const listId = useId(), list = useRef<HTMLDivElement>(null), moreButton = useRef<HTMLButtonElement>(null)
  const focusRequest = useRef<{ type: 'item'; index: number } | { type: 'collapse' } | null>(null)
  const total = items.length + featuredCount
  const { shown, visibleItems, canShowMore, canShowLess } = getListVisibility(total, featuredCount, requestedShown)

  useLayoutEffect(() => {
    const request = focusRequest.current
    focusRequest.current = null
    if (request?.type === 'item' && request.index < visibleItems) {
      list.current?.children.item(request.index)?.querySelector<HTMLAnchorElement>('a[href]')?.focus({ preventScroll: true })
    } else if (request?.type === 'collapse' && !canShowLess) {
      moreButton.current?.focus({ preventScroll: true })
    }
  }, [visibleItems, canShowLess])

  function showMore() {
    if (!canShowMore) return
    focusRequest.current = { type: 'item', index: visibleItems }
    setRequestedShown(current => getListVisibility(total, featuredCount, current).moreTarget)
  }

  function showLess() {
    if (!canShowLess) return
    focusRequest.current = { type: 'collapse' }
    setRequestedShown(current => getListVisibility(total, featuredCount, current).lessTarget)
  }

  return <>
    <div id={listId} ref={list} className={className}>
      {items.map((item, index) => <div key={item.id} data-publication-item={item.id} hidden={index >= visibleItems} className={styles.loadMoreItem}>{item.content}</div>)}
    </div>
    <div className={styles.loadMoreFooter}>
      <p role="status" aria-live="polite" aria-atomic="true">{showingLabel.replace('{shown}', String(shown)).replace('{total}', String(total))}</p>
      <div className={styles.loadMoreActions}>
        {canShowLess && <button type="button" onClick={showLess} aria-controls={listId} className={styles.loadMoreButton}>
          {showLessLabel}<ArrowUp size={16} aria-hidden="true" />
        </button>}
        {canShowMore && <button ref={moreButton} type="button" onClick={showMore} aria-controls={listId} className={`${styles.loadMoreButton} ${styles.loadMorePrimary}`}>
          {loadMoreLabel}<ArrowDown size={16} aria-hidden="true" />
        </button>}
      </div>
    </div>
  </>
}
