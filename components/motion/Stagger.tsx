'use client'

import { motion } from 'motion/react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const EASE = [0.22, 1, 0.36, 1] as const

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
}

interface StaggerProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  /** Seconds before the first child starts animating */
  delay?: number
  /** Override stagger interval between children (seconds) */
  stagger?: number
}

/**
 * Container that staggers its <StaggerItem> children into view.
 * Triggers once when the container scrolls into the viewport.
 */
export function Stagger({
  children,
  className,
  style,
  delay = 0,
  stagger = 0.1,
}: StaggerProps) {
  const variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: stagger, delayChildren: delay },
    },
  }

  return (
    <motion.div
      className={className}
      style={style}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
    >
      {children}
    </motion.div>
  )
}

interface StaggerItemProps {
  children: React.ReactNode
  className?: string
}

/**
 * Direct child of <Stagger>. Inherits the stagger timing from its parent.
 */
export function StaggerItem({ children, className }: StaggerItemProps) {
  const reduced = useReducedMotion()

  const variants = {
    hidden: { opacity: 0, y: reduced ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduced ? 0.3 : 0.75, ease: EASE },
    },
  }

  return (
    <motion.div className={className} variants={variants}>
      {children}
    </motion.div>
  )
}
