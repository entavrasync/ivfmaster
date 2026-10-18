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
        'In the order they appear. Between four and seven — below four the header looks unfinished, above seven the links start colliding with the CTA on a laptop before the mobile drawer takes over.',
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
        'The accessible name of the menu button, read aloud by screen readers — e.g. "Menu". It is not shown on screen.',
      translation: 'all',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Navigation' }
    },
  },
})
