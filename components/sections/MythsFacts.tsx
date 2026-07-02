'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useTranslations } from 'next-intl'
import { Container } from '@/components/layout/Container'
import { Pressable } from '@/components/motion/Pressable'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { Link } from '@/i18n/navigation'

const EASE = [0.22, 1, 0.36, 1] as const

type Faq = { id: string; q: string; a: string }

/* ─── Chevron — gently rotates on open ────────────────────────────────── */

function Chevron({ open, reduced }: Readonly<{ open: boolean; reduced: boolean }>) {
  return (
    <motion.svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
      animate={{ rotate: open ? 180 : 0 }}
      transition={{ duration: reduced ? 0 : 0.28, ease: EASE }}
      style={{
        flexShrink: 0,
        color:      open ? '#E2849C' : '#96A4C4',
        transition: 'color 0.22s ease',
      }}
    >
      <path
        d="M4.5 6.75 9 11.25 13.5 6.75"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </motion.svg>
  )
}

/* ─── Single FAQ row ──────────────────────────────────────────────────── */

function FaqRow({
  item,
  isOpen,
  onToggle,
  reduced,
  index,
}: Readonly<{
  item:     Faq
  isOpen:   boolean
  onToggle: () => void
  reduced:  boolean
  index:    number
}>) {
  return (
    <motion.div
      initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.5, ease: EASE, delay: reduced ? 0 : index * 0.045 }}
      style={{
        borderRadius: '14px',
        overflow:     'hidden',
        border:       '1px solid rgba(195,148,80,0.16)',
        background:   isOpen ? 'rgba(255,248,250,0.96)' : 'rgba(255,252,248,0.82)',
        /* inset box-shadow = blush left accent on open; no layout shift from border-left change */
        boxShadow:    isOpen
          ? 'inset 3px 0 0 rgba(226,132,156,0.55), 0 4px 20px -6px rgba(226,132,156,0.18), 0 1px 4px rgba(55,28,8,0.05)'
          : '0 2px 8px -4px rgba(55,28,8,0.07)',
        transition:   'background 0.25s ease, box-shadow 0.3s ease',
      }}
    >
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        type="button"
        style={{
          width:          '100%',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          gap:            '1rem',
          padding:        'clamp(1.125rem, 1.8vw, 1.375rem) clamp(1.25rem, 2.5vw, 1.75rem)',
          background:     'none',
          border:         'none',
          cursor:         'pointer',
          textAlign:      'left',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontSize:   'clamp(1rem, 0.6vw + 0.55rem, 1.125rem)',
            fontWeight: 500,
            lineHeight: 1.42,
            color:      '#1C2A48',
          }}
        >
          {item.q}
        </span>
        <Chevron open={isOpen} reduced={reduced} />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.34, ease: EASE }}
            style={{ overflow: 'hidden' }}
          >
            <div
              style={{
                padding:    'clamp(0.875rem, 1.5vw, 1.125rem) clamp(1.25rem, 2.5vw, 1.75rem) clamp(1.125rem, 1.8vw, 1.375rem)',
                borderTop:  '1px solid rgba(226,132,156,0.12)',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize:   'clamp(1rem, 0.6vw + 0.55rem, 1.125rem)',
                  lineHeight: 1.78,
                  color:      '#474D66',
                }}
              >
                {item.a}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ─── Section ──────────────────────────────────────────────────────────── */

export function MythsFacts() {
  const reduced             = useReducedMotion()
  const [openId, setOpenId] = useState<string | null>(null)
  const t                   = useTranslations('MythsFacts')

  const faqs: Faq[] = (['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7'] as const).map((k) => ({
    id: k,
    q:  t(`faqs.${k}.q`),
    a:  t(`faqs.${k}.a`),
  }))

  const introV = {
    hidden:  {},
    visible: { transition: { staggerChildren: reduced ? 0 : 0.10 } },
  }
  const introItemV = {
    hidden:  { opacity: reduced ? 1 : 0, y: reduced ? 0 : 18 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.72, ease: EASE } },
  }

  return (
    <section
      aria-labelledby="faq-heading"
      style={{
        background:    'linear-gradient(180deg, #F9F5EF 0%, #F2EBE0 100%)',
        paddingTop:    'clamp(4.5rem, 9vw, 7rem)',
        paddingBottom: 'clamp(4.5rem, 9vw, 7rem)',
      }}
    >
      <Container>

        {/* ── Intro ───────────────────────────────────────────────────── */}
        <motion.div
          variants={introV}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          style={{ marginBottom: 'clamp(2.5rem, 5vw, 4rem)' }}
        >
          <motion.p
            variants={introItemV}
            style={{
              fontFamily:    'var(--font-body)',
              fontSize:      '0.75rem',
              fontWeight:    700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color:         '#6478B0',
              marginBottom:  '1.25rem',
            }}
          >
            {t('eyebrow')}
          </motion.p>

          <motion.h2
            id="faq-heading"
            variants={introItemV}
            style={{
              fontFamily:            'var(--font-display)',
              fontSize:              'clamp(2rem, 3vw + 0.5rem, 3.25rem)',
              fontWeight:            500,
              lineHeight:            1.1,
              letterSpacing:         '-0.024em',
              color:                 '#1C2A48',
              fontVariationSettings: '"opsz" 44',
              marginBottom:          '1.25rem',
            }}
          >
            {t('heading')}
          </motion.h2>

          <motion.p
            variants={introItemV}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize:   'clamp(1.0625rem, 0.9vw + 0.5rem, 1.25rem)',
              lineHeight: 1.72,
              color:      '#5A6173',
              maxWidth:   '54ch',
            }}
          >
            {t('body')}
          </motion.p>
        </motion.div>

        {/* ── FAQ accordion ───────────────────────────────────────────── */}
        <div
          style={{
            maxWidth:      '780px',
            display:       'flex',
            flexDirection: 'column',
            gap:           '0.75rem',
            marginBottom:  'clamp(3.5rem, 7vw, 5.5rem)',
          }}
        >
          {faqs.map((item, i) => (
            <FaqRow
              key={item.id}
              item={item}
              isOpen={openId === item.id}
              onToggle={() => setOpenId(openId === item.id ? null : item.id)}
              reduced={reduced}
              index={i}
            />
          ))}
        </div>

        {/* ── Soft close + CTA ────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.7, ease: EASE }}
          style={{
            display:       'flex',
            flexDirection: 'column',
            alignItems:    'flex-start',
            gap:           '1rem',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize:   'clamp(1rem, 0.7vw + 0.5rem, 1.125rem)',
              lineHeight: 1.65,
              color:      '#5A6173',
            }}
          >
            {t('closeBody')}
          </p>

          <Pressable>
            <Link
              href="/contact"
              style={{
                display:        'inline-block',
                fontFamily:     'var(--font-body)',
                fontSize:       '1rem',
                fontWeight:     600,
                letterSpacing:  '0.01em',
                color:          '#FFFFFF',
                background:     '#E2849C',
                padding:        '0.875rem 2rem',
                borderRadius:   '100px',
                boxShadow:      '0 8px 20px -5px rgba(226,132,156,0.50)',
                textDecoration: 'none',
                whiteSpace:     'nowrap',
              }}
            >
              {t('ctaButton')}
            </Link>
          </Pressable>

          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize:   '0.8125rem',
              color:      '#96A4C4',
            }}
          >
            {t('ctaSub')}
          </p>
        </motion.div>

      </Container>
    </section>
  )
}
