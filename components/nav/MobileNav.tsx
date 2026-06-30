'use client'

import { Link, usePathname } from '@/i18n/navigation'
import { AnimatePresence, motion } from 'motion/react'
import { X, ChevronRight } from 'lucide-react'
import { Stagger, StaggerItem, Pressable } from '@/components/motion'
import { LanguageSwitcher } from './LanguageSwitcher'
import { cn } from '@/lib/utils'

const EASE = [0.22, 1, 0.36, 1] as const

const NAV_LINKS = [
  { label: 'Home',        href: '/'            },
  { label: 'Educate IVF', href: '/educate-ivf' },
  { label: 'Procedures',  href: '/procedures'  },
  { label: 'About',       href: '/about'       },
  { label: 'Team',        href: '/team'        },
  { label: 'Contact',     href: '/contact'     },
]

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileNav({ isOpen, onClose }: Readonly<MobileNavProps>) {
  const pathname = usePathname()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="fixed inset-0 z-40"
            style={{ backgroundColor: 'rgba(28,42,72,0.35)', backdropFilter: 'blur(3px)' }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel — flex column, NO overflow here so footer sticks */}
          <motion.div
            key="panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.48, ease: EASE }}
            className="fixed top-0 right-0 z-50 h-full flex flex-col"
            style={{
              width: 'min(80vw, 360px)',
              backgroundColor: '#FBF7F1',
              boxShadow: '-12px 0 48px rgba(28,42,72,0.18)',
            }}
          >
            {/* ── Header ── */}
            <div
              className="flex items-center justify-between shrink-0"
              style={{ padding: '18px 20px 16px', borderBottom: '1px solid rgba(216,204,190,0.6)' }}
            >
              <Link href="/" onClick={onClose} className="flex flex-col" style={{ gap: '2px' }} aria-label="IVF Master — home">
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', fontWeight: 700, color: '#2E4F8E', letterSpacing: '-0.02em' }}>
                  IVF Master
                </span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.6875rem', color: '#9AA0AC', letterSpacing: '0.02em' }}>
                  by Mandrupkar Clinic
                </span>
              </Link>

              <Pressable onClick={onClose}>
                <button
                  aria-label="Close menu"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '8px', color: '#6B7280' }}
                >
                  <X size={18} strokeWidth={2} />
                </button>
              </Pressable>
            </div>

            {/* ── Scrollable body ── */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden">

              {/* Language */}
              <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(236,239,249,0.8)' }}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.625rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9AA0AC', marginBottom: '10px' }}>
                  Language
                </p>
                <LanguageSwitcher variant="panel" />
              </div>

              {/* Nav links */}
              <nav style={{ padding: '8px 0' }}>
                <Stagger stagger={0.055} delay={0.04}>
                  {NAV_LINKS.map(({ label, href }) => {
                    const active = pathname === href || (href !== '/' && pathname.startsWith(href))
                    return (
                      <StaggerItem key={href}>
                        <Pressable haptic onClick={onClose}>
                          <Link
                            href={href}
                            className={cn('flex items-center justify-between group')}
                            style={{
                              padding: '13px 20px',
                              borderBottom: '1px solid rgba(236,239,249,0.6)',
                              backgroundColor: active ? 'rgba(46,79,142,0.04)' : 'transparent',
                            }}
                          >
                            <span
                              style={{
                                fontFamily: 'var(--font-body)',
                                fontSize: '0.9375rem',
                                fontWeight: active ? 600 : 400,
                                color: active ? '#2E4F8E' : '#374151',
                                letterSpacing: '-0.01em',
                              }}
                            >
                              {label}
                            </span>
                            <ChevronRight
                              size={15}
                              strokeWidth={2}
                              style={{ color: active ? '#2E4F8E' : '#C4C9D4', flexShrink: 0 }}
                            />
                          </Link>
                        </Pressable>
                      </StaggerItem>
                    )
                  })}
                </Stagger>
              </nav>
            </div>

            {/* ── Footer CTA — always visible at bottom ── */}
            <div
              className="shrink-0"
              style={{ padding: '14px 20px 28px', borderTop: '1px solid rgba(216,204,190,0.6)' }}
            >
              <Pressable haptic onClick={onClose}>
                <Link
                  href="/contact"
                  className="flex items-center justify-center w-full"
                  style={{
                    background: 'linear-gradient(135deg, #D4617B 0%, #C24E6A 100%)',
                    color: '#ffffff',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    letterSpacing: '-0.01em',
                    padding: '12px 20px',
                    borderRadius: '12px',
                    boxShadow: '0 6px 20px -4px rgba(194,78,106,0.45)',
                  }}
                >
                  Talk to our experts
                </Link>
              </Pressable>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
