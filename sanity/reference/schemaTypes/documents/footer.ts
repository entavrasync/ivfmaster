import { defineField, defineType } from 'sanity'

import { localized } from '../shared/fields'

/** Footer copy and links; clinic facts retain their dedicated source documents. */
export const footer = defineType({
  name: 'footer',
  title: 'Footer',
  type: 'document',
  description: 'Edit the footer text and links here. Contact details are in Shared clinic settings; opening times are in Clinic hours & availability. Approve and publish to update the website.',
  fields: [
    localized('tagline', {
      title: 'Tagline',
      type: 'localizedText',
      description: 'The sentence beneath the logo.',
      translation: 'all',
    }),
    localized('byline', {
      title: 'Byline',
      description: 'The small line beside the logo. Enter it in English and Marathi.',
      translation: 'all',
    }),
    defineField({
      name: 'linkGroups',
      title: 'Link columns',
      type: 'array',
      of: [{ type: 'linkGroup' }],
      description:
        'Keep exactly two link columns. Each needs a heading and 1–8 links. Drag to change their order.',
      validation: (rule) => rule.custom(value => Array.isArray(value) && value.length === 2 || 'Add exactly two link columns for the footer layout.'),
    }),
    localized('contactHeading', {
      title: 'Contact column heading',
      description:
        'Heading above the contact details. Edit the details in Shared clinic settings and the hours in Clinic hours & availability.',
      translation: 'all',
    }),
    localized('languageHeading', {
      title: 'Language column heading',
      description: 'The heading above the language switcher.',
      translation: 'all',
    }),
    localized('copyright', {
      title: 'Copyright line',
      description:
        'Use {year} where the current year should appear — it is substituted at render time so this never needs editing in January.',
      translation: 'all',
      warn: (value) => {
        const entries = Object.values((value ?? {}) as Record<string, unknown>).filter(
          (entry): entry is string => typeof entry === 'string',
        )
        const hardcodedYear = entries.some((entry) => /\b20\d{2}\b/.test(entry))
        return hardcodedYear
          ? 'This contains a fixed year. Write {year} instead so it stays current.'
          : true
      },
    }),
    defineField({
      name: 'legalLinks',
      title: 'Legal links',
      type: 'array',
      of: [{ type: 'navItem' }],
      description: 'Optional: up to four links beside the copyright. Use an existing page or a full external policy URL. Leave empty to hide this row.',
      validation: (rule) => rule.max(4).error('Keep no more than four legal links. Remove the extra links.'),
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Footer' }
    },
  },
})
