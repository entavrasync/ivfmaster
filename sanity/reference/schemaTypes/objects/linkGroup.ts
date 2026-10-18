import { defineField, defineType } from 'sanity'

import { DEFAULT_LOCALE } from '../../lib/locales'
import { localized } from '../shared/fields'

/**
 * A titled column of links — one footer column.
 *
 * The number of columns is genuinely flexible here: the footer grid is
 * `repeat(auto-fit, minmax(200px, 1fr))`, so adding or removing a column
 * reflows rather than breaking. That is why the consuming array is bounded for
 * editorial reasons rather than pinned to an exact length.
 */
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
      validation: (rule) => rule.required().min(1).max(8),
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
