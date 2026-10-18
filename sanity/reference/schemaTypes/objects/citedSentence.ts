import { defineField, defineType } from 'sanity'

import { localized } from '../shared/fields'

/**
 * A single sentence with one link somewhere inside it.
 *
 * ## Why this exists rather than a plain `cta`
 *
 * The credential line under the trust cards reads as one sentence with the
 * source's domain linked in the middle of it. Where "the middle" is depends on
 * the language: in English the link lands at the very end, in Marathi the
 * sentence continues after it. A `cta` on its own can only ever append a link
 * *after* the prose, which would reorder the Marathi sentence.
 *
 * Splitting it into before / link / after keeps the reading order correct in
 * both languages while still storing the destination once, as structured data,
 * rather than asking editors to write markup.
 *
 * Both prose halves are optional and translated independently — a language may
 * legitimately have nothing on one side, which is exactly the English case.
 */
export const citedSentence = defineType({
  name: 'citedSentence',
  title: 'Sentence with a link',
  type: 'object',
  fields: [
    localized('textBefore', {
      title: 'Text before the link',
      translation: 'optional',
      description: 'Leave empty if the sentence opens with the link itself.',
    }),
    defineField({
      name: 'link',
      title: 'Link',
      type: 'cta',
      description: 'The label is the text that appears underlined in the sentence.',
      validation: (rule) => rule.required(),
    }),
    localized('textAfter', {
      title: 'Text after the link',
      translation: 'optional',
      description:
        'Leave empty if the sentence ends at the link. Marathi word order often needs this even when English does not.',
    }),
  ],
  preview: {
    select: { before: 'textBefore.mr', label: 'link.label.mr' },
    prepare: ({ before, label }) => ({
      title: [before, label].filter(Boolean).join(' ') || 'Sentence with a link',
    }),
  },
})
