import {
  defineField,
  type FieldDefinition,
  type ImageRule,
  type Rule,
} from 'sanity'

import { SUPPORTED_LOCALES } from '../../lib/locales'
import {
  requireAllLocales,
  requireAnyLocale,
} from '../../lib/localizedValidation'

/**
 * Field factories that encode the project's schema conventions.
 *
 * These are helpers, not registered schema types — they exist so that every
 * document written in Phase 2 makes the same decisions the same way, and so
 * that changing a convention is one edit rather than a search-and-replace.
 */

export type LocalizedFieldType =
  | 'localizedString'
  | 'localizedText'
  | 'localizedPortableText'

/**
 * How strictly a localized field is validated.
 *
 *   'all'      both languages required. Use where a visitor in either language
 *              sees this exact field: headings, CTA labels, image alt text.
 *   'any'      at least one language required, the other may follow. Use for
 *              long-form copy that is genuinely translated over time; GROQ's
 *              coalesce() guarantees the page still renders.
 *   'optional' no requirement at all. Use only for genuinely optional content.
 */
export type TranslationPolicy = 'all' | 'any' | 'optional'

/**
 * Declares a localized field with the right validation attached.
 *
 *   localized('headline', { title: 'Headline', translation: 'all' })
 *   localized('body', { title: 'Body', type: 'localizedPortableText', translation: 'any' })
 *
 * `warn` adds a second, non-blocking rule alongside the translation policy —
 * Sanity accepts an array of rules, so guidance (length, tone) never silently
 * replaces the requirement that the field actually has content.
 */
export function localized(
  name: string,
  {
    title,
    description,
    type = 'localizedString',
    translation = 'any',
    warn,
    ...rest
  }: {
    title: string
    description?: string
    type?: LocalizedFieldType
    translation?: TranslationPolicy
    warn?: (value: unknown) => true | string
  } & Record<string, unknown>,
): FieldDefinition {
  const policy =
    translation === 'all'
      ? requireAllLocales
      : translation === 'any'
        ? requireAnyLocale
        : undefined

  return defineField({
    name,
    title,
    description,
    type,
    ...(policy || warn
      ? {
          validation: (rule: Rule) => {
            const rules = []
            if (policy) rules.push(rule.custom(policy))
            if (warn) rules.push(rule.custom(warn).warning())
            return rules
          },
        }
      : {}),
    ...rest,
  }) as FieldDefinition
}

/**
 * Manual ordering. Preferred over sorting by title, which would produce a
 * different order in each language.
 */
export function defineOrderField(
  rest: Record<string, unknown> = {},
): FieldDefinition {
  return defineField({
    name: 'order',
    title: 'Display order',
    type: 'number',
    description: 'Lower numbers appear first. Not translated.',
    validation: (rule) => rule.required().integer().min(0),
    ...rest,
  }) as FieldDefinition
}

/**
 * Explicit publish/unpublish, separate from Sanity's draft state.
 *
 * This replaces the current practice of commenting out entries in TypeScript
 * (see the placeholder nurse in `lib/team.ts`) — a team member can be prepared
 * in full and revealed later without a code change.
 */
export function defineVisibilityField(
  rest: Record<string, unknown> = {},
): FieldDefinition {
  return defineField({
    name: 'isPublished',
    title: 'Show on the website',
    type: 'boolean',
    description:
      'Turn off to keep this document in the Studio without showing it to visitors.',
    initialValue: true,
    ...rest,
  }) as FieldDefinition
}

/**
 * An image with a hotspot and mandatory localized alt text.
 *
 * Alt text uses the 'all' policy because a screen-reader user in either
 * language must get a description — an untranslated alt is a genuine
 * accessibility failure, not a cosmetic gap.
 *
 * The hotspot replaces the hand-written CSS `object-position` values currently
 * carried in `lib/team.ts`: it expresses the same intent, per image, in a tool
 * the editor can actually see.
 */
export function defineImageField(
  {
    name = 'image',
    title = 'Image',
    description,
    required = false,
    ...rest
  }: {
    name?: string
    title?: string
    description?: string
    required?: boolean
  } & Record<string, unknown> = {},
): FieldDefinition {
  return defineField({
    name,
    title,
    description: `${description ?? 'Use an approved photograph or artwork matching this section.'} Keep the high-resolution original. Portraits should leave space around the head and shoulders (4:5 crop, recommended 1200×1500 or larger); gallery photographs should allow a landscape crop (3:2, recommended 1800×1200 or larger); artwork pairs need landscape desktop and portrait mobile compositions. These are recommendations, not upload limits. Use crop/hotspot to preserve the subject; leave unset to keep the website asset.`,
    type: 'image',
    options: { hotspot: true },
    fields: [
      localized('alt', {
        title: 'Alternative text',
        description:
          'Describes the image for screen readers and for visitors when the image fails to load. Required in every language.',
        translation: 'all',
      }),
      localized('caption', {
        title: 'Caption',
        readOnly: true,
        description: 'Compatibility field. Captions are controlled by the containing gallery area in the target layout.',
        translation: 'optional',
      }),
    ],
    validation: (rule: ImageRule) => required ? rule.required().assetRequired() : rule.assetRequired(),
    ...rest,
  }) as FieldDefinition
}

/** Every locale, for schema code that needs to enumerate them. */
export { SUPPORTED_LOCALES }
