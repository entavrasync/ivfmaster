/**
 * Pure helpers for reading and validating localized values.
 *
 * This module deliberately imports nothing from `sanity` so that it can be
 * unit-tested with the project's existing `node:test` runner and reused on the
 * Next.js side without dragging the Studio bundle along.
 *
 * The shape it operates on is produced by the `localizedString`,
 * `localizedText` and `localizedPortableText` schema objects:
 *
 *   { _type: 'localizedString', mr: 'मराठी मजकूर', en: 'English copy' }
 */

import {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  localeFallbackChain,
  type SupportedLocale,
} from './locales'

export type LocalizedValue<T> = Partial<Record<SupportedLocale, T>> & {
  _type?: string
}

/** Minimal structural shape of a Portable Text block. */
export type PortableTextBlockLike = {
  _type?: string
  _key?: string
  children?: ReadonlyArray<{ _type?: string; text?: string }>
}

/**
 * Treats `undefined`, `null`, `''` and whitespace-only strings as absent.
 *
 * `String.prototype.trim()` removes Unicode whitespace only, so Devanagari
 * text — including combining vowel signs and the virama — is never trimmed
 * away. An empty array (an unfilled Portable Text field) also counts as blank.
 */
export function isBlankValue(value: unknown): boolean {
  if (value === undefined || value === null) return true
  if (typeof value === 'string') return value.trim().length === 0
  if (Array.isArray(value)) return value.every((entry) => isBlankBlock(entry))
  return false
}

/** A Portable Text block with no text in any child counts as blank. */
function isBlankBlock(block: unknown): boolean {
  if (block === null || typeof block !== 'object') return true
  const children = (block as PortableTextBlockLike).children
  if (!Array.isArray(children)) return false // non-text blocks (images etc.) are content
  return children.every((child) => isBlankValue(child?.text))
}

/** Locales that actually carry content on this value. */
export function presentLocales<T>(
  value: LocalizedValue<T> | undefined | null,
  locales: readonly SupportedLocale[] = SUPPORTED_LOCALES,
): SupportedLocale[] {
  if (!value) return []
  return locales.filter((locale) => !isBlankValue(value[locale]))
}

/**
 * Runtime read with the same fallback order GROQ's `coalesce()` uses, so a
 * value resolved in TypeScript matches one resolved in a query.
 */
export function resolveLocalized<T>(
  value: LocalizedValue<T> | undefined | null,
  locale: SupportedLocale = DEFAULT_LOCALE,
): T | undefined {
  if (!value) return undefined
  for (const candidate of localeFallbackChain(locale)) {
    const resolved = value[candidate]
    if (!isBlankValue(resolved)) return resolved
  }
  return undefined
}

/**
 * Counts user-perceived characters rather than UTF-16 code units.
 *
 * This matters for SEO length guidance: `'मराठी'.length` is 5 because the
 * vowel signs are separate code points, but a reader — and a search result
 * snippet — sees 3 clusters. Measuring code units would penalise Devanagari
 * for being Devanagari. Falls back to code points where `Intl.Segmenter` is
 * unavailable, which is still closer than `.length`.
 */
export function graphemeLength(value: string): number {
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' })
    let count = 0
    for (const _ of segmenter.segment(value)) count += 1
    return count
  }
  return Array.from(value).length
}
