/**
 * Validation policies for localized fields.
 *
 * Every function here returns Sanity's custom-validation contract —
 * `true` for valid, or a human-readable string for invalid — but none of them
 * import `sanity`, so they are unit-testable with `node:test` and are the
 * single place where "what counts as translated" is defined.
 *
 * Two policies, deliberately distinct (see SANITY_DEVELOPMENT_ARCHITECTURE.md):
 *
 *   requireAllLocales  — the field is meaningless in a locale that lacks it.
 *                        Use for anything a visitor reads on a page that must
 *                        exist in both languages: headings, CTA labels,
 *                        image alt text, SEO titles.
 *
 *   requireAnyLocale   — the field must not be entirely empty, but a missing
 *                        translation is a legitimate editorial state that
 *                        `coalesce()` will fall back for. Use for long-form
 *                        body copy that is genuinely translated over time.
 *
 * Nothing here silently accepts a value that is empty in *every* locale.
 */

import { LOCALE_LABELS, SUPPORTED_LOCALES } from './locales'
import {
  graphemeLength,
  presentLocales,
  type LocalizedValue,
} from './localizedValue'

export type ValidationResult = true | string

/**
 * Sanity hands custom validators an untyped value, so every validator here
 * accepts `unknown` and narrows once. Anything that is not an object is
 * treated as an absent localized value rather than throwing — a malformed
 * document should surface as a validation message, not a Studio crash.
 */
function asLocalized(value: unknown): LocalizedValue<unknown> | undefined {
  if (value === null || value === undefined) return undefined
  if (typeof value !== 'object' || Array.isArray(value)) return undefined
  return value as LocalizedValue<unknown>
}

/**
 * Every supported locale must carry content.
 *
 * Sanity only runs custom validators on fields that are present, so an
 * *entirely* untouched object is reported as missing all locales rather than
 * slipping through as `undefined`.
 */
export function requireAllLocales(value: unknown): ValidationResult {
  // Adapted to the target's established English-base, optional-Marathi policy.
  return presentLocales(asLocalized(value)).includes('en') || 'English content is required. Marathi is optional and falls back to English.'
}

/**
 * At least one locale must carry content; the rest may follow later.
 * Guards against the failure mode of a field that looks filled in the Studio
 * but is empty in both languages.
 */
export function requireAnyLocale(value: unknown): ValidationResult {
  return requireAllLocales(value)
}

/**
 * Applies `requireAllLocales` to every entry of an array of localized values.
 *
 * Needed because Sanity validates the array, not its items, when the items are
 * plain localized types (`of: [{ type: 'localizedString' }]`). Without this, an
 * array can satisfy an exact-length rule while an entry is empty in Marathi —
 * which on the Home page means a blank line in the middle of a pinned scroll
 * sequence that still consumes its full GSAP beat.
 */
export function requireAllLocalesInEach(value: unknown): ValidationResult {
  if (!Array.isArray(value)) return true
  for (const [index, entry] of value.entries()) {
    const result = requireAllLocales(entry)
    if (result !== true) return `Item ${index + 1} — ${result}`
  }
  return true
}

/**
 * Length guidance for SEO fields, measured in grapheme clusters so Devanagari
 * is not penalised for using combining marks.
 *
 * Returned as a message for Sanity's `.warning()` rather than `.error()`:
 * a slightly long Marathi description is an editorial judgement call, not a
 * broken document, and blocking publish over it would be wrong.
 */
export function warnOnLength(
  value: unknown,
  {
    min,
    max,
    fieldLabel,
    note = 'Search engines may truncate this.',
  }: { min?: number; max: number; fieldLabel: string; note?: string },
): ValidationResult {
  const localized = asLocalized(value)
  if (!localized) return true

  const problems: string[] = []
  for (const locale of SUPPORTED_LOCALES) {
    const raw = localized[locale]
    if (typeof raw !== 'string' || raw.trim().length === 0) continue
    const length = graphemeLength(raw.trim())
    if (length > max) {
      problems.push(
        `${LOCALE_LABELS[locale]} is ${length} characters (recommended maximum ${max})`,
      )
    } else if (min !== undefined && length < min) {
      problems.push(
        `${LOCALE_LABELS[locale]} is ${length} characters (recommended minimum ${min})`,
      )
    }
  }

  if (problems.length === 0) return true
  return `${fieldLabel}: ${problems.join('; ')}. ${note}`
}

/** Recommended SEO limits, in grapheme clusters. */
export const SEO_LIMITS = {
  title: { max: 60 },
  description: { min: 70, max: 160 },
} as const
