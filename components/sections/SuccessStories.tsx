'use client'

import { motion } from 'motion/react'
import { useTranslations } from 'next-intl'
import { Container } from '@/components/layout/Container'
import { TestimonialsColumn } from '@/components/ui/TestimonialsColumn'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { TESTIMONIAL_COLUMNS } from '@/lib/content/testimonials'

const EASE = [0.22, 1, 0.36, 1] as const

const [firstColumn, secondColumn, thirdColumn] = TESTIMONIAL_COLUMNS

/* ─── Section ──────────────────────────────────────────────────────────── */

export function SuccessStories() {
  const reduced = useReducedMotion()
  const t       = useTranslations('SuccessStories')

  const introV = {
    hidden:  {},
    visible: { transition: { staggerChildren: reduced ? 0 : 0.10 } },
  }
  const itemV = {
    hidden:  { opacity: reduced ? 1 : 0, y: reduced ? 0 : 18 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.72, ease: EASE } },
  }

  return (
    <section
      aria-labelledby="stories-heading"
      style={{
        background:    'linear-gradient(180deg, #FAFAF7 0%, #F2EDE6 100%)',
        paddingTop:    'clamp(4.5rem, 9vw, 7rem)',
        paddingBottom: 'clamp(4.5rem, 9vw, 7rem)',
        overflow:      'hidden',
      }}
    >
      <Container>

        {/* ── Section intro ───────────────────────────────────────────── */}
        <motion.div
          variants={introV}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          style={{
            display:        'flex',
            flexDirection:  'column',
            alignItems:     'center',
            textAlign:      'center',
            marginBottom:   'clamp(3rem, 6vw, 5rem)',
          }}
        >
          <motion.div variants={itemV}>
            <span
              style={{
                fontFamily:    'var(--font-body)',
                fontSize:      '0.75rem',
                fontWeight:    700,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color:         '#6478B0',
                display:       'inline-block',
                border:        '1px solid rgba(100,120,176,0.22)',
                borderRadius:  '100px',
                padding:       '0.3125rem 1rem',
                marginBottom:  '1.375rem',
              }}
            >
              {t('eyebrow')}
            </span>
          </motion.div>

          <motion.h2
            id="stories-heading"
            variants={itemV}
            style={{
              fontFamily:            'var(--font-display)',
              fontSize:              'clamp(2rem, 3.2vw + 0.5rem, 3.5rem)',
              fontWeight:            500,
              lineHeight:            1.08,
              letterSpacing:         '-0.026em',
              color:                 '#1C2A48',
              fontVariationSettings: '"opsz" 48',
              marginBottom:          '1.25rem',
            }}
          >
            {t('heading')}
          </motion.h2>

          <motion.p
            variants={itemV}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize:   'clamp(1rem, 0.9vw + 0.5rem, 1.125rem)',
              lineHeight: 1.72,
              color:      '#5A6173',
              maxWidth:   '48ch',
            }}
          >
            {t('body')}
          </motion.p>
        </motion.div>

      </Container>

      {/* ── Scrolling columns — full-width, outside Container for edge bleed ── */}
      <div
        style={{
          display:                     'flex',
          justifyContent:              'center',
          gap:                         '1.25rem',
          maxHeight:                   '680px',
          overflow:                    'hidden',
          maskImage:                   'linear-gradient(to bottom, transparent, black 18%, black 82%, transparent)',
          WebkitMaskImage:             'linear-gradient(to bottom, transparent, black 18%, black 82%, transparent)',
        }}
      >
        <TestimonialsColumn
          testimonials={firstColumn}
          duration={16}
          reduced={reduced}
        />
        <TestimonialsColumn
          testimonials={secondColumn}
          duration={20}
          className="hidden md:block"
          reduced={reduced}
        />
        <TestimonialsColumn
          testimonials={thirdColumn}
          duration={18}
          className="hidden lg:block"
          reduced={reduced}
        />
      </div>
    </section>
  )
}
