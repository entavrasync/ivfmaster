'use client'

import { useEffect, type ReactNode } from 'react'
import { motion } from 'motion/react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Container } from '@/components/layout/Container'
import { Pressable } from '@/components/motion/Pressable'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useReadingProgress } from '@/components/providers/ReadingProgressContext'
import { HeroCover, RelatedCard } from '@/components/sections/ArticleDetail'
import { CATEGORY_STYLES, type Article } from '@/lib/articles'

/* "What IVF really is" — an "Educate IVF · Understanding IVF" guide. Richer body
 * than the generic prose renderer: two intro paragraphs, six phases each with a
 * definition list (bold label + description), optional per-phase notes, and a
 * closing support section. All copy is localised via the ArticleWhatIvf namespace,
 * so it reads natively in English and Marathi. */

const EASE = [0.22, 1, 0.36, 1] as const
const INK  = '#1C2A48'
const BODY = 'rgba(28,42,72,0.72)'

type Item  = { label: string; body: string }
type Phase = { heading: string; intro: string; intro2?: string; items: Item[]; note?: string }

/* ─── Presentational atoms ───────────────────────────────────────────────── */

function Heading({ children }: { children: ReactNode }) {
  return (
    <h2 style={{
      fontFamily:            'var(--font-display)',
      fontSize:              'clamp(1.375rem, 1.5vw + 0.5rem, 1.875rem)',
      fontWeight:            500,
      lineHeight:            1.2,
      letterSpacing:         '-0.020em',
      color:                 INK,
      fontVariationSettings: '"opsz" 32',
      margin:                '0 0 1.125rem',
    }}>
      {children}
    </h2>
  )
}

function Para({ children, mt = 0 }: { children: ReactNode; mt?: string | number }) {
  return (
    <p style={{
      fontFamily: 'var(--font-body)',
      fontSize:   'clamp(1rem, 0.25vw + 0.875rem, 1.125rem)',
      lineHeight: 1.84,
      color:      BODY,
      margin:     mt ? `${typeof mt === 'number' ? mt + 'px' : mt} 0 0` : 0,
    }}>
      {children}
    </p>
  )
}

function Note({ children }: { children: ReactNode }) {
  return (
    <p style={{
      margin:       '1.25rem 0 0',
      display:      'inline-block',
      background:   'rgba(100,120,200,0.09)',
      color:        'rgba(28,42,72,0.64)',
      fontFamily:   'var(--font-body)',
      fontSize:     '0.9375rem',
      fontStyle:    'italic',
      lineHeight:   1.6,
      padding:      '0.625rem 1rem',
      borderRadius: '10px',
    }}>
      {children}
    </p>
  )
}

/* Definition list — each phase item is a bold label + description, set off with a
 * soft left accent so the steps read as a scannable, premium list. */
function DefinitionList({ items, accent }: { items: readonly Item[]; accent: string }) {
  return (
    <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {items.map((item, i) => (
        <div key={i} style={{ borderLeft: `2px solid ${accent}`, paddingLeft: 'clamp(1rem, 2vw, 1.25rem)' }}>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize:   'clamp(1rem, 0.2vw + 0.9rem, 1.0625rem)',
            fontWeight: 600,
            lineHeight: 1.5,
            color:      '#2E4F8E',
            margin:     '0 0 0.3rem',
          }}>
            {item.label}
          </p>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize:   'clamp(1rem, 0.2vw + 0.9rem, 1.0625rem)',
            lineHeight: 1.78,
            color:      'rgba(28,42,72,0.74)',
            margin:     0,
          }}>
            {item.body}
          </p>
        </div>
      ))}
    </div>
  )
}

function Section({ reduced, children }: { reduced: boolean; children: ReactNode }) {
  return (
    <motion.section
      initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.68, ease: EASE }}
      style={{ marginBottom: 'clamp(2.75rem, 5vw, 4rem)' }}
    >
      {children}
    </motion.section>
  )
}

/* ─── Main export ────────────────────────────────────────────────────────── */

export function WhatIvfArticle({
  article,
  allArticles,
}: {
  article:     Article
  allArticles: ReadonlyArray<Article>
}) {
  const reduced = useReducedMotion()
  const t       = useTranslations('ArticleWhatIvf')
  const tE      = useTranslations('EducateIVF')
  const cs      = CATEGORY_STYLES['Understanding IVF']
  const { enableProgress, disableProgress } = useReadingProgress()

  useEffect(() => {
    enableProgress()
    return () => disableProgress()
  }, [enableProgress, disableProgress])

  const d         = new Date(article.date)
  const formatted = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })

  const phases = t.raw('phases') as Phase[]

  const related = (article.relatedSlugs ?? [])
    .map((s) => allArticles.find((a) => a.slug === s))
    .filter((a): a is Article => a !== undefined)

  return (
    <div style={{ background: '#FBF7F1', minHeight: '100vh' }}>

      {/* ── Back link ─────────────────────────────────────────────────── */}
      <Container>
        <div style={{ paddingTop: 'clamp(6rem, 10vw, 8rem)', paddingBottom: '1.5rem' }}>
          <Link
            href="/educate-ivf"
            style={{
              display:        'inline-flex',
              alignItems:     'center',
              gap:            '0.375rem',
              fontFamily:     'var(--font-body)',
              fontSize:       '0.875rem',
              fontWeight:     500,
              color:          'rgba(28,42,72,0.52)',
              textDecoration: 'none',
            }}
          >
            <ArrowLeft size={14} strokeWidth={2} />
            {tE('backLink')}
          </Link>
        </div>
      </Container>

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <Container>
        <motion.div
          initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.78, ease: EASE }}
        >
          {/* Meta row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            <span style={{
              display:       'inline-block',
              fontFamily:    'var(--font-body)',
              fontSize:      '0.6875rem',
              fontWeight:    600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color:         cs.color,
              background:    cs.bg,
              padding:       '0.25rem 0.6875rem',
              borderRadius:  '100px',
            }}>
              {t('category')}
            </span>
          </div>

          {/* Title */}
          <h1 style={{
            fontFamily:            'var(--font-display)',
            fontSize:              'clamp(2.25rem, 4vw + 0.25rem, 3.75rem)',
            fontWeight:            500,
            lineHeight:            1.06,
            letterSpacing:         '-0.030em',
            color:                 INK,
            fontVariationSettings: '"opsz" 48',
            margin:                '0 0 1.5rem',
            maxWidth:              '22ch',
          }}>
            {t('title')}
          </h1>

          {/* Intro paragraphs */}
          <div style={{ maxWidth: '62ch', margin: '0 0 3rem' }}>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize:   'clamp(1.125rem, 1vw + 0.75rem, 1.375rem)',
              lineHeight: 1.78,
              color:      'rgba(28,42,72,0.70)',
              margin:     0,
            }}>
              {t('intro1')}
            </p>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize:   'clamp(1.0625rem, 0.75vw + 0.75rem, 1.25rem)',
              lineHeight: 1.78,
              color:      'rgba(28,42,72,0.66)',
              margin:     '1.25rem 0 0',
            }}>
              {t('intro2')}
            </p>
          </div>

          {/* Cover image */}
          <div style={{ marginBottom: 'clamp(3.5rem, 6vw, 5rem)' }}>
            <HeroCover article={article} />
          </div>
        </motion.div>
      </Container>

      {/* ── Reading body ──────────────────────────────────────────────── */}
      <Container>
        <div style={{ maxWidth: '70ch', marginLeft: 'auto', marginRight: 'auto', paddingBottom: 'clamp(3.5rem, 6vw, 5rem)' }}>

          {phases.map((phase, i) => (
            <Section key={i} reduced={reduced}>
              <Heading>{phase.heading}</Heading>
              <Para>{phase.intro}</Para>
              {phase.intro2 && <Para mt="1.125rem">{phase.intro2}</Para>}
              <DefinitionList items={phase.items} accent={cs.accentEdge} />
              {phase.note && <Note>{phase.note}</Note>}
            </Section>
          ))}

          {/* Closing — emotional support and next steps */}
          <motion.div
            initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.68, ease: EASE }}
            style={{
              background:   cs.accentBg,
              borderLeft:   `3px solid ${cs.accentEdge}`,
              borderRadius: '0 16px 16px 0',
              padding:      'clamp(1.5rem, 3vw, 2.25rem)',
              marginTop:    'clamp(1rem, 2vw, 2rem)',
            }}
          >
            <p style={{
              fontFamily:            'var(--font-display)',
              fontSize:              '1.25rem',
              fontWeight:            500,
              lineHeight:            1.2,
              letterSpacing:         '-0.016em',
              color:                 INK,
              fontVariationSettings: '"opsz" 24',
              margin:                '0 0 1.125rem',
            }}>
              {t('closingHeading')}
            </p>
            <Para>{t('closingPara1')}</Para>
            <Para mt="1.125rem">{t('closingPara2')}</Para>
          </motion.div>
        </div>
      </Container>

      {/* ── End CTA ───────────────────────────────────────────────────── */}
      <div style={{ borderTop: '1px solid rgba(216,204,190,0.50)', borderBottom: '1px solid rgba(216,204,190,0.50)', background: 'rgba(236,234,244,0.35)' }}>
        <Container>
          <motion.div
            initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.68, ease: EASE }}
            style={{
              paddingTop:    'clamp(3.5rem, 6vw, 5rem)',
              paddingBottom: 'clamp(3.5rem, 6vw, 5rem)',
              textAlign:     'center',
              display:       'flex',
              flexDirection: 'column',
              alignItems:    'center',
              gap:           '1.5rem',
            }}
          >
            <h2 style={{
              fontFamily:            'var(--font-display)',
              fontSize:              'clamp(1.5rem, 2.5vw + 0.25rem, 2.25rem)',
              fontWeight:            500,
              lineHeight:            1.18,
              letterSpacing:         '-0.022em',
              color:                 INK,
              fontVariationSettings: '"opsz" 36',
              maxWidth:              '30ch',
              margin:                0,
            }}>
              {tE('endCtaHeading')}
            </h2>

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
                {tE('endCtaButton')}
                <ArrowRight size={15} strokeWidth={2} />
              </Link>
            </Pressable>

            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'rgba(28,42,72,0.44)', margin: 0 }}>
              {tE('endCtaMicro')}
            </p>
          </motion.div>
        </Container>
      </div>

      {/* ── Related articles ──────────────────────────────────────────── */}
      {related.length > 0 && (
        <Container>
          <motion.div
            initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.68, ease: EASE }}
            style={{ paddingTop: 'clamp(3.5rem, 6vw, 5rem)', paddingBottom: 'clamp(4rem, 7vw, 6rem)' }}
          >
            <h2 style={{
              fontFamily:            'var(--font-display)',
              fontSize:              'clamp(1.375rem, 1.5vw + 0.5rem, 1.875rem)',
              fontWeight:            500,
              lineHeight:            1.18,
              letterSpacing:         '-0.018em',
              color:                 INK,
              fontVariationSettings: '"opsz" 30',
              margin:                '0 0 2rem',
            }}>
              {tE('keepReading')}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.map((r, i) => (
                <motion.div
                  key={r.slug}
                  initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.6, ease: EASE, delay: reduced ? 0 : i * 0.08 }}
                  style={{ display: 'flex', flexDirection: 'column' }}
                >
                  <RelatedCard article={r} reduced={reduced} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </Container>
      )}
    </div>
  )
}
