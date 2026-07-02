'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'motion/react'
import { useTranslations } from 'next-intl'
import { Pressable } from '@/components/motion/Pressable'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { Link } from '@/i18n/navigation'
import costDesktop1 from '@/assets/cost/cost-desktop-1.png'
import costDesktop2 from '@/assets/cost/cost-desktop-2.png'
import costDesktop3 from '@/assets/cost/cost-desktop-3.png'
import costDesktop4 from '@/assets/cost/cost-desktop-4.png'
import costDesktop5 from '@/assets/cost/cost-desktop-5.png'
import costDesktop6 from '@/assets/cost/cost-desktop-6.png'
import costDesktop7 from '@/assets/cost/cost-desktop-7.png'
import costMobile1 from '@/assets/cost/cost-mobile-1.png'
import costMobile2 from '@/assets/cost/cost-mobile-2.png'
import costMobile3 from '@/assets/cost/cost-mobile-3.png'
import costMobile4 from '@/assets/cost/cost-mobile-4.png'
import costMobile5 from '@/assets/cost/cost-mobile-5.png'
import costMobile6 from '@/assets/cost/cost-mobile-6.png'
import costMobile7 from '@/assets/cost/cost-mobile-7.png'

gsap.registerPlugin(ScrollTrigger)

/* ─── Palette ─────────────────────────────────────────────────────────────── */
const IVORY    = '#EDE8E0'                 // lines 1-5 on dark bg
const DARK_INK = '#1C2A48'                // lines 6-7 + resolution on light bg
const MUTED    = 'rgba(151,166,210,0.72)' // eyebrow on dark
const FM_EASE  = [0.22, 1, 0.36, 1] as const

/* ─── Pacing constants (Sub-prompt B tuned) ──────────────────────────────── *
 *  BEAT = IN + HOLD + OUT — one complete line cycle.
 *  25% in → 50% hold → 25% out matches the spec exactly.
 *  PAUSE = the dark silence between l5 and l6 (emotional punctuation).      */
const BEAT  = 1.8    // timeline units per line
const IN    = 0.3    // 17% — quick enough to feel responsive
const HOLD  = 1.25   // 69% — the thought lingers
const OUT   = 0.25   // 14% — exits cleanly
// IN + HOLD + OUT = 1.80 ✓
const PAUSE = BEAT * 1.5  // 2.70 — deliberate dark beat
const ARTWORK_FADE = 1

/* Scroll-space factor: more pixels = more wall-clock time per line.
 * Mobile scrolls faster so we give it a larger factor.                       */
const FACTOR_DESKTOP = 3.2
const FACTOR_MOBILE  = 3.9

const ARTWORK = [
  { desktop: costDesktop1, mobile: costMobile1 },
  { desktop: costDesktop2, mobile: costMobile2 },
  { desktop: costDesktop3, mobile: costMobile3 },
  { desktop: costDesktop4, mobile: costMobile4 },
  { desktop: costDesktop5, mobile: costMobile5 },
  { desktop: costDesktop6, mobile: costMobile6 },
  { desktop: costDesktop7, mobile: costMobile7 },
] as const

/* ─── CTA block (shared between both render paths) ───────────────────────── */

function CtaBlock({ dark, closeBody, ctaButton, ctaSub }: {
  readonly dark:       boolean
  readonly closeBody:  string
  readonly ctaButton:  string
  readonly ctaSub:     string
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', width: '100%' }}>
      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize:   'clamp(1rem, 0.9vw + 0.5rem, 1.125rem)',
        lineHeight: 1.65,
        color:      dark ? IVORY        : DARK_INK,
        opacity:    dark ? 0.78         : 1,
        textAlign:  'center',
        maxWidth:   '42ch',
      }}>
        {closeBody}
      </p>

      <Pressable className="w-full sm:w-fit">
        <Link
          href="/contact"
          className="group relative block overflow-hidden text-center sm:inline-block"
          style={{
            fontFamily:     'var(--font-body)',
            fontSize:       'clamp(1rem, 0.9vw + 0.4rem, 1.0625rem)',
            fontWeight:     600,
            letterSpacing:  '0.01em',
            color:          '#FFFFFF',
            background:     '#E2849C',
            padding:        '0.8125rem 2rem',
            borderRadius:   '100px',
            boxShadow:      '0 10px 24px -8px rgba(226,132,156,0.55)',
            textDecoration: 'none',
            whiteSpace:     'nowrap',
          }}
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -translate-x-[160%] -skew-x-12 transition-transform duration-700 ease-out group-hover:translate-x-[420%] group-focus-visible:translate-x-[420%]"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.62), transparent)',
            }}
          />
          <span className="relative z-10">{ctaButton}</span>
        </Link>
      </Pressable>

      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize:   '0.875rem',
        lineHeight: 1.6,
        color:      dark ? MUTED : '#334B70',
        textAlign:  'center',
      }}>
        {ctaSub}
      </p>
    </div>
  )
}

/* ─── Component ──────────────────────────────────────────────────────────── */

export function CostOfWaiting() {
  const reduced = useReducedMotion()
  const t       = useTranslations('CostOfWaiting')

  const LINES = [
    { id: 'l1', text: t('line1') },
    { id: 'l2', text: t('line2') },
    { id: 'l3', text: t('line3') },
    { id: 'l4', text: t('line4') },
    { id: 'l5', text: t('line5') },
    { id: 'l6', text: t('hopeLine1'), isHope: true as const },
    { id: 'l7', text: t('hopeLine2'), isHope: true as const },
  ]

  const eyebrow   = t('eyebrow')
  const closeBody = t('closeBody')
  const ctaButton = t('ctaButton')
  const ctaSub    = t('ctaSub')

  const sectionRef      = useRef<HTMLElement>(null)
  const eyebrowRef      = useRef<HTMLParagraphElement>(null)
  const ambientRef      = useRef<HTMLDivElement>(null)
  const darkOverlayRef  = useRef<HTMLDivElement>(null)
  const lightOverlayRef = useRef<HTMLDivElement>(null)
  const ctaRef          = useRef<HTMLDivElement>(null)
  const artworkRefs     = useRef<(HTMLDivElement | null)[]>(new Array(ARTWORK.length).fill(null))
  /* lineRefs[0-4] → l1-l5 (dark lines), [5-6] → l6-l7 (hope/light lines) */
  const lineRefs        = useRef<(HTMLElement | null)[]>(new Array(LINES.length).fill(null))

  useEffect(() => {
    if (reduced) return

    const ctx = gsap.context(() => {
      /* ── Initial state: everything invisible ──────────────────────── */
      gsap.set(eyebrowRef.current,      { opacity: 0 })
      gsap.set(artworkRefs.current.filter(Boolean), { opacity: 0 })
      gsap.set(artworkRefs.current[0],  { opacity: 1 })
      gsap.set(darkOverlayRef.current,  { opacity: 1 })
      gsap.set(lightOverlayRef.current, { opacity: 0 })
      gsap.set(ctaRef.current,          { opacity: 0 })
      /* Lines centred via yPercent; GSAP stacks y-offset on top cleanly */
      gsap.set(lineRefs.current.filter(Boolean), { opacity: 0, yPercent: -50 })

      /* ── Ambient breathing glow (independent of scrub timeline) ──── *
       *  Slow sine pulse between base opacity (0.25, set in CSS) and   *
       *  a slightly brighter state. Stops when ctx is reverted.         */
      gsap.to(ambientRef.current, {
        opacity:  0.42,
        duration: 5.5,
        ease:     'sine.inOut',
        repeat:   -1,
        yoyo:     true,
      })

      /* ── Named timeline positions ─────────────────────────────────── */
      const l1IN  = 1 * BEAT          //  1.80
      const l2IN  = 2 * BEAT          //  3.60
      const l3IN  = 3 * BEAT          //  5.40
      const l4IN  = 4 * BEAT          //  7.20
      const l5IN  = 5 * BEAT          //  9.00
      const l5END = 6 * BEAT          // 10.80  ← l5 fully out; darkness begins
      const l6IN  = l5END + PAUSE     // 13.50  ← hope appears on light bg
      const l6END = l6IN  + BEAT      // 15.30
      const l7IN  = l6END             // 15.30
      const ctaIN = l7IN  + IN + 0.45 // 16.05
      const tlEnd = ctaIN + 0.9       // 16.95

      /* ── Scrub timeline ────────────────────────────────────────────── */
      const tl = gsap.timeline()

      /* Eyebrow: fades in immediately, exits just as l5 finishes */
      tl.fromTo(eyebrowRef.current,
        { opacity: 0 },
        { opacity: 0.72, duration: IN },
        0,
      )
      tl.to(eyebrowRef.current,
        { opacity: 0, duration: OUT },
        l5END,  // exits at the start of the dark silence
      )

      /* Lines l1-l5: one at a time, IN → long HOLD → OUT */
      const darkPositions = [l1IN, l2IN, l3IN, l4IN, l5IN]
      darkPositions.forEach((pos, i) => {
        const el = lineRefs.current[i]
        if (!el) return
        tl.fromTo(el,
          { opacity: 0, y: 16 },
          { opacity: 1, y:  0, duration: IN,  ease: 'power2.out' },
          pos,
        )
        tl.to(el,
          { opacity: 0, y: -8, duration: OUT, ease: 'power2.in' },
          pos + IN + HOLD,
        )
      })

      /* Artwork follows the same line positions, but crossfades more slowly.
       * Every image stays mounted; only layer opacity changes. */
      const artworkPositions = [l2IN, l3IN, l4IN, l5IN, l6IN, l7IN]
      artworkPositions.forEach((pos, i) => {
        const previous = artworkRefs.current[i]
        const next = artworkRefs.current[i + 1]
        if (!previous || !next) return

        tl.to(previous,
          { opacity: 0, duration: ARTWORK_FADE, ease: 'power1.inOut' },
          pos,
        )
        tl.to(next,
          { opacity: 1, duration: ARTWORK_FADE, ease: 'power1.inOut' },
          pos,
        )
      })

      /* Light overlay: animates across the FULL pause window.
       * Background goes from dusk navy → warm periwinkle/ivory so that
       * by l6IN the overlay is FULLY opaque and l6 appears in the light. */
      tl.fromTo(lightOverlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: PAUSE, ease: 'power1.inOut' },
        l5END,
      )
      tl.fromTo(darkOverlayRef.current,
        { opacity: 1 },
        { opacity: 0, duration: PAUSE, ease: 'power1.inOut' },
        l5END,
      )

      /* l6 "But waiting isn't failing." — dark ink text on the now-light bg */
      const el6 = lineRefs.current[5]
      if (el6) {
        tl.fromTo(el6,
          { opacity: 0, y: 16 },
          { opacity: 1, y:  0, duration: IN,  ease: 'power2.out' },
          l6IN,
        )
        tl.to(el6,
          { opacity: 0, y: -4, duration: OUT, ease: 'power2.in' },
          l6IN + IN + HOLD,
        )
      }

      /* l7 — fades in and STAYS (no out); CTA appears below while it holds */
      const el7 = lineRefs.current[6]
      if (el7) {
        tl.fromTo(el7,
          { opacity: 0, y: 16 },
          { opacity: 1, y:  0, duration: IN, ease: 'power2.out' },
          l7IN,
        )
      }

      /* CTA: rises up from y:18 once l7 has settled */
      tl.fromTo(ctaRef.current,
        { opacity: 0, y: 18 },
        { opacity: 1, y:  0, duration: IN, ease: 'power2.out' },
        ctaIN,
      )

      /* Empty hold so CTA stays readable before the section unpins */
      tl.to({}, { duration: tlEnd - ctaIN - IN })

      /* ── ScrollTrigger pin + scrub ────────────────────────────────── */
      ScrollTrigger.create({
        trigger:             sectionRef.current!,
        start:               'top top',
        end:                 () => {
          const f = window.innerWidth < 768 ? FACTOR_MOBILE : FACTOR_DESKTOP
          return '+=' + window.innerHeight * f
        },
        scrub:               true,
        pin:                 true,
        pinSpacing:          true,
        animation:           tl,
        invalidateOnRefresh: true,
      })

      /* Refresh once after layout settles — prevents timing drift on mount */
      setTimeout(() => ScrollTrigger.refresh(), 200)

    }, sectionRef)

    return () => ctx.revert()
  }, [reduced])

  /* ── REDUCED MOTION: two-phase static layout ─────────────────────────── *
   *  Dark → light handled as a gradient background so the emotional arc     *
   *  is preserved without any scroll-driven animation.                      */
  if (reduced) {
    return (
      <section
        aria-label={eyebrow}
        style={{
          position:      'relative',
          /* Two-phase gradient: dusk navy fades to warm periwinkle/ivory */
          background:    'linear-gradient(180deg, #1C2A48 0%, #1C2A48 52%, #CBD3E8 72%, #F0EDF5 100%)',
          paddingTop:    'clamp(6rem, 12vw, 11rem)',
          paddingBottom: 'clamp(6rem, 12vw, 11rem)',
        }}
      >
        {/* Static atmospheric glow on dark phase */}
        <div
          aria-hidden="true"
          style={{
            position:   'absolute',
            top:        0, left: 0, right: 0,
            height:     '55%',
            background: 'radial-gradient(ellipse 70% 55% at 50% 45%, rgba(46,79,142,0.25) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{
          position:      'relative',
          maxWidth:      '640px',
          margin:        '0 auto',
          padding:       '0 clamp(1.5rem, 5vw, 2.5rem)',
          textAlign:     'center',
          display:       'flex',
          flexDirection: 'column',
          gap:           'clamp(2.5rem, 5vw, 3.5rem)',
        }}>
          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: FM_EASE }}
            style={{
              fontFamily:    'var(--font-body)',
              fontSize:      '0.8125rem',
              fontWeight:    600,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color:         MUTED,
            }}
          >
            {eyebrow}
          </motion.p>

          {/* Dark lines l1-l5 — ivory on dusk */}
          {LINES.slice(0, 5).map((line, i) => (
            <motion.p
              key={line.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.6, delay: i * 0.05, ease: FM_EASE }}
              style={{
                fontFamily:            'var(--font-display)',
                fontSize:              'clamp(1.5rem, 3vw + 0.5rem, 2.375rem)',
                fontWeight:            500,
                lineHeight:            1.25,
                letterSpacing:         '-0.02em',
                color:                 IVORY,
                fontVariationSettings: '"opsz" 48',
              }}
            >
              {line.text}
            </motion.p>
          ))}

          {/* Spacer represents the dark pause */}
          <div style={{ height: 'clamp(2rem, 5vw, 4rem)' }} aria-hidden="true" />

          {/* Hope lines l6-l7 — dark ink on the lightened section */}
          {LINES.slice(5).map((line, i) => (
            <motion.p
              key={line.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.7, delay: i * 0.06, ease: FM_EASE }}
              style={{
                fontFamily:            'var(--font-display)',
                fontSize:              'clamp(1.5rem, 3vw + 0.5rem, 2.375rem)',
                fontWeight:            500,
                lineHeight:            1.25,
                letterSpacing:         '-0.02em',
                color:                 DARK_INK,
                fontVariationSettings: '"opsz" 48',
              }}
            >
              {line.text}
            </motion.p>
          ))}

          <CtaBlock dark={false} closeBody={closeBody} ctaButton={ctaButton} ctaSub={ctaSub} />
        </div>
      </section>
    )
  }

  /* ── SCROLL-DRIVEN: GSAP-pinned, dark-to-light ───────────────────────── */
  return (
    <section
      ref={sectionRef}
      aria-label={eyebrow}
      style={{
        height:   '100vh',
        overflow: 'hidden',
        position: 'relative',
        /* Flat dark base — overlays render on top */
        background: '#1C2A48',
      }}
    >

      {/* ── Dusk gradient layer (permanent dark texture) ──────────────── */}
      <div
        aria-hidden="true"
        style={{
          position:      'absolute',
          inset:         0,
          background:    'linear-gradient(160deg, #1E3163 0%, #1C2A48 55%, #17243E 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* ── Ambient breathing radial glow (GSAP pulses opacity) ────────── *
       *  Full-bleed div with centred radial gradient. Opacity 0.25 in      *
       *  CSS so GSAP's yoyo animates between 0.25↔0.42.                    */}
      <div
        ref={ambientRef}
        aria-hidden="true"
        style={{
          position:      'absolute',
          inset:         0,
          background:    'radial-gradient(ellipse 65% 55% at 50% 46%, rgba(46,79,142,0.28) 0%, transparent 70%)',
          opacity:       0.25,
          pointerEvents: 'none',
        }}
      />

      {/* ── Film grain (SVG fractal noise, whisper-soft) ────────────────── */}
      <div
        aria-hidden="true"
        style={{
          position:        'absolute',
          inset:           0,
          opacity:         0.035,
          backgroundImage: [
            'url("data:image/svg+xml,',
            '%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E',
            '%3Cfilter id=\'n\'%3E',
            '%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\'',
            ' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E',
            '%3C/filter%3E',
            '%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E',
            '%3C/svg%3E")',
          ].join(''),
          backgroundSize:  '256px 256px',
          pointerEvents:   'none',
        }}
      />

      {/* ── Responsive artwork — all seven stages stay mounted ─────────── */}
      {ARTWORK.map((artwork, i) => (
        <div
          key={artwork.desktop.src}
          ref={(el) => { artworkRefs.current[i] = el }}
          aria-hidden="true"
          style={{
            position:      'absolute',
            inset:         0,
            opacity:       i === 0 ? 1 : 0,
            pointerEvents: 'none',
            willChange:    'opacity',
          }}
        >
          <picture
            style={{
              position: 'absolute',
              inset:    0,
              display:  'block',
            }}
          >
            <source media="(max-width: 767px)" srcSet={artwork.mobile.src} />
            <img
              src={artwork.desktop.src}
              alt=""
              loading="eager"
              decoding="async"
              draggable={false}
              style={{
                position:      'absolute',
                inset:         0,
                width:         '100%',
                height:        '100%',
                objectFit:     'cover',
                objectPosition:'center',
                pointerEvents: 'none',
                userSelect:    'none',
              }}
            />
          </picture>
        </div>
      ))}

      {/* Dark artwork tint — fades out across the existing hope transition. */}
      <div
        ref={darkOverlayRef}
        aria-hidden="true"
        style={{
          position:      'absolute',
          inset:         0,
          background:    'rgba(12, 24, 50, 0.58)',
          opacity:       1,
          pointerEvents: 'none',
          willChange:    'opacity',
        }}
      />

      {/* ── Light overlay — GSAP scrubs opacity 0→1 during dark pause ──── *
       *  The existing transition now becomes the warm readability tint over
       *  the artwork; its timing and opacity animation remain unchanged.    */}
      <div
        ref={lightOverlayRef}
        aria-hidden="true"
        style={{
          position:      'absolute',
          inset:         0,
          background:    'rgba(248, 244, 238, 0.35)',
          opacity:       0,
          pointerEvents: 'none',
          willChange:    'opacity',
        }}
      />

      {/* ── Eyebrow — near top, GSAP fades it in/out ─────────────────── */}
      <p
        ref={eyebrowRef}
        style={{
          position:      'absolute',
          top:           'clamp(2.5rem, 5vw, 4rem)',
          left:          0,
          right:         0,
          textAlign:     'center',
          fontFamily:    'var(--font-body)',
          fontSize:      '0.8125rem',
          fontWeight:    600,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color:         MUTED,
          opacity:       0,
          padding:       '0 1.5rem',
          pointerEvents: 'none',
        }}
      >
        {eyebrow}
      </p>

      {/* ── Dark lines l1-l5 — ivory text, vertically centred ─────────── *
       *  top:50% + GSAP yPercent:-50 centres each line.                    *
       *  GSAP adds y-offset on top without conflicting with yPercent.      */}
      {LINES.slice(0, 5).map((line, i) => (
        <p
          key={line.id}
          ref={(el) => { lineRefs.current[i] = el }}
          style={{
            position:              'absolute',
            top:                   '50%',
            left:                  0,
            right:                 0,
            textAlign:             'center',
            padding:               '0 clamp(1.5rem, 7vw, 5rem)',
            fontFamily:            'var(--font-display)',
            fontSize:              'clamp(1.625rem, 3vw + 0.5rem, 2.5rem)',
            fontWeight:            500,
            lineHeight:            1.22,
            letterSpacing:         '-0.022em',
            color:                 IVORY,
            fontVariationSettings: '"opsz" 48',
            opacity:               0,
            pointerEvents:         'none',
          }}
        >
          {line.text}
        </p>
      ))}

      {/* ── Hope lines l6-l7 — DARK INK text (bg is now light) ────────── */}
      {LINES.slice(5).map((line, i) => (
        <p
          key={line.id}
          ref={(el) => { lineRefs.current[5 + i] = el }}
          style={{
            position:              'absolute',
            top:                   '50%',
            left:                  0,
            right:                 0,
            textAlign:             'center',
            padding:               '0 clamp(1.5rem, 7vw, 5rem)',
            fontFamily:            'var(--font-display)',
            fontSize:              'clamp(1.625rem, 3vw + 0.5rem, 2.5rem)',
            fontWeight:            500,
            lineHeight:            1.22,
            letterSpacing:         '-0.022em',
            color:                 DARK_INK,
            fontVariationSettings: '"opsz" 48',
            opacity:               0,
            pointerEvents:         'none',
          }}
        >
          {line.text}
        </p>
      ))}

      {/* ── CTA — bottom of viewport, appears on the lightened bg ──────── */}
      <div
        ref={ctaRef}
        style={{
          position:  'absolute',
          bottom:    'clamp(2.5rem, 6vw, 5rem)',
          left:      0,
          right:     0,
          opacity:   0,
          padding:   '0 clamp(1.5rem, 5vw, 3rem)',
        }}
      >
        <CtaBlock dark={false} closeBody={closeBody} ctaButton={ctaButton} ctaSub={ctaSub} />
      </div>

    </section>
  )
}
