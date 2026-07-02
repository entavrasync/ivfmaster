'use client'

import type { LucideIcon } from 'lucide-react'
import { motion } from 'motion/react'
import { MapPin, Clock, Phone, MessageCircle, ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Container } from '@/components/layout/Container'
import { Pressable } from '@/components/motion/Pressable'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { Link } from '@/i18n/navigation'

const EASE = [0.22, 1, 0.36, 1] as const

/* TODO: replace with real clinic WhatsApp number before launch */
const WA_URL = `https://wa.me/91XXXXXXXXXX?text=${encodeURIComponent(
  "Hello, I'd like to know more about fertility treatment at IVF Master."
)}`

/* ─── Component ──────────────────────────────────────────────────────────── */

export function FinalCTA() {
  const reduced = useReducedMotion()
  const t       = useTranslations('FinalCTA')

  const CONTACT_ROWS: ReadonlyArray<{
    Icon:   LucideIcon
    label:  string
    detail: string
    href?:  string
  }> = [
    { Icon: MapPin, label: t('clinicLabel'), detail: t('clinicAddress')                          },
    { Icon: Clock,  label: t('hoursLabel'),  detail: t('hoursDetail')                           },
    { Icon: Phone,  label: t('reachLabel'),  detail: t('reachPhone'), href: 'tel:+91XXXXXXXXXX' },
  ]

  const containerV = {
    hidden:  {},
    visible: { transition: { staggerChildren: reduced ? 0 : 0.10 } },
  }
  const itemV = {
    hidden:  { opacity: reduced ? 1 : 0, y: reduced ? 0 : 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.72, ease: EASE } },
  }

  return (
    <section
      id="final-cta"
      aria-labelledby="final-cta-heading"
      style={{
        background:    '#1C2A48',
        paddingTop:    'clamp(5rem, 10vw, 8rem)',
        paddingBottom: 'clamp(5rem, 10vw, 8rem)',
        position:      'relative',
        overflow:      'hidden',
      }}
    >
      {/* Subtle background depth — very faint periwinkle bloom top-left */}
      <div
        aria-hidden="true"
        style={{
          position:      'absolute',
          top:           '-25%',
          left:          '-15%',
          width:         '60%',
          height:        '70%',
          borderRadius:  '50%',
          background:    'radial-gradient(circle, rgba(100,120,176,0.07) 0%, transparent 65%)',
          pointerEvents: 'none',
        }}
      />

      <Container>
        <div
          style={{
            display:     'flex',
            flexWrap:    'wrap',
            gap:         'clamp(3rem, 6vw, 5rem)',
            alignItems:  'center',
          }}
        >
          {/* ── LEFT: message ──────────────────────────────────────────── */}
          <motion.div
            variants={containerV}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            style={{ flex: '2 1 300px', minWidth: 0 }}
          >
            {/* Eyebrow pill */}
            <motion.div variants={itemV} style={{ marginBottom: '1.75rem' }}>
              <span
                style={{
                  display:       'inline-block',
                  fontFamily:    'var(--font-body)',
                  fontSize:      '0.75rem',
                  fontWeight:    600,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color:         'rgba(148,164,196,0.88)',
                  border:        '1px solid rgba(148,164,196,0.22)',
                  borderRadius:  '100px',
                  padding:       '0.3125rem 1rem',
                }}
              >
                {t('eyebrow')}
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h2
              id="final-cta-heading"
              variants={itemV}
              style={{
                fontFamily:            'var(--font-display)',
                fontSize:              'clamp(2.25rem, 3.5vw + 0.5rem, 4rem)',
                fontWeight:            500,
                lineHeight:            1.08,
                letterSpacing:         '-0.028em',
                color:                 '#FBF7F1',
                fontVariationSettings: '"opsz" 48',
                marginBottom:          '1.375rem',
                maxWidth:              '20ch',
              }}
            >
              {t('headline')}
            </motion.h2>

            {/* Sub-headline */}
            <motion.p
              variants={itemV}
              style={{
                fontFamily:   'var(--font-body)',
                fontSize:     'clamp(1.0625rem, 1vw + 0.5rem, 1.1875rem)',
                lineHeight:   1.72,
                color:        'rgba(251,247,241,0.70)',
                maxWidth:     '46ch',
                marginBottom: '2.25rem',
              }}
            >
              {t('body')}
            </motion.p>

            {/* Structured contact info */}
            <motion.div
              variants={itemV}
              style={{
                display:       'flex',
                flexDirection: 'column',
                gap:           '1rem',
                marginBottom:  '2.5rem',
                paddingBottom: '2.25rem',
                borderBottom:  '1px solid rgba(251,247,241,0.10)',
              }}
            >
              {CONTACT_ROWS.map(({ Icon, label, detail, href }) => (
                <div
                  key={label}
                  style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem' }}
                >
                  {/* Icon circle */}
                  <div
                    style={{
                      width:           '34px',
                      height:          '34px',
                      borderRadius:    '50%',
                      background:      'rgba(148,164,196,0.10)',
                      border:          '1px solid rgba(148,164,196,0.18)',
                      display:         'flex',
                      alignItems:      'center',
                      justifyContent:  'center',
                      flexShrink:      0,
                      marginTop:       '1px',
                    }}
                  >
                    <Icon size={15} strokeWidth={1.7} color="rgba(148,164,196,0.88)" />
                  </div>

                  {/* Label + detail */}
                  <div>
                    <p
                      style={{
                        fontFamily:    'var(--font-body)',
                        fontSize:      '0.6875rem',
                        fontWeight:    600,
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        color:         'rgba(148,164,196,0.70)',
                        marginBottom:  '0.1875rem',
                        margin:        0,
                      }}
                    >
                      {label}
                    </p>
                    {href ? (
                      <a
                        href={href}
                        style={{
                          fontFamily:     'var(--font-body)',
                          fontSize:       '0.9375rem',
                          lineHeight:     1.5,
                          color:          'rgba(251,247,241,0.80)',
                          textDecoration: 'none',
                        }}
                      >
                        {detail}
                      </a>
                    ) : (
                      <p
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize:   '0.9375rem',
                          lineHeight: 1.5,
                          color:      'rgba(251,247,241,0.80)',
                          margin:     0,
                        }}
                      >
                        {detail}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div
              variants={itemV}
              style={{ display: 'flex', flexWrap: 'wrap', gap: '0.875rem', alignItems: 'center' }}
            >
              {/* Primary — blush WhatsApp */}
              <Pressable>
                <a
                  href={WA_URL}
                  target="_blank"
                  rel="noopener noreferrer"
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
                    boxShadow:      '0 10px 28px -8px rgba(226,132,156,0.60)',
                    textDecoration: 'none',
                    whiteSpace:     'nowrap',
                  }}
                >
                  <MessageCircle size={17} strokeWidth={2} />
                  {t('whatsappCta')}
                </a>
              </Pressable>

              {/* Secondary — outline */}
              <Pressable>
                <Link
                  href="/contact"
                  style={{
                    display:        'inline-flex',
                    alignItems:     'center',
                    gap:            '0.375rem',
                    fontFamily:     'var(--font-body)',
                    fontSize:       '1rem',
                    fontWeight:     500,
                    letterSpacing:  '0.01em',
                    color:          'rgba(251,247,241,0.76)',
                    background:     'transparent',
                    border:         '1px solid rgba(251,247,241,0.22)',
                    padding:        '0.9375rem 2rem',
                    borderRadius:   '100px',
                    textDecoration: 'none',
                    whiteSpace:     'nowrap',
                  }}
                >
                  {t('contactFormCta')}
                  <ArrowRight size={15} strokeWidth={2} />
                </Link>
              </Pressable>
            </motion.div>
          </motion.div>

          {/* ── RIGHT: warm portrait placeholder ──────────────────────── */}
          {/*
           * To swap in a real photo: replace the inner content with
           *   <Image src="/images/clinic-warm.jpg" alt="Mandrupkar Clinic"
           *          fill style={{ objectFit: 'cover', objectPosition: 'center top' }} />
           * and remove the placeholder markup below.
           */}
          <motion.figure
            aria-hidden="true"
            initial={{ opacity: reduced ? 1 : 0, scale: reduced ? 1 : 0.97, y: reduced ? 0 : 16 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 1, ease: EASE }}
            style={{
              flex:         '1 1 280px',
              maxWidth:     '480px',
              minWidth:     0,
              margin:       0,
              position:     'relative',
              borderRadius: 'clamp(16px, 2vw, 22px)',
              overflow:     'hidden',
              background:   'linear-gradient(148deg, #2B3C62 0%, #3A4E80 38%, #334070 65%, #263358 100%)',
              boxShadow:    '0 40px 80px -20px rgba(0,0,0,0.60), 0 12px 32px -8px rgba(0,0,0,0.28), inset 0 1px 0 rgba(148,164,196,0.12)',
              height:       'clamp(340px, 48vw, 520px)',
              width:        '100%',
            }}
          >
            {/* Soft central radial warmth */}
            <div
              aria-hidden="true"
              style={{
                position:      'absolute',
                inset:         0,
                background:    'radial-gradient(ellipse 78% 60% at 50% 38%, rgba(100,120,176,0.26) 0%, transparent 65%)',
                pointerEvents: 'none',
              }}
            />

            {/* Blush warmth lower-right */}
            <div
              aria-hidden="true"
              style={{
                position:      'absolute',
                bottom:        '-20%',
                right:         '-10%',
                width:         '55%',
                height:        '55%',
                borderRadius:  '50%',
                background:    'radial-gradient(circle, rgba(226,132,156,0.14) 0%, transparent 65%)',
                pointerEvents: 'none',
              }}
            />

            {/* Decorative motif — two interlocking circles (connection/couple) */}
            <div
              aria-hidden="true"
              style={{
                position:       'absolute',
                inset:          0,
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
              }}
            >
              <svg width="210" height="148" viewBox="0 0 210 148" fill="none">
                <circle cx="84"  cy="74" r="52" stroke="rgba(226,132,156,0.18)" strokeWidth="1.2" />
                <circle cx="126" cy="74" r="52" stroke="rgba(148,164,196,0.18)" strokeWidth="1.2" />
                <circle cx="84"  cy="74" r="30" fill="rgba(226,132,156,0.07)"   />
                <circle cx="126" cy="74" r="30" fill="rgba(148,164,196,0.07)"   />
                {/* Heart at intersection */}
                <path
                  d="M105 58 Q113 47 122 53 Q131 59 122 69 L105 86 L88 69 Q79 59 88 53 Q97 47 105 58Z"
                  stroke="rgba(226,132,156,0.30)"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Bottom vignette */}
            <div
              aria-hidden="true"
              style={{
                position:      'absolute',
                bottom:        0,
                left:          0,
                right:         0,
                height:        '36%',
                background:    'linear-gradient(to top, rgba(28,42,72,0.72), transparent)',
                pointerEvents: 'none',
              }}
            />

            {/* Placeholder label */}
            <p
              aria-hidden="true"
              style={{
                position:      'absolute',
                bottom:        '1.25rem',
                left:          0,
                right:         0,
                textAlign:     'center',
                fontFamily:    'var(--font-body)',
                fontSize:      '0.75rem',
                letterSpacing: '0.06em',
                color:         'rgba(251,247,241,0.36)',
              }}
            >
              Photo coming soon
            </p>

            <figcaption
              style={{
                position:   'absolute',
                width:      1,
                height:     1,
                overflow:   'hidden',
                clip:       'rect(0,0,0,0)',
                whiteSpace: 'nowrap',
              }}
            >
              Mandrupkar Clinic — warm, compassionate fertility care
            </figcaption>
          </motion.figure>
        </div>
      </Container>
    </section>
  )
}
