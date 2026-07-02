'use client'

import { useRef, useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ChevronDown } from 'lucide-react'
import { Link, usePathname } from '@/i18n/navigation'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { PROCEDURES, ProcedureMark } from './procedures-data'

const EASE = [0.22, 1, 0.36, 1] as const

interface ProceduresDropdownProps {
  readonly active:       boolean
  readonly isHovered:    boolean
  readonly onHoverEnter: () => void
}

export function ProceduresDropdown({
  active,
  isHovered,
  onHoverEnter,
}: ProceduresDropdownProps) {
  const reduced      = useReducedMotion()
  const pathname     = usePathname()
  const [open, setOpen] = useState(false)
  const timerRef     = useRef<ReturnType<typeof setTimeout> | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  function cancelClose() {
    if (timerRef.current) clearTimeout(timerRef.current)
  }

  function scheduleClose() {
    timerRef.current = setTimeout(() => setOpen(false), 150)
  }

  function openMenu() {
    cancelClose()
    setOpen(true)
  }

  /* Escape key closes */
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  /* Outside click closes */
  useEffect(() => {
    if (!open) return
    function onDown(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  /* Timer cleanup */
  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

  /* Variants */
  const panelV = {
    hidden:  { opacity: 0, scale: reduced ? 1 : 0.97, y: reduced ? 0 : -6 },
    visible: {
      opacity: 1,
      scale:   1,
      y:       0,
      transition: {
        duration:        0.26,
        ease:            EASE,
        staggerChildren: reduced ? 0 : 0.045,
        delayChildren:   reduced ? 0 : 0.04,
      },
    },
    exit: {
      opacity: 0,
      scale:   reduced ? 1 : 0.97,
      y:       reduced ? 0 : -4,
      transition: { duration: 0.18, ease: [0.4, 0, 1, 1] as const },
    },
  }

  const itemV = {
    hidden:  { opacity: 0, y: reduced ? 0 : 7 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.28, ease: EASE } },
  }

  const showPill = isHovered || open

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative' }}
      onMouseEnter={() => { openMenu(); onHoverEnter() }}
      onMouseLeave={scheduleClose}
    >
      {/* ── Trigger — click navigates, hover opens panel ─────────────────── */}
      <Link
        href="/procedures"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls="procedures-panel"
        className="relative flex items-center gap-1 px-4 py-2 rounded-full select-none"
      >
        {showPill && !reduced && (
          <motion.div
            layoutId="nav-hover-pill"
            className="absolute inset-0 rounded-full"
            style={{ backgroundColor: 'rgba(46,79,142,0.08)' }}
            transition={{ type: 'spring', stiffness: 500, damping: 45, mass: 0.5 }}
          />
        )}

        <span
          className="relative z-10 transition-colors duration-200"
          style={{
            fontFamily:    'var(--font-body)',
            fontSize:      '1.0625rem',
            fontWeight:    active ? 600 : 500,
            letterSpacing: '-0.01em',
            color:         active ? '#1C2A48' : 'rgba(28,42,72,0.60)',
          }}
        >
          Procedures
        </span>

        <motion.span
          className="relative z-10"
          animate={reduced ? {} : { rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25, ease: EASE }}
          style={{
            display:    'flex',
            alignItems: 'center',
            color:      active ? 'rgba(28,42,72,0.70)' : 'rgba(28,42,72,0.40)',
          }}
        >
          <ChevronDown size={14} strokeWidth={2} />
        </motion.span>

        {active && (
          <motion.span
            layoutId="nav-active-bar"
            className="absolute bottom-0.5 left-4 right-4"
            style={{ height: '2px', backgroundColor: '#E2849C', borderRadius: '2px' }}
            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
          />
        )}
      </Link>

      {/* ── Invisible bridge — eliminates the gap-hover dead zone ───────── */}
      {open && (
        <div
          aria-hidden="true"
          onMouseEnter={cancelClose}
          style={{
            position: 'absolute',
            top:      '100%',
            left:     '-20px',
            right:    '-20px',
            height:   '14px',
          }}
        />
      )}

      {/* ── Panel positioner ─────────────────────────────────────────────── */}
      <div
        style={{
          position:  'absolute',
          top:       'calc(100% + 12px)',
          left:      '50%',
          transform: 'translateX(-50%)',
          zIndex:    100,
        }}
      >
        <AnimatePresence>
          {open && (
            <motion.div
              id="procedures-panel"
              role="menu"
              aria-label="Procedures"
              key="procedures-panel"
              variants={panelV}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{
                width:               '348px',
                background:          'rgba(251,247,241,0.98)',
                borderRadius:        '18px',
                border:              '1px solid rgba(216,204,190,0.55)',
                boxShadow:           '0 24px 56px -10px rgba(28,42,72,0.22), 0 8px 20px -6px rgba(28,42,72,0.12)',
                padding:             '10px',
                backdropFilter:      'blur(18px)',
                WebkitBackdropFilter: 'blur(18px)',
              }}
            >
              {PROCEDURES.map((proc) => {
                const procActive = pathname === proc.href || pathname.startsWith(proc.href + '/')
                return (
                  <motion.div
                    key={proc.id}
                    variants={itemV}
                    whileHover={{ background: procActive ? 'rgba(46,79,142,0.08)' : 'rgba(46,79,142,0.05)' }}
                    style={{
                      borderRadius: '12px',
                      background:   procActive ? 'rgba(46,79,142,0.06)' : 'transparent',
                    }}
                  >
                    <Link
                      href={proc.href}
                      role="menuitem"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-xl"
                      style={{
                        display:        'flex',
                        alignItems:     'center',
                        gap:            '0.75rem',
                        padding:        '0.6875rem 0.75rem',
                        textDecoration: 'none',
                      }}
                    >
                      <ProcedureMark proc={proc} size={38} />

                      <div style={{ minWidth: 0 }}>
                        <p
                          style={{
                            fontFamily:    'var(--font-body)',
                            fontSize:      '0.9375rem',
                            fontWeight:    procActive ? 600 : 500,
                            letterSpacing: '-0.01em',
                            color:         procActive ? '#1C2A48' : '#374151',
                            margin:        0,
                            lineHeight:    1.3,
                          }}
                        >
                          {proc.label}
                        </p>
                        <p
                          style={{
                            fontFamily: 'var(--font-body)',
                            fontSize:   '0.8125rem',
                            lineHeight: 1.5,
                            color:      'rgba(55,65,81,0.56)',
                            margin:     '0.1875rem 0 0',
                          }}
                        >
                          {proc.description}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
