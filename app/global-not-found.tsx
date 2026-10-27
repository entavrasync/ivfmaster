import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { Figtree, Fraunces } from 'next/font/google'
import { NotFoundPage } from '@/components/shared/NotFoundPage'
import './globals.css'

const figtree = Figtree({ subsets: ['latin'], variable: '--font-figtree', display: 'swap' })
const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces', display: 'swap', axes: ['opsz'] })

export const metadata: Metadata = {
  title: '404 – Page Not Found | IVF Master',
  robots: { index: false, follow: true },
}

export default async function GlobalNotFound() {
  // next-intl forwards the requested locale even when no page matches the URL.
  const locale = (await headers()).get('x-next-intl-locale') === 'en' ? 'en' : 'mr'
  return <html lang={locale} className={`${figtree.variable} ${fraunces.variable}`}><body><NotFoundPage locale={locale} /></body></html>
}
