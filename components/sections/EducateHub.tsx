'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { Container } from '@/components/layout/Container'
import { Pressable } from '@/components/motion/Pressable'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import {
  ARTICLES,
  CATEGORIES,
  CATEGORY_STYLES,
  type Article,
  type ArticleCategory,
} from '@/lib/articles'

const EASE        = [0.22, 1, 0.36, 1] as const
const SHADOW_REST = '0 20px 44px -24px rgba(46,79,142,0.14), 0 4px 10px -4px rgba(46,79,142,0.05)'
const SHADOW_LIFT = '0 36px 68px -12px rgba(46,79,142,0.24), 0 10px 22px -8px rgba(46,79,142,0.12)'

const FEATURED_SLUG = 'what-ivf-really-is'

/* ─── Cover image placeholder ─────────────────────────────────────────────── */

const COVER_GRADIENTS: Record<ArticleCategory, string> = {
  'Understanding IVF': 'linear-gradient(148deg, #E8EDF7 0%, #EEF2FB 45%, #F0EEF8 75%, #F5F3FC 100%)',
  'Conditions':        'linear-gradient(148deg, #F3EAEF 0%, #F9F2F6 45%, #F4EDF2 75%, #FBF5F9 100%)',
  'Myths':             'linear-gradient(148deg, #EBE8F5 0%, #F3F0FA 45%, #EEE9F6 75%, #F6F3FC 100%)',
}

function CoverPlaceholder({
  article,
  featured = false,
}: {
  article:  Article
  featured?: boolean
}) {
  const cs = CATEGORY_STYLES[article.category]
  return (
    <div
      aria-hidden="true"
      style={{
        width:        '100%',
        height:       '100%',
        minHeight:    featured ? '280px' : undefined,
        aspectRatio:  featured ? undefined : '3 / 2',
        background:   COVER_GRADIENTS[article.category],
        position:     'relative',
        overflow:     'hidden',
        display:      'flex',
        alignItems:   'center',
        justifyContent: 'center',
      }}
    >
      {/* Decorative blobs */}
      <div
        style={{
          position:     'absolute',
          top:          '-40px',
          right:        '-40px',
          width:        '180px',
          height:       '180px',
          borderRadius: '50%',
          background:   cs.accentBg,
          opacity:      1.4,
        }}
      />
      <div
        style={{
          position:     'absolute',
          bottom:       '-30px',
          left:         '-30px',
          width:        '140px',
          height:       '140px',
          borderRadius: '50%',
          background:   cs.accentBg,
          opacity:      0.9,
        }}
      />
      {/* Category initial watermark */}
      <span
        style={{
          fontFamily:            'var(--font-display)',
          fontSize:              featured ? '5rem' : '3.5rem',
          fontWeight:            500,
          fontVariationSettings: '"opsz" 72',
          lineHeight:            1,
          color:                 cs.accentEdge,
          opacity:               0.18,
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

/* ─── Date + read time meta ──────────────────────────────────────────────── */

function MetaRow({ article }: { article: Article }) {
  const d = new Date(article.date)
  const formatted = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
  return (
    <p
      style={{
        fontFamily: 'var(--font-body)',
        fontSize:   '0.8125rem',
        color:      'rgba(28,42,72,0.46)',
        margin:     0,
        display:    'flex',
        gap:        '0.5rem',
        flexWrap:   'wrap',
      }}
    >
      {formatted}
      <span aria-hidden="true" style={{ color: 'rgba(28,42,72,0.25)' }}>·</span>
      {article.readTime} min read
    </p>
  )
}

/* ─── Featured card ──────────────────────────────────────────────────────── */

function FeaturedCard({ article, reduced }: { article: Article; reduced: boolean }) {
  const [hovered, setIsHovered] = useState(false)
  const h = !reduced && hovered

  return (
    <Link
      href={`/educate-ivf/${article.slug}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ display: 'block', textDecoration: 'none' }}
    >
      <motion.article
        animate={{
          y:         h ? -6 : 0,
          boxShadow: h ? SHADOW_LIFT : SHADOW_REST,
        }}
        transition={{ type: 'spring', stiffness: 250, damping: 26, mass: 0.9 }}
        style={{
          background:   '#FEFCF9',
          borderRadius: '20px',
          overflow:     'hidden',
          cursor:       'pointer',
          display:      'grid',
          gridTemplateColumns: '1fr',
        }}
        className="lg:grid-cols-[5fr_7fr]"
      >
        {/* Image */}
        <div
          style={{
            overflow:   'hidden',
            minHeight:  '260px',
          }}
          className="lg:min-h-0"
        >
          <motion.div
            animate={{ scale: h ? 1.04 : 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 30 }}
            style={{ width: '100%', height: '100%' }}
          >
            <CoverPlaceholder article={article} featured />
          </motion.div>
        </div>

        {/* Text */}
        <div
          style={{
            padding:       'clamp(2rem, 4vw, 2.75rem)',
            display:       'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap:           '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <CategoryBadge category={article.category} />
            <MetaRow article={article} />
          </div>

          <h2
            style={{
              fontFamily:            'var(--font-display)',
              fontSize:              'clamp(1.625rem, 2.5vw + 0.5rem, 2.375rem)',
              fontWeight:            500,
              lineHeight:            1.14,
              letterSpacing:         '-0.025em',
              color:                 '#1C2A48',
              fontVariationSettings: '"opsz" 36',
              margin:                0,
            }}
          >
            {article.title}
          </h2>

          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize:   'clamp(1rem, 0.5vw + 0.75rem, 1.125rem)',
              lineHeight: 1.76,
              color:      'rgba(28,42,72,0.64)',
              margin:     0,
              maxWidth:   '52ch',
            }}
          >
            {article.excerpt}
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
              marginTop:  '0.25rem',
            }}
          >
            Read article
            <motion.span
              animate={{ x: h ? 5 : 0 }}
              transition={{ duration: 0.20, ease: EASE }}
              style={{ display: 'flex' }}
            >
              <ArrowRight size={15} strokeWidth={2} />
            </motion.span>
          </span>
        </div>
      </motion.article>
    </Link>
  )
}

/* ─── Regular article card ───────────────────────────────────────────────── */

function ArticleCard({ article, reduced }: { article: Article; reduced: boolean }) {
  const [hovered, setIsHovered] = useState(false)
  const h = !reduced && hovered

  return (
    <Link
      href={`/educate-ivf/${article.slug}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ display: 'block', textDecoration: 'none', height: '100%' }}
    >
      <motion.article
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
          overflow:      'hidden',
          cursor:        'pointer',
          height:        '100%',
          display:       'flex',
          flexDirection: 'column',
        }}
      >
        {/* Cover */}
        <div style={{ overflow: 'hidden', borderRadius: '0' }}>
          <motion.div
            animate={{ scale: h ? 1.05 : 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 30 }}
          >
            <CoverPlaceholder article={article} />
          </motion.div>
        </div>

        {/* Body */}
        <div
          style={{
            padding:       'clamp(1.375rem, 2.5vw, 1.75rem)',
            display:       'flex',
            flexDirection: 'column',
            flex:          1,
            gap:           '0.625rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap' }}>
            <CategoryBadge category={article.category} />
            <MetaRow article={article} />
          </div>

          <h3
            style={{
              fontFamily:            'var(--font-display)',
              fontSize:              'clamp(1.25rem, 1.5vw + 0.5rem, 1.5rem)',
              fontWeight:            500,
              lineHeight:            1.22,
              letterSpacing:         '-0.018em',
              color:                 '#1C2A48',
              fontVariationSettings: '"opsz" 28',
              margin:                0,
            }}
          >
            {article.title}
          </h3>

          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize:   '0.9375rem',
              lineHeight: 1.70,
              color:      'rgba(28,42,72,0.60)',
              margin:     0,
              flex:       1,
            }}
          >
            {article.excerpt}
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
              marginTop:  '0.25rem',
            }}
          >
            Read more
            <motion.span
              animate={{ x: h ? 4 : 0 }}
              transition={{ duration: 0.20, ease: EASE }}
              style={{ display: 'flex' }}
            >
              <ArrowRight size={14} strokeWidth={2} />
            </motion.span>
          </span>
        </div>
      </motion.article>
    </Link>
  )
}

/* ─── Category filter row ────────────────────────────────────────────────── */

function CategoryFilter({
  active,
  onChange,
  reduced,
}: {
  active:   string
  onChange: (c: string) => void
  reduced:  boolean
}) {
  const pills = CATEGORIES

  return (
    <div
      style={{
        display:    'flex',
        gap:        '0.5rem',
        flexWrap:   'nowrap',
        overflowX:  'auto',
        paddingBottom: '2px',
        msOverflowStyle: 'none',
        scrollbarWidth:  'none',
      }}
      className="hide-scrollbar"
    >
      {pills.map((cat) => {
        const isActive = active === cat
        return (
          <button
            key={cat}
            type="button"
            onClick={() => onChange(cat)}
            style={{
              flexShrink:    0,
              fontFamily:    'var(--font-body)',
              fontSize:      '0.875rem',
              fontWeight:    isActive ? 600 : 400,
              letterSpacing: isActive ? '-0.01em' : '0',
              color:         isActive ? '#1C2A48' : 'rgba(28,42,72,0.52)',
              background:    isActive ? '#FEFCF9' : 'transparent',
              border:        isActive ? '1px solid rgba(216,204,190,0.70)' : '1px solid transparent',
              padding:       '0.4375rem 1.0625rem',
              borderRadius:  '100px',
              cursor:        'pointer',
              transition:    reduced ? 'none' : 'all 0.20s ease',
              boxShadow:     isActive ? '0 2px 8px -3px rgba(28,42,72,0.12)' : 'none',
              whiteSpace:    'nowrap',
            }}
          >
            {cat}
          </button>
        )
      })}
    </div>
  )
}

/* ─── Hub ────────────────────────────────────────────────────────────────── */

export function EducateHub() {
  const reduced        = useReducedMotion()
  const [activeFilter, setActiveFilter] = useState<string>('All')

  const featured = ARTICLES.find((a) => a.slug === FEATURED_SLUG)!
  const rest      = ARTICLES.filter((a) => a.slug !== FEATURED_SLUG)

  const showFeatured =
    activeFilter === 'All' || activeFilter === featured.category

  const visibleRest = rest.filter(
    (a) => activeFilter === 'All' || a.category === activeFilter
  )

  const staggerV = {
    hidden:  {},
    visible: {
      transition: {
        staggerChildren: reduced ? 0 : 0.09,
        delayChildren:   reduced ? 0 : 0.04,
      },
    },
  }
  const revealV = {
    hidden:  { opacity: reduced ? 1 : 0, y: reduced ? 0 : 26 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.66, ease: EASE } },
  }

  return (
    <div style={{ background: '#FBF7F1', minHeight: '100vh' }}>

      {/* ── Intro ─────────────────────────────────────────────────────── */}
      <Container>
        <motion.div
          initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.82, ease: EASE }}
          style={{
            paddingTop:    'clamp(9rem, 14vw, 11rem)',
            paddingBottom: 'clamp(3rem, 5vw, 4.5rem)',
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
            Learn, at your pace
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
              maxWidth:              '24ch',
            }}
          >
            Understanding, one question at a time.
          </h1>

          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize:   'clamp(1.0625rem, 0.5vw + 0.75rem, 1.25rem)',
              lineHeight: 1.76,
              color:      'rgba(28,42,72,0.62)',
              maxWidth:   '58ch',
              margin:     '0 0 2.75rem',
            }}
          >
            Honest, plain-language answers to the things couples wonder about
            most&nbsp;&mdash; written by the people who will care for you.
          </p>

          {/* Category filter */}
          <CategoryFilter
            active={activeFilter}
            onChange={setActiveFilter}
            reduced={reduced}
          />
        </motion.div>
      </Container>

      {/* ── Articles ──────────────────────────────────────────────────── */}
      <Container>
        <div style={{ paddingBottom: 'clamp(5rem, 8vw, 7rem)' }}>

          {/* Featured card */}
          {showFeatured && (
            <motion.div
              initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.72, ease: EASE, delay: reduced ? 0 : 0.08 }}
              style={{ marginBottom: 'clamp(1.5rem, 2.5vw, 2rem)' }}
            >
              <FeaturedCard article={featured} reduced={reduced} />
            </motion.div>
          )}

          {/* Grid */}
          {visibleRest.length > 0 && (
            <motion.div
              variants={staggerV}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6"
            >
              {visibleRest.map((article) => (
                <motion.div
                  key={article.slug}
                  variants={revealV}
                  style={{ display: 'flex', flexDirection: 'column' }}
                >
                  <ArticleCard article={article} reduced={reduced} />
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Empty state (when filtering with no results) */}
          {!showFeatured && visibleRest.length === 0 && (
            <div style={{ textAlign: 'center', paddingTop: '3rem', paddingBottom: '3rem' }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'rgba(28,42,72,0.46)' }}>
                No articles in this category yet.
              </p>
            </div>
          )}
        </div>
      </Container>

      {/* ── CTA band ──────────────────────────────────────────────────── */}
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
              paddingTop:     'clamp(3.5rem, 6vw, 5rem)',
              paddingBottom:  'clamp(3.5rem, 6vw, 5rem)',
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
                fontSize:              'clamp(1.25rem, 2vw + 0.5rem, 1.75rem)',
                fontWeight:            500,
                lineHeight:            1.30,
                letterSpacing:         '-0.018em',
                color:                 '#1C2A48',
                fontVariationSettings: '"opsz" 28',
                maxWidth:              '44ch',
                margin:                0,
              }}
            >
              Still have a question we have not answered?
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
                Ask our specialists
                <ArrowRight size={15} strokeWidth={2} />
              </Link>
            </Pressable>
          </motion.div>
        </Container>
      </div>
    </div>
  )
}
