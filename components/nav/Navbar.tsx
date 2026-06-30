'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Link, usePathname } from '@/i18n/navigation'
import { motion } from 'motion/react'
import { Pressable } from '@/components/motion'
import { useLenis } from '@/components/providers/SmoothScrollProvider'
import { LanguageSwitcher } from './LanguageSwitcher'
import { MobileNav } from './MobileNav'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/utils'

const EASE = [0.22, 1, 0.36, 1] as const
const SCROLL_THRESHOLD = 80

const NAV_LINKS = [
  { label: 'Home',        href: '/'            },
  { label: 'Educate IVF', href: '/educate-ivf' },
  { label: 'Procedures',  href: '/procedures'  },
  { label: 'About',       href: '/about'       },
  { label: 'Team',        href: '/team'        },
  { label: 'Contact',     href: '/contact'     },
]

/* ─── Hamburger → X morph ──────────────────────────────────────────────── */
function MenuIcon({ open }: Readonly<{ open: boolean }>) {
  const reduced = useReducedMotion()
  return (
    <div className="flex flex-col justify-between w-6 h-4">
      <motion.span
        className="block w-full rounded-full"
        style={{ height: '2px', backgroundColor: '#1C2A48', transformOrigin: 'center' }}
        animate={reduced ? {} : { y: open ? 7 : 0, rotate: open ? 45 : 0 }}
        transition={{ duration: 0.35, ease: EASE }}
      />
      <motion.span
        className="block w-full rounded-full"
        style={{ height: '2px', backgroundColor: '#1C2A48' }}
        animate={reduced ? {} : { opacity: open ? 0 : 1, scaleX: open ? 0.4 : 1 }}
        transition={{ duration: 0.2 }}
      />
      <motion.span
        className="block w-full rounded-full"
        style={{ height: '2px', backgroundColor: '#1C2A48', transformOrigin: 'center' }}
        animate={reduced ? {} : { y: open ? -7 : 0, rotate: open ? -45 : 0 }}
        transition={{ duration: 0.35, ease: EASE }}
      />
    </div>
  )
}

/* ─── Desktop nav link — sliding pill + blush active bar ─────────────────── */
interface DesktopNavLinkProps {
  href: string
  label: string
  active: boolean
  isHovered: boolean
  onMouseEnter: () => void
}

function DesktopNavLink({ href, label, active, isHovered, onMouseEnter }: Readonly<DesktopNavLinkProps>) {
  const reduced = useReducedMotion()

  return (
    <Link
      href={href}
      onMouseEnter={onMouseEnter}
      className="relative flex items-center px-4 py-2 rounded-full select-none"
    >
      {/* Sliding hover background pill */}
      {isHovered && !reduced && (
        <motion.div
          layoutId="nav-hover-pill"
          className="absolute inset-0 rounded-full"
          style={{ backgroundColor: 'rgba(46,79,142,0.08)' }}
          transition={{ type: 'spring', stiffness: 500, damping: 45, mass: 0.5 }}
        />
      )}

      <span
        className={cn(
          'relative z-10 transition-colors duration-200',
          active ? 'text-navy' : 'text-ink/60',
        )}
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '1.0625rem',
          fontWeight: active ? 600 : 500,
          letterSpacing: '-0.01em',
        }}
      >
        {label}
      </span>

      {/* Blush underline for active route */}
      {active && (
        <motion.span
          layoutId="nav-active-bar"
          className="absolute bottom-0.5 left-4 right-4"
          style={{ height: '2px', backgroundColor: '#E2849C', borderRadius: '2px' }}
          transition={{ type: 'spring', stiffness: 400, damping: 40 }}
        />
      )}
    </Link>
  )
}

/* ─── Logo lockup ──────────────────────────────────────────────────────── */
function LogoLockup() {
  return (
    <Link
      href="/"
      className="flex items-center shrink-0"
      style={{ gap: '10px' }}
      aria-label="IVF Master — home"
    >
      <Image
        src="/icon.jpg"
        alt=""
        width={120}
        height={120}
        className="object-cover rounded-lg lg:rounded-full"
        style={{
          width: '144px',
          height: '44px',
          flexShrink: 0,
          boxShadow: '0 4px 18px rgba(46,79,142,0.25)',
        }}
        priority
        aria-hidden="true"
      />
    </Link>
  )
}

/* ─── Main Navbar ──────────────────────────────────────────────────────── */
export function Navbar() {
  const pathname   = usePathname()
  const lenis      = useLenis()
  const reduced    = useReducedMotion()

  const [scrolled,   setScrolled]   = useState(false)
  const [hidden,     setHidden]     = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [hoveredHref, setHoveredHref] = useState<string | null>(null)
  const lastScrollY = useRef(0)

  useEffect(() => {
    function onScroll() {
      const y   = window.scrollY
      const dir = y > lastScrollY.current ? 'down' : 'up'
      setScrolled(y > SCROLL_THRESHOLD)
      setHidden(y > SCROLL_THRESHOLD && dir === 'down')
      lastScrollY.current = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!lenis) return
    if (mobileOpen) {
      lenis.stop()
    } else {
      lenis.start()
    }
  }, [mobileOpen, lenis])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const glassBackground = scrolled ? 'rgba(251,247,241,0.96)' : 'rgba(251,247,241,0.82)'
  const glassShadow = scrolled
    ? '0 24px 56px -12px rgba(46,79,142,0.38), 0 8px 20px -6px rgba(28,42,72,0.20), 0 2px 0 0 rgba(255,255,255,0.60) inset'
    : '0 12px 40px -8px rgba(46,79,142,0.22), 0 4px 12px -4px rgba(28,42,72,0.12), 0 2px 0 0 rgba(255,255,255,0.55) inset'

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 z-50"
        style={{ paddingTop: '10px' }}
        animate={reduced ? {} : { y: hidden ? '-100%' : '0%' }}
        transition={{ duration: 0.42, ease: EASE }}
      >
        {/* Plain div — avoids Container's CSS-variable gutters fighting Tailwind overrides */}
        <div style={{ maxWidth: '1480px', margin: '0 auto', paddingLeft: '12px', paddingRight: '12px' }}>
          <motion.div
            animate={reduced ? {} : { background: glassBackground, boxShadow: glassShadow }}
            initial={{ background: glassBackground, boxShadow: glassShadow }}
            transition={{ duration: 0.4, ease: EASE }}
            style={{
              borderRadius: '24px',
              backdropFilter: 'blur(20px) saturate(150%)',
              WebkitBackdropFilter: 'blur(20px) saturate(150%)',
              border: '1px solid rgba(216,204,190,0.60)',
              padding: '10px 18px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
              {/* ── Logo ── */}
              <LogoLockup />

              {/* ── Desktop centre nav ── */}
              <nav
                className="hidden lg:flex items-center gap-1"
                aria-label="Main navigation"
                onMouseLeave={() => setHoveredHref(null)}
              >
                {NAV_LINKS.map(({ label, href }) => {
                  const active = pathname === href || (href !== '/' && pathname.startsWith(href))
                  return (
                    <DesktopNavLink
                      key={href}
                      href={href}
                      label={label}
                      active={active}
                      isHovered={hoveredHref === href}
                      onMouseEnter={() => setHoveredHref(href)}
                    />
                  )
                })}
              </nav>

              {/* ── Desktop right — language + CTA ── */}
              <div className="hidden lg:flex items-center gap-3 shrink-0">
                <LanguageSwitcher variant="bar" />

                <Pressable haptic>
                  <Link
                    href="/contact"
                    className="inline-flex items-center rounded-full"
                    style={{
                      background: 'linear-gradient(135deg, #D4617B 0%, #C24E6A 100%)',
                      color: '#ffffff',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.9375rem',
                      fontWeight: 600,
                      letterSpacing: '-0.01em',
                      padding: '10px 22px',
                      boxShadow: '0 8px 24px -4px rgba(194,78,106,0.60), 0 3px 8px -2px rgba(194,78,106,0.35)',
                    }}
                  >
                    Talk to our experts
                  </Link>
                </Pressable>
              </div>

              {/* ── Mobile hamburger ── */}
              <Pressable className="lg:hidden" onClick={() => setMobileOpen((v) => !v)}>
                <button
                  aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                  aria-expanded={mobileOpen}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, width: '40px', height: '40px' }}
                >
                  <MenuIcon open={mobileOpen} />
                </button>
              </Pressable>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <MobileNav isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  )
}
