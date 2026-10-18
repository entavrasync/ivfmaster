/**
 * The single source of truth for *content* locales inside Sanity.
 *
 * Why this is not imported from `i18n/routing.ts`
 * ----------------------------------------------
 * `i18n/routing.ts` owns URL routing and pulls in `next-intl`. The Studio is a
 * separate bundle that has no business importing the app's routing layer, and
 * the Sanity CLI (schema extract / typegen) evaluates these modules outside of
 * Next.js entirely. So the locale list is declared here independently — and
 * `tests/sanity-locales.test.mts` asserts the two lists stay identical, so the
 * duplication is verified rather than hoped for.
 *
 * Both locales are first-class production content. Marathi is the *default*
 * locale (it owns the unprefixed URLs), but English is not a translation of it
 * and neither is authoritative over the other.
 */

export const SUPPORTED_LOCALES = ['mr', 'en'] as const

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]

/** Matches `routing.defaultLocale`. Owns the unprefixed URLs (`/about`). */
export const DEFAULT_LOCALE: SupportedLocale = 'mr'

/** Human labels shown on Studio fieldsets. */
export const LOCALE_LABELS: Readonly<Record<SupportedLocale, string>> = {
  mr: 'Marathi (मराठी)',
  en: 'English',
}

export function isSupportedLocale(value: unknown): value is SupportedLocale {
  return (
    typeof value === 'string' &&
    (SUPPORTED_LOCALES as readonly string[]).includes(value)
  )
}

/**
 * Resolution order used by both GROQ `coalesce()` and runtime helpers:
 * the requested locale first, then every other locale in declaration order.
 *
 * Deliberately symmetric — English is not privileged as a fallback, because
 * both locales are production content. A missing Marathi value falls back to
 * English and a missing English value falls back to Marathi.
 */
export function localeFallbackChain(
  locale: SupportedLocale,
): readonly SupportedLocale[] {
  return [locale, ...SUPPORTED_LOCALES.filter((l) => l !== locale)]
}
