import type { Metadata, Viewport } from 'next'
import { Figtree, Fraunces } from 'next/font/google'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'
import { Analytics } from '@vercel/analytics/next'
import { GoogleTagManager } from '@/components/Analytics/GoogleTagManager'
import { Navbar } from '@/components/nav/Navbar'
import { FloatingContactCTA } from '@/components/shared/FloatingContactCTA'
import { ReadingProgressProvider } from '@/components/providers/ReadingProgressContext'
import { StructuredData } from '@/components/SEO/StructuredData'
import { siteConfig } from '@/config/site'
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
    metadataBase: new URL(siteConfig.url),
    applicationName: siteConfig.name,
    title: {
      default: t('siteTitle'),
      // Page-level titles use: `{ title: 'Page Name' }` which becomes "Page Name | IVF Master"
      template: '%s | IVF Master',
    },
    description: t('siteDescription'),
    category: 'healthcare',
    icons: {
      icon: [{ url: '/icon.jpg' }],
    },
    openGraph: {
      type: 'website',
      url: siteConfig.url,
      title: t('siteTitle'),
      description: t('siteDescription'),
      siteName: siteConfig.name,
      locale: `${locale}_IN`,
      alternateLocale: routing.locales
        .filter((alternateLocale) => alternateLocale !== locale)
        .map((alternateLocale) => `${alternateLocale}_IN`),
    },
    twitter: {
      card: 'summary_large_image',
      title: t('siteTitle'),
      description: t('siteDescription'),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
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
      <GoogleTagManager />
      <body suppressHydrationWarning className={figtree.className}>
        <StructuredData />
        <NextIntlClientProvider messages={messages}>
          <ReadingProgressProvider>
            <Navbar />
            {children}
          </ReadingProgressProvider>
          <FloatingContactCTA />
        </NextIntlClientProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
