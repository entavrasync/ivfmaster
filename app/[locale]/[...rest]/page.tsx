import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: { absolute: '404 – Page Not Found | IVF Master' },
  robots: { index: false, follow: true },
}

// Keep unknown website paths in the locale layout and its not-found boundary.
export default function UnknownPage() {
  notFound()
}
