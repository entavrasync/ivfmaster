'use client'

import { motion } from 'motion/react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const EASE = [0.22, 1, 0.36, 1] as const

interface RevealProps {
  children: React.ReactNode
  className?: string
  /** Additional delay in seconds before the reveal starts */
  delay?: number
  /** How far up the element rises (px). Ignored in reduced-motion mode. */
  y?: number
}

/**
 * Fades + rises children into view as they scroll into the viewport.
 * Triggers once, slightly before the element fully enters (margin -80px).
 * Respects prefers-reduced-motion: fades only, no transform.
 */
export function Reveal({ children, className, delay = 0, y = 24 }: RevealProps) {
  const reduced = useReducedMotion()

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduced ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.75, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}
