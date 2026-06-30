'use client'

import { motion } from 'motion/react'
import { Container } from '@/components/layout/Container'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const EASE = [0.22, 1, 0.36, 1] as const

/* ─── Data ───────────────────────────────────────────────────────────────── */

const COSTS = [
  {
    num:     '01',
    heading: 'Time that doesn’t come back.',
    body:    'Every month of uncertainty is a month you could have spent moving forward. Clarity is not a luxury — it’s time.',
  },
  {
    num:     '02',
    heading: 'Confusion that compounds.',
    body:    'Without someone to explain, fears grow. What begins as worry becomes dread. Understanding is the antidote to spiral thinking.',
  },
  {
    num:     '03',
    heading: 'Advice that costs more than nothing.',
    body:    'Misinformation doesn’t just fail to help — it leads couples toward wrong treatments and conclusions that set them back.',
  },
  {
    num:     '04',
    heading: 'A decision kept on pause.',
    body:    'Age is one of the few factors in fertility that moves in one direction. The decision postponed is rarely the decision improved.',
  },
] as const

/* ─── Component ──────────────────────────────────────────────────────────── */

export function HiddenCost() {
  const reduced = useReducedMotion()

  /* Variant objects reference `reduced` from closure — no `custom` prop needed. */
  const gridContainerV = {
    hidden:  {},
    visible: { transition: { staggerChildren: 0.10 } },
  }
  const gridItemV = {
    hidden:  { opacity: 0, y: reduced ? 0 : 20 },
    visible: {
      opacity: 1, y: 0,
      transition: { duration: 0.72, ease: EASE },
    },
  }

  return (
    <section
      aria-labelledby="hidden-cost-heading"
      style={{
        background:    'linear-gradient(180deg, #F8F5EE 0%, #F2EDE7 100%)',
        paddingTop:    'clamp(5rem, 10vw, 9rem)',
        paddingBottom: 'clamp(5rem, 10vw, 9rem)',
      }}
    >
      <Container>

        {/* ── Eyebrow ───────────────────────────────────────────────────── */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: EASE }}
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
          The cost of waiting
        </motion.p>

        {/* ── Headline ──────────────────────────────────────────────────── */}
        <motion.h2
          id="hidden-cost-heading"
          initial={{ opacity: 0, y: reduced ? 0 : 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.78, delay: 0.1, ease: EASE }}
          style={{
            fontFamily:            'var(--font-display)',
            fontSize:              'clamp(2rem, 3vw + 0.5rem, 3.25rem)',
            fontWeight:            500,
            lineHeight:            1.1,
            letterSpacing:         '-0.024em',
            color:                 '#1C2A48',
            fontVariationSettings: '"opsz" 48',
            marginBottom:          '1.75rem',
            maxWidth:              '28ch',
          }}
        >
          Uncertainty has a price. It’s paid in time.
        </motion.h2>

        {/* ── Lead ──────────────────────────────────────────────────────── */}
        <motion.p
          initial={{ opacity: 0, y: reduced ? 0 : 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.72, delay: 0.2, ease: EASE }}
          style={{
            fontFamily:   'var(--font-body)',
            fontSize:     'clamp(1.125rem, 1.1vw + 0.5rem, 1.25rem)',
            lineHeight:   1.72,
            color:        '#5A6173',
            maxWidth:     '52ch',
            marginBottom: 'clamp(3.5rem, 7vw, 6rem)',
          }}
        >
          Beyond the financial cost of treatment, the cost of not understanding your
          fertility situation is paid in something harder to recover: months of guessing,
          emotional weight, and the decisions you couldn&apos;t make because no one
          explained them.
        </motion.p>

        {/* ── 2×2 cost grid — no cards, pure editorial ──────────────────
         *  staggerChildren fires once the container enters view.
         *  Items carry the shared gridItemV variant.
         * ──────────────────────────────────────────────────────────── */}
        <motion.div
          variants={gridContainerV}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 sm:grid-cols-2"
          style={{
            gap:          'clamp(3rem, 6vw, 5rem) clamp(2.5rem, 5vw, 5rem)',
            marginBottom: 'clamp(3.5rem, 7vw, 6rem)',
          }}
        >
          {COSTS.map((cost) => (
            <motion.div
              key={cost.num}
              variants={gridItemV}
              style={{ paddingTop: '0.25rem' }}
            >
              <span
                aria-hidden="true"
                style={{
                  fontFamily:    'var(--font-body)',
                  fontSize:      '0.75rem',
                  fontWeight:    600,
                  letterSpacing: '0.14em',
                  color:         '#97A6D2',
                  display:       'block',
                  marginBottom:  '1rem',
                }}
              >
                {cost.num}
              </span>

              <h3 style={{
                fontFamily:            'var(--font-display)',
                fontSize:              'clamp(1.375rem, 1.8vw + 0.4rem, 1.875rem)',
                fontWeight:            500,
                lineHeight:            1.15,
                letterSpacing:         '-0.02em',
                color:                 '#1C2A48',
                fontVariationSettings: '"opsz" 36',
                marginBottom:          '0.875rem',
              }}>
                {cost.heading}
              </h3>

              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize:   'clamp(1rem, 0.9vw + 0.5rem, 1.125rem)',
                lineHeight: 1.7,
                color:      '#5A6173',
              }}>
                {cost.body}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Resolution note ───────────────────────────────────────────
         *  Same bordered treatment as the Gestosis note in WhyTrust:
         *  placed-down feel, scale 0.98 → 1 on entry.
         * ──────────────────────────────────────────────────────────── */}
        <motion.div
          initial={{
            opacity: 0,
            y:       reduced ? 0 : 12,
            scale:   reduced ? 1 : 0.98,
          }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.82, delay: 0.2, ease: EASE }}
          style={{
            padding:      '1.375rem 1.625rem',
            maxWidth:     '56ch',
            borderLeft:   '2px solid rgba(100,120,176,0.38)',
            background:   'rgba(100,120,176,0.05)',
            borderRadius: '0 8px 8px 0',
          }}
        >
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize:   'clamp(1.0625rem, 0.9vw + 0.5rem, 1.1875rem)',
            lineHeight: 1.72,
            color:      '#334B80',
            margin:     0,
          }}>
            That&apos;s why we start with understanding &mdash; not with a treatment plan.
            We explain first, and every next step moves forward only when you&apos;re ready.
          </p>
        </motion.div>

      </Container>
    </section>
  )
}
