import { defineField } from 'sanity'

import { LOCALE_LABELS } from '../../lib/locales'
import { createLocalizedType } from './createLocalizedType'

/**
 * A single-line localized value: headings, labels, button text, image alt text.
 *
 * Requiredness is NOT declared here. A primitive cannot know whether a given
 * usage needs both languages or tolerates a missing translation, so that
 * decision belongs to the field that uses it — see `localized()` in
 * `sanity/schemaTypes/shared/fields.ts`.
 */
export const localizedString = createLocalizedType({
  name: 'localizedString',
  title: 'Localized text (single line)',
  description: 'Short text, entered once per language.',
  buildField: (locale) =>
    defineField({
      name: locale,
      title: LOCALE_LABELS[locale],
      type: 'string',
    }),
})
