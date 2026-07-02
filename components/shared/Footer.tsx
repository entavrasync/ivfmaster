'use client'

import type { LucideIcon } from 'lucide-react'
import { motion } from 'motion/react'
import { MapPin, Clock, Phone, Mail, MessageCircle, Globe } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { Container } from '@/components/layout/Container'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { Link, usePathname, useRouter } from '@/i18n/navigation'
import { type Locale } from '@/i18n/routing'

const EASE = [0.22, 1, 0.36, 1] as const

/* TODO: replace with real WhatsApp number before launch */
const WA_URL     = 'https://wa.me/91XXXXXXXXXX'
const PHONE_HREF = 'tel:+91XXXXXXXXXX'

/* ─── Data ───────────────────────────────────────────────────────────────── */

type FooterNavKey  = 'navHome' | 'navLearnIVF' | 'navProcedures' | 'navTeam'
type ClinicNavKey  = 'navAbout' | 'navContact' | 'navFaq'

const NAV_EXPLORE: ReadonlyArray<{ key: FooterNavKey; href: string }> = [
  { key: 'navHome',       href: '/'            },
  { key: 'navLearnIVF',   href: '/educate-ivf' },
  { key: 'navProcedures', href: '/procedures'  },
  { key: 'navTeam',       href: '/team'        },
]

const NAV_CLINIC: ReadonlyArray<{ key: ClinicNavKey; href: string }> = [
  { key: 'navAbout',   href: '/about'   },
  { key: 'navContact', href: '/contact' },
  { key: 'navFaq',     href: '/#faq'   },
]

const SOCIAL: ReadonlyArray<{ Icon: LucideIcon; label: string; href: string }> = [
  { Icon: MessageCircle, label: 'WhatsApp', href: WA_URL                     },
  { Icon: Phone,         label: 'Call',     href: PHONE_HREF                 },
  { Icon: Globe,         label: 'Website',  href: '#'                        },
  { Icon: Mail,          label: 'Email',    href: 'mailto:info@ivfmaster.in' },
]

const LOCALES: ReadonlyArray<{ code: Locale; label: string }> = [
  { code: 'en', label: 'English' },
  { code: 'mr', label: 'मराठी'  },
  { code: 'hi', label: 'हिंदी'  },
]

/* ─── Column heading ─────────────────────────────────────────────────────── */

function ColTitle({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <p
      style={{
        fontFamily:    'var(--font-body)',
        fontSize:      '0.6875rem',
        fontWeight:    600,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color:         'rgba(148,164,196,0.78)',
        margin:        '0 0 1.25rem 0',
      }}
    >
      {children}
    </p>
  )
}

const LINK_STYLE: React.CSSProperties = {
  fontFamily:     'var(--font-body)',
  fontSize:       '0.9375rem',
  lineHeight:     1.5,
  color:          'rgba(251,247,241,0.64)',
  textDecoration: 'none',
}

/* ─── Inline dark-themed language switcher ───────────────────────────────── */

function FooterLanguageSwitcher() {
  const router   = useRouter()
  const pathname = usePathname()
  const locale   = useLocale() as Locale

  function select(code: Locale) {
    router.replace(pathname, { locale: code })
  }

  return (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      {LOCALES.map(({ code, label }) => (
        <button
          key={code}
          type="button"
          onClick={() => select(code)}
          style={{
            fontFamily:   'var(--font-body)',
            fontSize:     '0.8125rem',
            color:        locale === code ? 'rgba(251,247,241,0.88)' : 'rgba(251,247,241,0.48)',
            background:   'transparent',
            border:       `1px solid ${locale === code ? 'rgba(251,247,241,0.28)' : 'rgba(251,247,241,0.12)'}`,
            borderRadius: '100px',
            padding:      '0.25rem 0.75rem',
            cursor:       'pointer',
            fontWeight:   locale === code ? 500 : 400,
          }}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

/* ─── Footer ─────────────────────────────────────────────────────────────── */

export function Footer() {
  const reduced = useReducedMotion()
  const t       = useTranslations('Footer')

  const CONTACT_ROWS: ReadonlyArray<{
    Icon:  LucideIcon
    text:  string
    href?: string
  }> = [
    { Icon: MapPin, text: t('address')                                              },
    { Icon: Clock,  text: t('hours')                                                },
    { Icon: Phone,  text: t('phone'), /* TODO: real number */ href: PHONE_HREF      },
    { Icon: Mail,   text: t('email'), href: 'mailto:info@ivfmaster.in'              },
  ]

  return (
    <footer
      aria-label="Site footer"
      style={{
        background: '#1C2A48',
        borderTop:  '1px solid rgba(251,247,241,0.08)',
        marginTop:  0,
      }}
    >
      <Container>

        {/* ── Main grid ───────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.72, ease: EASE }}
          style={{
            display:             'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap:                 'clamp(2.5rem, 4vw, 4rem)',
            paddingTop:          'clamp(3.5rem, 6vw, 5rem)',
            paddingBottom:       'clamp(3rem, 5vw, 4.5rem)',
          }}
        >

          {/* ── Brand block ─────────────────────────────────────────── */}
          <div>
            {/* Emblem */}
            <div
              style={{
                display:        'inline-flex',
                alignItems:     'center',
                justifyContent: 'center',
                width:          '44px',
                height:         '44px',
                borderRadius:   '50%',
                background:     'rgba(226,132,156,0.13)',
                border:         '1px solid rgba(226,132,156,0.26)',
                marginBottom:   '0.875rem',
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M12 21 Q3 14 3 8 Q3 4 6 4 Q9 4 12 7 Q15 4 18 4 Q21 4 21 8 Q21 14 12 21Z"
                  stroke="#E2849C"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <p
              style={{
                fontFamily:            'var(--font-display)',
                fontSize:              '1.375rem',
                fontWeight:            500,
                lineHeight:            1.15,
                letterSpacing:         '-0.018em',
                color:                 '#FBF7F1',
                fontVariationSettings: '"opsz" 24',
                margin:                '0 0 0.1875rem 0',
              }}
            >
              IVF Master
            </p>
            <p
              style={{
                fontFamily:    'var(--font-body)',
                fontSize:      '0.8125rem',
                letterSpacing: '0.05em',
                color:         'rgba(148,164,196,0.78)',
                margin:        '0 0 1rem 0',
              }}
            >
              {t('byline')}
            </p>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize:   '0.9375rem',
                lineHeight: 1.65,
                color:      'rgba(251,247,241,0.48)',
                maxWidth:   '26ch',
                margin:     '0 0 1.5rem 0',
              }}
            >
              {t('tagline')}
            </p>

            {/* Social icon buttons */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {SOCIAL.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  style={{
                    display:        'flex',
                    alignItems:     'center',
                    justifyContent: 'center',
                    width:          '36px',
                    height:         '36px',
                    borderRadius:   '50%',
                    background:     'rgba(148,164,196,0.09)',
                    border:         '1px solid rgba(148,164,196,0.18)',
                    color:          'rgba(251,247,241,0.58)',
                    textDecoration: 'none',
                    flexShrink:     0,
                  }}
                >
                  <Icon size={15} strokeWidth={1.8} />
                </a>
              ))}
            </div>
          </div>

          {/* ── Explore ─────────────────────────────────────────────── */}
          <div>
            <ColTitle>{t('colExplore')}</ColTitle>
            <ul
              style={{
                listStyle:     'none',
                padding:       0,
                margin:        0,
                display:       'flex',
                flexDirection: 'column',
                gap:           '0.625rem',
              }}
            >
              {NAV_EXPLORE.map(({ key, href }) => (
                <li key={key}>
                  <Link href={href} style={LINK_STYLE}>{t(key)}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Clinic ──────────────────────────────────────────────── */}
          <div>
            <ColTitle>{t('colClinic')}</ColTitle>
            <ul
              style={{
                listStyle:     'none',
                padding:       0,
                margin:        0,
                display:       'flex',
                flexDirection: 'column',
                gap:           '0.625rem',
                marginBottom:  '2rem',
              }}
            >
              {NAV_CLINIC.map(({ key, href }) => (
                <li key={key}>
                  <Link href={href} style={LINK_STYLE}>{t(key)}</Link>
                </li>
              ))}
            </ul>

            <ColTitle>{t('colLanguage')}</ColTitle>
            <FooterLanguageSwitcher />
          </div>

          {/* ── Get in touch ────────────────────────────────────────── */}
          <div>
            <ColTitle>{t('colContact')}</ColTitle>
            <div
              style={{
                display:       'flex',
                flexDirection: 'column',
                gap:           '0.875rem',
              }}
            >
              {CONTACT_ROWS.map(({ Icon, text, href }) => (
                <div
                  key={text}
                  style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem' }}
                >
                  <Icon
                    size={14}
                    strokeWidth={1.8}
                    color="rgba(148,164,196,0.68)"
                    style={{ flexShrink: 0, marginTop: '0.15rem' }}
                  />
                  {href ? (
                    <a
                      href={href}
                      style={{
                        ...LINK_STYLE,
                        fontSize: '0.875rem',
                      }}
                    >
                      {text}
                    </a>
                  ) : (
                    <span
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize:   '0.875rem',
                        lineHeight: 1.5,
                        color:      'rgba(251,247,241,0.62)',
                      }}
                    >
                      {text}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

        </motion.div>
      </Container>

      {/* ── Bottom bar ─────────────────────────────────────────────────── */}
      <div style={{ borderTop: '1px solid rgba(251,247,241,0.08)' }}>
        <Container>
          <div
            style={{
              display:        'flex',
              flexWrap:       'wrap',
              justifyContent: 'space-between',
              alignItems:     'center',
              gap:            '0.75rem',
              paddingTop:     '1.25rem',
              paddingBottom:  '1.5rem',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize:   '0.8125rem',
                color:      'rgba(251,247,241,0.34)',
                margin:     0,
              }}
            >
              {t('copyright')}
            </p>

            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              {[
                { key: 'privacyPolicy',   href: '/privacy' },
                { key: 'termsOfService',  href: '/terms'   },
              ].map(({ key, href }) => (
                <Link
                  key={key}
                  href={href}
                  style={{
                    fontFamily:     'var(--font-body)',
                    fontSize:       '0.8125rem',
                    color:          'rgba(251,247,241,0.34)',
                    textDecoration: 'none',
                  }}
                >
                  {t(key as 'privacyPolicy' | 'termsOfService')}
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </div>
    </footer>
  )
}
