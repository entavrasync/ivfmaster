import { defineArrayMember, defineField } from 'sanity'

import { LOCALE_LABELS } from '../../lib/locales'
import { createLocalizedType } from './createLocalizedType'

/**
 * The rich-text block configuration.
 *
 * The style list is derived from `lib/richArticles.ts`, which is already a
 * hand-rolled Portable Text: its `RichBlock` kinds map almost one-to-one onto
 * these styles, so migrating articles in Phase 2 is a content conversion
 * rather than a design decision.
 *
 *   para      -> normal        sub    -> h3
 *   intro     -> lead          list   -> bullet list
 *   paraMuted -> muted         note   -> note
 *
 * Deliberately NOT offered:
 *   - h1            the page owns the single <h1>; an editor must not add one
 *   - h4..h6        unused by the current design
 *   - numbered list unused by the current design
 *   - code          not a medical-content need
 *   - blockquote    superseded by the `pullQuote` object, which is a designed
 *                   panel rather than an indented paragraph
 *
 * The custom inline objects the plan calls for — `pullQuote`, `definitionList`,
 * `highlightPanel` and `figure` — are intentionally absent in this phase. Their
 * shape depends on the article renderer work in Phase 2, and adding them now
 * would mean guessing. They slot in here without touching anything else.
 */
const blockMember = defineArrayMember({
  type: 'block',
  styles: [
    { title: 'Paragraph', value: 'normal' },
    { title: 'Heading', value: 'h2' },
    { title: 'Sub-heading', value: 'h3' },
    { title: 'Lead paragraph', value: 'lead' },
    { title: 'Muted paragraph', value: 'muted' },
    { title: 'Note', value: 'note' },
  ],
  lists: [{ title: 'Bullet', value: 'bullet' }],
  marks: {
    decorators: [
      { title: 'Bold', value: 'strong' },
      { title: 'Italic', value: 'em' },
    ],
    annotations: [
      defineArrayMember({
        name: 'link',
        title: 'Link',
        type: 'object',
        fields: [
          defineField({
            name: 'href',
            title: 'URL',
            type: 'url',
            description:
              'An external address, or an internal path beginning with "/". Do not include a language prefix — the locale is added automatically.',
            validation: (rule) =>
              rule
                .required()
                .uri({
                  allowRelative: true,
                  scheme: ['http', 'https', 'mailto', 'tel'],
                }),
          }),
        ],
      }),
    ],
  },
})

/**
 * A localized rich-text value: article bodies, long-form narrative, anything
 * needing structure rather than a single paragraph.
 */
export const localizedPortableText = createLocalizedType({
  name: 'localizedPortableText',
  title: 'Localized rich text',
  description: 'Formatted content, entered once per language.',
  buildField: (locale) =>
    defineField({
      name: locale,
      title: LOCALE_LABELS[locale],
      type: 'array',
      of: [blockMember],
    }),
})
