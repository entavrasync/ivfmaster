'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Container } from '@/components/layout/Container'
import { Pressable } from '@/components/motion/Pressable'
import { Link } from '@/i18n/navigation'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { type Procedure, PROCEDURES } from '@/lib/procedures'
import { ProcVisual } from './ProcedureVisuals'

const EASE = [0.22, 1, 0.36, 1] as const

/* ─── Shadows ───────────────────────────────────────────────────── */

const SHADOW_REST  = '0 20px 44px -24px rgba(46,79,142,0.14), 0 4px 10px -4px rgba(46,79,142,0.05)'
const SHADOW_HOVER = '0 36px 68px -12px rgba(46,79,142,0.24), 0 10px 22px -8px rgba(46,79,142,0.12)'

/* ─── Featured IVF card ─────────────────────────────────────────── */

function FeaturedCard({ proc, reduced }: Readonly<{ proc: Procedure; reduced: boolean }>) {
  const [hovered, setIsHovered] = useState(false)
  const h = !reduced && hovered

  return (
    <Link
      href={`/procedures/${proc.slug}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ display: 'block', textDecoration: 'none' }}
    >
      <motion.div
        animate={{
          y:         h ? -6 : 0,
          scale:     h ? 1.012 : 1,
          boxShadow: h ? SHADOW_HOVER : SHADOW_REST,
        }}
        whileTap={reduced ? {} : { scale: 0.996 }}
        transition={{ type: 'spring', stiffness: 250, damping: 26, mass: 0.9 }}
        style={{
          background:   '#FEFCF9',
          borderRadius: '20px',
          borderTop:    `3px solid ${proc.accentEdge}`,
          padding:      'clamp(2rem, 4vw, 3rem)',
          cursor:       'pointer',
          position:     'relative',
          overflow:     'hidden',
        }}
      >
        {/* Hover radial accent — eases in */}
        <motion.div
          animate={{ opacity: h ? 1 : 0 }}
          transition={{ duration: 0.30, ease: EASE }}
          aria-hidden="true"
          style={{
            position:      'absolute',
            inset:         0,
            background:    `radial-gradient(ellipse 60% 50% at 88% 55%, ${proc.accentBg}, transparent)`,
            pointerEvents: 'none',
          }}
        />

        {/* Two-column: text left, visual right */}
        <div
          style={{
            display:    'flex',
            flexWrap:   'wrap',
            alignItems: 'center',
            gap:        'clamp(2rem, 5vw, 5rem)',
          }}
        >
          {/* Text */}
          <div style={{ flex: '3 1 260px', minWidth: 0, position: 'relative', zIndex: 1 }}>
            <p
              style={{
                fontFamily:    'var(--font-body)',
                fontSize:      '0.6875rem',
                fontWeight:    600,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color:         'rgba(148,164,196,0.80)',
                margin:        '0 0 0.75rem',
              }}
            >
              {proc.fullName}
            </p>

            <h2
              style={{
                fontFamily:            'var(--font-display)',
                fontSize:              'clamp(2.25rem, 3.5vw + 0.25rem, 3.375rem)',
                fontWeight:            500,
                lineHeight:            1.06,
                letterSpacing:         '-0.030em',
                color:                 '#1C2A48',
                fontVariationSettings: '"opsz" 48',
                margin:                '0 0 1rem',
              }}
            >
              {proc.name}
            </h2>

            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize:   'clamp(1.0625rem, 0.5vw + 0.75rem, 1.1875rem)',
                lineHeight: 1.74,
                color:      'rgba(28,42,72,0.64)',
                maxWidth:   '44ch',
                margin:     '0 0 2rem',
              }}
            >
              {proc.oneLiner}
            </p>

            <span
              style={{
                display:    'inline-flex',
                alignItems: 'center',
                gap:        '0.375rem',
                fontFamily: 'var(--font-body)',
                fontSize:   '0.9375rem',
                fontWeight: 500,
                color:      '#E2849C',
              }}
            >
              Understand {proc.name}
              <motion.span
                animate={{ x: h ? 5 : 0 }}
                transition={{ duration: 0.20, ease: EASE }}
                style={{ display: 'flex' }}
              >
                <ArrowRight size={15} strokeWidth={2} />
              </motion.span>
            </span>
          </div>

          {/* Visual anchor */}
          <div
            style={{
              flex:           '1 1 190px',
              maxWidth:       '300px',
              minHeight:      '190px',
              borderRadius:   '16px',
              background:     proc.accentBg,
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              position:       'relative',
              zIndex:         1,
            }}
          >
            <ProcVisual id={proc.slug} featured />
          </div>
        </div>
      </motion.div>
    </Link>
  )
}

/* ─── Regular card ──────────────────────────────────────────────── */

function RegularCard({ proc, reduced }: Readonly<{ proc: Procedure; reduced: boolean }>) {
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
          boxShadow: h ? SHADOW_HOVER : SHADOW_REST,
        }}
        whileTap={reduced ? {} : { scale: 0.99 }}
        transition={{ type: 'spring', stiffness: 250, damping: 26, mass: 0.9 }}
        style={{
          background:   '#FEFCF9',
          borderRadius: '20px',
          borderTop:    `2px solid ${proc.accentEdge}`,
          padding:      'clamp(1.75rem, 3vw, 2.25rem)',
          cursor:       'pointer',
          position:     'relative',
          overflow:     'hidden',
          height:       '100%',
          display:      'flex',
          flexDirection:'column',
        }}
      >
        {/* Hover accent */}
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

        {/* Visual mark */}
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

        {/* Text */}
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
              fontSize:              'clamp(1.5rem, 2vw + 0.25rem, 1.875rem)',
              fontWeight:            500,
              lineHeight:            1.10,
              letterSpacing:         '-0.022em',
              color:                 '#1C2A48',
              fontVariationSettings: '"opsz" 32',
              margin:                '0 0 0.875rem',
            }}
          >
            {proc.name}
          </h3>

          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize:   '1rem',
              lineHeight: 1.70,
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

/* ─── Hub ───────────────────────────────────────────────────────── */

export function ProceduresHub() {
  const reduced = useReducedMotion()
  const t       = useTranslations('Procedures')

  const staggerV = {
    hidden:  {},
    visible: {
      transition: {
        staggerChildren: reduced ? 0 : 0.11,
        delayChildren:   reduced ? 0 : 0.04,
      },
    },
  }
  const revealV = {
    hidden:  { opacity: reduced ? 1 : 0, y: reduced ? 0 : 28 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.68, ease: EASE } },
  }

  const [featured, ...rest] = PROCEDURES

  return (
    <div style={{ background: '#FBF7F1', minHeight: '100vh' }}>

      {/* ── Intro ───────────────────────────────────────────────── */}
      <Container>
        <motion.div
          initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.80, ease: EASE }}
          style={{
            paddingTop:    'clamp(9rem, 14vw, 11rem)',
            paddingBottom: 'clamp(3rem, 5vw, 4rem)',
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
              margin:        '0 0 1.375rem',
            }}
          >
            Treatments, explained simply
          </p>

          <h1
            style={{
              fontFamily:            'var(--font-display)',
              fontSize:              'clamp(2.5rem, 4.5vw + 0.25rem, 4rem)',
              fontWeight:            500,
              lineHeight:            1.06,
              letterSpacing:         '-0.030em',
              color:                 '#1C2A48',
              fontVariationSettings: '"opsz" 48',
              margin:                '0 0 1.375rem',
              maxWidth:              '22ch',
            }}
          >
            Every path to parenthood, in plain language.
          </h1>

          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize:   'clamp(1.0625rem, 0.5vw + 0.75rem, 1.25rem)',
              lineHeight: 1.74,
              color:      'rgba(28,42,72,0.62)',
              maxWidth:   '56ch',
              margin:     0,
            }}
          >
            You may have heard these names from a doctor or a friend. Here&apos;s what each one really
            means&nbsp;— gently, and without the jargon.
          </p>
        </motion.div>
      </Container>

      {/* ── Cards ───────────────────────────────────────────────── */}
      <Container>
        <motion.div
          variants={staggerV}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          style={{ paddingBottom: 'clamp(5rem, 8vw, 7rem)' }}
        >
          {/* Featured IVF — full width */}
          <motion.div
            variants={revealV}
            style={{ marginBottom: 'clamp(1rem, 1.75vw, 1.375rem)' }}
          >
            <FeaturedCard proc={featured} reduced={reduced} />
          </motion.div>

          {/* Supporting three — equal columns */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">
            {rest.map((proc) => (
              <motion.div key={proc.slug} variants={revealV} style={{ display: 'flex', flexDirection: 'column' }}>
                <RegularCard proc={proc} reduced={reduced} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Container>

      {/* ── Close ───────────────────────────────────────────────── */}
      <div
        style={{
          borderTop:    '1px solid rgba(216,204,190,0.50)',
          borderBottom: '1px solid rgba(216,204,190,0.50)',
          background:   'rgba(236,234,244,0.35)',
        }}
      >
        <Container>
          <motion.div
            initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.70, ease: EASE }}
            style={{
              paddingTop:     'clamp(4rem, 7vw, 5.5rem)',
              paddingBottom:  'clamp(4rem, 7vw, 5.5rem)',
              display:        'flex',
              flexWrap:       'wrap',
              alignItems:     'center',
              justifyContent: 'space-between',
              gap:            'clamp(1.75rem, 3vw, 3rem)',
            }}
          >
            <p
              style={{
                fontFamily:            'var(--font-display)',
                fontSize:              'clamp(1.375rem, 2vw + 0.5rem, 1.875rem)',
                fontWeight:            500,
                lineHeight:            1.28,
                letterSpacing:         '-0.018em',
                color:                 '#1C2A48',
                fontVariationSettings: '"opsz" 32',
                maxWidth:              '44ch',
                margin:                0,
              }}
            >
              Not sure which path is yours? That&apos;s exactly what a first conversation is for.
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
                Talk through your options
                <ArrowRight size={15} strokeWidth={2} />
              </Link>
            </Pressable>
          </motion.div>
        </Container>
      </div>
    </div>
  )
}
