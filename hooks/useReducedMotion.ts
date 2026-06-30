'use client'

import { useEffect, useState } from 'react'

/**
 * Returns true when the user has requested reduced motion via OS preference.
 * Reactive — updates if the preference changes at runtime.
 * Safe to call in SSR; returns false until the client hydrates.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)

    const handler = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return reduced
}
