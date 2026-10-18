import { defineField, defineType } from 'sanity'

import { localized } from '../shared/fields'

/**
 * The footer's own words. Its *facts* come from `siteSettings`.
 *
 * This split is the whole point of Phase 2A. The footer currently hardcodes the
 * address, the hours ("Mon–Sat, 10 AM – 6 PM"), the phone number and the email
 * as translated message strings — four business facts living in a translation
 * file, in two languages, drifting away from the three other copies elsewhere
 * in the codebase.
 *
 * So there is no address field here, and no phone field. The footer renders
 * `siteSettings.address`, `siteSettings.hours` and `siteSettings.contact`, and
 * this document supplies only the labels around them.
 *
 * Also staying in code: the language switcher (generated from the routing
 * config) and the social icon row (icons are components; the URLs come from
 * `siteSettings.social`).
 */
export const footer = defineType({
  name: 'footer',
  title: 'Footer',
  type: 'document',
  fields: [
    localized('tagline', {
      title: 'Tagline',
      type: 'localizedText',
      description: 'The sentence beneath the logo.',
      translation: 'all',
    }),
    localized('byline', {
      title: 'Byline',
      description: 'The small line beside the logo — currently "by Mandrupkar Clinic".',
      translation: 'all',
    }),
    defineField({
      name: 'linkGroups',
      title: 'Link columns',
      type: 'array',
      of: [{ type: 'linkGroup' }],
      description:
        'The navigation columns. Two to four: the grid is auto-fitting, so the count is safe to change, but past four the columns fall below their 200px minimum and wrap awkwardly on a laptop.',
      validation: (rule) => rule.required().length(2),
    }),
    localized('contactHeading', {
      title: 'Contact column heading',
      description:
        'The heading above the address, hours, phone and email. Those values themselves come from Site settings — they are not editable here, so that they can never disagree with the rest of the site.',
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
      readOnly: true,
      title: 'Legal links',
      type: 'array',
      of: [{ type: 'navItem' }],
      description: 'The small print row — privacy policy, terms, and anything similar.',
      validation: (rule) => rule.max(4),
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Footer' }
    },
  },
})
