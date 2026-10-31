'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

/** Refresh on the next start/end boundary, including after a suspended tab wakes. */
export function EventRefresh({ boundary }: { boundary: number | null }) {
  const router = useRouter()
  useEffect(() => {
    if (!boundary) return
    const refresh = () => { if (Date.now() >= boundary) router.refresh() }
    let timer: number
    const schedule = () => {
      timer = window.setTimeout(() => { if (Date.now() >= boundary) refresh(); else schedule() }, Math.min(2_147_483_647, Math.max(0, boundary - Date.now() + 100)))
    }
    schedule()
    const visible = () => { if (document.visibilityState === 'visible') refresh() }
    document.addEventListener('visibilitychange', visible)
    window.addEventListener('focus', refresh)
    return () => { clearTimeout(timer); document.removeEventListener('visibilitychange', visible); window.removeEventListener('focus', refresh) }
  }, [boundary, router])
  return null
}
