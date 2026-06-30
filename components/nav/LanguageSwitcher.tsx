'use client'

import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Check, Globe } from 'lucide-react'
import { useLocale } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/navigation'
import { type Locale } from '@/i18n/routing'
import { Pressable } from '@/components/motion'
import { cn } from '@/lib/utils'

const EASE = [0.22, 1, 0.36, 1] as const

const LOCALES: { code: Locale; nativeLabel: string }[] = [
  { code: 'en', nativeLabel: 'English' },
  { code: 'mr', nativeLabel: 'मराठी'  },
  { code: 'hi', nativeLabel: 'हिंदी'  },
]

const DISPLAY_CODE: Record<Locale, string> = { en: 'EN', mr: 'मर', hi: 'हि' }

interface LanguageSwitcherProps {
  variant?: 'bar' | 'panel'
}

export function LanguageSwitcher({ variant = 'bar' }: Readonly<LanguageSwitcherProps>) {
  const locale    = useLocale() as Locale
  const router    = useRouter()
  const pathname  = usePathname()     // path without locale prefix
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  function select(code: Locale) {
    // next-intl router replaces the locale prefix in the current URL
    router.replace(pathname, { locale: code })
    setOpen(false)
  }

  function handleBlur(e: React.FocusEvent<HTMLDivElement>) {
    if (!ref.current?.contains(e.relatedTarget as Node)) {
      setOpen(false)
    }
  }

  /* ── Panel variant (mobile drawer) ────────────────────────────────────── */
  if (variant === 'panel') {
    return (
      <div className="flex flex-col gap-1">
        {LOCALES.map(({ code, nativeLabel }) => (
          <Pressable key={code} haptic onClick={() => select(code)}>
            <button
              className={cn(
                'w-full flex items-center justify-between px-4 py-3 rounded-lg text-left',
                'transition-colors duration-200',
                code === locale
                  ? 'bg-lavender text-navy font-medium'
                  : 'text-slate hover:text-ink',
              )}
            >
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '1rem' }}>
                {nativeLabel}
              </span>
              {code === locale && (
                <Check size={15} className="text-navy" strokeWidth={2.5} />
              )}
            </button>
          </Pressable>
        ))}
      </div>
    )
  }

  /* ── Bar variant (desktop nav) ─────────────────────────────────────────── */
  return (
    <div
      ref={ref}
      className="relative"
      onBlur={handleBlur}
      tabIndex={-1}
    >
      <Pressable>
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Switch language"
          className={cn(
            'flex items-center gap-2 px-4 py-2.5 rounded-full',
            'border transition-colors duration-200',
            open
              ? 'border-taupe/80 text-navy'
              : 'border-taupe/60 text-slate hover:text-navy hover:border-taupe',
          )}
        >
          <Globe size={15} strokeWidth={1.75} />
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 500 }}>
            {DISPLAY_CODE[locale] ?? locale.toUpperCase()}
          </span>
        </button>
      </Pressable>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.2, ease: EASE }}
            className={cn(
              'absolute right-0 top-full mt-2 z-50',
              'min-w-34 overflow-hidden rounded-xl',
              'bg-ivory border border-taupe shadow-sm py-1.5',
            )}
          >
            {LOCALES.map(({ code, nativeLabel }) => (
              <Pressable key={code}>
                <button
                  onClick={() => select(code)}
                  className={cn(
                    'w-full flex items-center justify-between px-3.5 py-2',
                    'transition-colors duration-150',
                    code === locale ? 'text-navy' : 'text-slate hover:text-ink',
                  )}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.875rem',
                      fontWeight: code === locale ? 500 : 400,
                    }}
                  >
                    {nativeLabel}
                  </span>
                  {code === locale && (
                    <Check size={13} strokeWidth={2.5} className="text-navy ml-2 shrink-0" />
                  )}
                </button>
              </Pressable>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
