'use client'

import { motion } from 'motion/react'
import { useTranslations } from 'next-intl'
import { Container } from '@/components/layout/Container'
import { Pressable } from '@/components/motion/Pressable'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { Link } from '@/i18n/navigation'

const EASE = [0.22, 1, 0.36, 1] as const

/* ─── Component ──────────────────────────────────────────────────────────── */

export function PatientJourney() {
  const reduced = useReducedMotion()
  const t       = useTranslations('PatientJourney')

  const steps = [
    { id: 'conversation', num: '01', heading: t('steps.s1.heading'), body: t('steps.s1.body') },
    { id: 'evaluation',   num: '02', heading: t('steps.s2.heading'), body: t('steps.s2.body') },
    { id: 'education',    num: '03', heading: t('steps.s3.heading'), body: t('steps.s3.body') },
    { id: 'planning',     num: '04', heading: t('steps.s4.heading'), body: t('steps.s4.body') },
    { id: 'treatment',    num: '05', heading: t('steps.s5.heading'), body: t('steps.s5.body') },
    { id: 'support',      num: '06', heading: t('steps.s6.heading'), body: t('steps.s6.body') },
  ]

  /* Variants inside component so `reduced` is in closure */
  const introContainerV = {
    hidden:  {},
    visible: { transition: { staggerChildren: reduced ? 0 : 0.11 } },
  }
  const introItemV = {
    hidden:  { opacity: reduced ? 1 : 0, y: reduced ? 0 : 18 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.72, ease: EASE } },
  }

  const railV = {
    hidden:  {},
    visible: { transition: { staggerChildren: reduced ? 0 : 0.13 } },
  }

  /* `custom` carries `reduced` so each card's hidden state accounts for it */
  const cardV = {
    hidden:  (red: boolean) => ({ opacity: red ? 1 : 0, y: red ? 0 : 22, x: red ? 0 : 14 }),
    visible: { opacity: 1, y: 0, x: 0, transition: { duration: 0.62, ease: EASE } },
  }

  return (
    <section
      aria-labelledby="patient-journey-heading"
      style={{
        background:    'linear-gradient(180deg, #FAF8F2 0%, #F5F1E9 100%)',
        paddingTop:    'clamp(5rem, 10vw, 9rem)',
        paddingBottom: 'clamp(5rem, 10vw, 9rem)',
      }}
    >

      {/* ── Intro ─────────────────────────────────────────────────────────── */}
      <Container>
        <motion.div
          variants={introContainerV}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          style={{ marginBottom: 'clamp(3.5rem, 7vw, 5.5rem)' }}
        >
          <motion.p
            variants={introItemV}
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
            {t('eyebrow')}
          </motion.p>

          <motion.h2
            id="patient-journey-heading"
            variants={introItemV}
            style={{
              fontFamily:            'var(--font-display)',
              fontSize:              'clamp(2rem, 3vw + 0.5rem, 3.25rem)',
              fontWeight:            500,
              lineHeight:            1.1,
              letterSpacing:         '-0.024em',
              color:                 '#1C2A48',
              fontVariationSettings: '"opsz" 48',
              marginBottom:          '1.5rem',
              maxWidth:              '26ch',
            }}
          >
            {t('heading')}
          </motion.h2>

          <motion.p
            variants={introItemV}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize:   'clamp(1.125rem, 1.1vw + 0.5rem, 1.25rem)',
              lineHeight: 1.72,
              color:      '#5A6173',
              maxWidth:   '50ch',
            }}
          >
            {t('body')}
          </motion.p>
        </motion.div>
      </Container>

      {/* ── Horizontal swipe rail ──────────────────────────────────────────
       *  Padding mirrors Container gutter tokens so the first card's left
       *  edge aligns with intro text on every breakpoint.
       *  scroll-snap gives a premium snap-per-card feel on mobile.
       *  [&::-webkit-scrollbar]:hidden + scrollbarWidth:none hides the bar
       *  cross-browser while keeping native touch scroll.                   */}
      <div
        className={[
          'overflow-x-auto',
          '[&::-webkit-scrollbar]:hidden',
          'pl-(--gutter-mobile)  sm:pl-(--gutter-tablet)  lg:pl-(--gutter-desktop)',
          'pr-(--gutter-mobile)  sm:pr-(--gutter-tablet)  lg:pr-(--gutter-desktop)',
          'scroll-pl-(--gutter-mobile)',
          'sm:scroll-pl-(--gutter-tablet)',
          'lg:scroll-pl-(--gutter-desktop)',
        ].join(' ')}
        style={{
          scrollbarWidth: 'none',
          scrollSnapType: 'x mandatory',
          paddingBottom:  '2rem',
          paddingTop:     '0.5rem',
        }}
      >
        <motion.div
          variants={railV}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          style={{
            display: 'flex',
            gap:     'clamp(0.875rem, 1.5vw, 1.125rem)',
            width:   'max-content',
          }}
        >
          {steps.map((step) => (
            <motion.div
              key={step.id}
              custom={reduced}
              variants={cardV}
              style={{
                flexShrink:      0,
                /* ~72 vw on mobile so next card peeks; capped at 272 px on desktop */
                width:           'clamp(244px, 72vw, 272px)',
                scrollSnapAlign: 'start',
                background:      '#FFFDF9',
                borderRadius:    '18px',
                boxShadow:       '0 18px 36px -22px rgba(46,79,142,0.16)',
                padding:         'clamp(1.375rem, 2.5vw, 1.75rem)',
              }}
            >
              {/* Step number */}
              <span
                aria-hidden="true"
                style={{
                  display:       'block',
                  fontFamily:    'var(--font-body)',
                  fontSize:      '0.6875rem',
                  fontWeight:    700,
                  letterSpacing: '0.18em',
                  color:         '#97A6D2',
                  marginBottom:  '1rem',
                }}
              >
                {step.num}
              </span>

              {/* Card heading */}
              <h3
                style={{
                  fontFamily:            'var(--font-display)',
                  fontSize:              'clamp(1.0625rem, 1.1vw + 0.4rem, 1.25rem)',
                  fontWeight:            500,
                  lineHeight:            1.25,
                  letterSpacing:         '-0.015em',
                  color:                 '#1C2A48',
                  fontVariationSettings: '"opsz" 28',
                  marginBottom:          '0.75rem',
                }}
              >
                {step.heading}
              </h3>

              {/* Card body */}
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize:   'clamp(0.9375rem, 0.75vw + 0.5rem, 1rem)',
                  lineHeight: 1.68,
                  color:      '#5A6173',
                  margin:     0,
                }}
              >
                {step.body}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ── Close / CTA ───────────────────────────────────────────────────── */}
      <Container>
        <motion.div
          initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.72, ease: EASE }}
          style={{
            marginTop:     'clamp(3.5rem, 7vw, 5.5rem)',
            borderTop:     '1px solid rgba(100,120,176,0.14)',
            paddingTop:    'clamp(2.5rem, 5vw, 4rem)',
            display:       'flex',
            flexDirection: 'column',
            gap:           '1.25rem',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize:   'clamp(1rem, 0.9vw + 0.5rem, 1.125rem)',
              lineHeight: 1.72,
              color:      '#5A6173',
              maxWidth:   '50ch',
              margin:     0,
            }}
          >
            {t('closeBody')}
          </p>

          <div>
            <Pressable className="w-full sm:w-auto">
              <Link
                href="/contact"
                className="block text-center sm:inline-block"
                style={{
                  fontFamily:     'var(--font-body)',
                  fontSize:       'clamp(1rem, 0.9vw + 0.4rem, 1.0625rem)',
                  fontWeight:     600,
                  letterSpacing:  '0.01em',
                  color:          '#FFFFFF',
                  background:     '#E2849C',
                  padding:        '0.9375rem 2.5rem',
                  borderRadius:   '100px',
                  boxShadow:      '0 10px 24px -8px rgba(226,132,156,0.55)',
                  textDecoration: 'none',
                  whiteSpace:     'nowrap',
                }}
              >
                {t('ctaButton')}
              </Link>
            </Pressable>
          </div>
        </motion.div>
      </Container>

    </section>
  )
}
