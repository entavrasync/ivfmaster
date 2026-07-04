'use client'

import { motion } from 'motion/react'
import Image, { type StaticImageData } from 'next/image'
import { useTranslations } from 'next-intl'
import { Container } from '@/components/layout/Container'
import { Pressable } from '@/components/motion/Pressable'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { Link } from '@/i18n/navigation'
import gorakhPhoto from '@/assets/doctor/gorakh-mandrupkar.jpeg'
import saiePhoto from '@/assets/doctor/saie.jpeg'

const EASE = [0.22, 1, 0.36, 1] as const

/* Both portraits share one lavender-ivory gradient so they read as a matched pair */
const PORTRAIT_GRADIENT =
  'linear-gradient(160deg, #E8E4F4 0%, #D4CEEA 45%, #EAE6F6 78%, #F4F1FB 100%)'

/* ─── Types ──────────────────────────────────────────────────────────────── */

type Credential = { text: string; accent: boolean }
type Doctor = {
  id:             string
  photo:          StaticImageData
  objectPosition: string
  name:           string
  essence:        string
  intro:          string
  credentials:    Credential[]
  ctaLabel:       string
  ctaHref:        string
  storyLabel:     string
  storyHref:      string
}

/* ─── Portrait — real photo, matched framing ───────────────────────────────
 *
 *  Both doctors share the same box + lavender-ivory backdrop (shown while the
 *  photo loads) so they read as a matched pair. objectPosition keeps each face
 *  well-framed regardless of the box's crop.
 */

function Portrait({ photo, name, objectPosition }: Readonly<{ photo: StaticImageData; name: string; objectPosition: string }>) {
  return (
    <figure
      style={{
        margin:       0,
        position:     'relative',
        width:        '100%',
        /* Upright photo frame so portrait + landscape headshots both sit
         * naturally; capped so it stays tasteful on wide columns. */
        aspectRatio:  '4 / 5',
        maxHeight:    'min(58vh, 30rem)',
        borderRadius: 'clamp(16px, 1.6vw, 22px)',
        overflow:     'hidden',
        background:   PORTRAIT_GRADIENT,
        boxShadow:    '0 24px 48px -12px rgba(46,79,142,0.22), 0 8px 20px -8px rgba(46,79,142,0.12)',
      }}
    >
      <Image
        src={photo}
        alt={name}
        fill
        sizes="(max-width: 639px) 100vw, 48vw"
        placeholder="blur"
        style={{ objectFit: 'cover', objectPosition }}
      />

      {/* Subtle bottom vignette — grounds the portrait, adds depth */}
      <div
        aria-hidden="true"
        style={{
          position:      'absolute',
          bottom:        0,
          left:          0,
          right:         0,
          height:        '28%',
          background:    'linear-gradient(to top, rgba(40,36,72,0.18), transparent)',
          pointerEvents: 'none',
        }}
      />
    </figure>
  )
}

/* ─── Single doctor card ──────────────────────────────────────────────── */

function DoctorCard({ doctor, reduced }: Readonly<{ doctor: Doctor; reduced: boolean }>) {
  const cardV = {
    hidden:  {},
    visible: { transition: { staggerChildren: reduced ? 0 : 0.09 } },
  }
  const portraitV = {
    hidden:  { opacity: reduced ? 1 : 0, scale: reduced ? 1 : 0.96, y: reduced ? 0 : 10 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 1, ease: EASE } },
  }
  const itemV = {
    hidden:  { opacity: reduced ? 1 : 0, y: reduced ? 0 : 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.68, ease: EASE } },
  }

  return (
    <motion.article
      variants={cardV}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      aria-label={doctor.name}
      style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
    >
      {/* Portrait */}
      <motion.div variants={portraitV} style={{ marginBottom: '1.625rem' }}>
        <Portrait photo={doctor.photo} name={doctor.name} objectPosition={doctor.objectPosition} />
      </motion.div>

      {/* Essence — emotional hook before the name */}
      <motion.p
        variants={itemV}
        style={{
          fontFamily:            'var(--font-display)',
          fontSize:              'clamp(1rem, 0.9vw + 0.4rem, 1.125rem)',
          fontWeight:            400,
          fontStyle:             'italic',
          lineHeight:            1.4,
          letterSpacing:         '-0.01em',
          color:                 '#9B6A40',
          marginBottom:          '0.4rem',
          fontVariationSettings: '"opsz" 18',
        }}
      >
        &ldquo;{doctor.essence}&rdquo;
      </motion.p>

      {/* Name */}
      <motion.h3
        variants={itemV}
        style={{
          fontFamily:            'var(--font-display)',
          fontSize:              'clamp(1.625rem, 2vw + 0.4rem, 2.25rem)',
          fontWeight:            500,
          lineHeight:            1.08,
          letterSpacing:         '-0.022em',
          color:                 '#1C2A48',
          fontVariationSettings: '"opsz" 36',
          marginBottom:          '1rem',
        }}
      >
        {doctor.name}
      </motion.h3>

      {/* Intro */}
      <motion.p
        variants={itemV}
        style={{
          fontFamily: 'var(--font-body)',
          fontSize:   'clamp(0.9375rem, 0.8vw + 0.4rem, 1.0625rem)',
          lineHeight: 1.75,
          color:      '#474D66',
        }}
      >
        {doctor.intro}
      </motion.p>

      {/* Credentials — refined and readable, not faint */}
      <motion.div variants={itemV}>
        <ul
          style={{
            listStyle:  'none',
            padding:    '1.125rem 0 0 0',
            margin:     '1.25rem 0 1.625rem 0',
            borderTop:  '1px solid rgba(100,120,176,0.13)',
          }}
        >
          {doctor.credentials.map((cred) => (
            <li
              key={cred.text}
              style={{
                display:       'flex',
                gap:           '0.5rem',
                alignItems:    'flex-start',
                fontFamily:    'var(--font-body)',
                fontSize:      '0.875rem',
                lineHeight:    1.65,
                color:         cred.accent ? '#5E72A8' : '#5C6B8A',
                fontWeight:    cred.accent ? 500      : 400,
                paddingBottom: '0.3rem',
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  flexShrink:    0,
                  color:         cred.accent ? '#7888B8' : '#96A4C4',
                  letterSpacing: '-0.05em',
                  marginTop:     '0.05em',
                  lineHeight:    1.65,
                }}
              >
                -
              </span>
              {cred.text}
            </li>
          ))}
        </ul>
      </motion.div>

      {/* CTAs — full-width on mobile, inline on sm+ */}
      <motion.div
        variants={itemV}
        className="mt-auto flex flex-col sm:flex-row flex-wrap gap-3 items-stretch sm:items-center"
      >
        <Pressable className="w-full sm:w-auto">
          <Link
            href={doctor.ctaHref}
            style={{
              display:        'block',
              textAlign:      'center',
              fontFamily:     'var(--font-body)',
              fontSize:       '1rem',
              fontWeight:     600,
              letterSpacing:  '0.01em',
              color:          '#FFFFFF',
              background:     '#E2849C',
              padding:        '0.9375rem 2rem',
              borderRadius:   '100px',
              boxShadow:      '0 8px 20px -5px rgba(226,132,156,0.52)',
              textDecoration: 'none',
              whiteSpace:     'nowrap',
            }}
          >
            {doctor.ctaLabel}
          </Link>
        </Pressable>

        <Link
          href={doctor.storyHref}
          style={{
            alignSelf:      'center',
            fontFamily:     'var(--font-body)',
            fontSize:       '0.9375rem',
            fontWeight:     500,
            color:          '#7C8AAC',
            textDecoration: 'none',
            borderBottom:   '1px solid rgba(124,138,172,0.28)',
            paddingBottom:  '0.125rem',
            whiteSpace:     'nowrap',
          }}
        >
          {doctor.storyLabel} →
        </Link>
      </motion.div>
    </motion.article>
  )
}

/* ─── Couple moment — shared by both layout trees ──────────────────────── */

function CoupleMoment({ reduced, note, className }: Readonly<{ reduced: boolean; note: string; className?: string }>) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: reduced ? 1 : 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.9, ease: EASE }}
      style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}
    >
      <div
        aria-hidden="true"
        style={{ flex: 1, height: '1px', background: 'rgba(176,118,52,0.22)', minWidth: '1.5rem' }}
      />
      <p
        style={{
          fontFamily:            'var(--font-display)',
          fontSize:              'clamp(1rem, 1.2vw + 0.3rem, 1.25rem)',
          fontStyle:             'italic',
          fontWeight:            400,
          lineHeight:            1.55,
          letterSpacing:         '-0.012em',
          color:                 '#7A5230',
          textAlign:             'center',
          flexShrink:            1,
          fontVariationSettings: '"opsz" 20',
        }}
      >
        {note}
      </p>
      <div
        aria-hidden="true"
        style={{ flex: 1, height: '1px', background: 'rgba(176,118,52,0.22)', minWidth: '1.5rem' }}
      />
    </motion.div>
  )
}

/* ─── Section ──────────────────────────────────────────────────────────── */

export function MeetTheDoctors() {
  const reduced = useReducedMotion()
  const t       = useTranslations('MeetTheDoctors')

  const doctors: Doctor[] = [
    {
      id:             'gorakh',
      photo:          gorakhPhoto,
      objectPosition: 'center 20%',
      name:           'Dr. Gorakh Mandrupkar',
      essence:     t('gorakhEssence'),
      intro:       t('gorakhIntro'),
      credentials: [
        { text: t('gorakhCred1'), accent: false },
        { text: t('gorakhCred2'), accent: false },
        { text: t('gorakhCred3'), accent: false },
        { text: t('gorakhCred4'), accent: true  },
      ],
      ctaLabel:   t('gorakhCta'),
      ctaHref:    '/contact?doctor=gorakh',
      storyLabel: t('gorakhStory'),
      storyHref:  '/team/gorakh-mandrupkar',
    },
    {
      id:             'saie',
      photo:          saiePhoto,
      objectPosition: 'center 20%',
      name:           'Dr. Saie Mandrupkar',
      essence:     t('saieEssence'),
      intro:       t('saieIntro'),
      credentials: [
        { text: t('saieCred1'), accent: false },
        { text: t('saieCred2'), accent: false },
        { text: t('saieCred3'), accent: false },
      ],
      ctaLabel:   t('saieCta'),
      ctaHref:    '/contact?doctor=saie',
      storyLabel: t('saieStory'),
      storyHref:  '/team/saie-mandrupkar',
    },
  ]

  const introV = {
    hidden:  {},
    visible: { transition: { staggerChildren: reduced ? 0 : 0.11 } },
  }
  const introItemV = {
    hidden:  { opacity: reduced ? 1 : 0, y: reduced ? 0 : 18 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.72, ease: EASE } },
  }

  return (
    <section
      aria-labelledby="meet-doctors-heading"
      style={{
        background:    'linear-gradient(180deg, #F4EDE2 0%, #EAE0CF 100%)',
        paddingTop:    'clamp(5rem, 10vw, 8rem)',
        paddingBottom: 'clamp(5rem, 10vw, 8rem)',
      }}
    >
      <Container>

        {/* ── Section intro ───────────────────────────────────────────── */}
        <motion.div
          variants={introV}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          style={{ marginBottom: 'clamp(3rem, 6vw, 5rem)' }}
        >
          <motion.p
            variants={introItemV}
            style={{
              fontFamily:    'var(--font-body)',
              fontSize:      '0.875rem',
              fontWeight:    600,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color:         '#6478B0',
              marginBottom:  '1.25rem',
            }}
          >
            {t('eyebrow')}
          </motion.p>

          <motion.h2
            id="meet-doctors-heading"
            variants={introItemV}
            style={{
              fontFamily:            'var(--font-display)',
              fontSize:              'clamp(2.25rem, 3.5vw + 0.5rem, 3.75rem)',
              fontWeight:            500,
              lineHeight:            1.08,
              letterSpacing:         '-0.026em',
              color:                 '#1C2A48',
              fontVariationSettings: '"opsz" 48',
              marginBottom:          '1.25rem',
              maxWidth:              '22ch',
            }}
          >
            {t('heading')}
          </motion.h2>

          <motion.p
            variants={introItemV}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize:   'clamp(1.0625rem, 1vw + 0.5rem, 1.1875rem)',
              lineHeight: 1.72,
              color:      '#5A6173',
              maxWidth:   '56ch',
            }}
          >
            {t('body')}
          </motion.p>
        </motion.div>

        {/* ── Doctor cards ────────────────────────────────────────────────
         *  flex-col on mobile (stacks), flex-row on sm+ (side by side).
         *  Each card wrapper gets flex:1 so both halves share equal width. */}
        <div
          style={{
            display:        'flex',
            flexWrap:       'wrap',
            gap:            'clamp(2rem, 4vw, 4rem)',
          }}
        >
          <div style={{ display: 'flex', flex: '1 1 280px', minWidth: 0 }}>
            <DoctorCard doctor={doctors[0]} reduced={reduced} />
          </div>
          <div style={{ display: 'flex', flex: '1 1 280px', minWidth: 0 }}>
            <DoctorCard doctor={doctors[1]} reduced={reduced} />
          </div>
        </div>

        {/* Couple moment — below both cards on all breakpoints */}
        <div style={{ marginTop: 'clamp(2.5rem, 5vw, 4rem)' }}>
          <CoupleMoment reduced={reduced} note={t('coupleNote')} />
        </div>

      </Container>
    </section>
  )
}
