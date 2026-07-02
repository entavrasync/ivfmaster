'use client'

import type { JSX } from 'react'
import { motion } from 'motion/react'
import { useTranslations } from 'next-intl'
import { Container } from '@/components/layout/Container'
import { Pressable } from '@/components/motion/Pressable'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { Link } from '@/i18n/navigation'

const EASE = [0.22, 1, 0.36, 1] as const

/* ─── Types ──────────────────────────────────────────────────────────────── */

type Step = { id: string; num: string; heading: string; body: string }

/* ─── ABAB card rhythm ────────────────────────────────────────────────────── */

const CARD_VARIANTS = [
  /* A — warm ivory + blush */
  {
    bg:       '#FFFDF9',
    accent:   'rgba(226,132,156,0.30)',
    numColor: 'rgba(226,132,156,0.74)',
    glowBg:   'rgba(226,132,156,0.20)',
    illColor: 'rgba(200,96,128,0.42)',
  },
  /* B — faint lavender + periwinkle */
  {
    bg:       'rgba(247,245,255,0.92)',
    accent:   'rgba(100,120,176,0.24)',
    numColor: 'rgba(100,120,176,0.68)',
    glowBg:   'rgba(100,120,176,0.14)',
    illColor: 'rgba(72,96,160,0.38)',
  },
]

/* ─── Per-step line illustrations ─────────────────────────────────────────── */

const ILLUSTRATIONS: Record<string, (color: string) => JSX.Element> = {
  stimulation: (c) => (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 26 C10 22 10 10 16 6 C22 10 22 22 16 26Z"
        stroke={c} strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 6 C14 3 11 3 10 5"
        stroke={c} strokeWidth="1.3"  strokeLinecap="round" />
      <path d="M16 6 C18 3 21 3 22 5"
        stroke={c} strokeWidth="1.3"  strokeLinecap="round" />
    </svg>
  ),
  retrieval: (c) => (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 24 C9 24 8 8 16 5 C24 8 23 24 16 24Z"
        stroke={c} strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 11 Q16 9 20 11"
        stroke={c} strokeWidth="1.1"  strokeLinecap="round" opacity={0.6} />
    </svg>
  ),
  fertilisation: (c) => (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="16" r="6.5" stroke={c} strokeWidth="1.45" />
      <circle cx="20" cy="16" r="6.5" stroke={c} strokeWidth="1.45" />
    </svg>
  ),
  culture: (c) => (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="13" cy="13" r="4.5" stroke={c} strokeWidth="1.35" />
      <circle cx="20" cy="13" r="4.5" stroke={c} strokeWidth="1.35" />
      <circle cx="13" cy="21" r="4.5" stroke={c} strokeWidth="1.35" />
      <circle cx="20" cy="21" r="4.5" stroke={c} strokeWidth="1.35" />
    </svg>
  ),
  transfer: (c) => (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 13 C11 5 21 5 25 13"
        stroke={c} strokeWidth="1.45" strokeLinecap="round" />
      <line x1="16" y1="13" x2="16" y2="22"
        stroke={c} strokeWidth="1.4"  strokeLinecap="round" />
      <circle cx="16" cy="25" r="2.5" stroke={c} strokeWidth="1.3" />
    </svg>
  ),
  wait: (c) => (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 26 Q6 18 6 12 Q6 6 11 6 Q14 6 16 9 Q18 6 21 6 Q26 6 26 12 Q26 18 16 26Z"
        stroke={c} strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
}

/* ─── Horizontal connector (desktop rail) ────────────────────────────────── */

function StepConnector() {
  return (
    <div
      style={{
        alignItems:     'center',
        background:     'rgba(113,135,196,0.16)',
        border:         '1px solid rgba(113,135,196,0.34)',
        borderRadius:   '999px',
        boxShadow:      '0 0 10px rgba(100,120,176,0.72), 0 0 24px rgba(100,120,176,0.48)',
        display:        'flex',
        height:         '38px',
        justifyContent: 'center',
        width:          '38px',
      }}
    >
      <svg width="22" height="22" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path
          d="M4 16H28M28 16L19 7M28 16L19 25"
          stroke="#647BBE"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}

/* ─── Vertical connector (mobile stack) ─────────────────────────────────── */

function VerticalConnector() {
  return (
    <div
      aria-hidden="true"
      style={{ display: 'flex', justifyContent: 'center', padding: '0.125rem 0' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: '1px', height: '28px', background: 'rgba(113,135,196,0.30)' }} />
        <div
          style={{
            width:           '32px',
            height:          '32px',
            borderRadius:    '50%',
            background:      'rgba(113,135,196,0.13)',
            border:          '1px solid rgba(113,135,196,0.30)',
            boxShadow:       '0 0 10px rgba(100,120,176,0.52), 0 0 22px rgba(100,120,176,0.30)',
            display:         'flex',
            alignItems:      'center',
            justifyContent:  'center',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 32 32" fill="none">
            <path
              d="M16 6V26M16 26L7 17M16 26L25 17"
              stroke="#647BBE"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div style={{ width: '1px', height: '28px', background: 'rgba(113,135,196,0.30)' }} />
      </div>
    </div>
  )
}

/* ─── Card interior — reused by both layout trees ────────────────────────── */

type CardVariant = (typeof CARD_VARIANTS)[number]

function CardInterior({
  step,
  v,
  IllFn,
}: Readonly<{ step: Step; v: CardVariant; IllFn: (c: string) => JSX.Element }>) {
  return (
    <>
      {/* Warm radial glow behind number */}
      <div
        aria-hidden="true"
        style={{
          position:      'absolute',
          top:           0,
          left:          0,
          width:         '130px',
          height:        '130px',
          borderRadius:  '50%',
          background:    `radial-gradient(circle, ${v.glowBg} 0%, transparent 65%)`,
          pointerEvents: 'none',
        }}
      />

      {/* Number + illustration */}
      <div
        style={{
          position:       'relative',
          zIndex:         1,
          display:        'flex',
          alignItems:     'flex-start',
          justifyContent: 'space-between',
          marginBottom:   '0.875rem',
        }}
      >
        <span
          aria-hidden="true"
          style={{
            fontFamily:            'var(--font-display)',
            fontSize:              'clamp(2.5rem, 3vw, 3rem)',
            fontWeight:            500,
            lineHeight:            1,
            letterSpacing:         '-0.03em',
            color:                 v.numColor,
            fontVariationSettings: '"opsz" 48',
          }}
        >
          {step.num}
        </span>

        <div
          aria-hidden="true"
          style={{ width: '36px', height: '36px', flexShrink: 0, marginTop: '2px' }}
        >
          {IllFn(v.illColor)}
        </div>
      </div>

      {/* Heading */}
      <h3
        style={{
          fontFamily:            'var(--font-display)',
          fontSize:              'clamp(1.0625rem, 0.7vw + 0.4rem, 1.125rem)',
          fontWeight:            500,
          lineHeight:            1.25,
          letterSpacing:         '-0.015em',
          color:                 '#1C2A48',
          fontVariationSettings: '"opsz" 28',
          marginBottom:          '0.5rem',
        }}
      >
        {step.heading}
      </h3>

      {/* Accent rule */}
      <div
        aria-hidden="true"
        style={{
          height:       '1px',
          background:   v.accent,
          opacity:      0.65,
          marginBottom: '0.75rem',
          flexShrink:   0,
        }}
      />

      {/* Body */}
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize:   'clamp(0.9375rem, 0.5vw + 0.5rem, 1rem)',
          lineHeight: 1.68,
          color:      '#5A6173',
          margin:     0,
          flex:       1,
        }}
      >
        {step.body}
      </p>
    </>
  )
}

/* ─── Component ──────────────────────────────────────────────────────────── */

export function UnderstandingIVF() {
  const reduced = useReducedMotion()
  const t       = useTranslations('UnderstandingIVF')

  const steps: Step[] = [
    { id: 'stimulation',   num: '01', heading: t('steps.stimulation.heading'),   body: t('steps.stimulation.body')   },
    { id: 'retrieval',     num: '02', heading: t('steps.retrieval.heading'),     body: t('steps.retrieval.body')     },
    { id: 'fertilisation', num: '03', heading: t('steps.fertilisation.heading'), body: t('steps.fertilisation.body') },
    { id: 'culture',       num: '04', heading: t('steps.culture.heading'),       body: t('steps.culture.body')       },
    { id: 'transfer',      num: '05', heading: t('steps.transfer.heading'),      body: t('steps.transfer.body')      },
    { id: 'wait',          num: '06', heading: t('steps.wait.heading'),          body: t('steps.wait.body')          },
  ]

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
    visible: { transition: { staggerChildren: reduced ? 0 : 0.09 } },
  }
  const cardV = {
    hidden:  (red: boolean) => ({ opacity: red ? 1 : 0, y: red ? 0 : 22, x: red ? 0 : 10 }),
    visible: { opacity: 1, y: 0, x: 0, transition: { duration: 0.58, ease: EASE } },
  }

  return (
    <section
      aria-labelledby="understanding-ivf-heading"
      style={{
        background:    'linear-gradient(180deg, #FAF8F2 0%, #F5F1E9 100%)',
        paddingTop:    'clamp(5rem, 10vw, 9rem)',
        paddingBottom: 'clamp(5rem, 10vw, 9rem)',
      }}
    >
      {/* ── Intro ─────────────────────────────────────────────────────── */}
      <Container>
        <motion.div
          variants={introContainerV}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          style={{ marginBottom: 'clamp(3.5rem, 7vw, 5.5rem)', textAlign: 'left' }}
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
            id="understanding-ivf-heading"
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
              maxWidth:              '28ch',
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
              maxWidth:   '52ch',
            }}
          >
            {t('body')}
          </motion.p>
        </motion.div>
      </Container>

      {/* ── MOBILE: vertical stack (hidden lg+) ───────────────────────── */}
      <Container>
        <div className="lg:hidden">
          <div style={{ display: 'flex', flexDirection: 'column' }}>
          {steps.map((step, i) => {
            const stepNum = parseInt(step.num, 10)
            const v       = stepNum % 2 === 1 ? CARD_VARIANTS[0] : CARD_VARIANTS[1]
            const IllFn   = ILLUSTRATIONS[step.id]
            const isLast  = i === steps.length - 1

            return (
              <div key={step.id}>
                <motion.div
                  initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.55, ease: EASE }}
                  style={{
                    position:      'relative',
                    overflow:      'hidden',
                    display:       'flex',
                    flexDirection: 'column',
                    background:    v.bg,
                    borderRadius:  '18px',
                    borderTop:     `2px solid ${v.accent}`,
                    boxShadow:     '0 16px 36px -16px rgba(46,79,142,0.18)',
                    padding:       '1.5rem',
                    width:         '100%',
                  }}
                >
                  <CardInterior step={step} v={v} IllFn={IllFn} />
                </motion.div>

                {!isLast && <VerticalConnector />}
              </div>
            )
          })}
          </div>
        </div>
      </Container>

      {/* ── DESKTOP: horizontal rail (hidden below lg) ────────────────── */}
      <Container size="full">
        <div
          className="hidden lg:block overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ paddingBottom: '2rem', paddingTop: '0.5rem' }}
        >
          <motion.div
            variants={railV}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="flex flex-nowrap pl-4 items-stretch justify-around gap-0"
            style={{ minWidth: 'max-content', width: '100%' }}
          >
            {steps.flatMap((step) => {
              const stepNum = parseInt(step.num, 10)
              const v       = stepNum % 2 === 1 ? CARD_VARIANTS[0] : CARD_VARIANTS[1]
              const hasNext = stepNum < steps.length
              const IllFn   = ILLUSTRATIONS[step.id]

              const card = (
                <motion.div
                  key={step.id}
                  custom={reduced}
                  variants={cardV}
                  className="min-w-0 snap-start"
                  style={{
                    display:       'flex',
                    flex:          '0 0 clamp(220px, 13vw, 244px)',
                    flexDirection: 'column',
                    position:      'relative',
                    overflow:      'hidden',
                    background:    v.bg,
                    borderRadius:  '18px',
                    borderTop:     `2px solid ${v.accent}`,
                    boxShadow:     '0 22px 44px -24px rgba(46,79,142,0.20)',
                    maxWidth:      '100%',
                    padding:       'clamp(1.25rem, 1.6vw, 1.5rem)',
                    margin:        '0 clamp(0.75rem, 1vw, 1rem) 0 clamp(0.75rem, 1vw, 1rem)',
                  }}
                >
                  <CardInterior step={step} v={v} IllFn={IllFn} />
                </motion.div>
              )

              if (!hasNext) return [card]

              const connector = (
                <div
                  key={`connector-${step.id}`}
                  aria-hidden="true"
                  style={{
                    alignItems:     'center',
                    display:        'flex',
                    flex:           '0 0 42px',
                    justifyContent: 'center',
                  }}
                >
                  <StepConnector />
                </div>
              )

              return [card, connector]
            })}
          </motion.div>
        </div>
      </Container>

      {/* ── Close / CTA ───────────────────────────────────────────────── */}
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
            alignItems:    'center',
            gap:           '1.25rem',
            textAlign:     'center',
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

          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize:   '0.8125rem',
              lineHeight: 1.6,
              color:      '#8A8897',
              margin:     0,
            }}
          >
            {t('ctaSub')}
          </p>
        </motion.div>
      </Container>
    </section>
  )
}
