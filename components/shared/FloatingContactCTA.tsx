'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useAnimation } from 'motion/react'
import { MessageCircle, Phone, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import {
  getClinicStatus,
  CLINIC_CONTACT,
  type ClinicStatus,
} from '@/lib/clinicHours'

const EASE = [0.22, 1, 0.36, 1] as const

const IG_URL       = 'https://www.instagram.com/ivfmaster?utm_source=ig_web_button_share_sheet'
const IG_BG        = 'linear-gradient(145deg, #FF7BA8 0%, #E8437A 48%, #B82D68 100%)'
const IG_SHADOW    = '0 12px 28px -7px rgba(201,53,112,0.72), 0 5px 12px -4px rgba(173,37,92,0.48), inset 0 1.5px 0 rgba(255,255,255,0.48), inset 0 -2px 4px rgba(126,24,72,0.22)'

const PILL_BG           = 'linear-gradient(145deg, #F08AAA 0%, #D85C86 48%, #BD3E70 100%)'
const PILL_SHADOW       = '0 14px 34px -7px rgba(212,76,128,0.68), 0 6px 14px -5px rgba(173,48,101,0.42), inset 0 1.5px 0 rgba(255,255,255,0.42), inset 0 -2px 4px rgba(129,34,76,0.18)'
const PILL_SHADOW_ACTIVE= '0 7px 18px -6px rgba(201,63,116,0.58), inset 0 1px 0 rgba(255,255,255,0.28), inset 0 -2px 4px rgba(129,34,76,0.20)'

const PANEL_SHADOW = [
  '0 18px 36px -12px rgba(28,42,72,0.28)',
  '0 4px 10px -5px rgba(28,42,72,0.16)',
].join(', ')

function InstagramIcon() {
  return (
    <svg
      aria-hidden="true"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  )
}

/* ─── Status dot ─────────────────────────────────────────────────── */

function StatusDot({ state, size = 8 }: Readonly<{ state: ClinicStatus['state']; size?: number }>) {
  const color =
    state === 'open'         ? '#22C55E' :
    state === 'closed_today' ? '#F59E0B' : '#94A3B8'
  return (
    <span
      aria-hidden="true"
      style={{
        display:      'inline-block',
        flexShrink:   0,
        width:        `${size}px`,
        height:       `${size}px`,
        borderRadius: '50%',
        background:   color,
        boxShadow:    state === 'open' ? '0 0 0 2.5px rgba(34,197,94,0.22)' : 'none',
      }}
    />
  )
}

/* ─── Floating CTA ───────────────────────────────────────────────── */

export function FloatingContactCTA() {
  const reduced  = useReducedMotion()
  const t        = useTranslations('FloatingCTA')
  const controls = useAnimation()

  const [expanded,  setExpanded ] = useState(false)
  const [status,    setStatus   ] = useState<ClinicStatus | null>(null)
  const [nudged,    setNudged   ] = useState(false)
  const refresh = useCallback(() => setStatus(getClinicStatus()), [])

  useEffect(() => {
    refresh()
    const id = setInterval(refresh, 60_000)
    return () => clearInterval(id)
  }, [refresh])

  useEffect(() => { if (expanded) refresh() }, [expanded, refresh])

  // One-time 3 s attention pulse on the pill
  useEffect(() => {
    if (reduced || !status || nudged) return
    const id = setTimeout(async () => {
      if (!expanded) {
        setNudged(true)
        await controls.start({ scale: [1, 1.10, 1], transition: { duration: 0.50, ease: 'easeInOut', times: [0, 0.45, 1] } })
        controls.set({ scale: 1 })
      }
    }, 3_000)
    return () => clearTimeout(id)
  }, [reduced, status, nudged, expanded, controls])

  if (!status) return null

  const waHref  = `https://wa.me/${CLINIC_CONTACT.whatsappNumber}`
  const telHref = `tel:${CLINIC_CONTACT.phoneNumber.replace(/\s/g, '')}`

  const statusLabel: string = (() => {
    switch (status.state) {
      case 'open':          return t('statusOpen',        { time: status.closeTimeDisplay ?? '' })
      case 'closed_today':  return t('statusClosedToday', { when: status.nextOpenDisplay  ?? '' })
      case 'holiday':       return t('statusHoliday',     { name: status.holidayName      ?? '' })
      case 'closed_weekly': return t('statusWeeklyOff',   { when: status.nextOpenDisplay  ?? '' })
    }
  })()

  return (
    /*
     * Sits OUTSIDE ReadingProgressProvider in layout.tsx so no parent
     * transform can re-anchor this fixed element.
     */
    <div
      role="complementary"
      aria-label={t('contact')}
      style={{
        position:      'fixed',
        bottom:        'clamp(1.25rem, 3vw, 1.75rem)',
        right:         'clamp(1rem, 3vw, 1.5rem)',
        zIndex:        9999,
        isolation:     'isolate',
        display:       'flex',
        flexDirection: 'row',
        alignItems:    'center',
        gap:           '0.625rem',
      }}
    >

      {/* ── Quiet secondary action; no competing hover label ─────────── */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <motion.a
          href={IG_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t('instagramTooltip')}
          whileHover={reduced ? {} : { y: -2 }}
          whileTap={reduced ? {} : { scale: 0.96 }}
          transition={{ duration: reduced ? 0 : 0.18, ease: EASE }}
          style={{
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            width:          '48px',
            height:         '48px',
            borderRadius:   '50%',
            background:     IG_BG,
            color:          '#FFFFFF',
            textDecoration: 'none',
            border:         '1px solid rgba(255,255,255,0.34)',
            boxShadow:      IG_SHADOW,
            flexShrink:     0,
          }}
        >
          <InstagramIcon />
        </motion.a>
      </div>

      {/* ── "Get in touch" pill + its tooltip panel ──────────────────── */}
      {/*
       * Wrapping pill + panel in a relative div ensures the panel's
       * `position:absolute / bottom:calc(100% + 13px)` is measured
       * from the pill wrapper, NOT from the outer fixed container.
       */}
      <div style={{ position: 'relative' }}>

        {/* Tooltip panel — opens ABOVE the pill */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              key="panel"
              initial={{ opacity: 0, scale: 0.93, y: 8 }}
              animate={{ opacity: 1, scale: 1,    y: 0 }}
              exit={{   opacity: 0, scale: 0.96,  y: 4 }}
              transition={{ duration: reduced ? 0 : 0.20, ease: EASE }}
              style={{
                position:        'absolute',
                bottom:          'calc(100% + 13px)',
                right:           0,
                transformOrigin: 'bottom right',
                width:           'min(300px, calc(100vw - 2.5rem))',
                borderRadius:    '16px',
                background:      '#FFFFFF',
                border:          'none',
                boxShadow:       PANEL_SHADOW,
                overflow:        'visible',
                zIndex:          9999,
              }}
            >
              {/* Inner — clipped to border-radius */}
              <div style={{ borderRadius: '16px', overflow: 'hidden' }}>

                {/* Status header */}
                <div style={{
                  padding:        '0.875rem 1rem',
                  background:     'rgba(241,237,248,0.50)',
                  borderBottom:   '1px solid rgba(210,198,188,0.40)',
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: 'space-between',
                  gap:            '0.625rem',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: 0 }}>
                    <StatusDot state={status.state} size={8} />
                    <span style={{
                      fontFamily:   'var(--font-body)',
                      fontSize:     '0.8125rem',
                      fontWeight:   500,
                      lineHeight:   1.4,
                      color:        'rgba(28,42,72,0.72)',
                      overflow:     'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace:   'nowrap',
                    }}>
                      {statusLabel}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setExpanded(false)}
                    aria-label={t('close')}
                    style={{
                      display:        'flex',
                      alignItems:     'center',
                      justifyContent: 'center',
                      width:          '26px',
                      height:         '26px',
                      borderRadius:   '50%',
                      border:         'none',
                      background:     'rgba(28,42,72,0.08)',
                      cursor:         'pointer',
                      color:          'rgba(28,42,72,0.50)',
                      flexShrink:     0,
                      transition:     reduced ? 'none' : 'background 0.15s ease',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(28,42,72,0.14)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(28,42,72,0.08)' }}
                  >
                    <X size={12} strokeWidth={2.5} />
                  </button>
                </div>

                {/* Action buttons */}
                <div style={{
                  padding:       '0.875rem 1rem 1rem',
                  display:       'flex',
                  flexDirection: 'column',
                  gap:           '0.5rem',
                  background:    '#FFFFFF',
                }}>
                  <a
                    href={waHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display:        'flex',
                      alignItems:     'center',
                      justifyContent: 'center',
                      gap:            '0.5rem',
                      fontFamily:     'var(--font-body)',
                      fontSize:       '0.9375rem',
                      fontWeight:     600,
                      letterSpacing:  '0.005em',
                      color:          '#FFFFFF',
                      background:     PILL_BG,
                      padding:        '0.6875rem 1.25rem',
                      borderRadius:   '100px',
                      textDecoration: 'none',
                      boxShadow:      '0 7px 18px -6px rgba(201,63,116,0.52), inset 0 1px 0 rgba(255,255,255,0.34)',
                    }}
                  >
                    <MessageCircle size={15} strokeWidth={2} />
                    {t('whatsapp')}
                  </a>

                  <a
                    href={telHref}
                    style={{
                      display:        'flex',
                      alignItems:     'center',
                      justifyContent: 'center',
                      gap:            '0.5rem',
                      fontFamily:     'var(--font-body)',
                      fontSize:       '0.9375rem',
                      fontWeight:     500,
                      color:          '#1C2A48',
                      background:     'transparent',
                      padding:        '0.6875rem 1.25rem',
                      borderRadius:   '100px',
                      textDecoration: 'none',
                      border:         '1.5px solid rgba(28,42,72,0.18)',
                      transition:     reduced ? 'none' : 'border-color 0.15s ease',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(28,42,72,0.38)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(28,42,72,0.18)' }}
                  >
                    <Phone size={15} strokeWidth={2} />
                    {t('call')}
                  </a>
                </div>
              </div>

              {/* Down-pointing caret toward pill */}
              <span aria-hidden="true" style={{
                position:    'absolute',
                bottom:      '-7px',
                right:       '19px',
                display:     'block',
                width:       0,
                height:      0,
                borderLeft:  '7px solid transparent',
                borderRight: '7px solid transparent',
                borderTop:   '7px solid #FFFFFF',
              }} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pill trigger */}
        <motion.button
          type="button"
          animate={controls}
          onClick={() => setExpanded((v) => !v)}
          aria-label={expanded ? t('close') : t('contact')}
          aria-expanded={expanded}
          whileTap={reduced ? {} : { scale: 0.94 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          style={{
            display:       'flex',
            alignItems:    'center',
            gap:           '0.4375rem',
            fontFamily:    'var(--font-body)',
            fontSize:      '0.875rem',
            fontWeight:    600,
            letterSpacing: '0.01em',
            color:         '#FFFFFF',
            position:      'relative',
            overflow:      'hidden',
            background:    expanded ? 'linear-gradient(145deg, #D8628B 0%, #B8386A 100%)' : PILL_BG,
            border:        '1px solid rgba(255,255,255,0.30)',
            height:        '48px',
            paddingLeft:   'clamp(1rem, 2vw, 1.25rem)',
            paddingRight:  'clamp(1rem, 2vw, 1.25rem)',
            borderRadius:  '100px',
            cursor:        'pointer',
            boxShadow:     expanded ? PILL_SHADOW_ACTIVE : PILL_SHADOW,
            whiteSpace:    'nowrap',
            transition:    reduced ? 'none' : 'background 0.18s ease, box-shadow 0.18s ease',
          }}
        >
          <span aria-hidden="true" style={{
            position:      'absolute',
            top:           '3px',
            left:          '18px',
            right:         '18px',
            height:        '1px',
            borderRadius:  '999px',
            background:    'linear-gradient(90deg, transparent, rgba(255,255,255,0.88), transparent)',
            boxShadow:     '0 0 8px rgba(255,220,235,0.82)',
            pointerEvents: 'none',
          }} />
          <span aria-hidden="true" style={{
            position:      'absolute',
            top:           '10px',
            right:         '17px',
            width:         '3px',
            height:        '3px',
            borderRadius:  '50%',
            background:    '#FFFFFF',
            boxShadow:     '0 0 7px 2px rgba(255,218,235,0.70)',
            opacity:       expanded ? 0.45 : 0.9,
            pointerEvents: 'none',
          }} />
          <StatusDot state={status.state} size={8} />
          <MessageCircle size={16} strokeWidth={2} />
          <span className="hidden sm:inline">{t('contact')}</span>
        </motion.button>
      </div>
    </div>
  )
}
