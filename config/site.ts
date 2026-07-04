import { routing } from '../i18n/routing.ts'

type SiteEnvironment = 'production' | 'preview' | 'development'

function normalizeSiteUrl(url: string | undefined): string {
  return (url || 'https://ivfmaster.in').replace(/\/+$/, '')
}

function getSiteDomain(url: string): string {
  return new URL(url).hostname
}

function resolveSiteEnvironment(): SiteEnvironment {
  if (process.env.VERCEL_ENV === 'production') return 'production'
  if (process.env.VERCEL_ENV === 'preview') return 'preview'
  if (process.env.NODE_ENV === 'production') return 'production'
  return 'development'
}

const siteUrl = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL)

export const siteConfig = {
  name: 'IVF Master',
  legalName: 'IVF Master by Mandrupkar Clinic',
  description:
    'Personalized IVF and fertility treatment at IVF Master. Experience compassionate care from expert doctors in Sangli, Maharashtra.',
  url: siteUrl,
  domain: getSiteDomain(siteUrl),
  environment: resolveSiteEnvironment(),
  locale: routing.defaultLocale,
  locales: routing.locales,
  address: {
    streetAddress: 'Mandrupkar Clinic, Ishwarpur',
    addressLocality: 'Sangli',
    addressRegion: 'Maharashtra',
    addressCountry: 'IN',
  },
  contact: {
    email: 'ivfmaster.in@gmail.com',
    telephone: '+91 95610 96416',
    whatsappNumber: '91XXXXXXXXXX',
  },
  social: {
    instagram:
      'https://www.instagram.com/ivfmaster?utm_source=ig_web_button_share_sheet',
  },
  search: {
    googleVerificationFile: 'google80a692f4c482ca25.html',
  },
  seo: {
    contentReviewedAt: '2026-07-02',
  },
  analytics: {
    gtmId: process.env.NEXT_PUBLIC_GTM_ID || '',
    gaMeasurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '',
  },
} as const
