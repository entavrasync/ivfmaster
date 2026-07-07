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

/* "Unexplained infertility" — an "Educate IVF · Conditions" piece. Each section
 * is either a prose paragraph or a bulleted list, with an optional intro line.
 * All copy is localised via the ArticleUnexplained namespace so it reads
 * natively in English and Marathi. */

const EASE = [0.22, 1, 0.36, 1] as const
const INK  = '#1C2A48'
const BODY = 'rgba(28,42,72,0.72)'
const MARK = 'rgba(194,78,106,0.85)'

type UnexplainedSection = {
  heading?: string
  body?: string
  intro?: string
  items?: string[]
}

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

function Para({ children }: { children: ReactNode }) {
  return (
    <p style={{
      fontFamily: 'var(--font-body)',
      fontSize:   'clamp(1rem, 0.25vw + 0.875rem, 1.125rem)',
      lineHeight: 1.84,
      color:      BODY,
      margin:     0,
    }}>
      {children}
    </p>
  )
}

function BulletList({ items }: { items: readonly string[] }) {
  return (
    <ul style={{
      listStyle:     'none',
      margin:        '0.75rem 0 0',
      padding:       0,
      display:       'flex',
      flexDirection: 'column',
      gap:           '0.625rem',
    }}>
      {items.map((item, i) => (
        <li
          key={i}
          style={{
            fontFamily:  'var(--font-body)',
            fontSize:    'clamp(1rem, 0.25vw + 0.875rem, 1.125rem)',
            lineHeight:  1.7,
            color:       'rgba(28,42,72,0.76)',
            display:     'flex',
            gap:         '0.75rem',
            alignItems:  'flex-start',
          }}
        >
          <span
            aria-hidden="true"
            style={{
              display:      'inline-block',
              width:        '6px',
              height:       '6px',
              borderRadius: '50%',
              background:   MARK,
              flexShrink:   0,
              marginTop:    '0.55em',
            }}
          />
          {item}
        </li>
      ))}
    </ul>
  )
}

function Section({ reduced, children }: { reduced: boolean; children: ReactNode }) {
  return (
    <motion.section
      initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.68, ease: EASE }}
      style={{ marginBottom: 'clamp(2.5rem, 4vw, 3.5rem)' }}
    >
      {children}
    </motion.section>
  )
}

/* ─── Main export ────────────────────────────────────────────────────────── */

export function UnexplainedArticle({
  article,
  allArticles,
}: {
  article:     Article
  allArticles: ReadonlyArray<Article>
}) {
  const reduced = useReducedMotion()
  const t       = useTranslations('ArticleUnexplained')
  const tE      = useTranslations('EducateIVF')
  const cs      = CATEGORY_STYLES['Conditions']
  const { enableProgress, disableProgress } = useReadingProgress()

  useEffect(() => {
    enableProgress()
    return () => disableProgress()
  }, [enableProgress, disableProgress])

  const d         = new Date(article.date)
  const formatted = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })

  const sections = t.raw('sections') as UnexplainedSection[]

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

          {/* Intro */}
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize:   'clamp(1.125rem, 1vw + 0.75rem, 1.375rem)',
            lineHeight: 1.78,
            color:      'rgba(28,42,72,0.70)',
            maxWidth:   '62ch',
            margin:     '0 0 3rem',
          }}>
            {t('intro')}
          </p>

          {/* Cover image */}
          <div style={{ marginBottom: 'clamp(3.5rem, 6vw, 5rem)' }}>
            <HeroCover article={article} />
          </div>
        </motion.div>
      </Container>

      {/* ── Reading body ──────────────────────────────────────────────── */}
      <Container>
        <div style={{ maxWidth: '70ch', marginLeft: 'auto', marginRight: 'auto', paddingBottom: 'clamp(3.5rem, 6vw, 5rem)' }}>

          {sections.map((section, i) => (
            <Section key={i} reduced={reduced}>
              {section.heading && <Heading>{section.heading}</Heading>}

              {/* Prose body (if present) */}
              {section.body && <Para>{section.body}</Para>}

              {/* Intro line before a list (if present) */}
              {section.intro && (
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize:   'clamp(1rem, 0.25vw + 0.875rem, 1.125rem)',
                  lineHeight: 1.7,
                  color:      'rgba(28,42,72,0.78)',
                  fontWeight: 500,
                  margin:     '0 0 0.25rem',
                }}>
                  {section.intro}
                </p>
              )}

              {/* Bullet list (if present) */}
              {section.items && <BulletList items={section.items} />}
            </Section>
          ))}

          {/* Closing "Remember" panel */}
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
              fontStyle:             'italic',
              fontSize:              'clamp(1.0625rem, 0.5vw + 0.9rem, 1.25rem)',
              fontWeight:            500,
              lineHeight:            1.6,
              letterSpacing:         '-0.010em',
              color:                 INK,
              fontVariationSettings: '"opsz" 24',
              margin:                0,
            }}>
              {t('closing')}
            </p>
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
