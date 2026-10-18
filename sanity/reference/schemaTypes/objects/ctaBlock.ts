import { defineField, defineType } from 'sanity'

import { DEFAULT_LOCALE } from '../../lib/locales'
import { localized } from '../shared/fields'

/**
 * The closing beat of a section: a short lead-in, then one or two actions.
 *
 * This exact shape repeats five times on the Home page alone (pain-recognition
 * close, why-trust close, cost-of-waiting close, understanding-IVF close, final
 * CTA). Modelling it once means an editor learns it once, and a change to how
 * CTAs validate applies everywhere at the same time.
 *
 * Every field is optional at this level because the slots differ: some blocks
 * are a single button with one line above it, others are a full heading plus
 * two actions. The consuming document marks the block itself required where the
 * page cannot render without it.
 *
 * `translation: 'optional'` is therefore stated explicitly on each localized
 * field. Omitting it would fall back to the `'any'` default, which requires
 * content in at least one language and would turn an unused slot into an
 * error-severity marker that disables Publish for the whole document.
 */
export const ctaBlock = defineType({
  name: 'ctaBlock',
  title: 'Call-to-action block',
  type: 'object',
  fields: [
    localized('eyebrow', {
      title: 'Eyebrow',
      description: 'The small uppercase line above the heading. Optional.',
      translation: 'optional',
    }),
    localized('heading', {
      title: 'Heading',
      translation: 'optional',
    }),
    localized('body', {
      title: 'Body',
      type: 'localizedText',
      translation: 'optional',
    }),
    defineField({
      name: 'primary',
      title: 'Primary action',
      type: 'cta',
    }),
    defineField({
      name: 'secondary',
      title: 'Secondary action',
      type: 'cta',
      description: 'The quieter alternative beside the primary action. Optional.',
    }),
    localized('microCopy', {
      title: 'Reassurance line',
      type: 'localizedText',
      description:
        'The small line beneath the buttons — e.g. "No pressure. Just answers." Optional.',
      translation: 'optional',
    }),
  ],
  preview: {
    select: {
      heading: `heading.${DEFAULT_LOCALE}`,
      fallback: 'heading.en',
      label: `primary.label.${DEFAULT_LOCALE}`,
    },
    prepare({ heading, fallback, label }) {
      return { title: heading || fallback || label || 'Call-to-action block' }
    },
  },
})
