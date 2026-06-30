'use client'

import { useScrollReveal } from '@/hooks/useScrollReveal'

interface RevealSectionProps {
  children: React.ReactNode
  className?: string
  y?: number
  delay?: number
  stagger?: number
  /** Animate child elements with this selector instead of the wrapper */
  target?: string
  as?: React.ElementType
}

/**
 * Drop-in wrapper that fade+slides its children into view on scroll.
 * Children are server components — this wrapper stays client-only.
 */
export function RevealSection({
  children,
  className,
  y = 48,
  delay = 0,
  stagger = 0.12,
  target,
  as: Tag = 'div',
}: Readonly<RevealSectionProps>) {
  const ref = useScrollReveal<HTMLDivElement>({ y, delay, stagger, target })

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  )
}
