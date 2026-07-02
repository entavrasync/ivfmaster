'use client'

import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Container } from '@/components/layout/Container'
import { Pressable } from '@/components/motion/Pressable'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useReadingProgress } from '@/components/providers/ReadingProgressContext'
import {
  CATEGORY_STYLES,
  type Article,
  type ArticleCategory,
} from '@/lib/articles'

const EASE        = [0.22, 1, 0.36, 1] as const
const SHADOW_REST = '0 20px 44px -24px rgba(46,79,142,0.14), 0 4px 10px -4px rgba(46,79,142,0.05)'
const SHADOW_LIFT = '0 36px 68px -12px rgba(46,79,142,0.24), 0 10px 22px -8px rgba(46,79,142,0.12)'

const COVER_GRADIENTS: Record<ArticleCategory, string> = {
  'Understanding IVF': 'linear-gradient(148deg, #E8EDF7 0%, #EEF2FB 45%, #F0EEF8 75%, #F5F3FC 100%)',
  'Conditions':        'linear-gradient(148deg, #F3EAEF 0%, #F9F2F6 45%, #F4EDF2 75%, #FBF5F9 100%)',
  'Myths':             'linear-gradient(148deg, #EBE8F5 0%, #F3F0FA 45%, #EEE9F6 75%, #F6F3FC 100%)',
}

/* ─── Category badge ─────────────────────────────────────────────────────── */

function CategoryBadge({ category }: { category: ArticleCategory }) {
  const cs = CATEGORY_STYLES[category]
  return (
    <span
      style={{
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
        whiteSpace:    'nowrap',
      }}
    >
      {category}
    </span>
  )
}

/* ─── Cover image placeholder ────────────────────────────────────────────── */

function HeroCover({ article }: { article: Article }) {
  const cs = CATEGORY_STYLES[article.category]
  return (
    <div
      aria-hidden="true"
      style={{
        width:        '100%',
        aspectRatio:  '21 / 9',
        background:   COVER_GRADIENTS[article.category],
        borderRadius: '20px',
        overflow:     'hidden',
        position:     'relative',
        display:      'flex',
        alignItems:   'center',
        justifyContent: 'center',
        boxShadow:    '0 24px 52px -16px rgba(46,79,142,0.14)',
      }}
    >
      <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '300px', height: '300px', borderRadius: '50%', background: cs.accentBg, opacity: 1.2 }} />
      <div style={{ position: 'absolute', bottom: '-50px', left: '-50px', width: '240px', height: '240px', borderRadius: '50%', background: cs.accentBg, opacity: 0.9 }} />
      <span
        style={{
          fontFamily:            'var(--font-display)',
          fontSize:              '8rem',
          fontWeight:            500,
          fontVariationSettings: '"opsz" 96',
          lineHeight:            1,
          color:                 cs.accentEdge,
          opacity:               0.14,
          userSelect:            'none',
          pointerEvents:         'none',
          position:              'relative',
          zIndex:                1,
        }}
      >
        {article.title.charAt(0).toUpperCase()}
      </span>
    </div>
  )
}

/* ─── Related article card ───────────────────────────────────────────────── */

function RelatedCard({ article, reduced }: { article: Article; reduced: boolean }) {
  const [hovered, setIsHovered] = useState(false)
  const h = !reduced && hovered
  const cs = CATEGORY_STYLES[article.category]

  return (
    <Link
      href={`/educate-ivf/${article.slug}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ display: 'block', textDecoration: 'none', height: '100%' }}
    >
      <motion.div
        animate={{
          y:         h ? -5 : 0,
          scale:     h ? 1.015 : 1,
          boxShadow: h ? SHADOW_LIFT : SHADOW_REST,
        }}
        transition={{ type: 'spring', stiffness: 260, damping: 28 }}
        style={{
          background:    '#FEFCF9',
          borderRadius:  '16px',
          overflow:      'hidden',
          cursor:        'pointer',
          height:        '100%',
          display:       'flex',
          flexDirection: 'column',
        }}
      >
        {/* Mini cover */}
        <div
          style={{
            background:  COVER_GRADIENTS[article.category],
            aspectRatio: '16 / 9',
            display:     'flex',
            alignItems:  'center',
            justifyContent: 'center',
            position:    'relative',
            overflow:    'hidden',
          }}
          aria-hidden="true"
        >
          <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', borderRadius: '50%', background: cs.accentBg }} />
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 500, fontVariationSettings: '"opsz" 40', color: cs.accentEdge, opacity: 0.20, userSelect: 'none', position: 'relative', zIndex: 1 }}>
            {article.title.charAt(0)}
          </span>
        </div>

        {/* Body */}
        <div style={{ padding: '1.25rem 1.375rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '0.5rem' }}>
          <CategoryBadge category={article.category} />
          <h4
            style={{
              fontFamily:            'var(--font-display)',
              fontSize:              '1.125rem',
              fontWeight:            500,
              lineHeight:            1.28,
              letterSpacing:         '-0.015em',
              color:                 '#1C2A48',
              fontVariationSettings: '"opsz" 24',
              margin:                0,
              flex:                  1,
            }}
          >
            {article.title}
          </h4>
          <span
            style={{
              display:    'inline-flex',
              alignItems: 'center',
              gap:        '0.3rem',
              fontFamily: 'var(--font-body)',
              fontSize:   '0.8125rem',
              fontWeight: 500,
              color:      '#E2849C',
            }}
          >
            Read
            <motion.span animate={{ x: h ? 3 : 0 }} transition={{ duration: 0.18, ease: EASE }} style={{ display: 'flex' }}>
              <ArrowRight size={13} strokeWidth={2} />
            </motion.span>
          </span>
        </div>
      </motion.div>
    </Link>
  )
}

/* ─── Main export ────────────────────────────────────────────────────────── */

export function ArticleDetail({
  article,
  allArticles,
}: {
  article:     Article
  allArticles: ReadonlyArray<Article>
}) {
  const reduced = useReducedMotion()
  const cs      = CATEGORY_STYLES[article.category]
  const { enableProgress, disableProgress } = useReadingProgress()

  useEffect(() => {
    enableProgress()
    return () => disableProgress()
  }, [enableProgress, disableProgress])

  const d         = new Date(article.date)
  const formatted = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })

  const relatedArticles = article.relatedSlugs
    ? article.relatedSlugs
        .map((s) => allArticles.find((a) => a.slug === s))
        .filter((a): a is Article => a !== undefined)
    : allArticles.filter((a) => a.slug !== article.slug && a.category === article.category).slice(0, 3)

  return (
    <div style={{ background: '#FBF7F1', minHeight: '100vh' }}>

      {/* ── Back link ─────────────────────────────────────────────────── */}
      <Container>
        <div
          style={{
            paddingTop:    'clamp(6rem, 10vw, 8rem)',
            paddingBottom: '1.5rem',
          }}
        >
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
              transition:     reduced ? 'none' : 'color 0.18s ease',
            }}
          >
            <ArrowLeft size={14} strokeWidth={2} />
            Back to Educate IVF
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
          <div
            style={{
              display:     'flex',
              alignItems:  'center',
              gap:         '0.75rem',
              flexWrap:    'wrap',
              marginBottom: '1.5rem',
            }}
          >
            <CategoryBadge category={article.category} />
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize:   '0.8125rem',
                color:      'rgba(28,42,72,0.46)',
                display:    'flex',
                gap:        '0.5rem',
              }}
            >
              {formatted}
              <span aria-hidden="true" style={{ color: 'rgba(28,42,72,0.25)' }}>·</span>
              {article.readTime} min read
            </span>
          </div>

          {/* Title */}
          <h1
            style={{
              fontFamily:            'var(--font-display)',
              fontSize:              'clamp(2.25rem, 4vw + 0.25rem, 3.75rem)',
              fontWeight:            500,
              lineHeight:            1.06,
              letterSpacing:         '-0.030em',
              color:                 '#1C2A48',
              fontVariationSettings: '"opsz" 48',
              margin:                '0 0 1.5rem',
              maxWidth:              '22ch',
            }}
          >
            {article.title}
          </h1>

          {/* Intro */}
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize:   'clamp(1.125rem, 1vw + 0.75rem, 1.375rem)',
              lineHeight: 1.78,
              color:      'rgba(28,42,72,0.70)',
              maxWidth:   '62ch',
              margin:     '0 0 3rem',
            }}
          >
            {article.intro}
          </p>

          {/* Cover image */}
          <div style={{ marginBottom: 'clamp(3.5rem, 6vw, 5rem)' }}>
            <HeroCover article={article} />
          </div>
        </motion.div>
      </Container>

      {/* ── Reading body ──────────────────────────────────────────────── */}
      <Container>
        <div
          style={{
            maxWidth:     '70ch',
            marginLeft:   'auto',
            marginRight:  'auto',
            paddingBottom: 'clamp(3.5rem, 6vw, 5rem)',
          }}
        >
          {article.sections.map((section, i) => (
            <motion.div
              key={i}
              initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.68, ease: EASE, delay: reduced ? 0 : i * 0.04 }}
              style={{ marginBottom: 'clamp(2.5rem, 4vw, 3.5rem)' }}
            >
              <h2
                style={{
                  fontFamily:            'var(--font-display)',
                  fontSize:              'clamp(1.375rem, 1.5vw + 0.5rem, 1.875rem)',
                  fontWeight:            500,
                  lineHeight:            1.20,
                  letterSpacing:         '-0.020em',
                  color:                 '#1C2A48',
                  fontVariationSettings: '"opsz" 32',
                  margin:                '0 0 1.125rem',
                }}
              >
                {section.heading}
              </h2>

              {section.body.split('\n\n').map((para, pi) => (
                <p
                  key={pi}
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize:   'clamp(1rem, 0.25vw + 0.875rem, 1.125rem)',
                    lineHeight: 1.84,
                    color:      'rgba(28,42,72,0.72)',
                    margin:     pi > 0 ? '1.125rem 0 0' : '0',
                  }}
                >
                  {para}
                </p>
              ))}
            </motion.div>
          ))}

          {/* Key takeaways */}
          {article.keyTakeaways && article.keyTakeaways.length > 0 && (
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
                marginBottom: 'clamp(3.5rem, 6vw, 5rem)',
              }}
            >
              <p
                style={{
                  fontFamily:            'var(--font-display)',
                  fontSize:              '1.25rem',
                  fontWeight:            500,
                  lineHeight:            1.20,
                  letterSpacing:         '-0.016em',
                  color:                 '#1C2A48',
                  fontVariationSettings: '"opsz" 24',
                  margin:                '0 0 1.125rem',
                }}
              >
                In short
              </p>
              <ul
                style={{
                  listStyle: 'none',
                  margin:    0,
                  padding:   0,
                  display:   'flex',
                  flexDirection: 'column',
                  gap:       '0.75rem',
                }}
              >
                {article.keyTakeaways.map((item, i) => (
                  <li
                    key={i}
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize:   '1rem',
                      lineHeight: 1.70,
                      color:      'rgba(28,42,72,0.76)',
                      display:    'flex',
                      gap:        '0.625rem',
                      alignItems: 'flex-start',
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        color:     cs.color,
                        fontWeight: 600,
                        flexShrink: 0,
                        marginTop:  '0.05em',
                      }}
                    >
                      &mdash;
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>
      </Container>

      {/* ── End CTA ───────────────────────────────────────────────────── */}
      <div
        style={{
          borderTop:    '1px solid rgba(216,204,190,0.50)',
          borderBottom: '1px solid rgba(216,204,190,0.50)',
          background:   'rgba(236,234,244,0.35)',
        }}
      >
        <Container>
          <motion.div
            initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.68, ease: EASE }}
            style={{
              paddingTop:     'clamp(3.5rem, 6vw, 5rem)',
              paddingBottom:  'clamp(3.5rem, 6vw, 5rem)',
              textAlign:      'center',
              display:        'flex',
              flexDirection:  'column',
              alignItems:     'center',
              gap:            '1.5rem',
            }}
          >
            <h2
              style={{
                fontFamily:            'var(--font-display)',
                fontSize:              'clamp(1.5rem, 2.5vw + 0.25rem, 2.25rem)',
                fontWeight:            500,
                lineHeight:            1.18,
                letterSpacing:         '-0.022em',
                color:                 '#1C2A48',
                fontVariationSettings: '"opsz" 36',
                maxWidth:              '30ch',
                margin:                0,
              }}
            >
              Have a question about your situation?
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
                Talk to our specialists
                <ArrowRight size={15} strokeWidth={2} />
              </Link>
            </Pressable>

            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize:   '0.875rem',
                color:      'rgba(28,42,72,0.44)',
                margin:     0,
              }}
            >
              No pressure &mdash; just honest answers.
            </p>
          </motion.div>
        </Container>
      </div>

      {/* ── Related articles ──────────────────────────────────────────── */}
      {relatedArticles.length > 0 && (
        <Container>
          <motion.div
            initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.68, ease: EASE }}
            style={{
              paddingTop:    'clamp(3.5rem, 6vw, 5rem)',
              paddingBottom: 'clamp(4rem, 7vw, 6rem)',
            }}
          >
            <h2
              style={{
                fontFamily:            'var(--font-display)',
                fontSize:              'clamp(1.375rem, 1.5vw + 0.5rem, 1.875rem)',
                fontWeight:            500,
                lineHeight:            1.18,
                letterSpacing:         '-0.018em',
                color:                 '#1C2A48',
                fontVariationSettings: '"opsz" 30',
                margin:                '0 0 2rem',
              }}
            >
              Keep reading.
            </h2>

            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {relatedArticles.map((related, i) => (
                <motion.div
                  key={related.slug}
                  initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.60, ease: EASE, delay: reduced ? 0 : i * 0.08 }}
                  style={{ display: 'flex', flexDirection: 'column' }}
                >
                  <RelatedCard article={related} reduced={reduced} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </Container>
      )}
    </div>
  )
}
