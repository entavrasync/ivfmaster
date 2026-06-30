'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useReducedMotion } from '@/hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

const LenisContext = createContext<Lenis | null>(null)

/**
 * Returns the live Lenis instance for programmatic control.
 * Null when smooth scroll is disabled (reduced-motion or SSR).
 *
 * Usage: const lenis = useLenis(); lenis?.scrollTo('#section', { duration: 1.2 })
 */
export function useLenis() {
  return useContext(LenisContext)
}

interface SmoothScrollProviderProps {
  children: React.ReactNode
}

/**
 * Wires Lenis smooth scroll to GSAP's ticker so both share one RAF clock.
 *
 * Architecture:
 *  - Lenis interpolates scroll (lerp 0.1 = responsive, not floaty)
 *  - GSAP ticker drives Lenis — no separate requestAnimationFrame
 *  - lenis.on('scroll', ScrollTrigger.update) keeps pinned sections in sync
 *  - Reduced motion: Lenis skipped; native scroll + instant ScrollTrigger
 */
export function SmoothScrollProvider({ children }: Readonly<SmoothScrollProviderProps>) {
  const [lenis, setLenis] = useState<Lenis | null>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return

    const instance = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      smoothTouch: false,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    })

    setLenis(instance)

    instance.on('scroll', ScrollTrigger.update)

    function onTick(time: number) {
      instance.raf(time * 1000)
    }

    gsap.ticker.add(onTick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(onTick)
      instance.destroy()
      setLenis(null)
    }
  }, [reduced])

  return (
    <LenisContext.Provider value={lenis}>
      {children}
    </LenisContext.Provider>
  )
}
