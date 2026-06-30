'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'motion/react'
import { Container } from '@/components/layout/Container'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const EASE = [0.22, 1, 0.36, 1] as const

/* ─── Data ──────────────────────────────────────────────────────────────── */

const REASONS = [
  {
    num:      '01',
    headline: 'We listen before we treat.',
    body:     'No rushing, no conveyor belt. Your first visit is a conversation about your story — not a quick verdict.',
    indented: false,
  },
  {
    num:      '02',
    headline: 'We explain everything, simply.',
    body:     "You'll never feel lost in jargon. We make sure you understand every step before it happens — because understanding is what calms fear.",
    indented: true,
  },
  {
    num:      '03',
    headline: "We're honest, even when it's hard.",
    body:     "We won't oversell your chances. You'll get the real picture, with compassion — so your hope is built on truth, not pressure.",
    indented: false,
  },
] as const

/* ─── Count-up ───────────────────────────────────────────────────────────
 * Counts from 0 → target over ~1.2s with cubic ease-out.
 * Respects reduced-motion: returns the final value immediately.
 * Only starts once `active` flips true (scroll into view).
 * ─────────────────────────────────────────────────────────────────────── */

function useCountUp(target: number, active: boolean, reduced: boolean): number {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (reduced) { setCount(target); return }
    if (!active) return

    const DURATION_MS = 1200
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

/* ─── Reason inner content ───────────────────────────────────────────────
 * Separated from its outer wrapper so the wrapper can be a motion.div
 * that carries the stagger variant and layout classes.
 * ─────────────────────────────────────────────────────────────────────── */

interface ReasonContentProps {
  readonly num:      string
  readonly headline: string
  readonly body:     string
}

function ReasonContent({ num, headline, body }: Readonly<ReasonContentProps>) {
  return (
    <>
      <span
        aria-hidden="true"
        style={{
          fontFamily:    'var(--font-body)',
          fontSize:      '0.75rem',
          fontWeight:    600,
          letterSpacing: '0.14em',
          color:         '#97A6D2',
          display:       'block',
          marginBottom:  '0.875rem',
        }}
      >
        {num}
      </span>

      <h3 style={{
        fontFamily:            'var(--font-display)',
        fontSize:              'clamp(1.625rem, 2vw + 0.5rem, 2.25rem)',
        fontWeight:            500,
        lineHeight:            1.1,
        letterSpacing:         '-0.02em',
        color:                 '#1C2A48',
        fontVariationSettings: '"opsz" 36',
        marginBottom:          '1rem',
        maxWidth:              '26ch',
      }}>
        {headline}
      </h3>

      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize:   'clamp(1.125rem, 0.9vw + 0.6rem, 1.25rem)',
        lineHeight: 1.72,
        color:      '#5A6173',
        maxWidth:   '48ch',
      }}>
        {body}
      </p>
    </>
  )
}

/* ─── Main component ────────────────────────────────────────────────────── */

export function WhyTrust() {
  const reduced = useReducedMotion()

  /* Proof cluster: track when this area enters the viewport to trigger
   * count-up. The ref sits on an always-visible div (not on the motion.p
   * itself) so IntersectionObserver fires even before the p fades in. */
  const proofRef    = useRef<HTMLDivElement>(null)
  const proofInView = useInView(proofRef, { once: true, margin: '-60px' })

  const yearsCount   = useCountUp(20,   proofInView, reduced)
  const couplesCount = useCountUp(2000, proofInView, reduced)

  /* ── Variants ────────────────────────────────────────────────────────── */

  /* Intro block: eyebrow → headline → lead, ~0.12 s apart */
  const introContainerV = {
    hidden:  {},
    visible: { transition: { staggerChildren: 0.12 } },
  }
  const introItemV = {
    hidden:  { opacity: 0, y: reduced ? 0 : 18 },
    visible: {
      opacity: 1, y: 0,
      transition: { duration: 0.78, ease: EASE },
    },
  }

  /* Reasons list: group trigger, each row fades+rises ~0.10 s apart */
  const reasonsContainerV = {
    hidden:  {},
    visible: { transition: { staggerChildren: 0.10 } },
  }
  const reasonItemV = {
    hidden:  { opacity: 0, y: reduced ? 0 : 20 },
    visible: {
      opacity: 1, y: 0,
      transition: { duration: 0.72, ease: EASE },
    },
  }

  return (
    <section
      aria-labelledby="why-trust-heading"
      style={{
        background:    'linear-gradient(180deg, #FAF8F2 0%, #F6F3EA 100%)',
        paddingTop:    'clamp(5rem, 10vw, 9rem)',
        paddingBottom: 'clamp(5rem, 10vw, 9rem)',
      }}
    >
      <Container>

        {/* ── INTRO BLOCK — sequential stagger ─────────────────────────────
         *  Parent motion.div triggers once; eyebrow, headline, lead each
         *  carry introItemV and reveal ~0.12 s apart.
         *  The 55% / 45% grid only activates ≥1024 px (lg:grid class).
         * ──────────────────────────────────────────────────────────────── */}
        <motion.div
          className="lg:grid"
          style={{
            gridTemplateColumns: '55% 45%',
            marginBottom: 'clamp(3.5rem, 7vw, 6rem)',
          }}
          variants={introContainerV}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <div>
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
              Why couples choose us
            </motion.p>

            <motion.h2
              id="why-trust-heading"
              variants={introItemV}
              style={{
                fontFamily:            'var(--font-display)',
                fontSize:              'clamp(2rem, 3vw + 0.5rem, 3.25rem)',
                fontWeight:            500,
                lineHeight:            1.1,
                letterSpacing:         '-0.024em',
                color:                 '#1C2A48',
                fontVariationSettings: '"opsz" 48',
                marginBottom:          '1.75rem',
              }}
            >
              Trust isn&apos;t claimed. It&apos;s earned, quietly, over time.
            </motion.h2>

            <motion.p
              variants={introItemV}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize:   'clamp(1.125rem, 1vw + 0.5rem, 1.25rem)',
                lineHeight: 1.72,
                color:      '#5A6173',
                maxWidth:   '50ch',
              }}
            >
              For over twenty years, couples have come to us confused and afraid — and left
              with clarity. Here&apos;s what they say makes the difference.
            </motion.p>
          </div>
          {/* Right column: open breathing room — intentional on desktop */}
        </motion.div>

        {/* ── THREE REASONS — staggered editorial list ──────────────────────
         *  Container triggers once as the list enters view. Each motion.div
         *  row carries reasonItemV so they reveal in sequence (~0.10 s gap).
         *  The indented class only applies ≥1024 px — mobile stacks cleanly.
         * ──────────────────────────────────────────────────────────────── */}
        <motion.div
          variants={reasonsContainerV}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          style={{ borderTop: '1px solid rgba(190,182,170,0.26)' }}
        >
          {REASONS.map((r) => (
            <motion.div
              key={r.num}
              variants={reasonItemV}
              className={r.indented ? 'lg:pl-[28%]' : ''}
              style={{
                paddingTop:    'clamp(2.5rem, 5vw, 3.75rem)',
                paddingBottom: 'clamp(2.5rem, 5vw, 3.75rem)',
                borderBottom:  '1px solid rgba(190,182,170,0.26)',
              }}
            >
              <ReasonContent num={r.num} headline={r.headline} body={r.body} />
            </motion.div>
          ))}
        </motion.div>

        {/* ── QUIET PROOF — credentials as calm support ─────────────────────
         *  Outer div is the IntersectionObserver anchor (always in flow,
         *  no opacity on it) so count-up fires at the right scroll position.
         *  Stat line: simple fade-in + count-up numbers.
         *  Gestosis note: delayed reveal with a gentle 0.98→1 scale-settle
         *    — the "placed-down" feel, calm and weighty, not flashy.
         * ──────────────────────────────────────────────────────────────── */}
        <div
          ref={proofRef}
          style={{
            paddingTop:    'clamp(3rem, 6vw, 5rem)',
            display:       'flex',
            flexDirection: 'column',
            gap:           '2rem',
          }}
        >
          {/* Stat cluster */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.72, ease: EASE }}
            style={{
              fontFamily:    'var(--font-body)',
              fontSize:      '0.9375rem',
              lineHeight:    1.65,
              color:         '#8A8897',
              letterSpacing: '0.01em',
            }}
          >
            {yearsCount}+ years of care
            <span aria-hidden="true" style={{ margin: '0 0.75rem', opacity: 0.45 }}>·</span>
            {couplesCount >= 1000
              ? couplesCount.toLocaleString('en-IN')
              : couplesCount}+ couples guided
            <span aria-hidden="true" style={{ margin: '0 0.75rem', opacity: 0.45 }}>·</span>
            Pune-trained specialists
          </motion.p>

          {/* Gestosis Score note
           *  scale 0.98 → 1 gives the "placed down" feeling.
           *  Reduced motion: initial/animate skip the transform and scale,
           *  leaving only an opacity fade (the scale: 1 target is harmless). */}
          <motion.div
            role="figure"
            aria-label="Clinical distinction"
            initial={{
              opacity: 0,
              y:       reduced ? 0 : 12,
              scale:   reduced ? 1 : 0.98,
            }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.82, delay: 0.22, ease: EASE }}
            style={{
              margin:       0,
              padding:      '1.25rem 1.5rem',
              maxWidth:     '52ch',
              borderLeft:   '2px solid rgba(100,120,176,0.42)',
              background:   'rgba(100,120,176,0.055)',
              borderRadius: '0 8px 8px 0',
            }}
          >
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize:   '1rem',
              lineHeight: 1.7,
              color:      '#334B80',
              margin:     0,
            }}>
              Our lead specialist developed the HDP Gestosis Score — now adopted by
              India&apos;s National Health Mission.
            </p>
          </motion.div>
        </div>

      </Container>
    </section>
  )
}
