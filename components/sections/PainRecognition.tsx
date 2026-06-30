'use client'

import { motion } from 'motion/react'
import { Container } from '@/components/layout/Container'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const EASE = [0.22, 1, 0.36, 1] as const

/* Split headline into words for the per-word stagger. */
const HEADLINE = "You've been carrying this quietly for a long time."
const HEADLINE_WORDS = HEADLINE.split(' ')

/* How long all headline words take to stream in, so sub-line waits its turn. */
const HEADLINE_DONE = 0.3 + HEADLINE_WORDS.length * 0.08 // ≈ 1.1 s

export function PainRecognition() {
  const reduced = useReducedMotion()

  /* ─── Variants ────────────────────────────────────────────────────────── */

  const eyebrowV = {
    hidden:  { opacity: 0, y: reduced ? 0 : 14 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE } },
  }

  /* Parent of the word spans — fires stagger immediately when view-entered. */
  const headlineContainerV = {
    hidden:  {},
    visible: { transition: { staggerChildren: 0.08, delayChildren: 0.28 } },
  }

  /* Each word */
  const wordV = {
    hidden:  { opacity: 0, y: reduced ? 0 : 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.88, ease: EASE } },
  }

  /* Sub-line waits until most headline words have streamed in. */
  const subLineV = {
    hidden:  { opacity: 0, y: reduced ? 0 : 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.85, delay: reduced ? 0.1 : HEADLINE_DONE, ease: EASE },
    },
  }

  /* Master container — all direct children share the same whileInView trigger. */
  const masterV = {
    hidden:  {},
    visible: { transition: { staggerChildren: 0 } },
  }

  return (
    <section
      aria-labelledby="pain-recognition-heading"
      style={{
        background:    'transparent',
        paddingTop:    'clamp(5rem, 10vw, 9rem)',
        paddingBottom: 'clamp(5rem, 10vw, 9rem)',
      }}
    >
      <Container>
        {/*
         * Editorial column: centered, ~60ch wide on desktop,
         * full-width with comfortable gutters on mobile.
         */}
        <motion.div
          className="mx-auto text-center"
          style={{ maxWidth: '62ch' }}
          variants={masterV}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-72px' }}
        >
          {/* ── Eyebrow ── */}
          <motion.p
            variants={eyebrowV}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.875rem',
              fontWeight: 600,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#6478B0',
              marginBottom: '1.25rem',
            }}
          >
            Before anything else
          </motion.p>

          {/* ── Headline — word-by-word stagger ── */}
          <motion.h2
            id="pain-recognition-heading"
            variants={headlineContainerV}
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              /*
               * gap replaces normal word spacing because each word
               * is an inline-block span inside a flex container.
               */
              columnGap: '0.26em',
              rowGap: '0.1em',
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.75rem, 3.5vw + 0.5rem, 3.25rem)',
              fontWeight: 500,
              lineHeight: 1.12,
              letterSpacing: '-0.022em',
              color: '#1C2A48',
              fontOpticalSizing: 'auto',
              fontVariationSettings: '"opsz" 48',
              marginBottom: '1.75rem',
            }}
          >
            {HEADLINE_WORDS.map((word, i) => (
              <motion.span
                key={i}
                variants={wordV}
                /* inline-block required — motion.span defaults to inline */
                style={{ display: 'inline-block' }}
              >
                {word}
              </motion.span>
            ))}
          </motion.h2>

          {/* ── Sub-line ── */}
          <motion.p
            variants={subLineV}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(1.125rem, 1.1vw + 0.5rem, 1.25rem)',
              lineHeight: 1.72,
              color: '#5A6173',
              maxWidth: '50ch',
              margin: '0 auto',
              letterSpacing: '-0.005em',
            }}
          >
            The waiting, the questions, the hope that keeps starting over.{' '}
            We understand — and you don&apos;t have to carry it alone anymore.
          </motion.p>
        </motion.div>
      </Container>
    </section>
  )
}
