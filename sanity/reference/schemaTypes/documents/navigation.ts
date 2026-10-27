import { defineField, defineType } from 'sanity'

import { localized } from '../shared/fields'

/** Header links and CTA presentation, consumed by Navbar and MobileNav. Logo, locale switching, responsive interactions and operational contact destinations remain controlled by the target components. */
export const navigation = defineType({
  name: 'navigation',
  title: 'Navigation',
  type: 'document',
  fields: [
    defineField({
      name: 'items',
      title: 'Header links',
      type: 'array',
      of: [{ type: 'navItem' }],
      description:
        'Add a link and enter its name in both languages. Drag to reorder. Keep 4-7 links, then approve and publish. Published procedures appear under the /procedures link automatically.',
      validation: (rule) => rule.required().min(4).max(7),
    }),
    defineField({
      name: 'primaryCta',
      title: 'Header button',
      type: 'cta',
      description: 'The one action in the header — currently "Talk to our experts".',
      validation: (rule) => rule.required(),
    }),
    localized('mobileMenuLabel', {
      title: 'Mobile menu label',
      description:
        'Name read aloud by screen readers, for example "Menu".',
      translation: 'all',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Navigation' }
    },
  },
})
