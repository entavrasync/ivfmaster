import { routing } from '../i18n/routing.ts'

function normalizeSiteUrl(url: string | undefined): string {
  return (url || 'https://ivfmaster.in').replace(/\/+$/, '')
}

export const siteConfig = {
  name: 'IVF Master',
  legalName: 'IVF Master by Mandrupkar Clinic',
  description:
    'Personalized IVF and fertility treatment at IVF Master. Experience compassionate care from expert doctors in Sangli, Maharashtra.',
  url: normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL),
  locale: routing.defaultLocale,
  locales: routing.locales,
  address: {
    streetAddress: 'Mandrupkar Clinic, Ishwarpur',
    addressLocality: 'Sangli',
    addressRegion: 'Maharashtra',
    addressCountry: 'IN',
  },
  contact: {
    email: 'info@ivfmaster.in',
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
  analytics: {
    gtmId: process.env.NEXT_PUBLIC_GTM_ID || '',
    gaMeasurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '',
  },
} as const
