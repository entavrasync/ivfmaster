'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import Image, { type StaticImageData } from 'next/image'
import { useCallback, useEffect, useState } from 'react'

import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/utils'

const EASE = [0.22, 1, 0.36, 1] as const
const AUTOPLAY_MS = 4500
const SWIPE_THRESHOLD = 48

interface FacilityCarouselProps {
  /** Two or more photos. A single-photo area renders a plain <Image>, not this. */
  images: readonly StaticImageData[]
  /** Shared alt text for the area (the caption sits below, fixed). */
  alt: string
  sizes: string
  labels: {
    prev: string
    next: string
    goTo: string
  }
}

/**
 * In-place gallery carousel for facility tiles that hold more than one photo
 * (currently the embryology laboratory). Lives inside the same rounded frame as
 * the single-image tiles — same size, same caption below — with the photos
 * cycling within it.
 *
 * - Calm crossfade between images (~0.6s).
 * - Slow auto-advance that pauses on hover and hands control to the visitor
 *   the moment they use an arrow, dot, or swipe.
 * - Tasteful arrows (reveal on hover / always on touch) + dot indicators.
 * - Swipeable on touch via a transparent drag layer.
 * - prefers-reduced-motion: no auto-play, no crossfade — instant swaps stepped
 *   through with the arrows and dots.
 */
export function FacilityCarousel({ images, alt, sizes, labels }: FacilityCarouselProps) {
  const reduced = useReducedMotion()
  const count = images.length
  const [index, setIndex] = useState(0)
  const [hovering, setHovering] = useState(false)
  const [userDriving, setUserDriving] = useState(false)

  const goTo = useCallback(
    (next: number) => {
      setUserDriving(true)
      setIndex(((next % count) + count) % count)
    },
    [count]
  )

  const step = useCallback(
    (delta: number) => {
      setUserDriving(true)
      setIndex((prev) => (prev + delta + count) % count)
    },
    [count]
  )

  // Slow, calm auto-advance. Off for reduced motion, while hovering, or once the
  // visitor has taken manual control.
  useEffect(() => {
    if (reduced || userDriving || hovering || count < 2) return
    const id = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % count)
    }, AUTOPLAY_MS)
    return () => window.clearInterval(id)
  }, [reduced, userDriving, hovering, count])

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      step(-1)
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      step(1)
    }
  }

  const arrowBase =
    'absolute top-1/2 z-20 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-white/60 bg-ivory/85 text-navy shadow-[0_10px_24px_-10px_rgba(28,42,72,0.5)] backdrop-blur-md outline-none transition-[opacity,background-color,color] duration-300 hover:bg-ivory hover:text-ink focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-navy md:opacity-0 md:group-hover/carousel:opacity-100'

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className="group/carousel absolute inset-0"
      role="group"
      aria-roledescription="carousel"
      aria-label={alt}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onKeyDown={onKeyDown}
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={index}
          className="absolute inset-0"
          initial={{ opacity: reduced ? 1 : 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: reduced ? 1 : 0 }}
          transition={{ duration: reduced ? 0 : 0.6, ease: EASE }}
        >
          <Image
            src={images[index]}
            alt={alt}
            fill
            sizes={sizes}
            placeholder="blur"
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Transparent swipe layer for touch / pointer drag (skipped in reduced motion). */}
      {!reduced && (
        <motion.div
          className="absolute inset-0 z-10"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.12}
          dragSnapToOrigin
          onDragStart={() => setUserDriving(true)}
          onDragEnd={(_event, info) => {
            if (info.offset.x <= -SWIPE_THRESHOLD) step(1)
            else if (info.offset.x >= SWIPE_THRESHOLD) step(-1)
          }}
        />
      )}

      {/* Soft scrim so arrows and dots stay legible over any photo. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24 bg-gradient-to-t from-ink/30 to-transparent"
      />

      <button
        type="button"
        onClick={() => step(-1)}
        aria-label={labels.prev}
        className={cn(arrowBase, 'left-3')}
      >
        <ChevronLeft aria-hidden="true" className="size-5" />
      </button>
      <button
        type="button"
        onClick={() => step(1)}
        aria-label={labels.next}
        className={cn(arrowBase, 'right-3')}
      >
        <ChevronRight aria-hidden="true" className="size-5" />
      </button>

      <div className="absolute inset-x-0 bottom-3.5 z-20 flex items-center justify-center gap-2">
        {images.map((_image, i) => {
          const active = i === index
          return (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`${labels.goTo} ${i + 1}`}
              aria-current={active ? 'true' : undefined}
              className={cn(
                'h-2 rounded-full outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-navy',
                active ? 'w-6 bg-blush' : 'w-2 bg-white/70 hover:bg-white'
              )}
            />
          )
        })}
      </div>
    </div>
  )
}
