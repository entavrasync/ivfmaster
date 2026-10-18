import { defineField, defineType } from 'sanity'

import { localized } from '../shared/fields'

/**
 * The /team page — its own copy, the care team, and the facility gallery.
 *
 * The doctors are not listed here. They are documents, rendered in their `order`
 * field's sequence, for the same reason the procedures listing holds no curated
 * array: one list, one place to edit it.
 *
 * The care team and the facility photographs *are* here, because each appears in
 * exactly one grid on exactly one page and nothing references them. See
 * DOCTOR_CONTENT_MAPPING.md §5.
 *
 * What stays in messages/*.json: the portrait placeholder caption, the carousel
 * controls and their aria-labels, the "Back to the team" link, the credentials
 * heading, and the two per-doctor button templates. All of them are chrome that
 * repeats identically for every person on the page.
 */
export const teamPage = defineType({
  name: 'teamPage',
  title: 'Team page',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Introduction', default: true },
    { name: 'doctors', title: 'Doctors section' },
    { name: 'careTeam', title: 'Care team' },
    { name: 'facility', title: 'The clinic' },
    { name: 'closing', title: 'Closing' },
    { name: 'seo', title: 'SEO' },
  ],

  fields: [
    // ── Introduction ───────────────────────────────────────────────────────
    defineField({
      name: 'hero',
      title: 'Introduction',
      type: 'object',
      group: 'hero',
      options: { collapsible: true, collapsed: false },
      fields: [
        localized('eyebrow', { title: 'Eyebrow', translation: 'all' }),
        localized('headline', {
          title: 'Headline',
          description: 'The page\'s only <h1>.',
          translation: 'all',
        }),
        localized('lead', { title: 'Lead paragraph', type: 'localizedText', translation: 'all' }),
      ],
      validation: (rule) => rule.required(),
    }),

    // ── Doctors section ────────────────────────────────────────────────────
    defineField({
      name: 'doctorsSection',
      title: 'Doctors section',
      type: 'object',
      group: 'doctors',
      description:
        'The words around the two doctor cards. The doctors themselves are edited as their own documents, and appear here in their display order.',
      options: { collapsible: true, collapsed: true },
      fields: [
        localized('eyebrow', { title: 'Eyebrow', translation: 'all' }),
        localized('heading', { title: 'Heading', translation: 'all' }),
        localized('lead', { title: 'Lead paragraph', type: 'localizedText', translation: 'all' }),
        localized('coupleNote', {
          title: 'Closing note',
          type: 'localizedText',
          description:
            'The line beneath the two cards — "Married for over twenty years…". The Home page has the same note, edited there.',
          translation: 'any',
        }),
      ],
      validation: (rule) => rule.required(),
    }),

    // ── Care team ──────────────────────────────────────────────────────────
    defineField({
      name: 'careTeamSection',
      title: 'Care team',
      type: 'object',
      group: 'careTeam',
      options: { collapsible: true, collapsed: true },
      fields: [
        localized('eyebrow', { title: 'Eyebrow', translation: 'all' }),
        localized('heading', { title: 'Heading', translation: 'all' }),
        localized('lead', { title: 'Lead paragraph', type: 'localizedText', translation: 'all' }),
        defineField({
          name: 'members',
          title: 'Members',
          type: 'array',
          of: [{ type: 'careTeamMember' }],
          description:
            'The existing confirmed embryologist card. Adding people requires a separately reviewed roster change.',
          validation: (rule) => rule.length(1),
        }),
      ],
      validation: (rule) => rule.required(),
    }),

    // ── The clinic ─────────────────────────────────────────────────────────
    defineField({
      name: 'facilitySection',
      title: 'The clinic',
      type: 'object',
      group: 'facility',
      options: { collapsible: true, collapsed: true },
      fields: [
        localized('eyebrow', { title: 'Eyebrow', translation: 'all' }),
        localized('heading', { title: 'Heading', translation: 'all' }),
        localized('lead', { title: 'Lead paragraph', type: 'localizedText', translation: 'all' }),
        defineField({
          name: 'areas',
          title: 'Areas',
          type: 'array',
          of: [{ type: 'facilityTile' }],
          description:
            'Four today, in a two-by-two grid: reception, consultation room, embryology laboratory and waiting area. These are environment photographs, never clinical procedure imagery.',
          validation: (rule) => rule.required().length(4),
        }),
      ],
      validation: (rule) => rule.required(),
    }),

    // ── Closing ────────────────────────────────────────────────────────────
    defineField({
      name: 'closing',
      title: 'Closing',
      type: 'ctaBlock',
      group: 'closing',
      validation: (rule) => rule.required(),
    }),

    // ── SEO ────────────────────────────────────────────────────────────────
    defineField({
      name: 'seo',
      title: 'Search engine listing',
      type: 'seo',
      group: 'seo',
    }),
  ],

  preview: {
    prepare() {
      return { title: 'Team page' }
    },
  },
})
