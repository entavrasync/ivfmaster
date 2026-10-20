import { defineField, defineType } from 'sanity'

import { localized } from '../shared/fields'

/**
 * The clinic's single source of truth.
 *
 * Today the phone number lives in `config/site.ts`, `lib/clinicHours.ts`,
 * `components/shared/Footer.tsx`, `components/sections/FinalCTA.tsx` (twice —
 * once in `WA_URL`, once in a `tel:` href) and `ContactPage.tsx`. Opening hours
 * live in three places and **already disagree**: `lib/clinicHours.ts` says
 * 10:00–18:00 while `lib/seo/jsonLd.ts` tells Google 10:00–20:00. That is the
 * failure mode this document exists to end.
 *
 * Rule of thumb for what belongs here: if it is a fact about the business
 * rather than words on one page, it belongs here and nowhere else.
 *
 * Almost nothing here is localized, by design — see `objects/business.ts`.
 */
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  groups: [
    { name: 'identity', title: 'Identity', default: true },
    { name: 'contact', title: 'Contact' },
    { name: 'hours', title: 'Opening hours' },
    { name: 'stats', title: 'Headline numbers' },
    { name: 'seo', title: 'SEO defaults' },
  ],

  fields: [
    // ---- Identity ---------------------------------------------------------
    defineField({
      name: 'name',
      title: 'Clinic name',
      type: 'string',
      group: 'identity',
      description:
        'The short name used in headings, the browser tab and structured data — e.g. IVF Master. Not translated: a clinic\'s name is its name in every language.',
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: 'legalName',
      title: 'Full legal name',
      type: 'string',
      group: 'identity',
      description: 'The registered name, used in JSON-LD and the footer copyright line.',
      validation: (rule) => rule.required().max(120),
    }),
    // There is deliberately no tagline field here. The only tagline on the site
    // is the footer's, and it is rendered in exactly one place — so it lives on
    // the `footer` document rather than becoming a second global string that
    // nothing else reads.
    localized('description', {
      title: 'What the clinic does',
      type: 'localizedText',
      group: 'identity',
      description:
        'One or two sentences describing the clinic. Used as the site-wide search description (including the home page) unless the SEO defaults below or a page set their own.',
      translation: 'all',
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'postalAddress',
      group: 'identity',
      validation: (rule) => rule.required(),
    }),
    localized('displayAddress', {
      title: 'Address as written for readers',
      type: 'localizedText',
      group: 'identity',
      description:
        'The same address as above, written out the way it should appear on the page in each language. It exists because the Marathi site writes the address in Devanagari and no formatter can transliterate a street name correctly. The structured fields above stay the single machine-readable source — JSON-LD, maps and directions all read those, never this.',
      translation: 'all',
    }),
    defineField({
      name: 'geo',
      title: 'Map location',
      type: 'geoLocation',
      group: 'identity',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'social',
      title: 'Social profiles',
      type: 'array',
      group: 'identity',
      of: [{ type: 'socialLink' }],
      description: 'Also emitted as JSON-LD sameAs, which is how Google links the site to these profiles.',
      validation: (rule) =>
        rule.unique().custom((value) => {
          const platforms = (value as { platform?: string }[] | undefined)?.map((entry) => entry.platform)
          if (!platforms) return true
          return new Set(platforms).size === platforms.length
            ? true
            : 'Each platform can only be listed once.'
        }),
    }),

    // ---- Contact ----------------------------------------------------------
    defineField({
      name: 'contact',
      title: 'Contact channels',
      type: 'contactChannels',
      group: 'contact',
      validation: (rule) => rule.required(),
    }),

    // ---- Hours ------------------------------------------------------------
    defineField({
      name: 'hours',
      title: 'Weekly opening hours',
      type: 'array',
      group: 'hours',
      of: [{ type: 'dayHours' }],
      description:
        'All seven days, in order, so the footer and the live open/closed indicator never have to guess about a missing day.',
      validation: (rule) =>
        rule
          .required()
          .length(7)
          .custom((value) => {
            const days = (value as { day?: string }[] | undefined)?.map((entry) => entry.day)
            if (!days) return true
            const missing = days.some((day) => !day)
            if (missing) return 'Every row needs a day selected.'
            return new Set(days).size === days.length
              ? true
              : 'Each day can only appear once.'
          }),
    }),
    localized('hoursSummary', {
      title: 'Opening hours in one line',
      group: 'hours',
      description:
        'The short human phrasing shown next to the clock icon — for example "Mon–Sat, 10 AM – 6 PM". Keep it in step with the rows above. It is written by hand rather than generated because the Marathi site says the hours idiomatically ("सकाळी", "संध्याकाळी"), which no date formatter produces. The rows above remain the source of truth for the live open/closed indicator.',
      translation: 'all',
    }),
    defineField({
      name: 'timezone',
      title: 'Timezone',
      type: 'string',
      group: 'hours',
      description:
        'IANA timezone name. The open/closed indicator compares the visitor\'s clock against clinic time, so this must be the clinic\'s zone, not the visitor\'s.',
      initialValue: 'Asia/Kolkata',
      validation: (rule) =>
        rule.required().regex(/^[A-Za-z]+\/[A-Za-z_+-]+$/, { name: 'IANA timezone, e.g. Asia/Kolkata' }),
    }),
    defineField({
      name: 'holidays',
      title: 'Closures',
      type: 'array',
      group: 'hours',
      of: [{ type: 'clinicHoliday' }],
      description:
        'Dates the clinic is closed despite its usual hours. Leaving this empty means the clinic keeps its normal hours all year.',
    }),

    // ---- Headline numbers -------------------------------------------------
    defineField({
      name: 'stats',
      title: 'Headline numbers',
      type: 'array',
      group: 'stats',
      of: [{ type: 'statistic' }],
      description:
        'The four numbers below the Home banner. Use “Fill empty fields from website” in the document actions to restore the previous four entries, review them with the clinic, then approve and publish Site settings. Keep exactly four for the existing mobile and desktop grid.',
      validation: (rule) => rule.required().length(4),
    }),

    // ---- SEO defaults -----------------------------------------------------
    defineField({
      name: 'defaultSeo',
      title: 'Site-wide SEO defaults',
      type: 'seo',
      group: 'seo',
      description:
        'Used where a page has not set its own. The social sharing image here is the fallback for every page on the site.',
    }),
    defineField({
      name: 'siteUrl',
      title: 'Production URL',
      type: 'url',
      group: 'seo',
      description:
        'The origin, with no trailing slash — e.g. https://ivfmaster.in. Canonical URLs, hreflang alternates and the sitemap are all built from this.',
      validation: (rule) =>
        rule
          .required()
          .uri({ scheme: ['https'] })
          .custom((value) =>
            typeof value === 'string' && value.endsWith('/')
              ? 'Leave off the trailing slash.'
              : true,
          ),
    }),
  ],

  preview: {
    select: { title: 'name', subtitle: 'legalName' },
  },
})
