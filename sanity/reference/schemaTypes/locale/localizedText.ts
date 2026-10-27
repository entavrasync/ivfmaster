import { defineField } from 'sanity'

import { LOCALE_LABELS } from '../../lib/locales'
import { createLocalizedType } from './createLocalizedType'
import { validatePlainCopy } from '../../../lib/copy-validation'

/**
 * A multi-line localized value with no formatting: intros, excerpts, meta
 * descriptions, short body paragraphs.
 *
 * Use `localizedPortableText` instead when the content needs headings, lists,
 * links or emphasis.
 */
export const localizedText = createLocalizedType({
  name: 'localizedText',
  title: 'Localized text (multi-line)',
  description: 'Plain paragraph text, entered once per language.',
  buildField: (locale) =>
    defineField({
      name: locale,
      title: LOCALE_LABELS[locale],
      type: 'text',
      validation: rule => rule.custom(validatePlainCopy),
      rows: 4,
    }),
})
