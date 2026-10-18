import { defineField, defineType, type ArrayRule } from 'sanity'

import { requireAllLocalesInEach } from '../../lib/localizedValidation'
import { defineImageField, localized } from '../shared/fields'

/**
 * The Home page.
 *
 * This is deliberately **not** a page builder. There is no `sections[]` of
 * arbitrary blocks, because the Home page is not an arbitrary stack of blocks:
 * it is a fixed piece of scroll choreography. Three pinned story panels whose
 * progress is split at hardcoded 0.33/0.67 thresholds. Five narrative lines
 * sliced at index 5 to switch the section from dark to light. Seven artwork
 * frames cross-fading against seven GSAP beats. Six process steps joined by id
 * to six inline SVGs.
 *
 * A generic block list would let an editor add a fourth story panel that never
 * appears, or a sixth narrative line that silently desynchronises the pin from
 * the artwork. So each section is a named slot with the exact shape its
 * component needs, and the array lengths that the animation depends on are
 * enforced here rather than hoped for.
 *
 * Every fixed length below is sourced in HOME_CONTENT_MAPPING.md §0, which
 * cites the line of component code that requires it.
 *
 * What is *not* here, on purpose: gradients, colour variants, inline SVGs,
 * Lucide icons, easing curves, SCROLL_MULTIPLIER, BEAT/IN/HOLD/OUT/PAUSE,
 * FACTOR_DESKTOP/FACTOR_MOBILE, section order, and the art-directed background
 * images. Those are design and motion, not content, and exposing them would
 * hand editors a way to break the page with no way to tell that they had.
 */

/** Applied to every array of bare localized strings on this page. */
const eachLocalized = (rule: ArrayRule<unknown[]>) =>
  rule.custom(requireAllLocalesInEach)

export const homePage = defineType({
  name: 'homePage',
  title: 'Home page',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero', default: true },
    { name: 'pain', title: 'Pain recognition' },
    { name: 'trust', title: 'Why trust us' },
    { name: 'cost', title: 'Cost of waiting' },
    { name: 'process', title: 'Understanding IVF' },
    { name: 'doctors', title: 'Doctors' },
    { name: 'myths', title: 'Myths & facts' },
    { name: 'closing', title: 'Final CTA' },
    { name: 'seo', title: 'SEO' },
  ],

  fields: [
    // ── Hero ───────────────────────────────────────────────────────────────
    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'object',
      group: 'hero',
      description:
        'The first screen. Upload optional banner images below; leave them empty to keep the artwork that ships with the site. The parallax and text scrims stay in code.',
      options: { collapsible: true, collapsed: false },
      fields: [
        localized('eyebrow', { title: 'Eyebrow', translation: 'all' }),
        localized('headline', {
          title: 'Headline',
          translation: 'all',
          description:
            'The page\'s only <h1>. Keep it short: it animates in as one block and a much longer line changes the height of the first screen.',
        }),
        localized('subheadline', { title: 'Subheadline', translation: 'all' }),
        localized('body', {
          title: 'Body',
          type: 'localizedText',
          description: 'Sits in a 46-character-wide column beneath the subheadline.',
          translation: 'all',
        }),
        defineField({
          name: 'primaryCta',
          title: 'Primary button',
          type: 'cta',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'secondaryCta',
          title: 'Secondary link',
          type: 'cta',
          validation: (rule) => rule.required(),
        }),
        localized('microTrust', {
          title: 'Reassurance line',
          description: 'The small line under the buttons. Optional.',
          translation: 'any',
        }),
        {
          ...defineImageField({ name: 'desktopImage', title: 'Desktop banner image' }),
          description: 'Wide landscape image, at least 2400×1350 (16:9). Keep the left half calm and light because the headline sits there, and set the hotspot on the main subject.',
        },
        {
          ...defineImageField({ name: 'mobileImage', title: 'Mobile banner image' }),
          description: 'Tall portrait image, at least 1080×1920 (9:16). Keep the top half calm and light for the text, and place the main subject in the lower half.',
        },
      ],
      validation: (rule) => rule.required(),
    }),

    // ── Pain recognition ───────────────────────────────────────────────────
    defineField({
      name: 'painRecognition',
      title: 'Pain recognition — introduction',
      type: 'object',
      group: 'pain',
      options: { collapsible: true, collapsed: true },
      fields: [
        localized('eyebrow', { title: 'Eyebrow', translation: 'all' }),
        localized('headline', { title: 'Headline', translation: 'all' }),
        localized('body', { title: 'Body', type: 'localizedText', translation: 'all' }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'painStory',
      title: 'Pain recognition — the three-panel story',
      type: 'object',
      group: 'pain',
      description:
        'The pinned scroll sequence. Each panel is paired with a hand-tuned gradient and photograph that stay in code.',
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({
          name: 'chapters',
          title: 'Chapters',
          type: 'array',
          of: [{ type: 'storyChapter' }],
          description:
            'Exactly three. The section pins the viewport and splits scroll progress at fixed 0.33 and 0.67 thresholds across three panels; a fourth chapter would never be shown and a second would leave a third of the pin blank.',
          validation: (rule) => rule.required().length(3),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'painCta',
      title: 'Pain recognition — closing call to action',
      type: 'ctaBlock',
      group: 'pain',
      validation: (rule) => rule.required(),
    }),

    // ── Why trust us ───────────────────────────────────────────────────────
    defineField({
      name: 'whyTrust',
      title: 'Why trust us',
      type: 'object',
      group: 'trust',
      options: { collapsible: true, collapsed: true },
      fields: [
        localized('eyebrow', { title: 'Eyebrow', translation: 'all' }),
        localized('heading', { title: 'Heading', translation: 'all' }),
        localized('body', { title: 'Body', type: 'localizedText', translation: 'all' }),
        defineField({
          name: 'cards',
          title: 'Fear / response cards',
          type: 'array',
          of: [{ type: 'trustCard' }],
          description:
            'Exactly three. They alternate left, right, left down a central spine; the sides are derived from position, so reordering is safe but changing the count breaks the alternation and leaves the spine unbalanced.',
          validation: (rule) => rule.required().length(3),
        }),
        // There is deliberately no "trust line" field here. `messages/*.json`
        // carries three translated proof points (WhyTrust.statYears,
        // .statCouples, .statSpecialists) but nothing renders them — they are
        // leftovers from an earlier design. Modelling them would create a
        // required field with no consumer, so they stay in the message files
        // until someone decides whether the section should show them.
        localized('credentialNote', {
          title: 'Credential note',
          type: 'localizedText',
          description: 'The line about the clinic\'s affiliations. Optional.',
          translation: 'any',
        }),
        defineField({
          name: 'credentialCitation',
          title: 'Credential citation',
          type: 'citedSentence',
          description:
            'The follow-up line naming the source, with the source itself linked inside the sentence. Optional.',
        }),
        defineField({
          name: 'closing',
          title: 'Closing call to action',
          type: 'ctaBlock',
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),

    // ── Cost of waiting ────────────────────────────────────────────────────
    defineField({
      name: 'costOfWaiting',
      title: 'The cost of waiting',
      type: 'object',
      group: 'cost',
      description:
        'The cinematic pinned section. Every array length here is tied to a GSAP timeline — read the field notes before changing anything.',
      options: { collapsible: true, collapsed: true },
      fields: [
        localized('eyebrow', { title: 'Eyebrow', translation: 'all' }),
        defineField({
          name: 'narrativeLines',
          title: 'Narrative lines',
          type: 'array',
          of: [{ type: 'localizedString' }],
          description:
            'Exactly five. Each line is one beat of the pinned timeline — fade in, hold, fade out — and the total scroll distance is calculated from the beat count. A sixth line would be scrolled past before it ever appeared.',
          validation: (rule) => [rule.required().length(5), eachLocalized(rule)],
        }),
        defineField({
          name: 'hopeLines',
          title: 'Turning-point lines',
          type: 'array',
          of: [{ type: 'localizedString' }],
          description:
            'Exactly two. These are the lines after the section turns from dark to light. The turn happens at a fixed position in the sequence, so the split between the five above and these two is not adjustable.',
          validation: (rule) => [rule.required().length(2), eachLocalized(rule)],
        }),
        defineField({
          name: 'frames',
          title: 'Artwork frames',
          type: 'array',
          of: [{ type: 'editorialImage' }],
          description:
            'Optional — leave empty to keep the artwork that ships with the site. If you upload frames you must upload exactly seven, because the seven images cross-fade against the seven lines above. A partial set would leave the section blank partway through the scroll.',
          validation: (rule) => rule.length(7),
        }),
        defineField({
          name: 'closing',
          title: 'Closing call to action',
          type: 'ctaBlock',
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),

    // ── Understanding IVF ──────────────────────────────────────────────────
    defineField({
      name: 'understandingIvf',
      title: 'Understanding IVF',
      type: 'object',
      group: 'process',
      options: { collapsible: true, collapsed: true },
      fields: [
        localized('eyebrow', { title: 'Eyebrow', translation: 'all' }),
        localized('heading', { title: 'Heading', translation: 'all' }),
        localized('body', { title: 'Body', type: 'localizedText', translation: 'all' }),
        defineField({
          name: 'steps',
          title: 'Process steps',
          type: 'array',
          of: [{ type: 'processStep' }],
          description:
            'Exactly six, one for each stage of a cycle, each with a different illustration. The numbering and the connecting line between steps are drawn from their position.',
          validation: (rule) =>
            rule
              .required()
              .length(6)
              .custom((value) => {
                const keys = (value as { illustrationKey?: string }[] | undefined)?.map(
                  (step) => step.illustrationKey,
                )
                if (!keys) return true
                const filled = keys.filter(Boolean)
                if (filled.length !== keys.length) return 'Every step needs an illustration selected.'
                return new Set(filled).size === filled.length
                  ? true
                  : 'Each step\'s illustration can only be used once — two steps sharing one would draw the same picture twice.'
              }),
        }),
        defineField({
          name: 'closing',
          title: 'Closing call to action',
          type: 'ctaBlock',
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),

    // ── Doctors ────────────────────────────────────────────────────────────
    defineField({
      name: 'meetTheDoctors',
      title: 'Meet the doctors',
      type: 'object',
      group: 'doctors',
      options: { collapsible: true, collapsed: true },
      fields: [
        localized('eyebrow', { title: 'Eyebrow', translation: 'all' }),
        localized('heading', { title: 'Heading', translation: 'all' }),
        localized('body', { title: 'Body', type: 'localizedText', translation: 'all' }),
        defineField({
          name: 'doctors',
          title: 'Doctors',
          type: 'array',
          of: [{ type: 'homeDoctor' }],
          description:
            'Exactly two — this section is a two-column introduction to the couple who run the clinic, and each card is bound to a portrait that lives in code.',
          validation: (rule) =>
            rule
              .required()
              .length(2)
              .custom((value) => {
                const refs = (
                  value as { doctor?: { _ref?: string }; profileSlug?: string }[] | undefined
                )?.map((entry) => entry.doctor?._ref ?? entry.profileSlug)
                if (!refs) return true
                const filled = refs.filter(Boolean)
                if (filled.length !== refs.length) return 'Both cards need a doctor selected.'
                return new Set(filled).size === filled.length
                  ? true
                  : 'The two cards must be different doctors.'
              }),
        }),
        localized('coupleNote', {
          title: 'Closing note',
          type: 'localizedText',
          description: 'The line beneath the two cards. Optional.',
          translation: 'any',
        }),
      ],
      validation: (rule) => rule.required(),
    }),

    // ── Myths & facts ──────────────────────────────────────────────────────
    defineField({
      name: 'mythsFacts',
      title: 'Myths & facts',
      type: 'object',
      group: 'myths',
      options: { collapsible: true, collapsed: true },
      fields: [
        localized('eyebrow', { title: 'Eyebrow', translation: 'all' }),
        localized('heading', { title: 'Heading', translation: 'all' }),
        localized('body', { title: 'Body', type: 'localizedText', translation: 'all' }),
        defineField({
          name: 'items',
          title: 'Myths',
          type: 'array',
          of: [{ type: 'mythFact' }],
          description:
            'Between three and ten. Unlike the rest of this page the count here is genuinely free — this is a plain accordion with no pinning and no position-dependent maths, so adding one cannot break anything. The bounds are editorial: fewer than three looks unfinished, more than ten becomes a wall of text.',
          validation: (rule) => rule.required().min(3).max(10),
        }),
        defineField({
          name: 'closing',
          title: 'Closing call to action',
          type: 'ctaBlock',
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),

    // ── Final CTA ──────────────────────────────────────────────────────────
    defineField({
      name: 'finalCta',
      title: 'Final call to action',
      type: 'object',
      group: 'closing',
      description:
        'The clinic\'s address, hours and phone number in this section are read from Site settings — they are not editable here, so the page can never contradict the footer or the structured data.',
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({
          name: 'intro',
          title: 'Heading block',
          type: 'ctaBlock',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'contactLabels',
          title: 'Row labels',
          type: 'object',
          description: 'The three labels beside the address, the hours and the phone number.',
          fields: [
            localized('clinic', { title: 'Address label', translation: 'all' }),
            localized('hours', { title: 'Hours label', translation: 'all' }),
            localized('reach', { title: 'Phone label', translation: 'all' }),
          ],
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'whatsappCta',
          title: 'WhatsApp button',
          type: 'cta',
          description:
            'The number and the prefilled message come from Site settings — set this link\'s type to WhatsApp and only write the label.',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'formCta',
          title: 'Contact form button',
          type: 'cta',
          validation: (rule) => rule.required(),
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
        'Anything left empty here falls back to the site-wide defaults in Site settings.',
    }),
  ],

  preview: {
    prepare() {
      return { title: 'Home page' }
    },
  },
})
