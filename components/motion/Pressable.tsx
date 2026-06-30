'use client'

import { motion } from 'motion/react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface PressableProps {
  children: React.ReactNode
  className?: string
  /**
   * Fires a brief haptic vibration on tap (Android only via Vibration API).
   * Silently skipped on iOS and desktop — no errors, no feature detection noise.
   */
  haptic?: boolean
  onClick?: React.MouseEventHandler<HTMLDivElement>
}

/**
 * Premium interactive wrapper for buttons, cards, and clickable surfaces.
 * Provides a subtle scale-up on hover and scale-down on press, with a soft
 * spring so it never feels bouncy. Optional micro-haptic on tap for Android.
 * All motion is suppressed under prefers-reduced-motion.
 */
export function Pressable({ children, className, haptic = false, onClick }: PressableProps) {
  const reduced = useReducedMotion()

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    if (haptic && !reduced) {
      try {
        if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
          navigator.vibrate(8)
        }
      } catch {
        // Vibration API blocked by browser policy — silently ignore
      }
    }
    onClick?.(e)
  }

  return (
    <motion.div
      className={className}
      whileHover={reduced ? {} : { scale: 1.02 }}
      whileTap={reduced ? {} : { scale: 0.98 }}
      transition={{
        type: 'spring',
        stiffness: 180,
        damping: 28,
        mass: 0.8,
      }}
      onClick={handleClick}
    >
      {children}
    </motion.div>
  )
}
