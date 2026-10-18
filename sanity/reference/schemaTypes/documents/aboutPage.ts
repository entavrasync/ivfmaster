import { defineField, defineType } from 'sanity'

import { localized } from '../shared/fields'

/**
 * The About page.
 *
 * A singleton, enforced from `shared/singletons.ts`, holding the seven sections
 * `/about` has shipped since before the migration — in the order the page draws
 * them. It is not a page builder: there is no block array and no section
 * picker, because each section has a component that assumes its exact shape and
 * a palette hand-matched to the section above it.
 *
 * Three things this document deliberately does not hold, each argued in
 * ABOUT_CONTENT_MAPPING.md:
 *
 *   §2  Doctor identity. `doctors[].doctor` is a reference; the name, role and
 *       photograph live on the doctor's own document and are not copied here.
 *   §3  Images. The two artwork pairs are art-directed static imports served
 *       with build-time dimensions and a blur placeholder, one of them the LCP
 *       element of the page. They stay in code, exactly as the Home artwork
 *       does, and moving them would be a performance change wearing a content
 *       migration's clothes.
 *   §1  Button destinations. Only the labels are editorial; `/contact`,
 *       `#our-story` and `/educate-ivf` are the page's structure and stay in
 *       the components.
 *
 * Marathi is CONTENT-MISSING throughout — it has never existed for this page —
 * so every editorial field takes the `'any'` translation policy, which is also
 * what the shared `seo` object uses. The one bilingual pair the page already
 * owns, `About.metaTitle` and `About.metaDescription`, is seeded into it.
 */
export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About page',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Introduction', default: true },
    { name: 'origin', title: 'Why we exist' },
    { name: 'care', title: 'How care begins' },
    { name: 'doctors', title: 'Doctor chapters' },
    { name: 'team', title: 'The team' },
    { name: 'trust', title: 'Trust in practice' },
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
        localized('eyebrow', { title: 'Eyebrow' }),
        localized('title', {
          title: 'Headline',
          description:
            'Set in the display serif at around eleven characters per line. Two short sentences read better here than one long one.',
        }),
        localized('body', { title: 'Body', type: 'localizedText' }),
        localized('primaryCtaLabel', {
          title: 'Primary button text',
          description: 'Goes to the contact page.',
        }),
        localized('secondaryCtaLabel', {
          title: 'Secondary button text',
          description: 'Scrolls down to "Why IVF Master exists" on this page.',
        }),
      ],
      validation: (rule) => rule.required(),
    }),

    // ── Why we exist ───────────────────────────────────────────────────────
    defineField({
      name: 'origin',
      title: 'Why we exist',
      type: 'object',
      group: 'origin',
      options: { collapsible: true, collapsed: true },
      fields: [
        localized('eyebrow', { title: 'Eyebrow' }),
        localized('title', { title: 'Headline' }),
        defineField({
          name: 'paragraphs',
          title: 'Paragraphs',
          type: 'array',
          of: [{ type: 'localizedText' }],
          description: 'The right-hand column, one paragraph per entry.',
          validation: (rule) => rule.required().min(1).max(6),
        }),
        localized('quote', {
          title: 'Pull quote',
          type: 'localizedText',
          description: 'Set large against the left border, beneath the headline.',
        }),
        localized('note', {
          title: 'Closing note',
          type: 'localizedText',
          description:
            'The line under the rule at the foot of the column. The page prefixes it with "From the beginning".',
        }),
      ],
      validation: (rule) => rule.required(),
    }),

    // ── How care begins ────────────────────────────────────────────────────
    defineField({
      name: 'care',
      title: 'How care begins',
      type: 'object',
      group: 'care',
      options: { collapsible: true, collapsed: true },
      fields: [
        localized('eyebrow', { title: 'Eyebrow' }),
        localized('title', { title: 'Headline' }),
        localized('intro', { title: 'Introduction', type: 'localizedText' }),
        defineField({
          name: 'steps',
          title: 'Steps',
          type: 'array',
          of: [{ type: 'aboutCareStep' }],
          description:
            'Exactly four. They are drawn as a four-column timeline on desktop and numbered from their position, so a fifth would have nowhere to go.',
          validation: (rule) => rule.required().length(4),
        }),
      ],
      validation: (rule) => rule.required(),
    }),

    // ── Doctor chapters ────────────────────────────────────────────────────
    defineField({
      name: 'doctorsSection',
      title: 'Doctor chapters',
      type: 'object',
      group: 'doctors',
      options: { collapsible: true, collapsed: true },
      fields: [
        localized('eyebrow', {
          title: 'Eyebrow',
          description: 'Shown above both chapters — "Two doctors, one continuity of care".',
        }),
        defineField({
          name: 'chapters',
          title: 'Chapters',
          type: 'array',
          of: [{ type: 'aboutDoctor' }],
          description:
            'Exactly two. The chapters alternate sides and background colours from their position, and the same two doctors are introduced on the Home page.',
          validation: (rule) =>
            rule
              .required()
              .length(2)
              .custom((chapters) => {
                const refs = (chapters as { doctor?: { _ref?: string }; profileSlug?: string }[] | undefined)
                  ?.map((chapter) => chapter?.doctor?._ref ?? chapter.profileSlug)
                  .filter(Boolean)
                if (!refs) return true
                return new Set(refs).size === refs.length
                  ? true
                  : 'The same doctor appears twice. Each chapter introduces a different doctor.'
              }),
        }),
      ],
      validation: (rule) => rule.required(),
    }),

    // ── The team ───────────────────────────────────────────────────────────
    defineField({
      name: 'team',
      title: 'The team',
      type: 'object',
      group: 'team',
      options: { collapsible: true, collapsed: true },
      fields: [
        localized('eyebrow', { title: 'Eyebrow' }),
        localized('title', { title: 'Headline' }),
        localized('intro', { title: 'Introduction', type: 'localizedText' }),
        defineField({
          name: 'moments',
          title: 'Moments',
          type: 'array',
          of: [{ type: 'aboutMoment' }],
          description:
            'Exactly three. A three-column grid on desktop and a snap carousel below it — a fourth wraps to a second row on its own.',
          validation: (rule) => rule.required().length(3),
        }),
      ],
      validation: (rule) => rule.required(),
    }),

    // ── Trust in practice ──────────────────────────────────────────────────
    defineField({
      name: 'trust',
      title: 'Trust in practice',
      type: 'object',
      group: 'trust',
      options: { collapsible: true, collapsed: true },
      fields: [
        localized('eyebrow', { title: 'Eyebrow' }),
        localized('title', { title: 'Headline' }),
        localized('intro', { title: 'Introduction', type: 'localizedText' }),
        defineField({
          name: 'points',
          title: 'Points',
          type: 'array',
          of: [{ type: 'aboutTrustPoint' }],
          description: 'Read in order, as stages of the relationship over time.',
          validation: (rule) => rule.required().min(1).max(8),
        }),
      ],
      validation: (rule) => rule.required(),
    }),

    // ── Closing ────────────────────────────────────────────────────────────
    defineField({
      name: 'closing',
      title: 'Closing',
      type: 'object',
      group: 'closing',
      options: { collapsible: true, collapsed: true },
      description:
        'The navy panel at the foot of the page. It is not the shared `ctaBlock`: this one carries two buttons of its own, to the contact page and to the education hub.',
      fields: [
        localized('eyebrow', { title: 'Eyebrow' }),
        localized('title', { title: 'Headline' }),
        localized('body', { title: 'Body', type: 'localizedText' }),
        localized('primaryCtaLabel', {
          title: 'Primary button text',
          description: 'Goes to the contact page.',
        }),
        localized('secondaryCtaLabel', {
          title: 'Secondary button text',
          description: 'Goes to the education hub.',
        }),
      ],
      validation: (rule) => rule.required(),
    }),

    // ── SEO ────────────────────────────────────────────────────────────────
    defineField({
      name: 'seo',
      title: 'Search engine listing',
      type: 'seo',
      group: 'seo',
      description:
        'What Google shows for /about. Unlike the rest of this page, both languages already exist here — they ship today as About.metaTitle and About.metaDescription.',
    }),
  ],

  preview: {
    prepare() {
      return { title: 'About page' }
    },
  },
})
