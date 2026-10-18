import { defineType, type FieldDefinition } from 'sanity'

import {
  DEFAULT_LOCALE,
  LOCALE_LABELS,
  SUPPORTED_LOCALES,
  type SupportedLocale,
} from '../../lib/locales'
import { isBlankValue, resolveLocalized } from '../../lib/localizedValue'

/**
 * Builds a field-level localized object type: one sub-field per supported
 * locale, sharing a single `_id` with the document that owns it.
 *
 * Field-level rather than document-level localization is a deliberate choice
 * (SANITY_MIGRATION_PLAN.md section 6.2). With two locales it guarantees the two
 * languages stay structurally identical — which is precisely the failure the
 * current `messages/mr.json` already exhibits — and keeps one slug, one
 * reference target and one sitemap entry per real-world entity.
 *
 * Adding a third locale is a one-line change to `SUPPORTED_LOCALES`; every
 * primitive built through this factory picks it up automatically.
 */
export function createLocalizedType({
  name,
  title,
  description,
  buildField,
}: {
  name: string
  title: string
  description: string
  buildField: (locale: SupportedLocale) => FieldDefinition
}) {
  return defineType({
    name,
    title,
    description,
    type: 'object',
    options: { collapsible: true, collapsed: false },
    fields: SUPPORTED_LOCALES.map(buildField),
    preview: {
      select: Object.fromEntries(
        SUPPORTED_LOCALES.map((locale) => [locale, locale]),
      ) as Record<string, string>,
      prepare(selection: Record<string, unknown>) {
        const value = selection as Record<SupportedLocale, unknown>
        const resolved = resolveLocalized(value, DEFAULT_LOCALE)
        const untranslated = SUPPORTED_LOCALES.filter((locale) =>
          isBlankValue(value[locale]),
        )

        return {
          title: toPlainText(resolved) || 'Empty',
          subtitle:
            untranslated.length === 0
              ? undefined
              : `Missing: ${untranslated.map((l) => LOCALE_LABELS[l]).join(', ')}`,
        }
      },
    },
  })
}

/** Flattens a string or a Portable Text array into a one-line preview. */
function toPlainText(value: unknown): string {
  if (typeof value === 'string') return value
  if (!Array.isArray(value)) return ''
  return value
    .flatMap((block: unknown) => {
      if (block === null || typeof block !== 'object') return []
      const children = (block as { children?: unknown }).children
      if (!Array.isArray(children)) return []
      return children.map((child: unknown) =>
        typeof (child as { text?: unknown })?.text === 'string'
          ? ((child as { text: string }).text)
          : '',
      )
    })
    .join(' ')
    .trim()
}
