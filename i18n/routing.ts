import { defineRouting } from 'next-intl/routing';

// Single source of truth for all locale-related configuration.
// Import this in: middleware, i18n/request.ts, i18n/navigation.ts,
// and any generateStaticParams that needs to enumerate all locales.
export const routing = defineRouting({
  locales: ['mr', 'en'] as const,
  defaultLocale: 'mr',

  // 'as-needed': the default locale (mr) has no URL prefix.
  // /about         → Marathi (primary)
  // /hi/about      → Hindi
  // /en/about      → English
  // Marathi is the primary experience, so it owns the clean root URLs while
  // Hindi and English keep their own SEO-indexable prefixes.
  localePrefix: 'as-needed',

  // Always land visitors on Marathi (the default) rather than auto-switching by
  // the browser's Accept-Language. Visitors can still pick Hindi/English via the switcher.
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number]; // 'mr' | 'hi' | 'en'
