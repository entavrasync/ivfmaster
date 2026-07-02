import type { Metadata, Viewport } from 'next'
import { Figtree, Fraunces } from 'next/font/google'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'
import { Analytics } from '@vercel/analytics/next'
import { Navbar } from '@/components/nav/Navbar'
import { ReadingProgressProvider } from '@/components/providers/ReadingProgressContext'
import { routing } from '@/i18n/routing'
import '@/app/globals.css'

const figtree = Figtree({
  subsets: ['latin'],
  variable: '--font-figtree',
  display: 'swap',
})

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  axes: ['opsz'],
})

// Generates locale-specific <title> and <meta description> from messages/[locale].json
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Meta' })

  return {
    title: {
      default: t('siteTitle'),
      // Page-level titles use: `{ title: 'Page Name' }` which becomes "Page Name | IVF Master"
      template: '%s | IVF Master',
    },
    description: t('siteDescription'),
    icons: {
      icon: [{ url: '/icon.jpg' }],
    },
    // hreflang alternate links — critical for multilingual SEO
    alternates: {
      languages: {
        en: '/',
        hi: '/hi',
        mr: '/mr',
      },
    },
  }
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#2E4F8E',
}

// Tells Next.js which [locale] values are valid at build time.
// Without this, only the dynamically-requested locales would be pre-rendered.
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params

  // Guard: unknown locale segments → 404 instead of broken render
  if (!(routing.locales as ReadonlyArray<string>).includes(locale)) {
    notFound()
  }

  // Load the full message map for this locale.
  // NextIntlClientProvider makes it available to all client components
  // via useTranslations() without any extra prop drilling.
  const messages = await getMessages()

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${figtree.variable} ${fraunces.variable}`}
    >
      <body suppressHydrationWarning className={figtree.className}>
        <NextIntlClientProvider messages={messages}>
          <ReadingProgressProvider>
            <Navbar />
            {children}
          </ReadingProgressProvider>
        </NextIntlClientProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
