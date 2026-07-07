'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
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
import { RICH_ARTICLES, type RichBlock } from '@/lib/richArticles'

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

export function HeroCover({ article }: { article: Article }) {
  const cs = CATEGORY_STYLES[article.category]
  /* A real procedure photo takes over the whole frame when the article has one;
   * otherwise we keep the lettered gradient placeholder. The gradient stays as a
   * warm backdrop while the photo loads. */
  const hasImage = Boolean(article.coverImage)
  return (
    <div
      aria-hidden={hasImage ? undefined : 'true'}
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
      {article.coverImage ? (
        <Image
          src={article.coverImage}
          alt={article.title}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 1120px"
          style={{ objectFit: 'cover' }}
        />
      ) : (
        <>
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
        </>
      )}
    </div>
  )
}

/* ─── Related article card ───────────────────────────────────────────────── */

export function RelatedCard({ article, reduced }: { article: Article; reduced: boolean }) {
  const [hovered, setIsHovered] = useState(false)
  const t  = useTranslations('EducateIVF')
  const h  = !reduced && hovered
  const cs = CATEGORY_STYLES[article.category]
  const title = article.i18nKey ? t(`articles.${article.i18nKey}.title`) : article.title

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
          aria-hidden={article.coverImage ? undefined : 'true'}
        >
          {article.coverImage ? (
            <Image
              src={article.coverImage}
              alt={title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <>
              <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', borderRadius: '50%', background: cs.accentBg }} />
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 500, fontVariationSettings: '"opsz" 40', color: cs.accentEdge, opacity: 0.20, userSelect: 'none', position: 'relative', zIndex: 1 }}>
                {title.charAt(0)}
              </span>
            </>
          )}
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
            {title}
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

/* ─── PCOS rich body ─────────────────────────────────────────────────────────
 * A bespoke, best-in-class reading layout for the fully-translated PCOS
 * article. All copy is pulled from next-intl (EducateIVF.articles.pcos) so the
 * same layout renders correctly in English and Marathi. Sections carry lists
 * with soft dot markers, sub-headings, and the mantra as a premium pull-quote. */

const INK        = '#1C2A48'
const INK_BODY   = 'rgba(28,42,72,0.74)'
const INK_MUTED  = 'rgba(28,42,72,0.56)'
const LAVENDER   = 'rgba(148,100,200,'  // + alpha)

function RichHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        fontFamily:            'var(--font-display)',
        fontSize:              'clamp(1.375rem, 1.5vw + 0.5rem, 1.875rem)',
        fontWeight:            500,
        lineHeight:            1.2,
        letterSpacing:         '-0.02em',
        color:                 INK,
        fontVariationSettings: '"opsz" 32',
        margin:                '0 0 1.125rem',
      }}
    >
      {children}
    </h2>
  )
}

function RichSubheading({ children }: { children: React.ReactNode }) {
  return (
    <h3
      style={{
        fontFamily:            'var(--font-display)',
        fontSize:              'clamp(1.125rem, 1vw + 0.5rem, 1.375rem)',
        fontWeight:            500,
        lineHeight:            1.24,
        letterSpacing:         '-0.014em',
        color:                 INK,
        fontVariationSettings: '"opsz" 24',
        margin:                '0 0 0.75rem',
      }}
    >
      {children}
    </h3>
  )
}

function RichPara({ children, muted = false }: { children: React.ReactNode; muted?: boolean }) {
  return (
    <p
      style={{
        fontFamily: 'var(--font-body)',
        fontSize:   'clamp(1.0625rem, 0.25vw + 0.9375rem, 1.1875rem)',
        lineHeight: 1.8,
        color:      muted ? INK_MUTED : INK_BODY,
        margin:     '0 0 0.75rem',
      }}
    >
      {children}
    </p>
  )
}

function RichList({ items, accent }: { items: readonly string[]; accent: string }) {
  return (
    <ul
      style={{
        listStyle:     'none',
        margin:        '0.25rem 0 0',
        padding:       0,
        display:       'flex',
        flexDirection: 'column',
        gap:           '0.6875rem',
      }}
    >
      {items.map((item, i) => (
        <li
          key={i}
          style={{
            fontFamily: 'var(--font-body)',
            fontSize:   'clamp(1.0625rem, 0.25vw + 0.9375rem, 1.1875rem)',
            lineHeight: 1.7,
            color:      INK_BODY,
            display:    'flex',
            gap:        '0.75rem',
            alignItems: 'flex-start',
          }}
        >
          <span
            aria-hidden="true"
            style={{
              flexShrink:   0,
              width:        '7px',
              height:       '7px',
              borderRadius: '50%',
              background:   accent,
              marginTop:    '0.62em',
            }}
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

function RichNote({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontFamily: 'var(--font-body)',
        fontSize:   '0.9375rem',
        fontStyle:  'italic',
        lineHeight: 1.64,
        color:      INK_MUTED,
        margin:     '1rem 0 0',
      }}
    >
      {children}
    </p>
  )
}

/* Definition-style list: each item is "Term: description"; the term before the
 * first colon is emphasised. Used for the IVF phase sub-points. */
function RichDefList({ items, accent }: { items: readonly string[]; accent: string }) {
  return (
    <ul
      style={{
        listStyle:     'none',
        margin:        '0.5rem 0 0',
        padding:       0,
        display:       'flex',
        flexDirection: 'column',
        gap:           '0.9375rem',
      }}
    >
      {items.map((item, i) => {
        const idx  = item.indexOf(': ')
        const term = idx > 0 ? item.slice(0, idx) : null
        const rest = idx > 0 ? item.slice(idx + 2) : item
        return (
          <li
            key={i}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize:   'clamp(1.0625rem, 0.25vw + 0.9375rem, 1.1875rem)',
              lineHeight: 1.72,
              color:      INK_BODY,
              display:    'flex',
              gap:        '0.75rem',
              alignItems: 'flex-start',
            }}
          >
            <span
              aria-hidden="true"
              style={{ flexShrink: 0, width: '7px', height: '7px', borderRadius: '50%', background: accent, marginTop: '0.6em' }}
            />
            <span>
              {term && (
                <strong style={{ fontWeight: 600, color: INK }}>{term}: </strong>
              )}
              {rest}
            </span>
          </li>
        )
      })}
    </ul>
  )
}

/* Soft, warm highlighted paragraph — used for a hopeful or reassuring beat. */
function RichHighlight({ text, reduced }: { text: string; reduced: boolean }) {
  return (
    <motion.div
      initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.66, ease: EASE }}
      style={{
        margin:       '0.25rem 0 0',
        padding:      'clamp(1.375rem, 3vw, 1.875rem) clamp(1.5rem, 3vw, 2rem)',
        borderRadius: '18px',
        background:   'linear-gradient(135deg, rgba(148,100,200,0.09) 0%, rgba(226,132,156,0.11) 100%)',
        border:       '1px solid rgba(148,100,200,0.14)',
      }}
    >
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize:   'clamp(1.0625rem, 0.4vw + 0.95rem, 1.25rem)',
          fontWeight: 500,
          lineHeight: 1.66,
          color:      INK,
          margin:     0,
        }}
      >
        {text}
      </p>
    </motion.div>
  )
}

function SignatureQuote({ text, reduced }: { text: string; reduced: boolean }) {
  return (
    <motion.figure
      initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, ease: EASE }}
      style={{
        margin:       'clamp(2rem, 4vw, 2.75rem) 0',
        padding:      'clamp(1.75rem, 4vw, 2.5rem) clamp(1.5rem, 4vw, 2.5rem)',
        borderRadius: '22px',
        background:   'linear-gradient(135deg, rgba(148,100,200,0.11) 0%, rgba(226,132,156,0.13) 100%)',
        border:       '1px solid rgba(148,100,200,0.16)',
        boxShadow:    '0 24px 52px -28px rgba(120,72,168,0.34)',
        position:     'relative',
        overflow:     'hidden',
      }}
    >
      <span
        aria-hidden="true"
        style={{
          position:              'absolute',
          top:                   'clamp(-0.5rem, -1vw, -0.25rem)',
          left:                  'clamp(1rem, 3vw, 1.75rem)',
          fontFamily:            'var(--font-display)',
          fontSize:              '6rem',
          lineHeight:            1,
          color:                 'rgba(148,100,200,0.18)',
          fontVariationSettings: '"opsz" 96',
          pointerEvents:         'none',
          userSelect:            'none',
        }}
      >
        &ldquo;
      </span>
      <blockquote
        style={{
          margin:                0,
          position:              'relative',
          zIndex:                1,
          fontFamily:            'var(--font-display)',
          fontSize:              'clamp(1.5rem, 2.5vw + 0.5rem, 2.25rem)',
          fontWeight:            500,
          lineHeight:            1.28,
          letterSpacing:         '-0.02em',
          color:                 INK,
          fontVariationSettings: '"opsz" 40',
          textAlign:             'center',
        }}
      >
        {text}
      </blockquote>
    </motion.figure>
  )
}

function RichSectionWrap({
  children,
  reduced,
  index,
}: {
  children: React.ReactNode
  reduced:  boolean
  index:    number
}) {
  return (
    <motion.section
      initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.68, ease: EASE, delay: reduced ? 0 : Math.min(index, 3) * 0.04 }}
      style={{ marginBottom: 'clamp(2.5rem, 4vw, 3.5rem)' }}
    >
      {children}
    </motion.section>
  )
}

/* Renders a single content block by resolving its field against the article's
 * message namespace. `s` returns a string, `a` returns a string[]. */
function RichBlockView({
  block,
  s,
  a,
  accent,
  reduced,
}: {
  block:   RichBlock
  s:       (f: string) => string
  a:       (f: string) => string[]
  accent:  string
  reduced: boolean
}) {
  switch (block.kind) {
    case 'para':
    case 'intro':
      return (
        <>
          {s(block.field).split('\n\n').map((para, i) => (
            <RichPara key={i}>{para}</RichPara>
          ))}
        </>
      )
    case 'paraMuted':
      return <RichPara muted>{s(block.field)}</RichPara>
    case 'list':
      return <RichList items={a(block.field)} accent={accent} />
    case 'defList':
      return <RichDefList items={a(block.field)} accent={accent} />
    case 'note':
      return <RichNote>{s(block.field)}</RichNote>
    case 'sub':
      return <RichSubheading>{s(block.field)}</RichSubheading>
    case 'quote':
      return <SignatureQuote text={s(block.field)} reduced={reduced} />
    case 'highlight':
      return <RichHighlight text={s(block.field)} reduced={reduced} />
    default:
      return null
  }
}

/* Data-driven body for any fully-translated article. Structure comes from
 * RICH_ARTICLES[i18nKey]; all copy is resolved from next-intl so EN and MR
 * render from the same layout. */
function RichBody({
  i18nKey,
  cs,
  reduced,
}: {
  i18nKey: string
  cs:      (typeof CATEGORY_STYLES)[ArticleCategory]
  reduced: boolean
}) {
  const t   = useTranslations('EducateIVF')
  const cfg = RICH_ARTICLES[i18nKey]
  const base = `articles.${i18nKey}`
  const s   = (f: string) => t(`${base}.${f}`)
  const a   = (f: string) => t.raw(`${base}.${f}`) as string[]
  const dot = cs.color

  if (!cfg) return null

  return (
    <div>
      {cfg.sections.map((section, i) => (
        <RichSectionWrap key={i} reduced={reduced} index={i}>
          {section.headingField && <RichHeading>{s(section.headingField)}</RichHeading>}
          {section.blocks.map((block, j) => (
            <RichBlockView key={j} block={block} s={s} a={a} accent={dot} reduced={reduced} />
          ))}
        </RichSectionWrap>
      ))}

      {/* Remember — soft lavender takeaways panel */}
      {cfg.remember && (
        <motion.div
          initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.68, ease: EASE }}
          style={{
            background:   `${LAVENDER}0.07)`,
            borderLeft:   `3px solid ${LAVENDER}0.42)`,
            borderRadius: '0 18px 18px 0',
            padding:      'clamp(1.5rem, 3vw, 2.25rem)',
            marginTop:    'clamp(1rem, 2vw, 2rem)',
          }}
        >
          <p
            style={{
              fontFamily:            'var(--font-display)',
              fontSize:              '1.25rem',
              fontWeight:            500,
              lineHeight:            1.2,
              letterSpacing:         '-0.016em',
              color:                 INK,
              fontVariationSettings: '"opsz" 24',
              margin:                '0 0 1.125rem',
            }}
          >
            {s(cfg.remember.headingField)}
          </p>

          {cfg.remember.itemsField && (
            <ul
              style={{
                listStyle:     'none',
                margin:        0,
                padding:       0,
                display:       'flex',
                flexDirection: 'column',
                gap:           '0.75rem',
              }}
            >
              {a(cfg.remember.itemsField).map((item, i) => (
                <li
                  key={i}
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize:   '1rem',
                    lineHeight: 1.7,
                    color:      'rgba(28,42,72,0.78)',
                    display:    'flex',
                    gap:        '0.625rem',
                    alignItems: 'flex-start',
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{ color: `${LAVENDER}0.85)`, fontWeight: 600, flexShrink: 0, marginTop: '0.05em' }}
                  >
                    &mdash;
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          )}

          {cfg.remember.lineField && (
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize:   'clamp(1rem, 0.25vw + 0.9375rem, 1.0625rem)',
                lineHeight: 1.74,
                color:      'rgba(28,42,72,0.80)',
                margin:     0,
              }}
            >
              {s(cfg.remember.lineField)}
            </p>
          )}
        </motion.div>
      )}
    </div>
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
  const t       = useTranslations('EducateIVF')
  const cs      = CATEGORY_STYLES[article.category]
  const { enableProgress, disableProgress } = useReadingProgress()

  useEffect(() => {
    enableProgress()
    return () => disableProgress()
  }, [enableProgress, disableProgress])

  const d         = new Date(article.date)
  const formatted = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })

  /* Translated articles read their title/intro from messages; others keep the
   * literal English strings on the article object. */
  const richCfg       = article.i18nKey ? RICH_ARTICLES[article.i18nKey] : undefined
  const title         = article.i18nKey ? t(`articles.${article.i18nKey}.title`) : article.title
  const intro         = article.i18nKey ? t(`articles.${article.i18nKey}.intro`) : article.intro
  /* Some articles open with a titled definitional section rather than a hero
   * lead paragraph — in that case the hero shows no intro. */
  const showHeroIntro = richCfg ? richCfg.heroIntro : true
  const ctaButton     = richCfg?.ctaButtonField
    ? t(`articles.${article.i18nKey}.${richCfg.ctaButtonField}`)
    : t('endCtaButton')

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
            {t('backLink')}
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
            {title}
          </h1>

          {/* Intro */}
          {showHeroIntro && intro.split('\n\n').map((para, i) => (
            <p
              key={i}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize:   'clamp(1.125rem, 1vw + 0.75rem, 1.375rem)',
                lineHeight: 1.78,
                color:      'rgba(28,42,72,0.70)',
                maxWidth:   '62ch',
                margin:     i === 0 ? '0 0 1.25rem' : '0 0 1.25rem',
              }}
            >
              {para}
            </p>
          ))}

          {/* Cover image */}
          <div style={{ marginTop: showHeroIntro ? 'clamp(1.75rem, 3vw, 2.5rem)' : '0.5rem', marginBottom: 'clamp(3.5rem, 6vw, 5rem)' }}>
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
          {richCfg && article.i18nKey ? (
            <RichBody i18nKey={article.i18nKey} cs={cs} reduced={reduced} />
          ) : (
          <>
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
                {t('inShort')}
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
          </>
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
              {t('endCtaHeading')}
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
                {ctaButton}
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
              {t('endCtaMicro')}
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
              {t('keepReading')}
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
