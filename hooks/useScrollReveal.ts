'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useReducedMotion } from './useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

interface ScrollRevealOptions {
  /** y offset to start from, default 48 */
  y?: number
  /** initial opacity, default 0 */
  opacity?: number
  /** animation duration in seconds, default 0.8 */
  duration?: number
  /** stagger between children, default 0.12 */
  stagger?: number
  /** ScrollTrigger start position, default 'top 88%' */
  start?: string
  /** ease string, default 'power3.out' */
  ease?: string
  /** target child selector — if omitted, animates the container itself */
  target?: string
  /** delay before tween starts, default 0 */
  delay?: number
}

/**
 * Attach to a section ref. Children (or the element itself) will fade + slide
 * in when they enter the viewport. Respects prefers-reduced-motion.
 *
 * Usage:
 *   const sectionRef = useScrollReveal<HTMLElement>()
 *   <section ref={sectionRef}>…</section>
 *
 * With child selector:
 *   const ref = useScrollReveal<HTMLElement>({ target: '[data-reveal]', stagger: 0.15 })
 */
export function useScrollReveal<T extends HTMLElement = HTMLElement>(
  options: ScrollRevealOptions = {},
) {
  const {
    y        = 48,
    opacity  = 0,
    duration = 0.8,
    stagger  = 0.12,
    start    = 'top 88%',
    ease     = 'power3.out',
    target,
    delay    = 0,
  } = options

  const ref     = useRef<T>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (!ref.current || reduced) return

    const el      = ref.current
    const targets = target ? el.querySelectorAll(target) : [el]

    const ctx = gsap.context(() => {
      gsap.from(targets, {
        y,
        opacity,
        duration,
        stagger,
        delay,
        ease,
        scrollTrigger: {
          trigger: el,
          start,
          once: true,
        },
      })
    }, el)

    return () => ctx.revert()
  }, [reduced, y, opacity, duration, stagger, start, ease, target, delay])

  return ref
}
