'use client'

import { useEffect } from 'react'
import { motion } from 'motion/react'
import { ArrowLeft, ArrowRight, Check, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Container } from '@/components/layout/Container'
import { Pressable } from '@/components/motion/Pressable'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useReadingProgress } from '@/components/providers/ReadingProgressContext'
import { HeroCover, RelatedCard } from '@/components/sections/ArticleDetail'
import { CATEGORY_STYLES, type Article } from '@/lib/articles'

/* "IVF myths vs facts" — an "Educate IVF · Myths" piece. Each item is a myth
 * (the misconception) answered by a fact, rendered as a paired card. Localised
 * via the ArticleMyths message namespace, so it reads natively in EN and MR. */

const EASE = [0.22, 1, 0.36, 1] as const
const INK  = '#1C2A48'
const FACT = '#1F9D57'

type MythItem = { myth: string; fact: string }

/* ─── Myth → Fact card ───────────────────────────────────────────────────── */

function MythCard({
  index, item, mythLabel, factLabel, reduced,
}: {
  index: number; item: MythItem; mythLabel: string; factLabel: string; reduced: boolean
}) {
  return (
    <motion.article
      initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, ease: EASE }}
      style={{
        background:   '#FFFDF9',
        border:       '1px solid rgba(148,100,200,0.16)',
        borderRadius: '18px',
        padding:      'clamp(1.5rem, 3vw, 2rem)',
        boxShadow:    '0 18px 44px -28px rgba(46,79,142,0.18)',
      }}
    >
      {/* Myth */}
      <div>
        <span style={{
          display:       'inline-flex',
          alignItems:    'center',
          gap:           '0.375rem',
          fontFamily:    'var(--font-body)',
          fontSize:      '0.6875rem',
          fontWeight:    700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color:         'rgba(28,42,72,0.42)',
        }}>
          <X size={13} strokeWidth={2.5} aria-hidden="true" />
          {mythLabel} {index}
        </span>
        <p style={{
          fontFamily:            'var(--font-display)',
          fontStyle:             'italic',
          fontSize:              'clamp(1.1875rem, 1vw + 0.6rem, 1.4375rem)',
          fontWeight:            500,
          lineHeight:            1.4,
          letterSpacing:         '-0.012em',
          color:                 'rgba(28,42,72,0.72)',
          fontVariationSettings: '"opsz" 24',
          margin:                '0.5rem 0 0',
        }}>
          &ldquo;{item.myth}&rdquo;
        </p>
      </div>

      {/* Divider */}
      <div aria-hidden="true" style={{ height: '1px', background: 'rgba(148,100,200,0.16)', margin: 'clamp(1.125rem, 2.5vw, 1.5rem) 0' }} />

      {/* Fact */}
      <div>
        <span style={{
          display:       'inline-flex',
          alignItems:    'center',
          gap:           '0.375rem',
          fontFamily:    'var(--font-body)',
          fontSize:      '0.6875rem',
          fontWeight:    700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color:         FACT,
        }}>
          <Check size={13} strokeWidth={3} aria-hidden="true" />
          {factLabel}
        </span>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize:   'clamp(1rem, 0.25vw + 0.875rem, 1.125rem)',
          lineHeight: 1.8,
          color:      'rgba(28,42,72,0.76)',
          margin:     '0.5rem 0 0',
        }}>
          {item.fact}
        </p>
      </div>
    </motion.article>
  )
}

/* ─── Main export ────────────────────────────────────────────────────────── */

export function MythsArticle({
  article,
  allArticles,
}: {
  article:     Article
  allArticles: ReadonlyArray<Article>
}) {
  const reduced = useReducedMotion()
  const t       = useTranslations('ArticleMyths')
  const tE      = useTranslations('EducateIVF')
  const cs      = CATEGORY_STYLES['Myths']
  const { enableProgress, disableProgress } = useReadingProgress()

  useEffect(() => {
    enableProgress()
    return () => disableProgress()
  }, [enableProgress, disableProgress])

  const d         = new Date(article.date)
  const formatted = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })

  const items     = t.raw('items') as MythItem[]
  const mythLabel = t('mythLabel')
  const factLabel = t('factLabel')

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

      {/* ── Myth cards ────────────────────────────────────────────────── */}
      <Container>
        <div style={{ maxWidth: '46rem', marginLeft: 'auto', marginRight: 'auto', paddingBottom: 'clamp(3rem, 5vw, 4rem)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1rem, 2.5vw, 1.5rem)' }}>
            {items.map((item, i) => (
              <MythCard
                key={i}
                index={i + 1}
                item={item}
                mythLabel={mythLabel}
                factLabel={factLabel}
                reduced={reduced}
              />
            ))}
          </div>

          {/* Closing line */}
          <motion.p
            initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.68, ease: EASE }}
            style={{
              marginTop:             'clamp(2.5rem, 5vw, 3.5rem)',
              textAlign:             'center',
              fontFamily:            'var(--font-display)',
              fontStyle:             'italic',
              fontSize:              'clamp(1.25rem, 1.4vw + 0.5rem, 1.625rem)',
              fontWeight:            500,
              lineHeight:            1.5,
              letterSpacing:         '-0.012em',
              color:                 '#6E4A9E',
              fontVariationSettings: '"opsz" 28',
              maxWidth:              '32ch',
              marginInline:          'auto',
            }}
          >
            {t('closing')}
          </motion.p>
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
