'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Creates a scoped GSAP context tied to a container ref.
 * All GSAP selectors in `setup` are scoped to that container element,
 * and all animations are reverted automatically on unmount.
 *
 * Usage:
 *   const ref = useGsapContext((ctx) => {
 *     gsap.from('.headline', { opacity: 0, y: 40 })
 *   }, [])
 *   <div ref={ref}>...</div>
 */
export function useGsapContext<T extends Element = HTMLDivElement>(
  setup: (ctx: gsap.Context) => void,
  deps: React.DependencyList = [],
): React.RefObject<T | null> {
  const ref = useRef<T>(null)

  useEffect(() => {
    if (!ref.current) return
    const ctx = gsap.context(() => {
      setup(ctx)
    }, ref)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return ref
}
