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

/* PCOS article — an "Educate IVF · Conditions" piece with a richer body than the
 * generic prose renderer: bulleted lists, sub-headings, an aside note, and a
 * premium pull-quote. All copy is localised via the ArticlePcos message namespace,
 * so it reads natively in English and Marathi. */

const EASE = [0.22, 1, 0.36, 1] as const
const INK  = '#1C2A48'
const BODY = 'rgba(28,42,72,0.72)'
const MARK = 'rgba(194,78,106,0.85)'

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

function Subheading({ children }: { children: ReactNode }) {
  return (
    <h3 style={{
      fontFamily:            'var(--font-display)',
      fontSize:              'clamp(1.1875rem, 0.8vw + 0.9rem, 1.375rem)',
      fontWeight:            500,
      lineHeight:            1.25,
      letterSpacing:         '-0.014em',
      color:                 '#28407A',
      fontVariationSettings: '"opsz" 24',
      margin:                '0 0 0.75rem',
    }}>
      {children}
    </h3>
  )
}

function Para({ children, emphasis = false }: { children: ReactNode; emphasis?: boolean }) {
  return (
    <p style={{
      fontFamily: 'var(--font-body)',
      fontSize:   'clamp(1rem, 0.25vw + 0.875rem, 1.125rem)',
      lineHeight: emphasis ? 1.7 : 1.84,
      color:      emphasis ? 'rgba(28,42,72,0.80)' : BODY,
      fontWeight: emphasis ? 500 : 400,
      margin:     0,
    }}>
      {children}
    </p>
  )
}

function BulletList({ items }: { items: readonly string[] }) {
  return (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
      {items.map((item, i) => (
        <li
          key={i}
          style={{
            display:    'flex',
            gap:        '0.75rem',
            alignItems: 'flex-start',
            fontFamily: 'var(--font-body)',
            fontSize:   'clamp(1rem, 0.2vw + 0.9rem, 1.0625rem)',
            lineHeight: 1.7,
            color:      'rgba(28,42,72,0.76)',
          }}
        >
          <span aria-hidden="true" style={{ flexShrink: 0, width: '6px', height: '6px', borderRadius: '50%', background: MARK, marginTop: '0.62em' }} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

function Note({ children }: { children: ReactNode }) {
  return (
    <p style={{
      margin:     '1.125rem 0 0',
      display:    'inline-block',
      background: 'rgba(226,132,156,0.10)',
      color:      'rgba(28,42,72,0.64)',
      fontFamily: 'var(--font-body)',
      fontSize:   '0.9375rem',
      fontStyle:  'italic',
      lineHeight: 1.6,
      padding:    '0.625rem 1rem',
      borderRadius: '10px',
    }}>
      {children}
    </p>
  )
}

function PullQuote({ text }: { text: string }) {
  return (
    <figure style={{
      margin:       'clamp(1.75rem, 3vw, 2.5rem) 0',
      textAlign:    'center',
      padding:      'clamp(1.75rem, 3vw, 2.25rem) clamp(1.25rem, 3vw, 2rem)',
      background:   'linear-gradient(135deg, rgba(226,132,156,0.12), rgba(226,132,156,0.05))',
      border:       '1px solid rgba(226,132,156,0.24)',
      borderRadius: '18px',
    }}>
      <span aria-hidden="true" style={{
        display:      'block',
        fontFamily:   'var(--font-display)',
        fontSize:     '2.75rem',
        lineHeight:   0.6,
        color:        'rgba(226,132,156,0.55)',
        marginBottom: '0.5rem',
      }}>
        &ldquo;
      </span>
      <blockquote style={{
        margin:                0,
        fontFamily:            'var(--font-display)',
        fontStyle:             'italic',
        fontSize:              'clamp(1.375rem, 1.6vw + 0.6rem, 1.875rem)',
        fontWeight:            500,
        lineHeight:            1.3,
        letterSpacing:         '-0.010em',
        color:                 '#C24E6A',
        fontVariationSettings: '"opsz" 32',
      }}>
        {text}
      </blockquote>
    </figure>
  )
}

/* ─── Reveal wrapper ─────────────────────────────────────────────────────── */

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

export function PcosArticle({
  article,
  allArticles,
}: {
  article:     Article
  allArticles: ReadonlyArray<Article>
}) {
  const reduced = useReducedMotion()
  const t       = useTranslations('ArticlePcos')
  const tE      = useTranslations('EducateIVF')
  const cs      = CATEGORY_STYLES['Conditions']
  const { enableProgress, disableProgress } = useReadingProgress()

  useEffect(() => {
    enableProgress()
    return () => disableProgress()
  }, [enableProgress, disableProgress])

  const d         = new Date(article.date)
  const formatted = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })

  const signs         = t.raw('signs')         as string[]
  const diagnosisList = t.raw('diagnosisList') as string[]
  const lifestyleList = t.raw('lifestyleList') as string[]
  const medicinesList = t.raw('medicinesList') as string[]
  const regularList   = t.raw('regularList')   as string[]
  const visitList     = t.raw('visitList')     as string[]
  const rememberList  = t.raw('rememberList')  as string[]

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
            {article.title}
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

          {/* Common signs and symptoms */}
          <Section reduced={reduced}>
            <Heading>{t('signsHeading')}</Heading>
            <BulletList items={signs} />
            <Note>{t('signsNote')}</Note>
          </Section>

          {/* Why does PCOS happen? */}
          <Section reduced={reduced}>
            <Heading>{t('whyHeading')}</Heading>
            <Para>{t('whyBody')}</Para>
          </Section>

          {/* How is PCOS diagnosed? */}
          <Section reduced={reduced}>
            <Heading>{t('diagnosisHeading')}</Heading>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(1rem, 0.25vw + 0.875rem, 1.125rem)', lineHeight: 1.7, color: 'rgba(28,42,72,0.78)', fontWeight: 500, margin: '0 0 0.875rem' }}>
              {t('diagnosisIntro')}
            </p>
            <BulletList items={diagnosisList} />
          </Section>

          {/* How is PCOS treated? */}
          <Section reduced={reduced}>
            <Heading>{t('treatmentHeading')}</Heading>

            {/* Healthy lifestyle */}
            <div style={{ marginTop: '0.25rem' }}>
              <Subheading>{t('lifestyleSubheading')}</Subheading>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(1rem, 0.25vw + 0.875rem, 1.125rem)', lineHeight: 1.7, color: 'rgba(28,42,72,0.78)', fontWeight: 500, margin: '0 0 0.875rem' }}>
                {t('lifestyleIntro')}
              </p>
              <BulletList items={lifestyleList} />
            </div>

            {/* Mantra pull-quote */}
            <PullQuote text={t('mantra')} />

            {/* Medicines */}
            <div>
              <Subheading>{t('medicinesSubheading')}</Subheading>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(1rem, 0.25vw + 0.875rem, 1.125rem)', lineHeight: 1.7, color: 'rgba(28,42,72,0.78)', fontWeight: 500, margin: '0 0 0.875rem' }}>
                {t('medicinesIntro')}
              </p>
              <BulletList items={medicinesList} />
              <Note>{t('medicinesNote')}</Note>
            </div>
          </Section>

          {/* Why is regular treatment important? */}
          <Section reduced={reduced}>
            <Heading>{t('regularHeading')}</Heading>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(1rem, 0.25vw + 0.875rem, 1.125rem)', lineHeight: 1.7, color: 'rgba(28,42,72,0.78)', fontWeight: 500, margin: '0 0 0.875rem' }}>
              {t('regularIntro')}
            </p>
            <BulletList items={regularList} />
            <div style={{ marginTop: '1.125rem' }}>
              <Para emphasis>{t('regularClosing')}</Para>
            </div>
          </Section>

          {/* When should you visit us? */}
          <Section reduced={reduced}>
            <Heading>{t('visitHeading')}</Heading>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(1rem, 0.25vw + 0.875rem, 1.125rem)', lineHeight: 1.7, color: 'rgba(28,42,72,0.78)', fontWeight: 500, margin: '0 0 0.875rem' }}>
              {t('visitIntro')}
            </p>
            <BulletList items={visitList} />
          </Section>

          {/* Remember panel */}
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
              {t('rememberHeading')}
            </p>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {rememberList.map((item, i) => (
                <li key={i} style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', lineHeight: 1.7, color: 'rgba(28,42,72,0.76)', display: 'flex', gap: '0.625rem', alignItems: 'flex-start' }}>
                  <span aria-hidden="true" style={{ color: cs.color, fontWeight: 600, flexShrink: 0, marginTop: '0.05em' }}>&mdash;</span>
                  {item}
                </li>
              ))}
            </ul>
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
