import { defineField, defineType, type Rule } from 'sanity'

import { DEFAULT_LOCALE } from '../../lib/locales'
import { requireAllLocales } from '../../lib/localizedValidation'
import { localized } from '../shared/fields'

const hasText = (value: unknown) => typeof value === 'string' && value.trim().length > 0

/**
 * Sanity materializes the `emphasis` and link `kind` defaults into every optional
 * action slot when a document is created, so an untouched slot is an object, not
 * undefined. A slot with no button text and no destination is unused; requiring
 * its fields would disable Publish for slots the page never renders.
 */
export function isUnusedAction(value: unknown): boolean {
  if (!value || typeof value !== 'object') return true
  const { label, link } = value as { label?: Record<string, unknown>; link?: Record<string, unknown> }
  const labelled = !!label && Object.entries(label).some(([key, text]) => !key.startsWith('_') && hasText(text))
  const destination = !!link && [link.internalPath, link.externalUrl, link.anchor].some(hasText)
  return !labelled && !destination
}

/**
 * A call to action: the label a visitor reads, plus where it goes.
 *
 * `emphasis` is structural, not cosmetic — the design already distinguishes a
 * primary action from a secondary one throughout the site, and which action is
 * primary is an editorial decision. It is an enum rather than a free field
 * precisely so it cannot become a styling escape hatch: colours, sizes and
 * hover states stay in the components.
 *
 * The label uses the 'all' translation policy. A button whose text falls back
 * to the other language is a visible defect, not a graceful degradation.
 */
export const cta = defineType({
  name: 'cta',
  title: 'Call to action',
  type: 'object',
  fields: [
    localized('label', {
      title: 'Button text',
      translation: 'optional',
      validation: (rule: Rule) => rule.custom((value, context) => isUnusedAction(context.parent) || requireAllLocales(value)),
    }),
    defineField({
      name: 'link',
      title: 'Destination',
      type: 'link',
      validation: (rule) => rule.custom((value, context) => isUnusedAction(context.parent) || value ? true : 'Choose where this button should go.'),
    }),
    defineField({
      name: 'emphasis',
      readOnly: true,
      title: 'Emphasis',
      type: 'string',
      description:
        'Primary is the main action in a section; secondary is the quieter alternative beside it.',
      options: {
        list: [
          { title: 'Primary', value: 'primary' },
          { title: 'Secondary', value: 'secondary' },
        ],
        layout: 'radio',
      },
      initialValue: 'primary',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { label: `label.${DEFAULT_LOCALE}`, fallback: 'label.en', emphasis: 'emphasis' },
    prepare({ label, fallback, emphasis }) {
      return {
        title: label || fallback || 'Untitled action',
        subtitle: emphasis === 'secondary' ? 'Secondary' : 'Primary',
      }
    },
  },
})
