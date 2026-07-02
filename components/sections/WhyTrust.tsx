'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'motion/react'
import { useTranslations } from 'next-intl'
import { Container } from '@/components/layout/Container'
import { Pressable } from '@/components/motion/Pressable'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { Link } from '@/i18n/navigation'

const EASE = [0.22, 1, 0.36, 1] as const

/* ─── Count-up ────────────────────────────────────────────────────────────── */

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

/* ─── Component ──────────────────────────────────────────────────────────── */

export function WhyTrust() {
  const reduced = useReducedMotion()
  const t       = useTranslations('WhyTrust')

  const conversation = [
    { side: 'left'  as const, label: t('card0.label'), worry: t('card0.worry'), response: t('card0.response') },
    { side: 'right' as const, label: t('card1.label'), worry: t('card1.worry'), response: t('card1.response') },
    { side: 'left'  as const, label: t('card2.label'), worry: t('card2.worry'), response: t('card2.response') },
  ]

  /* Proof anchor: always-visible wrapper so IntersectionObserver fires
   * before the motion.p has faded in — count-up starts at the right moment. */
  const proofRef    = useRef<HTMLDivElement>(null)
  const proofInView = useInView(proofRef, { once: true, margin: '-60px' })
  const yearsCount   = useCountUp(20,   proofInView, reduced)
  const couplesCount = useCountUp(2000, proofInView, reduced)

  const statLine1 = `${yearsCount}+ ${t('statYearsLabel')}`
  const statLine2 = `${couplesCount >= 1000 ? couplesCount.toLocaleString('en-IN') : couplesCount}+ ${t('statCouplesLabel')}`
  const statLine3 = t('statSpecialists')

  /* Intro stagger: eyebrow → headline → lead, 0.12 s apart */
  const introContainerV = {
    hidden:  {},
    visible: { transition: { staggerChildren: 0.12 } },
  }
  const introItemV = {
    hidden:  { opacity: 0, y: reduced ? 0 : 18 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.78, ease: EASE } },
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

        {/* ── INTRO BLOCK — left-aligned, sequential stagger ─────────────── */}
        <motion.div
          variants={introContainerV}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          style={{ marginBottom: 'clamp(3.5rem, 7vw, 6rem)' }}
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
              maxWidth:              '24ch',
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

        {/* ── CONVERSATIONAL CARDS ─────────────────────────────────────────
         *  Three alternating cards: LEFT · RIGHT · LEFT.
         *  Each slides in from its respective side (x ±40 → 0) + fade.
         *  On desktop: 56% max-width; right card pushed by ml-auto.
         *  On mobile: full width, stacked, slide direction preserved.
         *  Reduced motion: pure fade, no x-slide.
         * ──────────────────────────────────────────────────────────────── */}
        <div
          style={{
            display:       'flex',
            flexDirection: 'column',
            gap:           'clamp(1.75rem, 3.5vw, 2.75rem)',
            marginBottom:  'clamp(4rem, 8vw, 7rem)',
          }}
        >
          {conversation.map((card) => (
            <motion.div
              key={card.label}
              initial={{
                opacity: 0,
                x:       reduced ? 0 : card.side === 'left' ? -40 : 40,
              }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.70, ease: EASE }}
              className={[
                'w-full lg:max-w-[56%]',
                card.side === 'right' ? 'lg:ml-auto' : '',
              ].join(' ')}
              style={{
                background:   '#FFFDF9',
                borderRadius: '20px',
                boxShadow:    '0 20px 40px -24px rgba(46,79,142,0.18)',
                padding:      'clamp(1.75rem, 3vw, 2rem)',
              }}
            >
              {/* Card label */}
              <p style={{
                fontFamily:    'var(--font-body)',
                fontSize:      '0.75rem',
                fontWeight:    700,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color:         '#97A6D2',
                marginBottom:  '1.25rem',
              }}>
                {card.label}
              </p>

              {/* Worry quote — display font italic + blush left accent */}
              <div style={{
                borderLeft:   '2px solid rgba(226,132,156,0.55)',
                paddingLeft:  '1rem',
                marginBottom: '1.25rem',
              }}>
                <p style={{
                  fontFamily:            'var(--font-display)',
                  fontStyle:             'italic',
                  fontSize:              'clamp(1.125rem, 1.2vw + 0.4rem, 1.3125rem)',
                  lineHeight:            1.55,
                  letterSpacing:         '-0.01em',
                  color:                 '#2E4F8E',
                  fontVariationSettings: '"opsz" 36',
                }}>
                  &ldquo;{card.worry}&rdquo;
                </p>
              </div>

              {/* Warm response */}
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize:   'clamp(1rem, 0.9vw + 0.5rem, 1.125rem)',
                lineHeight: 1.72,
                color:      '#5A6173',
              }}>
                {card.response}
              </p>
            </motion.div>
          ))}
        </div>

        {/* ── QUIET PROOF ───────────────────────────────────────────────────
         *  Stat cluster: fade-in with live count-up.
         *  Gestosis note: scale 0.98→1 settle — "placed down" feel.
         * ──────────────────────────────────────────────────────────────── */}
        <div
          ref={proofRef}
          style={{
            display:       'flex',
            flexDirection: 'column',
            gap:           '2rem',
            marginBottom:  'clamp(3rem, 6vw, 5rem)',
          }}
        >
          <motion.div
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
            {/* Mobile: vertical dot list */}
            <ul className="flex flex-col lg:hidden" style={{
              listStyle: 'none',
              padding:   0,
              margin:    0,
              gap:       '0.5rem',
            }}>
              {[statLine1, statLine2, statLine3].map((item, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                  <span aria-hidden="true" style={{ opacity: 0.5 }}>·</span>
                  {item}
                </li>
              ))}
            </ul>

            {/* Desktop: inline with separator dots */}
            <p className="hidden lg:block" style={{ margin: 0 }}>
              {statLine1}
              <span aria-hidden="true" style={{ margin: '0 0.75rem', opacity: 0.45 }}>·</span>
              {statLine2}
              <span aria-hidden="true" style={{ margin: '0 0.75rem', opacity: 0.45 }}>·</span>
              {statLine3}
            </p>
          </motion.div>

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
              {t('gestosisNote')}
            </p>
          </motion.div>
        </div>

        {/* ── CTA — fades + drops in from the TOP ───────────────────────────
         *  y: -30 → 0 is the opposite of the usual rise-from-below, giving
         *  this block a distinct "placed down" entrance from above.
         *  Button: solid blush pill, soft colored shadow, Pressable spring.
         *  Mobile: full-width pill. Desktop: left-aligned inline.
         * ──────────────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: reduced ? 0 : -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.72, ease: EASE }}
          style={{
            display:       'flex',
            flexDirection: 'column',
            alignItems:    'flex-start',
            gap:           '1rem',
          }}
        >
          <Pressable className="w-full lg:w-auto">
            <Link
              href="/contact"
              className="block text-center lg:inline-block"
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

          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize:   '0.875rem',
            lineHeight: 1.6,
            color:      '#8A8897',
          }}>
            {t('ctaSub')}
          </p>
        </motion.div>

      </Container>
    </section>
  )
}
