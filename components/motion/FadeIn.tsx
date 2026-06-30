'use client'

import { motion } from 'motion/react'

const EASE = [0.22, 1, 0.36, 1] as const

interface FadeInProps {
  children: React.ReactNode
  className?: string
  delay?: number
  duration?: number
}

/**
 * Simple opacity-only fade — the most reduced-motion-safe reveal.
 * No transform, works everywhere including reduced-motion contexts.
 * For richer reveals use <Reveal>; reserve <FadeIn> for subtle appears.
 */
export function FadeIn({ children, className, delay = 0, duration = 0.6 }: FadeInProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}
