import { defineField, defineType } from 'sanity'

import { localized } from '../shared/fields'

/**
 * The /procedures listing page — its own copy, not the procedures themselves.
 *
 * The listing renders every published procedure in order, so there is no
 * curated array here: a document that named which procedures to show would be a
 * second list to keep in sync with the first, which is the duplication this
 * phase exists to remove.
 *
 * What stays in messages/*.json rather than moving here: the detail-page
 * furniture (`detailBack`, `detailProcessHeading`, `detailFaqHeading` and the
 * rest). Those strings repeat identically across all four procedure pages and
 * two of them are templates the application fills in — "Questions couples ask
 * about {name}." Asking an editor to maintain a placeholder inside a sentence
 * that appears on every procedure is worse than leaving it in the message file.
 * PROCEDURE_CONTENT_MAPPING.md §7 lists the split key by key.
 */
export const proceduresPage = defineType({
  name: 'proceduresPage',
  title: 'Procedures page',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Introduction', default: true },
    { name: 'closing', title: 'Closing' },
    { name: 'seo', title: 'SEO' },
  ],

  fields: [
    defineField({
      name: 'hero',
      title: 'Introduction',
      type: 'object',
      group: 'hero',
      options: { collapsible: true, collapsed: false },
      fields: [
        localized('eyebrow', { title: 'Eyebrow', translation: 'all' }),
        localized('heading', {
          title: 'Heading',
          description: 'The page\'s only <h1>.',
          translation: 'all',
        }),
        localized('body', { title: 'Body', type: 'localizedText', translation: 'all' }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'closing',
      title: 'Closing',
      type: 'ctaBlock',
      group: 'closing',
      description: 'The invitation beneath the list of procedures.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'seo',
      title: 'Search engine listing',
      type: 'seo',
      group: 'seo',
    }),
  ],

  preview: {
    prepare() {
      return { title: 'Procedures page' }
    },
  },
})
