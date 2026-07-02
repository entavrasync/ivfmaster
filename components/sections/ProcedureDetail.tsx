'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ArrowLeft, ArrowRight, Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Container } from '@/components/layout/Container'
import { Pressable } from '@/components/motion/Pressable'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { type Procedure } from '@/lib/procedures'
import { ProcVisual } from './ProcedureVisuals'

const EASE        = [0.22, 1, 0.36, 1] as const
const SHADOW_REST = '0 20px 44px -24px rgba(46,79,142,0.14), 0 4px 10px -4px rgba(46,79,142,0.05)'
const SHADOW_LIFT = '0 36px 68px -12px rgba(46,79,142,0.24), 0 10px 22px -8px rgba(46,79,142,0.12)'

/* ─── Hero image placeholder ─────────────────────────────────────────────── */

function HeroImage({ proc, photoComingSoon }: { proc: Procedure; photoComingSoon: string }) {
  return (
    <div
      aria-hidden="true"
      style={{
        width:        '100%',
        aspectRatio:  '5 / 4',
        borderRadius: '20px',
        background:   'linear-gradient(148deg, #ECE8F7 0%, #F5F2FB 40%, #EEE9F4 65%, #F8F5FD 100%)',
        boxShadow:    SHADOW_REST,
        position:     'relative',
        overflow:     'hidden',
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position:     'absolute',
          top:          '-60px',
          right:        '-60px',
          width:        '240px',
          height:       '240px',
          borderRadius: '50%',
          background:   proc.accentBg,
          opacity:      0.9,
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position:     'absolute',
          bottom:       '-40px',
          left:         '-40px',
          width:        '190px',
          height:       '190px',
          borderRadius: '50%',
          background:   proc.accentBg,
          opacity:      0.65,
        }}
      />
      <div
        style={{
          position:       'absolute',
          inset:          0,
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
        }}
      >
        <ProcVisual id={proc.slug} featured />
      </div>
      <p
        style={{
          position:      'absolute',
          bottom:        '1.125rem',
          left:          0,
          right:         0,
          textAlign:     'center',
          fontFamily:    'var(--font-body)',
          fontSize:      '0.6875rem',
          letterSpacing: '0.06em',
          color:         'rgba(28,42,72,0.30)',
          margin:        0,
        }}
      >
        {photoComingSoon}
      </p>
    </div>
  )
}

/* ─── Step image placeholder ─────────────────────────────────────────────── */

const STEP_GRADIENTS = [
  'linear-gradient(148deg, rgba(226,132,156,0.10) 0%, #F5F2FB 50%, #EDE9F7 100%)',
  'linear-gradient(148deg, rgba(100,120,200,0.09) 0%, #F0EEF8 50%, #EAE8F5 100%)',
  'linear-gradient(148deg, rgba(148,100,200,0.08) 0%, #F3F0F9 50%, #EDE9F6 100%)',
  'linear-gradient(148deg, rgba(72,140,172,0.09)  0%, #F0EFF8 50%, #EAECF5 100%)',
  'linear-gradient(148deg, rgba(226,132,156,0.08) 0%, #F4F2FA 50%, #EDE9F7 100%)',
  'linear-gradient(148deg, rgba(100,120,200,0.07) 0%, #F0EEF8 50%, #EAE8F5 100%)',
]

function StepImage({
  index,
  proc,
  photoComingSoon,
}: {
  index:           number
  proc:            Procedure
  photoComingSoon: string
}) {
  return (
    <div
      aria-hidden="true"
      style={{
        width:          '100%',
        aspectRatio:    '4 / 3',
        borderRadius:   '20px',
        background:     STEP_GRADIENTS[index % STEP_GRADIENTS.length],
        boxShadow:      SHADOW_REST,
        position:       'relative',
        overflow:       'hidden',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
      }}
    >
      <span
        style={{
          fontFamily:            'var(--font-display)',
          fontSize:              '7rem',
          fontWeight:            500,
          fontVariationSettings: '"opsz" 72',
          lineHeight:            1,
          color:                 proc.accentEdge,
          opacity:               0.20,
          userSelect:            'none',
          pointerEvents:         'none',
        }}
      >
        {String(index + 1).padStart(2, '0')}
      </span>
      <p
        style={{
          position:      'absolute',
          bottom:        '1rem',
          left:          0,
          right:         0,
          textAlign:     'center',
          fontFamily:    'var(--font-body)',
          fontSize:      '0.6875rem',
          letterSpacing: '0.06em',
          color:         'rgba(28,42,72,0.28)',
          margin:        0,
        }}
      >
        {photoComingSoon}
      </p>
    </div>
  )
}

/* ─── Hero section ───────────────────────────────────────────────────────── */

function HeroSection({
  proc,
  reduced,
  backLabel,
  photoComingSoon,
}: {
  proc:            Procedure
  reduced:         boolean
  backLabel:       string
  photoComingSoon: string
}) {
  return (
    <section>
      <Container>
        <div
          style={{
            paddingTop:    'clamp(7rem, 11vw, 9rem)',
            paddingBottom: 'clamp(4rem, 7vw, 6rem)',
          }}
        >
          {/* Back link */}
          <motion.div
            initial={{ opacity: reduced ? 1 : 0, x: reduced ? 0 : -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.50, ease: EASE }}
          >
            <Link
              href="/procedures"
              style={{
                display:        'inline-flex',
                alignItems:     'center',
                gap:            '0.375rem',
                fontFamily:     'var(--font-body)',
                fontSize:       '0.875rem',
                fontWeight:     500,
                color:          'rgba(28,42,72,0.50)',
                textDecoration: 'none',
                marginBottom:   'clamp(2.5rem, 4vw, 3.5rem)',
                transition:     'color 0.18s ease',
              }}
              className="hover:text-[#1C2A48]"
            >
              <ArrowLeft size={14} strokeWidth={2} />
              {backLabel}
            </Link>
          </motion.div>

          {/* Two-column grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-10 lg:gap-16">

            {/* Left — text */}
            <motion.div
              initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.80, ease: EASE }}
            >
              <p
                style={{
                  fontFamily:    'var(--font-body)',
                  fontSize:      '0.6875rem',
                  fontWeight:    600,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color:         'rgba(100,120,200,0.88)',
                  margin:        '0 0 1rem',
                }}
              >
                {proc.fullName}
              </p>

              <h1
                style={{
                  fontFamily:            'var(--font-display)',
                  fontSize:              'clamp(2.75rem, 5vw + 0.25rem, 4.25rem)',
                  fontWeight:            500,
                  lineHeight:            1.05,
                  letterSpacing:         '-0.032em',
                  color:                 '#1C2A48',
                  fontVariationSettings: '"opsz" 48',
                  margin:                '0 0 1.25rem',
                }}
              >
                {proc.name}
              </h1>

              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize:   'clamp(1.0625rem, 0.5vw + 0.75rem, 1.25rem)',
                  lineHeight: 1.78,
                  color:      'rgba(28,42,72,0.66)',
                  margin:     '0 0 2.25rem',
                  maxWidth:   '48ch',
                }}
              >
                {proc.heroDescription}
              </p>

              {/* Quick facts */}
              <div
                style={{
                  display:    'flex',
                  flexWrap:   'wrap',
                  gap:        '0.75rem 2.5rem',
                  borderTop:  '1px solid rgba(216,204,190,0.50)',
                  paddingTop: '1.75rem',
                }}
              >
                {proc.quickFacts.map((fact) => (
                  <div key={fact.label}>
                    <p
                      style={{
                        fontFamily:    'var(--font-body)',
                        fontSize:      '0.6875rem',
                        fontWeight:    600,
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        color:         'rgba(148,164,196,0.80)',
                        margin:        '0 0 0.25rem',
                      }}
                    >
                      {fact.label}
                    </p>
                    <p
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize:   '1rem',
                        fontWeight: 500,
                        lineHeight: 1.4,
                        color:      '#1C2A48',
                        margin:     0,
                      }}
                    >
                      {fact.value}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right — image */}
            <motion.div
              initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.90, ease: EASE, delay: reduced ? 0 : 0.10 }}
            >
              <HeroImage proc={proc} photoComingSoon={photoComingSoon} />
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  )
}

/* ─── Who it's for ───────────────────────────────────────────────────────── */

function WhoItsForSection({
  proc,
  reduced,
  isRightLabel,
}: {
  proc:         Procedure
  reduced:      boolean
  isRightLabel: string
}) {
  return (
    <section
      style={{
        borderTop:    '1px solid rgba(216,204,190,0.50)',
        borderBottom: '1px solid rgba(216,204,190,0.50)',
        background:   'rgba(236,234,244,0.28)',
      }}
    >
      <Container>
        <motion.div
          initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.72, ease: EASE }}
          style={{
            paddingTop:    'clamp(4rem, 7vw, 5.5rem)',
            paddingBottom: 'clamp(4rem, 7vw, 5.5rem)',
          }}
        >
          <p
            style={{
              fontFamily:    'var(--font-body)',
              fontSize:      '0.6875rem',
              fontWeight:    600,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color:         'rgba(100,120,200,0.88)',
              margin:        '0 0 1rem',
            }}
          >
            {isRightLabel}
          </p>

          <h2
            style={{
              fontFamily:            'var(--font-display)',
              fontSize:              'clamp(1.75rem, 2.5vw + 0.5rem, 2.5rem)',
              fontWeight:            500,
              lineHeight:            1.18,
              letterSpacing:         '-0.022em',
              color:                 '#1C2A48',
              fontVariationSettings: '"opsz" 36',
              margin:                '0 0 2.5rem',
              maxWidth:              '28ch',
            }}
          >
            {proc.name} may be right for you if&hellip;
          </h2>

          <ul
            style={{
              listStyle:           'none',
              padding:             0,
              margin:              0,
              display:             'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 36ch), 1fr))',
              gap:                 '0.875rem 3rem',
            }}
          >
            {proc.whoItsFor.map((item) => (
              <li
                key={item}
                style={{
                  display:    'flex',
                  alignItems: 'baseline',
                  gap:        '0.75rem',
                  fontFamily: 'var(--font-body)',
                  fontSize:   'clamp(1rem, 0.4vw + 0.75rem, 1.125rem)',
                  lineHeight: 1.65,
                  color:      'rgba(28,42,72,0.72)',
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    color:      proc.accentEdge,
                    fontWeight: 600,
                    flexShrink: 0,
                    fontSize:   '1.0625rem',
                  }}
                >
                  &mdash;
                </span>
                {item}
              </li>
            ))}
          </ul>
        </motion.div>
      </Container>
    </section>
  )
}

/* ─── Process — alternating layout ──────────────────────────────────────── */

function ProcessSection({
  proc,
  reduced,
  processEyebrow,
  processHeading,
  photoComingSoon,
}: {
  proc:            Procedure
  reduced:         boolean
  processEyebrow:  string
  processHeading:  string
  photoComingSoon: string
}) {
  return (
    <section>
      <Container>
        <div
          style={{
            paddingTop:    'clamp(4.5rem, 8vw, 6.5rem)',
            paddingBottom: 'clamp(4.5rem, 8vw, 6.5rem)',
          }}
        >
          <motion.div
            initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.70, ease: EASE }}
            style={{ marginBottom: 'clamp(3rem, 5vw, 4.5rem)' }}
          >
            <p
              style={{
                fontFamily:    'var(--font-body)',
                fontSize:      '0.6875rem',
                fontWeight:    600,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color:         'rgba(100,120,200,0.88)',
                margin:        '0 0 1rem',
              }}
            >
              {processEyebrow}
            </p>
            <h2
              style={{
                fontFamily:            'var(--font-display)',
                fontSize:              'clamp(1.75rem, 2.5vw + 0.5rem, 2.5rem)',
                fontWeight:            500,
                lineHeight:            1.18,
                letterSpacing:         '-0.022em',
                color:                 '#1C2A48',
                fontVariationSettings: '"opsz" 36',
                margin:                0,
              }}
            >
              {processHeading}
            </h2>
          </motion.div>

          {/* Steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(3.5rem, 6vw, 5rem)' }}>
            {proc.process.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.72, ease: EASE }}
              >
                <div
                  className={`flex flex-col gap-8 lg:gap-14 lg:items-center ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
                >
                  {/* Image — always first child (top on mobile) */}
                  <div className="w-full lg:w-1/2">
                    <StepImage index={i} proc={proc} photoComingSoon={photoComingSoon} />
                  </div>

                  {/* Text */}
                  <div className="w-full lg:w-1/2">
                    <div
                      style={{
                        display:      'flex',
                        alignItems:   'baseline',
                        gap:          '1rem',
                        marginBottom: '1.125rem',
                      }}
                    >
                      <span
                        style={{
                          fontFamily:            'var(--font-display)',
                          fontSize:              '2.75rem',
                          fontWeight:            500,
                          fontVariationSettings: '"opsz" 48',
                          lineHeight:            1,
                          color:                 proc.accentEdge,
                          letterSpacing:         '-0.03em',
                          flexShrink:            0,
                        }}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <h3
                        style={{
                          fontFamily:            'var(--font-display)',
                          fontSize:              'clamp(1.375rem, 1.5vw + 0.75rem, 1.875rem)',
                          fontWeight:            500,
                          lineHeight:            1.22,
                          letterSpacing:         '-0.018em',
                          color:                 '#1C2A48',
                          fontVariationSettings: '"opsz" 28',
                          margin:                0,
                        }}
                      >
                        {step.title}
                      </h3>
                    </div>

                    <p
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize:   'clamp(1rem, 0.4vw + 0.75rem, 1.125rem)',
                        lineHeight: 1.82,
                        color:      'rgba(28,42,72,0.68)',
                        margin:     0,
                        maxWidth:   '52ch',
                      }}
                    >
                      {step.detail}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}

/* ─── What to expect ─────────────────────────────────────────────────────── */

function WhatToExpectSection({
  proc,
  reduced,
  whatToExpect,
  honestExp,
}: {
  proc:         Procedure
  reduced:      boolean
  whatToExpect: string
  honestExp:    string
}) {
  return (
    <section
      style={{
        borderTop:  '1px solid rgba(216,204,190,0.50)',
        background: '#FBF7F1',
      }}
    >
      <Container>
        <motion.div
          initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.70, ease: EASE }}
          style={{
            paddingTop:    'clamp(4rem, 7vw, 5.5rem)',
            paddingBottom: 'clamp(4rem, 7vw, 5.5rem)',
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-10 lg:gap-16 items-start">
            <div>
              <p
                style={{
                  fontFamily:    'var(--font-body)',
                  fontSize:      '0.6875rem',
                  fontWeight:    600,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color:         'rgba(100,120,200,0.88)',
                  margin:        '0 0 1rem',
                }}
              >
                {whatToExpect}
              </p>
              <h2
                style={{
                  fontFamily:            'var(--font-display)',
                  fontSize:              'clamp(1.75rem, 2.5vw + 0.5rem, 2.5rem)',
                  fontWeight:            500,
                  lineHeight:            1.18,
                  letterSpacing:         '-0.022em',
                  color:                 '#1C2A48',
                  fontVariationSettings: '"opsz" 36',
                  margin:                0,
                }}
              >
                {honestExp}
              </h2>
            </div>

            <div
              style={{
                background:   'rgba(236,234,244,0.40)',
                borderRadius: '16px',
                padding:      'clamp(1.75rem, 3vw, 2.5rem)',
                borderLeft:   `3px solid ${proc.accentEdge}`,
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize:   'clamp(1.0625rem, 0.5vw + 0.75rem, 1.1875rem)',
                  lineHeight: 1.84,
                  color:      'rgba(28,42,72,0.72)',
                  margin:     0,
                }}
              >
                {proc.whatToExpect}
              </p>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  )
}

/* ─── FAQ accordion ──────────────────────────────────────────────────────── */

function FAQItem({
  faq,
  isOpen,
  onToggle,
  reduced,
}: {
  faq:      { q: string; a: string }
  isOpen:   boolean
  onToggle: () => void
  reduced:  boolean
}) {
  return (
    <div style={{ borderBottom: '1px solid rgba(216,204,190,0.50)' }}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        style={{
          width:          '100%',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          gap:            '1.5rem',
          padding:        '1.375rem 0',
          background:     'none',
          border:         'none',
          cursor:         'pointer',
          textAlign:      'left',
        }}
      >
        <span
          style={{
            fontFamily:            'var(--font-display)',
            fontSize:              'clamp(1.0625rem, 0.8vw + 0.75rem, 1.25rem)',
            fontWeight:            500,
            lineHeight:            1.38,
            letterSpacing:         '-0.014em',
            color:                 '#1C2A48',
            fontVariationSettings: '"opsz" 24',
          }}
        >
          {faq.q}
        </span>
        <motion.span
          animate={reduced ? {} : { rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.22, ease: EASE }}
          style={{ display: 'flex', flexShrink: 0, color: '#E2849C' }}
        >
          <Plus size={18} strokeWidth={2} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.30, ease: EASE }}
            style={{ overflow: 'hidden' }}
          >
            <p
              style={{
                fontFamily:    'var(--font-body)',
                fontSize:      'clamp(1rem, 0.4vw + 0.75rem, 1.125rem)',
                lineHeight:    1.82,
                color:         'rgba(28,42,72,0.68)',
                paddingBottom: '1.375rem',
                margin:        0,
              }}
            >
              {faq.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function FAQSection({
  proc,
  reduced,
  faqEyebrow,
  faqHeading,
}: {
  proc:       Procedure
  reduced:    boolean
  faqEyebrow: string
  faqHeading: string
}) {
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  return (
    <section
      style={{
        borderTop:    '1px solid rgba(216,204,190,0.50)',
        borderBottom: '1px solid rgba(216,204,190,0.50)',
        background:   '#FEFCF9',
      }}
    >
      <Container>
        <motion.div
          initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.70, ease: EASE }}
          style={{
            paddingTop:    'clamp(4rem, 7vw, 5.5rem)',
            paddingBottom: 'clamp(4rem, 7vw, 5.5rem)',
          }}
        >
          <p
            style={{
              fontFamily:    'var(--font-body)',
              fontSize:      '0.6875rem',
              fontWeight:    600,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color:         'rgba(100,120,200,0.88)',
              margin:        '0 0 1rem',
            }}
          >
            {faqEyebrow}
          </p>
          <h2
            style={{
              fontFamily:            'var(--font-display)',
              fontSize:              'clamp(1.75rem, 2.5vw + 0.5rem, 2.5rem)',
              fontWeight:            500,
              lineHeight:            1.18,
              letterSpacing:         '-0.022em',
              color:                 '#1C2A48',
              fontVariationSettings: '"opsz" 36',
              margin:                '0 0 2.5rem',
            }}
          >
            {faqHeading}
          </h2>

          <div style={{ maxWidth: '72ch' }}>
            <div style={{ borderTop: '1px solid rgba(216,204,190,0.50)' }}>
              {proc.faqs.map((faq, i) => (
                <FAQItem
                  key={faq.q}
                  faq={faq}
                  isOpen={openIdx === i}
                  onToggle={() => setOpenIdx(openIdx === i ? null : i)}
                  reduced={reduced}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  )
}

/* ─── Other procedure card ───────────────────────────────────────────────── */

function OtherProcCard({ proc, reduced }: { proc: Procedure; reduced: boolean }) {
  const [hovered, setIsHovered] = useState(false)
  const h = !reduced && hovered

  return (
    <Link
      href={`/procedures/${proc.slug}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ display: 'block', textDecoration: 'none', height: '100%' }}
    >
      <motion.div
        animate={{
          y:         h ? -6 : 0,
          scale:     h ? 1.02 : 1,
          boxShadow: h ? SHADOW_LIFT : SHADOW_REST,
        }}
        whileTap={reduced ? {} : { scale: 0.99 }}
        transition={{ type: 'spring', stiffness: 250, damping: 26, mass: 0.9 }}
        style={{
          background:    '#FEFCF9',
          borderRadius:  '20px',
          borderTop:     `2px solid ${proc.accentEdge}`,
          padding:       'clamp(1.75rem, 3vw, 2.25rem)',
          cursor:        'pointer',
          position:      'relative',
          overflow:      'hidden',
          height:        '100%',
          display:       'flex',
          flexDirection: 'column',
        }}
      >
        <motion.div
          animate={{ opacity: h ? 1 : 0 }}
          transition={{ duration: 0.28, ease: EASE }}
          aria-hidden="true"
          style={{
            position:      'absolute',
            inset:         0,
            background:    `radial-gradient(ellipse 90% 65% at 18% 14%, ${proc.accentBg}, transparent)`,
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            width:          '66px',
            height:         '66px',
            borderRadius:   '14px',
            background:     proc.accentBg,
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            marginBottom:   '1.375rem',
            flexShrink:     0,
            position:       'relative',
            zIndex:         1,
          }}
        >
          <ProcVisual id={proc.slug} />
        </div>

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', flex: 1 }}>
          <p
            style={{
              fontFamily:    'var(--font-body)',
              fontSize:      '0.6875rem',
              fontWeight:    600,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color:         'rgba(148,164,196,0.78)',
              margin:        '0 0 0.4375rem',
            }}
          >
            {proc.fullName}
          </p>

          <h3
            style={{
              fontFamily:            'var(--font-display)',
              fontSize:              'clamp(1.375rem, 1.5vw + 0.5rem, 1.75rem)',
              fontWeight:            500,
              lineHeight:            1.14,
              letterSpacing:         '-0.020em',
              color:                 '#1C2A48',
              fontVariationSettings: '"opsz" 28',
              margin:                '0 0 0.875rem',
            }}
          >
            {proc.name}
          </h3>

          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize:   '1rem',
              lineHeight: 1.72,
              color:      'rgba(28,42,72,0.62)',
              margin:     '0 0 1.5rem',
              flex:       1,
            }}
          >
            {proc.oneLiner}
          </p>

          <span
            style={{
              display:    'inline-flex',
              alignItems: 'center',
              gap:        '0.3125rem',
              fontFamily: 'var(--font-body)',
              fontSize:   '0.875rem',
              fontWeight: 500,
              color:      '#E2849C',
              marginTop:  'auto',
            }}
          >
            Understand {proc.name}
            <motion.span
              animate={{ x: h ? 4 : 0 }}
              transition={{ duration: 0.20, ease: EASE }}
              style={{ display: 'flex' }}
            >
              <ArrowRight size={14} strokeWidth={2} />
            </motion.span>
          </span>
        </div>
      </motion.div>
    </Link>
  )
}

/* ─── Other procedures section ───────────────────────────────────────────── */

function OtherProceduresSection({
  proc,
  allProcs,
  reduced,
  otherEyebrow,
  otherHeading,
}: {
  proc:         Procedure
  allProcs:     ReadonlyArray<Procedure>
  reduced:      boolean
  otherEyebrow: string
  otherHeading: string
}) {
  const others = allProcs.filter((p) => p.slug !== proc.slug)

  return (
    <section style={{ background: '#FBF7F1' }}>
      <Container>
        <div
          style={{
            paddingTop:    'clamp(4.5rem, 8vw, 6.5rem)',
            paddingBottom: 'clamp(4.5rem, 8vw, 6.5rem)',
          }}
        >
          <motion.div
            initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.70, ease: EASE }}
            style={{ marginBottom: 'clamp(2.5rem, 4vw, 3.5rem)' }}
          >
            <p
              style={{
                fontFamily:    'var(--font-body)',
                fontSize:      '0.6875rem',
                fontWeight:    600,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color:         'rgba(100,120,200,0.88)',
                margin:        '0 0 1rem',
              }}
            >
              {otherEyebrow}
            </p>
            <h2
              style={{
                fontFamily:            'var(--font-display)',
                fontSize:              'clamp(1.75rem, 2.5vw + 0.5rem, 2.5rem)',
                fontWeight:            500,
                lineHeight:            1.18,
                letterSpacing:         '-0.022em',
                color:                 '#1C2A48',
                fontVariationSettings: '"opsz" 36',
                margin:                0,
              }}
            >
              {otherHeading}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">
            {others.map((other, i) => (
              <motion.div
                key={other.slug}
                initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.66, ease: EASE, delay: reduced ? 0 : i * 0.08 }}
                style={{ display: 'flex', flexDirection: 'column' }}
              >
                <OtherProcCard proc={other} reduced={reduced} />
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}

/* ─── Closing CTA ────────────────────────────────────────────────────────── */

function ClosingCTA({
  ctaText,
  ctaSub,
  ctaButton,
}: {
  ctaText:   string
  ctaSub:    string
  ctaButton: string
}) {
  return (
    <section
      style={{
        borderTop:  '1px solid rgba(216,204,190,0.50)',
        background: 'rgba(236,234,244,0.35)',
      }}
    >
      <Container>
        <div
          style={{
            paddingTop:    'clamp(4rem, 7vw, 5.5rem)',
            paddingBottom: 'clamp(4rem, 7vw, 5.5rem)',
            textAlign:     'center',
            display:       'flex',
            flexDirection: 'column',
            alignItems:    'center',
          }}
        >
          <p
            style={{
              fontFamily:            'var(--font-display)',
              fontSize:              'clamp(1.5rem, 2.5vw + 0.5rem, 2.125rem)',
              fontWeight:            500,
              lineHeight:            1.26,
              letterSpacing:         '-0.020em',
              color:                 '#1C2A48',
              fontVariationSettings: '"opsz" 32',
              maxWidth:              '36ch',
              margin:                '0 0 0.875rem',
            }}
          >
            {ctaText}
          </p>

          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize:   '1rem',
              lineHeight: 1.65,
              color:      'rgba(28,42,72,0.52)',
              margin:     '0 0 2.25rem',
            }}
          >
            {ctaSub}
          </p>

          <Pressable haptic>
            <Link
              href="/contact"
              style={{
                display:        'inline-flex',
                alignItems:     'center',
                gap:            '0.5rem',
                fontFamily:     'var(--font-body)',
                fontSize:       '1rem',
                fontWeight:     600,
                letterSpacing:  '0.01em',
                color:          '#FFFFFF',
                background:     '#E2849C',
                padding:        '0.9375rem 2rem',
                borderRadius:   '100px',
                boxShadow:      '0 10px 28px -8px rgba(226,132,156,0.55)',
                textDecoration: 'none',
                whiteSpace:     'nowrap',
              }}
            >
              {ctaButton}
              <ArrowRight size={15} strokeWidth={2} />
            </Link>
          </Pressable>
        </div>
      </Container>
    </section>
  )
}

/* ─── Main export ────────────────────────────────────────────────────────── */

interface ProcedureDetailProps {
  proc:     Procedure
  allProcs: ReadonlyArray<Procedure>
}

export function ProcedureDetail({ proc, allProcs }: Readonly<ProcedureDetailProps>) {
  const reduced = useReducedMotion()
  const t       = useTranslations('Procedures')

  const photoComingSoon = t('photoComingSoon')
  const backLabel       = t('detailBack')
  const isRightLabel    = t('detailIsRightForYou')
  const processEyebrow  = t('detailProcessEyebrow')
  const processHeading  = t('detailProcessHeading')
  const whatToExpect    = t('detailWhatToExpect')
  const honestExp       = t('detailHonestExp')
  const faqEyebrow      = t('detailFaqEyebrow')
  const faqHeading      = t('detailFaqHeading', { name: proc.name.toLowerCase() })
  const otherEyebrow    = t('detailOtherEyebrow')
  const otherHeading    = t('detailOtherHeading')
  const ctaText         = t('detailCtaText', { name: proc.name.toLowerCase() })
  const ctaSub          = t('detailCtaSub')
  const ctaButton       = t('detailCtaButton')

  return (
    <div style={{ background: '#FBF7F1', minHeight: '100vh' }}>
      <HeroSection
        proc={proc}
        reduced={reduced}
        backLabel={backLabel}
        photoComingSoon={photoComingSoon}
      />
      <WhoItsForSection
        proc={proc}
        reduced={reduced}
        isRightLabel={isRightLabel}
      />
      <ProcessSection
        proc={proc}
        reduced={reduced}
        processEyebrow={processEyebrow}
        processHeading={processHeading}
        photoComingSoon={photoComingSoon}
      />
      <WhatToExpectSection
        proc={proc}
        reduced={reduced}
        whatToExpect={whatToExpect}
        honestExp={honestExp}
      />
      <FAQSection
        proc={proc}
        reduced={reduced}
        faqEyebrow={faqEyebrow}
        faqHeading={faqHeading}
      />
      <OtherProceduresSection
        proc={proc}
        allProcs={allProcs}
        reduced={reduced}
        otherEyebrow={otherEyebrow}
        otherHeading={otherHeading}
      />
      <ClosingCTA
        ctaText={ctaText}
        ctaSub={ctaSub}
        ctaButton={ctaButton}
      />
    </div>
  )
}
