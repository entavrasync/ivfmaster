'use client'

import { motion } from 'motion/react'
import { Link } from '@/i18n/navigation'
import { Container } from '@/components/layout/Container'
import { Pressable } from '@/components/motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const EASE = [0.22, 1, 0.36, 1] as const

/*
 * Closing beat of the Pain Recognition arc.
 * Sits after the scroll-story; before RecognitionStories.
 *
 * Temperature: recognition, not conversion.
 * CTA is an open hand — quiet invitation, zero hard-sell.
 */
export function PainRecognitionCTA() {
  const reduced = useReducedMotion()

  const containerV = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.14, delayChildren: 0.08 } },
  }

  const itemV = {
    hidden:  { opacity: 0, y: reduced ? 0 : 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.85, ease: EASE },
    },
  }

  return (
    <section
      aria-labelledby="pain-cta-heading"
      style={{
        /*
         * Warm ivory → barely-lavender: picks up the sandy warmth from the
         * scroll-story's final chapter and exhales it into quiet rest.
         */
        background: 'linear-gradient(175deg, #F2EDE7 0%, #EDEEF6 55%, #F3F2FA 100%)',
        paddingTop:    'clamp(5rem, 10vw, 9rem)',
        paddingBottom: 'clamp(5rem, 12vw, 11rem)',
      }}
    >
      <Container>
        <motion.div
          className="mx-auto text-center"
          style={{ maxWidth: '54ch' }}
          variants={containerV}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-64px' }}
        >

          {/* ── Eyebrow ── */}
          <motion.p
            variants={itemV}
            style={{
              fontFamily:    'var(--font-body)',
              fontSize:      '0.875rem',
              fontWeight:    600,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color:         '#6478B0',
              marginBottom:  '1.25rem',
            }}
          >
            You don&apos;t have to carry this alone
          </motion.p>

          {/* ── Heading ── */}
          <motion.h2
            id="pain-cta-heading"
            variants={itemV}
            style={{
              fontFamily:            'var(--font-display)',
              fontSize:              'clamp(1.875rem, 3.2vw + 0.5rem, 3.125rem)',
              fontWeight:            500,
              lineHeight:            1.12,
              letterSpacing:         '-0.024em',
              color:                 '#1C2A48',
              fontVariationSettings: '"opsz" 48',
              marginBottom:          '1.75rem',
            }}
          >
            If this is you, you&apos;re in the right place.
          </motion.h2>

          {/* ── Body ── */}
          <motion.p
            variants={itemV}
            style={{
              fontFamily:   'var(--font-body)',
              fontSize:     'clamp(1.125rem, 1.1vw + 0.5rem, 1.25rem)',
              lineHeight:   1.72,
              color:        '#5A6173',
              marginBottom: '3rem',
              maxWidth:     '48ch',
              marginLeft:   'auto',
              marginRight:  'auto',
            }}
          >
            The first step isn&apos;t a decision. It&apos;s understanding. We start by
            listening — to your story, your history, your worries — so that whatever
            comes next is clear, and yours.
          </motion.p>

          {/* ── CTA block ── */}
          <motion.div
            variants={itemV}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}
          >
            {/*
             * Ghost / outline pill — navy border, barely-there fill.
             * Reads as an invitation, not a purchase button.
             * Deliberately quieter than the hero's blush pill.
             */}
            <Pressable haptic>
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2.5 rounded-full transition-all duration-300 hover:-translate-y-px"
                style={{
                  border:      '1.5px solid rgba(46,79,142,0.28)',
                  background:  'rgba(46,79,142,0.055)',
                  color:       '#2E4F8E',
                  fontFamily:  'var(--font-body)',
                  fontSize:    '1rem',
                  fontWeight:  600,
                  letterSpacing: '-0.01em',
                  padding:     '0.9375rem 2.125rem',
                }}
              >
                Let&apos;s understand your story together
                <span
                  aria-hidden="true"
                  className="inline-block transition-transform duration-300 group-hover:translate-x-0.5"
                  style={{ fontSize: '1.0625rem', lineHeight: 1 }}
                >
                  →
                </span>
              </Link>
            </Pressable>

            {/* Micro-line — tempo marker, zero pressure */}
            <p
              style={{
                fontFamily:    'var(--font-body)',
                fontSize:      '0.875rem',
                lineHeight:    1.65,
                color:         '#7B8094',
                letterSpacing: '0.01em',
              }}
            >
              An unhurried first conversation — whenever you&apos;re ready.
            </p>
          </motion.div>

        </motion.div>
      </Container>
    </section>
  )
}
