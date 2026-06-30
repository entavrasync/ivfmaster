import { defineRouting } from 'next-intl/routing';

// Single source of truth for all locale-related configuration.
// Import this in: middleware, i18n/request.ts, i18n/navigation.ts,
// and any generateStaticParams that needs to enumerate all locales.
export const routing = defineRouting({
  locales: ['en', 'hi', 'mr'] as const,
  defaultLocale: 'en',

  // 'as-needed': default locale (en) has no URL prefix.
  // /about         → English
  // /hi/about      → Hindi
  // /mr/about      → Marathi
  // This gives clean URLs for the majority (English) while still
  // giving Hindi/Marathi their own SEO-indexable URL.
  localePrefix: 'as-needed',
});

export type Locale = (typeof routing.locales)[number]; // 'en' | 'hi' | 'mr'
