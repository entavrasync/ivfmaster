import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

// Recursively merge two objects — base first, override on top.
// This lets hi.json / mr.json only carry the keys that have been
// professionally translated; everything else falls back to English.
function mergeMessages(
  base: Record<string, unknown>,
  override: Record<string, unknown>,
): Record<string, unknown> {
  const out = { ...base }
  for (const key of Object.keys(override)) {
    const bv = base[key]
    const ov = override[key]
    if (
      ov !== null &&
      typeof ov === 'object' &&
      !Array.isArray(ov) &&
      bv !== null &&
      typeof bv === 'object' &&
      !Array.isArray(bv)
    ) {
      out[key] = mergeMessages(
        bv as Record<string, unknown>,
        ov as Record<string, unknown>,
      )
    } else {
      out[key] = ov
    }
  }
  return out
}

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale

  if (!locale || !(routing.locales as ReadonlyArray<string>).includes(locale)) {
    locale = routing.defaultLocale
  }

  // Always load English as the base so no key ever shows as blank or raw.
  const enMessages = (await import('../messages/en.json')).default as Record<string, unknown>

  const messages =
    locale === 'en'
      ? enMessages
      : mergeMessages(
          enMessages,
          (await import(`../messages/${locale}.json`)).default as Record<string, unknown>,
        )

  return {
    locale,
    messages,
    timeZone: 'Asia/Kolkata',
    formats: {
      dateTime: {
        short: {
          day:   'numeric'  as const,
          month: 'short'    as const,
          year:  'numeric'  as const,
        },
      },
      number: {
        compact: { notation: 'compact' as const, maximumFractionDigits: 1 },
      },
    },
  }
})
