'use client'

import { buildWhatsappMessage } from '@/lib/buildWhatsappMessage'
import { CLINIC_CONTACT, getClinicStatus, type ClinicStatus } from '@/lib/clinicHours'
import { Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

const IG_URL = 'https://www.instagram.com/ivfmaster?utm_source=ig_web_button_share_sheet'

/* ─── Form state ─────────────────────────────────────────────────────────── */

interface FormState {
  name:             string
  reachingAs:       string
  duration:         string
  reason:           string
  preferredContact: string
  bestTime:         string
  openMessage:      string
}

/* ─── Tiny components ────────────────────────────────────────────────────── */

function StatusDot({ state }: Readonly<{ state: ClinicStatus['state'] }>) {
  const color =
    state === 'open'         ? '#22C55E' :
    state === 'closed_today' ? '#F59E0B' : '#94A3B8'
  return (
    <span style={{
      display: 'inline-block', flexShrink: 0, width: '8px', height: '8px',
      borderRadius: '50%', background: color,
      boxShadow: state === 'open' ? '0 0 0 2.5px rgba(34,197,94,0.22)' : 'none',
    }} />
  )
}

function InstagramIcon({ size = 18 }: Readonly<{ size?: number }>) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="3" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  )
}

function PillToggle({ options, value, onChange }: Readonly<{
  options: string[]
  value:   string
  onChange:(v: string) => void
}>) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
      {options.map((opt) => {
        const sel = value === opt
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(sel ? '' : opt)}
            style={{
              display: 'inline-flex', alignItems: 'center',
              padding: '0.4375rem 0.875rem', borderRadius: '100px',
              fontFamily: 'var(--font-body)', fontSize: '0.875rem',
              fontWeight: sel ? 600 : 400,
              color: sel ? '#FFFFFF' : 'rgba(28,42,72,0.72)',
              background: sel
                ? 'linear-gradient(135deg, #D4617B 0%, #C24E6A 100%)'
                : 'rgba(28,42,72,0.05)',
              border: `1.5px solid ${sel ? 'transparent' : 'rgba(28,42,72,0.14)'}`,
              boxShadow: sel ? '0 4px 12px -4px rgba(194,78,106,0.42)' : 'none',
              cursor: 'pointer',
              transition: 'all 0.15s cubic-bezier(0.22,1,0.36,1)',
              whiteSpace: 'nowrap',
            }}
          >
            {opt}
          </button>
        )
      })}
    </div>
  )
}

function FieldGroup({ label, children, error }: Readonly<{
  label:    string
  children: React.ReactNode
  error?:   string
}>) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <label style={{
        fontFamily: 'var(--font-body)', fontSize: '0.9375rem',
        fontWeight: 500, color: '#1C2A48',
      }}>
        {label}
      </label>
      {children}
      {error && (
        <p style={{ margin: 0, fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: '#C0392B' }}>
          {error}
        </p>
      )}
    </div>
  )
}

function ContactRow({ icon, label, sub, href, target = '_blank' }: Readonly<{
  icon:    React.ReactNode
  label:   string
  sub?:    string
  href?:   string
  target?: string
}>) {
  const inner = (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 0' }}>
      <span style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: '38px', height: '38px', borderRadius: '10px', flexShrink: 0,
        background: 'rgba(46,79,142,0.07)', color: '#1C2A48',
      }}>
        {icon}
      </span>
      <div>
        <p style={{ margin: 0, fontFamily: 'var(--font-body)', fontSize: '0.9375rem', fontWeight: 600, color: '#1C2A48' }}>
          {label}
        </p>
        {sub && (
          <p style={{ margin: '1px 0 0', fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'rgba(28,42,72,0.55)' }}>
            {sub}
          </p>
        )}
      </div>
    </div>
  )
  if (href) {
    return (
      <a href={href} target={target} rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block' }}>
        {inner}
      </a>
    )
  }
  return inner
}

function InfoRow({ icon, labelText, valueText }: Readonly<{ icon: React.ReactNode; labelText: string; valueText: string }>) {
  return (
    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
      <span style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
        background: 'rgba(46,79,142,0.07)', color: '#1C2A48',
      }}>
        {icon}
      </span>
      <div>
        <p style={{
          margin: 0, fontFamily: 'var(--font-body)', fontSize: '0.75rem',
          fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase',
          color: 'rgba(28,42,72,0.40)',
        }}>
          {labelText}
        </p>
        <p style={{ margin: '3px 0 0', fontFamily: 'var(--font-body)', fontSize: '0.9375rem', fontWeight: 500, color: '#1C2A48', lineHeight: 1.45 }}>
          {valueText}
        </p>
      </div>
    </div>
  )
}

/* ─── Main export ────────────────────────────────────────────────────────── */

export function ContactPage() {
  const t = useTranslations('Contact')

  const [form, setForm] = useState<FormState>({
    name: '', reachingAs: '', duration: '', reason: '',
    preferredContact: '', bestTime: '', openMessage: '',
  })
  const [nameError, setNameError] = useState(false)
  const [status, setStatus] = useState<ClinicStatus | null>(null)

  useEffect(() => { setStatus(getClinicStatus()) }, [])

  const waHref  = `https://wa.me/${CLINIC_CONTACT.whatsappNumber}`
  const telHref = `tel:${CLINIC_CONTACT.phoneNumber.replace(/\s/g, '')}`

  const statusLabel: string | null = status ? (() => {
    switch (status.state) {
      case 'open':          return t('statusOpen',        { time: status.closeTimeDisplay ?? '' })
      case 'closed_today':  return t('statusClosedToday', { when: status.nextOpenDisplay  ?? '' })
      case 'holiday':       return t('statusHoliday',     { name: status.holidayName      ?? '' })
      case 'closed_weekly': return t('statusWeeklyOff',   { when: status.nextOpenDisplay  ?? '' })
    }
  })() : null

  function setField<K extends keyof FormState>(key: K, val: FormState[K]) {
    setForm(prev => ({ ...prev, [key]: val }))
    if (key === 'name') setNameError(false)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) { setNameError(true); return }
    const message = buildWhatsappMessage({
      name:             form.name.trim(),
      reachingAs:       form.reachingAs,
      duration:         form.duration,
      reason:           form.reason,
      preferredContact: form.preferredContact,
      bestTime:         form.bestTime,
      openMessage:      form.openMessage.trim(),
    })
    window.open(
      `https://wa.me/${CLINIC_CONTACT.whatsappNumber}?text=${encodeURIComponent(message)}`,
      '_blank',
      'noopener,noreferrer',
    )
  }

  const reachingAsOptions = [t('formReachingAsCouple'), t('formReachingAsIndividual')]
  const durationOptions   = [t('formDuration6m'), t('formDuration6to12m'), t('formDuration1to2y'), t('formDuration2yPlus')]
  const reasonOptions     = [t('formReasonIVF'), t('formReasonSecondOpinion'), t('formReasonTests'), t('formReasonOther')]
  const contactOptions    = [t('formContactWhatsApp'), t('formContactCall')]
  const timeOptions       = [t('formTimeMorning'), t('formTimeAfternoon'), t('formTimeEvening')]

  return (
    <main>
      {/* ── Page header ─────────────────────────────────────────────────── */}
      <section style={{ padding: 'clamp(6rem,12vw,9rem) clamp(1.25rem,4vw,2rem) clamp(2rem,5vw,3rem)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '620px', margin: '0 auto' }}>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 700,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              color: '#C24E6A', margin: '0 0 0.875rem',
            }}>
              {t('eyebrow')}
            </p>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem,5vw,3.25rem)',
              fontWeight: 400, lineHeight: 1.12,
              color: '#1C2A48', margin: '0 0 1.125rem',
            }}>
              {t('headline')}
            </h1>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(1rem,1.5vw,1.125rem)',
              lineHeight: 1.65, color: 'rgba(28,42,72,0.60)',
              margin: 0,
            }}>
              {t('lead')}
            </p>
          </div>
        </div>
      </section>

      {/* ── Two-column layout ────────────────────────────────────────────── */}
      <section style={{ padding: '0 clamp(1.25rem,4vw,2rem) clamp(4rem,10vw,7rem)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div className="grid lg:grid-cols-[1fr_440px] gap-8 lg:gap-12 items-start">

            {/* ── LEFT: Smart intake form ─────────────────────────────────── */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '22px',
              padding: 'clamp(1.5rem,4vw,2.5rem)',
              boxShadow: '0 4px 28px -8px rgba(28,42,72,0.14), 0 1px 6px -2px rgba(28,42,72,0.07)',
              border: '1px solid rgba(216,204,190,0.50)',
            }}>
              <form onSubmit={handleSubmit} noValidate>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.875rem' }}>

                  {/* Name */}
                  <FieldGroup label={t('formNameLabel')} error={nameError ? t('formNameRequired') : undefined}>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setField('name', e.target.value)}
                      placeholder={t('formNamePlaceholder')}
                      style={{
                        width: '100%', boxSizing: 'border-box',
                        padding: '0.75rem 1rem',
                        fontFamily: 'var(--font-body)', fontSize: '0.9375rem', color: '#1C2A48',
                        background: '#FAFAF8',
                        border: `1.5px solid ${nameError ? '#E57373' : 'rgba(28,42,72,0.18)'}`,
                        borderRadius: '10px', outline: 'none',
                        transition: 'border-color 0.15s ease, background 0.15s ease',
                      }}
                      onFocus={(e) => { e.target.style.borderColor = '#C24E6A'; e.target.style.background = '#FFFFFF' }}
                      onBlur={(e)  => { e.target.style.borderColor = nameError ? '#E57373' : 'rgba(28,42,72,0.18)'; e.target.style.background = '#FAFAF8' }}
                    />
                  </FieldGroup>

                  {/* Reaching out as */}
                  <FieldGroup label={t('formReachingAsLabel')}>
                    <PillToggle options={reachingAsOptions} value={form.reachingAs} onChange={(v) => setField('reachingAs', v)} />
                  </FieldGroup>

                  {/* Duration */}
                  <FieldGroup label={t('formDurationLabel')}>
                    <PillToggle options={durationOptions} value={form.duration} onChange={(v) => setField('duration', v)} />
                  </FieldGroup>

                  {/* Reason */}
                  <FieldGroup label={t('formReasonLabel')}>
                    <PillToggle options={reasonOptions} value={form.reason} onChange={(v) => setField('reason', v)} />
                  </FieldGroup>

                  {/* Preferred contact */}
                  <FieldGroup label={t('formContactLabel')}>
                    <PillToggle options={contactOptions} value={form.preferredContact} onChange={(v) => setField('preferredContact', v)} />
                  </FieldGroup>

                  {/* Best time */}
                  <FieldGroup label={t('formTimeLabel')}>
                    <PillToggle options={timeOptions} value={form.bestTime} onChange={(v) => setField('bestTime', v)} />
                  </FieldGroup>

                  {/* Open message */}
                  <FieldGroup label={t('formMessageLabel')}>
                    <textarea
                      value={form.openMessage}
                      onChange={(e) => setField('openMessage', e.target.value)}
                      placeholder={t('formMessagePlaceholder')}
                      rows={4}
                      style={{
                        width: '100%', boxSizing: 'border-box',
                        padding: '0.75rem 1rem',
                        fontFamily: 'var(--font-body)', fontSize: '0.9375rem',
                        color: '#1C2A48', lineHeight: 1.55,
                        background: '#FAFAF8',
                        border: '1.5px solid rgba(28,42,72,0.18)',
                        borderRadius: '10px', outline: 'none', resize: 'vertical',
                        transition: 'border-color 0.15s ease, background 0.15s ease',
                      }}
                      onFocus={(e) => { e.target.style.borderColor = '#C24E6A'; e.target.style.background = '#FFFFFF' }}
                      onBlur={(e)  => { e.target.style.borderColor = 'rgba(28,42,72,0.18)'; e.target.style.background = '#FAFAF8' }}
                    />
                  </FieldGroup>

                  {/* Submit buttons */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingTop: '0.25rem' }}>
                    <button
                      type="submit"
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                        width: '100%', padding: '0.875rem 1.5rem', borderRadius: '100px',
                        fontFamily: 'var(--font-body)', fontSize: '1rem', fontWeight: 600,
                        color: '#FFFFFF', border: 'none', cursor: 'pointer',
                        background: 'linear-gradient(135deg, #D4617B 0%, #C24E6A 100%)',
                        boxShadow: '0 8px 22px -6px rgba(194,78,106,0.58), inset 0 1.5px 0 rgba(255,255,255,0.28)',
                        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform  = 'translateY(-1px)'
                        e.currentTarget.style.boxShadow  = '0 12px 28px -6px rgba(194,78,106,0.64), inset 0 1.5px 0 rgba(255,255,255,0.28)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform  = 'none'
                        e.currentTarget.style.boxShadow  = '0 8px 22px -6px rgba(194,78,106,0.58), inset 0 1.5px 0 rgba(255,255,255,0.28)'
                      }}
                    >
                      <MessageCircle size={18} strokeWidth={2} />
                      {t('formSubmit')}
                    </button>

                    <a
                      href={telHref}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                        padding: '0.8125rem 1.5rem', borderRadius: '100px',
                        fontFamily: 'var(--font-body)', fontSize: '0.9375rem', fontWeight: 500,
                        color: '#1C2A48', background: 'transparent',
                        border: '1.5px solid rgba(28,42,72,0.18)', textDecoration: 'none',
                        transition: 'border-color 0.15s ease',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(28,42,72,0.36)' }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(28,42,72,0.18)' }}
                    >
                      <Phone size={16} strokeWidth={2} />
                      {t('formSubmitSecondary')}
                    </a>
                  </div>

                </div>
              </form>
            </div>

            {/* ── RIGHT: Contact panel ────────────────────────────────────── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

              {/* Live status chip */}
              {status && statusLabel && (
                <div style={{
                  padding: '0.875rem 1.125rem',
                  borderRadius: '14px', background: '#FFFFFF',
                  border: '1px solid rgba(216,204,190,0.50)',
                  boxShadow: '0 2px 10px -4px rgba(28,42,72,0.10)',
                  display: 'flex', alignItems: 'center', gap: '0.625rem',
                }}>
                  <StatusDot state={status.state} />
                  <span style={{
                    fontFamily: 'var(--font-body)', fontSize: '0.9rem',
                    fontWeight: 500, color: 'rgba(28,42,72,0.72)',
                  }}>
                    {statusLabel}
                  </span>
                </div>
              )}

              {/* Contact methods card */}
              <div style={{
                background: '#FFFFFF', borderRadius: '18px',
                padding: '0.25rem 1.25rem 0.25rem',
                border: '1px solid rgba(216,204,190,0.50)',
                boxShadow: '0 4px 20px -8px rgba(28,42,72,0.12), 0 1px 4px -2px rgba(28,42,72,0.06)',
              }}>
                <p style={{
                  margin: '1.125rem 0 0',
                  fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 700,
                  letterSpacing: '0.10em', textTransform: 'uppercase',
                  color: 'rgba(28,42,72,0.40)',
                }}>
                  {t('panelTitle')}
                </p>

                <div style={{ borderBottom: '1px solid rgba(216,204,190,0.40)' }}>
                  <ContactRow icon={<MessageCircle size={18} strokeWidth={1.75} />} label={t('panelWhatsapp')} sub={t('panelWhatsappSub')} href={waHref} />
                </div>
                <div style={{ borderBottom: '1px solid rgba(216,204,190,0.40)' }}>
                  <ContactRow icon={<Phone size={18} strokeWidth={1.75} />} label={t('panelCall')} sub={t('panelCallSub')} href={telHref} target="_self" />
                </div>
                <div style={{ borderBottom: '1px solid rgba(216,204,190,0.40)' }}>
                  <ContactRow icon={<Mail size={18} strokeWidth={1.75} />} label={t('panelEmail')} sub={t('panelEmailSub')} href="mailto:ivfmaster.in@gmail.com" />
                </div>
                <ContactRow icon={<InstagramIcon size={18} />} label={t('panelInstagram')} sub={t('panelInstagramSub')} href={IG_URL} />
              </div>

              {/* Address + hours card */}
              <div style={{
                background: '#FFFFFF', borderRadius: '18px',
                padding: '1.25rem',
                border: '1px solid rgba(216,204,190,0.50)',
                boxShadow: '0 4px 20px -8px rgba(28,42,72,0.12), 0 1px 4px -2px rgba(28,42,72,0.06)',
                display: 'flex', flexDirection: 'column', gap: '1rem',
              }}>
                <InfoRow icon={<MapPin size={17} strokeWidth={1.75} />} labelText={t('panelAddressLabel')} valueText={t('panelAddress')} />
                <InfoRow icon={<Clock size={17} strokeWidth={1.75} />} labelText={t('panelHoursLabel')} valueText={t('panelHours')} />
              </div>

              {/* Map placeholder */}
              <a
                href="https://maps.google.com/?q=Mandrupkar+Clinic+Ishwarpur+Sangli+Maharashtra"
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none' }}
              >
                <div style={{
                  background: 'rgba(46,79,142,0.04)',
                  borderRadius: '18px',
                  border: '1.5px dashed rgba(28,42,72,0.14)',
                  height: '170px',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  gap: '0.5rem', cursor: 'pointer',
                  transition: 'background 0.15s ease, border-color 0.15s ease',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(46,79,142,0.07)'; (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(28,42,72,0.24)' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(46,79,142,0.04)'; (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(28,42,72,0.14)' }}
                >
                  <MapPin size={22} strokeWidth={1.5} style={{ color: 'rgba(28,42,72,0.30)' }} />
                  <span style={{
                    fontFamily: 'var(--font-body)', fontSize: '0.875rem',
                    fontWeight: 500, color: '#4B6CB7',
                  }}>
                    {t('panelMapCta')}
                  </span>
                </div>
              </a>

            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
