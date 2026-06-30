'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { Container } from '@/components/layout/Container'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { Stagger, StaggerItem } from '@/components/motion'

gsap.registerPlugin(ScrollTrigger)

/* ─── Chapter content ───────────────────────────────────────────────────── */
const CHAPTERS = [
  {
    eyebrow: 'The silence',
    headline: "It's the part no one talks about.",
    body: "The questions at every gathering. The announcements that quietly sting. Carrying it month after month, mostly alone.",
    gradient: 'linear-gradient(148deg, #B4C3D6 0%, #8EA5BE 45%, #6C8AAA 100%)',
    num: '01',
  },
  {
    eyebrow: 'What we see',
    headline: "It's rarely one simple reason.",
    body: "Fertility is a story with many chapters — hormones, timing, age, sometimes nothing obvious at all. Confusion isn't your fault. It just means no one has explained it yet.",
    gradient: 'linear-gradient(148deg, #BEBAD6 0%, #9D94C5 45%, #7D6EAF 100%)',
    num: '02',
  },
  {
    eyebrow: 'Where it leads',
    headline: 'Understanding is where hope begins.',
    body: "When you finally see the full picture clearly, the fear quietens. That clarity is the first real step toward parenthood — and it's the one we take with you.",
    gradient: 'linear-gradient(148deg, #F2D9BE 0%, #E6BF94 45%, #D8A46E 100%)',
    num: '03',
  },
] as const

type Chapter = typeof CHAPTERS[number]

const SCROLL_MULTIPLIER = 2.5 // total virtual scroll height = section × this

/* ─── Sub-components ────────────────────────────────────────────────────── */

function ProgressTrack({ active }: { active: number }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute', right: '18px', top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
        zIndex: 10, pointerEvents: 'none',
      }}
    >
      <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.28)' }} />
      {CHAPTERS.map((_, i) => (
        <div key={i} style={{
          width: i === active ? '8px' : '5px',
          height: i === active ? '8px' : '5px',
          borderRadius: '50%',
          background: i === active ? '#E2849C' : 'rgba(255,255,255,0.35)',
          transition: 'all 0.55s cubic-bezier(0.22,1,0.36,1)',
          boxShadow: i === active ? '0 0 8px rgba(226,132,156,0.6)' : 'none',
        }} />
      ))}
      <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.28)' }} />
    </div>
  )
}

interface ChapterTextProps {
  chapter: Chapter
  active:  boolean
  mobile?: boolean
}

function ChapterText({ chapter, active, mobile }: ChapterTextProps) {
  return (
    <div style={{
      opacity:    active ? 1 : 0.22,
      transform:  active ? 'translateY(0)' : 'translateY(14px)',
      transition: 'opacity 0.58s cubic-bezier(0.22,1,0.36,1), transform 0.58s cubic-bezier(0.22,1,0.36,1)',
    }}>
      {/* Eyebrow */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: mobile ? '1rem' : '1.5rem' }}>
        <div style={{
          width: '24px', height: '1px',
          background: mobile ? 'rgba(151,166,210,0.7)' : '#97A6D2',
        }} />
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: '0.6875rem', fontWeight: 600,
          letterSpacing: '0.16em', textTransform: 'uppercase',
          color: mobile ? 'rgba(151,166,210,0.88)' : '#97A6D2',
          margin: 0,
        }}>
          {chapter.eyebrow}
        </p>
      </div>

      {/* Headline */}
      <h3 style={{
        fontFamily: 'var(--font-display)',
        fontSize: mobile
          ? 'clamp(1.875rem, 6vw + 0.25rem, 2.5rem)'
          : 'clamp(2.25rem, 2.8vw + 0.5rem, 3.5rem)',
        fontWeight: 500,
        lineHeight: 1.08,
        letterSpacing: '-0.025em',
        color: mobile ? '#F8F4EE' : '#1C2A48',
        fontVariationSettings: '"opsz" 48',
        margin: '0 0 1.25rem',
      }}>
        {chapter.headline}
      </h3>

      {/* Body */}
      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: mobile ? '1rem' : '1.125rem',
        lineHeight: 1.78,
        color: mobile ? 'rgba(248,244,238,0.80)' : '#5A6272',
        maxWidth: mobile ? '36ch' : '38ch',
        margin: 0,
      }}>
        {chapter.body}
      </p>
    </div>
  )
}

/* ─── Reduced-motion stacked fallback ───────────────────────────────────── */
function ReducedMotionLayout() {
  return (
    <section
      aria-label="Our story in chapters"
      style={{ background: '#EDEEF5', paddingTop: 'clamp(4rem,8vw,7rem)', paddingBottom: 'clamp(4rem,8vw,7rem)' }}
    >
      <Container>
        <Stagger stagger={0.18} delay={0.1}>
          {CHAPTERS.map((ch) => (
            <StaggerItem key={ch.eyebrow}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,300px),1fr))',
                gap: '2.5rem', alignItems: 'center', marginBottom: '5rem',
              }}>
                <div style={{ aspectRatio:'4/3', borderRadius:'16px', background: ch.gradient }} />
                <ChapterText chapter={ch} active />
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  )
}

/* ─── Main component ─────────────────────────────────────────────────────── */
export function PainRecognitionStory() {
  const reduced = useReducedMotion()

  const desktopRef = useRef<HTMLElement>(null)
  const mobileRef  = useRef<HTMLElement>(null)

  /* Image + text layer refs for each layout */
  const dtImg = useRef<(HTMLDivElement | null)[]>([null, null, null])
  const dtTxt = useRef<(HTMLDivElement | null)[]>([null, null, null])
  const mbImg = useRef<(HTMLDivElement | null)[]>([null, null, null])
  const mbTxt = useRef<(HTMLDivElement | null)[]>([null, null, null])

  const [active, setActive] = useState(0)
  const activeRef           = useRef(0)

  useEffect(() => {
    if (reduced) return

    const ctx = gsap.context(() => {

      /* Initial opacity */
      ;[dtImg, dtTxt, mbImg, mbTxt].forEach(group =>
        group.current.forEach((el, i) => el && gsap.set(el, { opacity: i === 0 ? 1 : 0, y: 0 }))
      )

      /* Slow scale drift on first image */
      ;[dtImg.current[0], mbImg.current[0]].forEach(el => {
        if (el) gsap.to(el, { scale: 1.06, duration: 16, ease: 'none', overwrite: 'auto' })
      })

      function activate(
        idx:     number,
        imgRefs: (HTMLDivElement | null)[],
        txtRefs: (HTMLDivElement | null)[],
      ) {
        if (idx === activeRef.current) return
        activeRef.current = idx
        setActive(idx)

        imgRefs.forEach((el, i) => {
          if (!el) return
          gsap.to(el, { opacity: i === idx ? 1 : 0, duration: 0.7, ease: 'power2.inOut', overwrite: 'auto' })
          if (i === idx) {
            gsap.fromTo(el, { scale: 1.0 }, { scale: 1.06, duration: 16, ease: 'none', overwrite: 'auto' })
          }
        })

        txtRefs.forEach((el, i) => {
          if (!el) return
          gsap.to(el, {
            opacity: i === idx ? 1 : 0,
            y:       i === idx ? 0 : 10,
            duration: 0.55,
            ease: 'power2.inOut',
            overwrite: 'auto',
          })
        })
      }

      const mm = gsap.matchMedia()

      mm.add('(min-width: 1024px)', () => {
        const el = desktopRef.current
        if (!el) return
        const st = ScrollTrigger.create({
          trigger: el,
          pin:     true,
          start:   'top top',
          end:     () => '+=' + window.innerHeight * SCROLL_MULTIPLIER,
          invalidateOnRefresh: true,
          onUpdate(self) {
            const p = self.progress
            activate(p < 0.33 ? 0 : p < 0.67 ? 1 : 2, dtImg.current, dtTxt.current)
          },
        })
        return () => st.kill()
      })

      mm.add('(max-width: 1023px)', () => {
        const el = mobileRef.current
        if (!el) return
        const st = ScrollTrigger.create({
          trigger: el,
          pin:     true,
          start:   'top top',
          end:     () => '+=' + window.innerHeight * SCROLL_MULTIPLIER,
          invalidateOnRefresh: true,
          onUpdate(self) {
            const p = self.progress
            activate(p < 0.33 ? 0 : p < 0.67 ? 1 : 2, mbImg.current, mbTxt.current)
          },
        })
        return () => st.kill()
      })

      const t = setTimeout(() => ScrollTrigger.refresh(), 300)
      return () => clearTimeout(t)
    })

    return () => ctx.revert()
  }, [reduced, setActive])

  if (reduced) return <ReducedMotionLayout />

  return (
    <>
      {/* ══════════════════════════════ DESKTOP ≥1024px ══════════════════ */}
      <section
        ref={desktopRef}
        className="hidden lg:block"
        aria-label="Our story in chapters"
        style={{
          height:   '100vh',
          overflow: 'hidden',
          /*
           * Flat colour matching the parent wrapper's mid-gradient value (#F5F3FB→#ECEAF4).
           * A flat colour is intentional here: when GSAP pins this section (position:fixed),
           * the browser restarts any gradient from the element's own top edge, which would
           * cause a tonal jump. A flat mid-value is visually indistinguishable from the
           * wrapper gradient at this scroll depth and stays consistent when pinned.
           */
          background: '#F0EEF6',
        }}
      >
        <Container size="wide">
          {/*
           * Grid: 54% image / 46% text.
           * CRITICAL: height: 100vh on the grid so cells fill the viewport,
           * enabling absolute-inset centering of the text layers.
           */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '54% 46%',
            height:  '100vh',
          }}>

            {/* ── Left: image stage ── */}
            <div style={{
              display:       'flex',
              alignItems:    'center',
              justifyContent: 'flex-start',
              paddingTop:    '2.5rem',
              paddingBottom: '2.5rem',
              paddingRight:  '2.5rem',
            }}>
              {/*
               * maxHeight prevents the 4:5 image from exceeding the viewport.
               * maxWidth is derived from maxHeight × aspect ratio so the
               * proportions are always preserved regardless of screen size.
               */}
              <div style={{
                position:   'relative',
                width:      '100%',
                aspectRatio:'4 / 5',
                maxHeight:  'calc(100vh - 5rem)',
                maxWidth:   'calc((100vh - 5rem) * 4 / 5)',
                borderRadius: '20px',
                overflow:   'hidden',
                boxShadow:  '0 40px 80px -20px rgba(46,79,142,0.30), 0 8px 24px -8px rgba(28,42,72,0.16)',
              }}>
                {CHAPTERS.map((ch, i) => (
                  <div
                    key={ch.eyebrow}
                    ref={el => { dtImg.current[i] = el }}
                    aria-hidden="true"
                    style={{
                      position: 'absolute', inset: 0,
                      background: ch.gradient,
                      opacity:    i === 0 ? 1 : 0,
                      willChange: 'opacity, transform',
                    }}
                  />
                ))}
                <ProgressTrack active={active} />
              </div>
            </div>

            {/* ── Right: text layers (all centred, crossfade) ── */}
            <div style={{
              position: 'relative',
              /* All text layers are absolute so the column has no intrinsic height */
            }}>
              {/*
               * Large decorative chapter number — unique editorial touch.
               * Faint navy, sits behind the text content.
               */}
              <div
                aria-hidden="true"
                style={{
                  position:     'absolute',
                  right:        '-1rem',
                  bottom:       '2rem',
                  fontFamily:   'var(--font-display)',
                  fontSize:     'clamp(7rem, 12vw, 13rem)',
                  fontWeight:   700,
                  lineHeight:   1,
                  letterSpacing:'-0.06em',
                  color:        'rgba(46,79,142,0.055)',
                  userSelect:   'none',
                  pointerEvents:'none',
                  fontVariationSettings: '"opsz" 72',
                  transition:   'opacity 0.4s ease',
                }}
              >
                {CHAPTERS[active].num}
              </div>

              {/* Three text panels — all at same position, GSAP crossfades */}
              {CHAPTERS.map((ch, i) => (
                <div
                  key={ch.eyebrow}
                  ref={el => { dtTxt.current[i] = el }}
                  style={{
                    position:    'absolute',
                    inset:       0,
                    display:     'flex',
                    alignItems:  'center',
                    paddingLeft: '2.5rem',
                    paddingRight:'1.5rem',
                    opacity:     i === 0 ? 1 : 0,
                    pointerEvents: active === i ? 'auto' : 'none',
                  }}
                >
                  <div style={{ maxWidth: '44ch' }}>
                    <ChapterText chapter={ch} active={active === i} />
                  </div>
                </div>
              ))}
            </div>

          </div>
        </Container>
      </section>

      {/* ══════════════════════════════ MOBILE <1024px ═══════════════════ */}
      <section
        ref={mobileRef}
        className="lg:hidden"
        aria-label="Our story in chapters"
        style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}
      >
        {/* Full-bleed gradient images */}
        {CHAPTERS.map((ch, i) => (
          <div
            key={ch.eyebrow}
            ref={el => { mbImg.current[i] = el }}
            aria-hidden="true"
            style={{
              position: 'absolute', inset: 0,
              background: ch.gradient,
              opacity:    i === 0 ? 1 : 0,
              willChange: 'opacity, transform',
            }}
          />
        ))}

        {/* Scrim: legible bottom, airy top */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
            background: 'linear-gradient(to top, rgba(15,24,48,0.90) 0%, rgba(15,24,48,0.55) 35%, rgba(15,24,48,0.08) 60%, transparent 78%)',
          }}
        />

        {/* Progress track (mobile — bottom-left of image area) */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute', left: '1.5rem', top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
            zIndex: 3,
          }}
        >
          {CHAPTERS.map((_, i) => (
            <div key={i} style={{
              width: i === active ? '6px' : '4px',
              height: i === active ? '6px' : '4px',
              borderRadius: '50%',
              background: i === active ? '#E2849C' : 'rgba(255,255,255,0.35)',
              transition: 'all 0.55s cubic-bezier(0.22,1,0.36,1)',
            }} />
          ))}
        </div>

        {/* Text layers: stacked at bottom, GSAP crossfades */}
        {CHAPTERS.map((ch, i) => (
          <div
            key={ch.eyebrow}
            ref={el => { mbTxt.current[i] = el }}
            style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              padding:  '0 1.75rem 5rem',
              zIndex:   2,
              opacity:  i === 0 ? 1 : 0,
            }}
          >
            <ChapterText chapter={ch} active mobile />
          </div>
        ))}
      </section>
    </>
  )
}
