import { defineField, defineType } from 'sanity'

import { DEFAULT_LOCALE } from '../../lib/locales'
import { localized } from '../shared/fields'

/** One of the footer's two navigation columns. */
export const linkGroup = defineType({
  name: 'linkGroup',
  title: 'Link column',
  type: 'object',
  fields: [
    localized('heading', {
      title: 'Column heading',
      translation: 'all',
      description: 'Visible on every page in both languages, so both are required.',
    }),
    defineField({
      name: 'items',
      title: 'Links',
      type: 'array',
      of: [{ type: 'navItem' }],
      description: 'Add 1–8 links. Enter each name in English and Marathi, then choose its destination.',
      validation: (rule) => rule.custom(value => Array.isArray(value) && value.length >= 1 && value.length <= 8 || 'Add between one and eight links to this column.'),
    }),
  ],
  preview: {
    select: {
      heading: `heading.${DEFAULT_LOCALE}`,
      fallback: 'heading.en',
      items: 'items',
    },
    prepare({ heading, fallback, items }) {
      const count = Array.isArray(items) ? items.length : 0
      return {
        title: heading || fallback || 'Link column',
        subtitle: `${count} link${count === 1 ? '' : 's'}`,
      }
    },
  },
})
