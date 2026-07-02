'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Container } from '@/components/layout/Container'
import { Pressable } from '@/components/motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* ─── Stats config ───────────────────────────────────────────────────────── */
const STATS_CONFIG = [
  { value: 2000, suffix: '+', labelKey: 'couplesGuided'   as const },
  { value: 87,   suffix: '%', labelKey: 'successRate'     as const },
  { value: 20,   suffix: '+', labelKey: 'yearsExpertise'  as const },
  { value: 4800, suffix: '+', labelKey: 'cyclesCompleted' as const },
]

/* ─── Count-up hook (GSAP-triggered) ─────────────────────────────────────── */
function useCountUp(target: number, duration: number, active: boolean): number {
  const reduced = useReducedMotion()
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!active) return
    if (reduced) { setCount(target); return }
    const start = performance.now()
    let raf: number
    function tick(now: number) {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - (1 - t) ** 3
      setCount(Math.round(eased * target))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration, active, reduced])

  return count
}

/* ─── Single stat card ───────────────────────────────────────────────────── */
function StatCard({ value, suffix, label, active }: Readonly<{ value: number; suffix: string; label: string; active: boolean }>) {
  const count = useCountUp(value, 2000, active)
  return (
    <div className="flex flex-col items-center lg:items-start gap-1 px-6 py-6 lg:py-8">
      <span style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.875rem, 2.5vw + 0.5rem, 2.75rem)', fontWeight: 500, lineHeight: 1, letterSpacing: '-0.03em', color: '#2E4F8E', fontVariationSettings: '"opsz" 48' }}>
        {count >= 1000 ? count.toLocaleString('en-IN') : count}{suffix}
      </span>
      <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', fontWeight: 500, color: '#8A8F9C', letterSpacing: '0.01em' }}>
        {label}
      </span>
    </div>
  )
}

/* ─── Stats bar ──────────────────────────────────────────────────────────── */
function StatBar() {
  const t = useTranslations('Stats')
  const [active, setActive] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (!ref.current) return
    if (reduced) { setActive(true); return }

    const trigger = ScrollTrigger.create({
      trigger: ref.current,
      start: 'top 90%',
      onEnter: () => setActive(true),
      once: true,
    })
    return () => trigger.kill()
  }, [reduced])

  return (
    <div
      ref={ref}
      style={{ borderTop: '1px solid rgba(216,204,190,0.50)', background: 'rgba(251,247,241,0.70)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
    >
      <Container>
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {STATS_CONFIG.map((s, i) => (
            <div key={s.labelKey} style={i < STATS_CONFIG.length - 1 ? { borderRight: '1px solid rgba(216,204,190,0.40)' } : {}}>
              <StatCard value={s.value} suffix={s.suffix} label={t(s.labelKey)} active={active} />
            </div>
          ))}
        </div>
      </Container>
    </div>
  )
}

/* ─── Hero ───────────────────────────────────────────────────────────────── */
export function Hero() {
  const t = useTranslations('Hero')
  const reduced = useReducedMotion()

  const sectionRef  = useRef<HTMLElement>(null)
  const bgRef       = useRef<HTMLDivElement>(null)
  const contentRef  = useRef<HTMLDivElement>(null)
  const eyebrowRef  = useRef<HTMLParagraphElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const subRef      = useRef<HTMLParagraphElement>(null)
  const bodyRef     = useRef<HTMLParagraphElement>(null)
  const ctaRef      = useRef<HTMLDivElement>(null)
  const trustRef    = useRef<HTMLDivElement>(null)

  const trustItems = [t('trustCouples'), t('trustYears')]

  /* ── GSAP animations ── */
  useEffect(() => {
    if (reduced || !sectionRef.current || !bgRef.current) return

    const ctx = gsap.context(() => {

      /* Parallax — bg image drifts up at half scroll speed */
      gsap.to(bgRef.current, {
        y: '18%',
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })

      /* Hero content fades + drifts up as user scrolls away */
      gsap.to(contentRef.current, {
        y: -60,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '40% top',
          scrub: true,
        },
      })

      /* Staggered entrance — elements animate in on load */
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.from(eyebrowRef.current,  { y: 20, opacity: 0, duration: 0.7 }, 0.2)
        .from(headlineRef.current, { y: 40, opacity: 0, duration: 0.9 }, 0.35)
        .from(subRef.current,      { y: 30, opacity: 0, duration: 0.8 }, 0.5)
        .from(bodyRef.current,     { y: 24, opacity: 0, duration: 0.7 }, 0.65)
        .from(ctaRef.current,      { y: 20, opacity: 0, duration: 0.7 }, 0.78)
        .from(trustRef.current,    { y: 16, opacity: 0, duration: 0.6 }, 0.9)

    }, sectionRef)

    return () => ctx.revert()
  }, [reduced])

  return (
    <section
      ref={sectionRef}
      className="relative flex flex-col overflow-hidden"
      style={{ minHeight: '100svh', backgroundColor: '#EEE9E2' }}
    >
      {/* ── Background images ── */}
      <div ref={bgRef} className="absolute inset-0 will-change-transform" aria-hidden="true">
        {/* Mobile image */}
        <Image
          src="/hero-bg-mobile.png"
          alt=""
          fill
          priority
          className="object-cover object-right-top lg:hidden"
          sizes="100vw"
        />
        {/* Desktop image */}
        <Image
          src="/hero-bg-desktop.png"
          alt=""
          fill
          priority
          className="object-cover object-right hidden lg:block"
          sizes="100vw"
        />
        {/* Subtle left-side scrim so text stays readable */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(90deg, rgba(251,247,241,0.55) 0%, rgba(251,247,241,0.25) 55%, transparent 100%)' }}
        />
        {/* Mobile: top scrim for text readability */}
        <div
          className="absolute inset-0 lg:hidden"
          style={{ background: 'linear-gradient(180deg, rgba(251,247,241,0.60) 0%, rgba(251,247,241,0.20) 50%, transparent 100%)' }}
        />
      </div>

      {/* ── Content ── */}
      <div ref={contentRef} className="relative flex-1 flex items-center">
        <Container className="w-full">

          {/* Desktop */}
          <div className="hidden lg:block" style={{ paddingTop: '9rem', paddingBottom: '4rem' }}>
            <div className="flex flex-col" style={{ gap: '1.75rem', maxWidth: '560px' }}>
              <p ref={eyebrowRef} style={{ fontFamily: 'var(--font-body)', fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: '#97A6D2' }}>
                {t('eyebrow')}
              </p>
              <h1 ref={headlineRef} style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem, 4vw + 0.25rem, 5rem)', fontWeight: 500, lineHeight: 1.04, letterSpacing: '-0.02em', color: '#1C2A48', fontOpticalSizing: 'auto' as const, fontVariationSettings: '"opsz" 72' }}>
                {t('headline')}
              </h1>
              <p ref={subRef} style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.25rem, 1.5vw + 0.25rem, 1.625rem)', fontWeight: 400, lineHeight: 1.35, letterSpacing: '-0.015em', color: '#2E4F8E', fontVariationSettings: '"opsz" 32' }}>
                {t('subheadline')}
              </p>
              <p ref={bodyRef} style={{ fontFamily: 'var(--font-body)', fontSize: '1.125rem', lineHeight: 1.82, color: '#4A5568', maxWidth: '46ch' }}>
                {t('body')}
              </p>
              {/* ── CTA block ── */}
              <div ref={ctaRef} className="flex flex-col" style={{ gap: '0.75rem', paddingTop: '0.5rem' }}>
                {/* Primary + secondary on one row */}
                <div className="flex flex-wrap items-center" style={{ gap: '1.5rem' }}>
                  <Pressable haptic>
                    <Link
                      href="/contact"
                      className="inline-flex items-center rounded-full transition-all duration-200 hover:-translate-y-px"
                      style={{
                        background: 'linear-gradient(135deg, #D4617B 0%, #C24E6A 100%)',
                        color: '#ffffff',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.9375rem',
                        fontWeight: 600,
                        letterSpacing: '-0.01em',
                        padding: '0.875rem 2rem',
                        boxShadow: '0 8px 26px -5px rgba(194,78,106,0.52)',
                      }}
                    >
                      {t('ctaPrimary')}
                    </Link>
                  </Pressable>

                  {/* Secondary — text link only, no button chrome */}
                  <Link
                    href="/educate-ivf"
                    className="group inline-flex items-center gap-1"
                    style={{ fontFamily: 'var(--font-body)', fontSize: '0.9375rem', fontWeight: 500, color: '#2E4F8E', letterSpacing: '-0.01em', textDecoration: 'none' }}
                  >
                    <span className="border-b border-transparent group-hover:border-current transition-colors duration-200">
                      {t('ctaSecondary')}
                    </span>
                    <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true"> →</span>
                  </Link>
                </div>

                {/* Micro-trust reassurance */}
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: '#7B8494', lineHeight: 1.6, letterSpacing: '0.005em' }}>
                  {t('ctaMicroTrust')}
                </p>
              </div>

              {/* Trust indicators */}
              <div ref={trustRef} className="flex flex-wrap items-center gap-x-4 gap-y-1.5" style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 500, color: '#6B7280' }}>
                {trustItems.map((item, i) => (
                  <span key={item} className="flex items-center gap-4">
                    {item}
                    {i < trustItems.length - 1 && <span style={{ color: '#C8BEB4', fontSize: '0.75rem' }} aria-hidden="true">●</span>}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile */}
          <div className="lg:hidden flex flex-col" style={{ paddingTop: '8.5rem', paddingBottom: '2.5rem', gap: '1.5rem' }}>

            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: '#97A6D2' }}>
              {t('eyebrow')}
            </p>

            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 8vw + 0.25rem, 3.5rem)', fontWeight: 500, lineHeight: 1.05, letterSpacing: '-0.025em', color: '#1C2A48', fontOpticalSizing: 'auto' as const, fontVariationSettings: '"opsz" 72' }}>
              {t('headline')}
            </h1>

            <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.1875rem, 4vw + 0.125rem, 1.5rem)', fontWeight: 400, lineHeight: 1.38, letterSpacing: '-0.015em', color: '#2E4F8E', fontVariationSettings: '"opsz" 32' }}>
              {t('subheadline')}
            </p>

            <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.0625rem', lineHeight: 1.8, color: '#4A5568' }}>
              {t('body')}
            </p>

            {/* Mobile CTA stack */}
            <div className="flex flex-col" style={{ gap: '1rem', marginTop: '0.125rem' }}>
              <Pressable haptic>
                <Link
                  href="/contact"
                  className="flex items-center justify-center w-full rounded-full"
                  style={{ background: 'linear-gradient(135deg, #D4617B 0%, #C24E6A 100%)', color: '#ffffff', fontFamily: 'var(--font-body)', fontSize: '1.0625rem', fontWeight: 600, letterSpacing: '-0.01em', padding: '1.0625rem 1.5rem', boxShadow: '0 8px 28px -5px rgba(194,78,106,0.52)' }}
                >
                  {t('ctaPrimary')}
                </Link>
              </Pressable>

              <Link
                href="/educate-ivf"
                className="group flex items-center justify-center gap-1"
                style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', fontWeight: 500, color: '#2E4F8E', textDecoration: 'none' }}
              >
                <span className="border-b border-transparent group-hover:border-current transition-colors duration-200">
                  {t('ctaSecondary')}
                </span>
                <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true"> →</span>
              </Link>

              <p className="text-center" style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: '#7B8494', lineHeight: 1.6, letterSpacing: '0.005em' }}>
                {t('ctaMicroTrust')}
              </p>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5" style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 500, color: '#6B7280', paddingTop: '0.375rem' }}>
              {trustItems.map((item, i) => (
                <span key={item} className="flex items-center gap-4">
                  {item}
                  {i < trustItems.length - 1 && <span style={{ color: '#C8BEB4', fontSize: '0.75rem' }} aria-hidden="true">●</span>}
                </span>
              ))}
            </div>
          </div>

        </Container>
      </div>

      <StatBar />
    </section>
  )
}
