'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'motion/react'
import { Container } from '@/components/layout/Container'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const EASE = [0.22, 1, 0.36, 1] as const

/* ─── Count-up ────────────────────────────────────────────────────────────── */

function useCountUp(target: number, active: boolean, reduced: boolean): number {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (reduced) { setCount(target); return }
    if (!active) return

    const DURATION_MS = 1400
    const start = performance.now()
    let raf: number

    function tick(now: number) {
      const t = Math.min((now - start) / DURATION_MS, 1)
      setCount(Math.round((1 - (1 - t) ** 3) * target))
      if (t < 1) raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, active, reduced])

  return count
}

/* ─── Data ───────────────────────────────────────────────────────────────── */

const STATS = [
  {
    value:   20,
    suffix:  '+',
    label:   'Years of practice',
    subtext: 'Reproductive medicine, Pune',
  },
  {
    value:   2500,
    suffix:  '+',
    label:   'Couples guided',
    subtext: 'Across Maharashtra and beyond',
  },
  {
    value:   40,
    suffix:  '%',
    label:   'IVF success rate',
    subtext: 'Above the national average',
  },
  {
    value:   100,
    suffix:  '%',
    label:   'Confidential, always',
    subtext: 'Every visit, every conversation',
  },
] as const

/* ─── Component ──────────────────────────────────────────────────────────── */

export function TrustIndicators() {
  const reduced = useReducedMotion()

  /* Anchor ref on the always-visible grid wrapper so IntersectionObserver
   * fires correctly before the motion.divs have faded in. */
  const statsRef   = useRef<HTMLDivElement>(null)
  const statsInView = useInView(statsRef, { once: true, margin: '-60px' })

  const c1 = useCountUp(STATS[0].value, statsInView, reduced)
  const c2 = useCountUp(STATS[1].value, statsInView, reduced)
  const c3 = useCountUp(STATS[2].value, statsInView, reduced)
  const c4 = useCountUp(STATS[3].value, statsInView, reduced)
  const counts = [c1, c2, c3, c4]

  return (
    <section
      aria-labelledby="trust-indicators-heading"
      style={{
        background:    'linear-gradient(180deg, #F6F3EA 0%, #F0EAE0 100%)',
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
          In numbers
        </motion.p>

        {/* ── Headline ──────────────────────────────────────────────────── */}
        <motion.h2
          id="trust-indicators-heading"
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
            marginBottom:          'clamp(3.5rem, 7vw, 6rem)',
            maxWidth:              '22ch',
          }}
        >
          Two decades of care, in four numbers.
        </motion.h2>

        {/* ── Stat grid — pure typographic, no cards ────────────────────
         *  2 columns on sm+ (stacked on mobile).
         *  Count-up starts when statsRef enters the viewport.
         * ──────────────────────────────────────────────────────────── */}
        <div
          ref={statsRef}
          className="grid grid-cols-1 sm:grid-cols-2"
          style={{ gap: 'clamp(3rem, 6vw, 5rem) clamp(2rem, 5vw, 4rem)' }}
        >
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: reduced ? 0 : 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.72, delay: i * 0.08, ease: EASE }}
            >
              {/* Number */}
              <p style={{
                fontFamily:            'var(--font-display)',
                fontSize:              'clamp(3.5rem, 7vw, 5.5rem)',
                fontWeight:            500,
                lineHeight:            1,
                letterSpacing:         '-0.03em',
                color:                 '#1C2A48',
                fontVariationSettings: '"opsz" 72',
                marginBottom:          '0.75rem',
              }}>
                <span aria-hidden="true">{counts[i].toLocaleString('en-IN')}</span>
                <span aria-hidden="true" style={{ color: '#6478B0' }}>{stat.suffix}</span>
                {/* Screen-reader text: final value only */}
                <span className="sr-only">{stat.value}{stat.suffix}</span>
              </p>

              {/* Label */}
              <p style={{
                fontFamily:   'var(--font-body)',
                fontSize:     'clamp(1rem, 0.8vw + 0.5rem, 1.125rem)',
                fontWeight:   600,
                color:        '#1C2A48',
                marginBottom: '0.375rem',
              }}>
                {stat.label}
              </p>

              {/* Subtext */}
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize:   '0.9375rem',
                lineHeight: 1.6,
                color:      '#8A8897',
              }}>
                {stat.subtext}
              </p>
            </motion.div>
          ))}
        </div>

      </Container>
    </section>
  )
}
