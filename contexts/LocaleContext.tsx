'use client'

import { createContext, useContext, useEffect, useState } from 'react'

export type Locale = 'en' | 'mr' | 'hi'

export const LOCALES: { code: Locale; label: string; nativeLabel: string }[] = [
  { code: 'en', label: 'English',  nativeLabel: 'English' },
  { code: 'mr', label: 'Marathi',  nativeLabel: 'मराठी'   },
  { code: 'hi', label: 'Hindi',    nativeLabel: 'हिंदी'   },
]

interface LocaleContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: 'en',
  setLocale: () => {},
})

export function LocaleProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [locale, setLocaleState] = useState<Locale>('en')

  useEffect(() => {
    const stored = localStorage.getItem('ivfmaster-locale') as Locale | null
    if (stored && LOCALES.some((l) => l.code === stored)) {
      setLocaleState(stored)
    }
  }, [])

  function setLocale(next: Locale) {
    setLocaleState(next)
    localStorage.setItem('ivfmaster-locale', next)

    // TODO(i18n): Replace the two lines above with next-intl routing when integrating:
    //   import { useRouter, usePathname } from 'next-intl/client'
    //   const router = useRouter()
    //   router.replace(pathname, { locale: next })
    // Also wrap the app with <NextIntlClientProvider locale={locale} messages={messages}>
    // and remove <LocaleProvider> — the locale source of truth moves to the URL.
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  return useContext(LocaleContext)
}
