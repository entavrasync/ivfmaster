'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface ParallaxProps {
  children: React.ReactNode
  className?: string
  /**
   * Total vertical travel in px as the element crosses the viewport.
   * Positive = element moves down as you scroll down (standard parallax sense).
   * Keep small (20–40px) for the calm editorial feel.
   */
  range?: number
}

/**
 * Subtle scroll-parallax wrapper. Translates children ±range/2 px
 * as the element travels from entering to leaving the viewport.
 * Disabled entirely under prefers-reduced-motion.
 */
export function Parallax({ children, className, range = 30 }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  // Maps scroll progress 0→1 to +range/2 → -range/2
  const y = useTransform(scrollYProgress, [0, 1], [range / 2, -(range / 2)])

  if (reduced) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div ref={ref} className={className} style={{ y }}>
      {children}
    </motion.div>
  )
}
