import { defineField, defineType } from 'sanity'

import { DEFAULT_LOCALE } from '../../lib/locales'
import { defineImageField, localized } from '../shared/fields'
import { localizedString } from '../locale/localizedString'

/**
 * Objects used only by the Home page.
 *
 * Each one exists because a specific component needs that exact shape. None of
 * them is a generic "block" — the Home page is fixed visual choreography, not a
 * page builder, and the schema's job is to make the choreography's assumptions
 * impossible to violate from the Studio.
 *
 * See HOME_CONTENT_MAPPING.md for the evidence behind every fixed length here.
 */

/**
 * One panel of the pinned three-chapter scroll story.
 *
 * The gradient, the large numeral and the artwork stay in code: each gradient
 * is hand-matched to its photograph, and the pair would drift apart if half of
 * it were editable. Only the words are editorial.
 */
export const storyChapter = defineType({
  name: 'storyChapter',
  title: 'Story chapter',
  type: 'object',
  fields: [
    localized('eyebrow', { title: 'Eyebrow', translation: 'all' }),
    localized('headline', { title: 'Headline', translation: 'all' }),
    localized('body', {
      title: 'Body',
      type: 'localizedText',
      description:
        'Kept short — this sits in a pinned panel with a fixed height, and roughly 38 characters per line. Long text will overflow rather than push the layout down.',
      translation: 'all',
    }),
  ],
  preview: {
    select: {
      headline: `headline.${DEFAULT_LOCALE}`,
      fallback: 'headline.en',
      eyebrow: `eyebrow.${DEFAULT_LOCALE}`,
    },
    prepare({ headline, fallback, eyebrow }) {
      return { title: headline || fallback || 'Chapter', subtitle: eyebrow }
    },
  },
})

/**
 * One of the three alternating "what couples fear / what we do" cards.
 * Which side a card sits on is derived from its index in code, so reordering
 * the array reflows the zigzag correctly and there is nothing to keep in sync.
 */
export const trustCard = defineType({
  name: 'trustCard',
  title: 'Trust card',
  type: 'object',
  fields: [
    localized('label', {
      title: 'Label',
      description: 'The small heading above the card, e.g. "What couples fear".',
      translation: 'all',
    }),
    localized('worry', {
      title: 'The worry',
      type: 'localizedText',
      description: 'The question in the couple\'s own words.',
      translation: 'all',
    }),
    localized('response', {
      title: 'Our response',
      type: 'localizedText',
      translation: 'all',
    }),
  ],
  preview: {
    select: { label: `label.${DEFAULT_LOCALE}`, fallback: 'label.en', worry: `worry.${DEFAULT_LOCALE}` },
    prepare({ label, fallback, worry }) {
      return { title: label || fallback || 'Trust card', subtitle: worry }
    },
  },
})

/**
 * The six IVF process steps.
 *
 * `illustrationKey` is the join to the inline SVG map in UnderstandingIVF.tsx.
 * It is a closed list rather than a free string because a typo would silently
 * render a step with no illustration — a blank card in the middle of the
 * process explainer, with nothing in the Studio to indicate why.
 */
export const PROCESS_STEP_KEYS = [
  { title: '01 · Preparing your body (stimulation)', value: 'stimulation' },
  { title: '02 · Collecting the eggs (retrieval)', value: 'retrieval' },
  { title: '03 · Fertilisation', value: 'fertilisation' },
  { title: '04 · Growing the embryos (culture)', value: 'culture' },
  { title: '05 · Transfer', value: 'transfer' },
  { title: '06 · The wait', value: 'wait' },
] as const

export const processStep = defineType({
  name: 'processStep',
  title: 'Process step',
  type: 'object',
  fields: [
    defineField({
      name: 'illustrationKey',
      title: 'Step',
      type: 'string',
      description:
        'Selects which illustration the page draws for this step. The artwork lives in code; this is the join between the two.',
      options: { list: [...PROCESS_STEP_KEYS] },
      validation: (rule) => rule.required(),
    }),
    localized('heading', { title: 'Heading', translation: 'all' }),
    localized('body', { title: 'Body', type: 'localizedText', translation: 'all' }),
  ],
  preview: {
    select: {
      key: 'illustrationKey',
      heading: `heading.${DEFAULT_LOCALE}`,
      fallback: 'heading.en',
    },
    prepare({ key, heading, fallback }) {
      const step = PROCESS_STEP_KEYS.find((option) => option.value === key)
      return { title: heading || fallback || step?.title || 'Step', subtitle: step?.title }
    },
  },
})

/** One myth-versus-fact pair in the Home accordion. */
export const mythFact = defineType({
  name: 'mythFact',
  title: 'Myth / fact',
  type: 'object',
  fields: [
    localized('question', { title: 'Question', translation: 'all' }),
    localized('answer', { title: 'Answer', type: 'localizedText', translation: 'all' }),
  ],
  preview: {
    select: { question: `question.${DEFAULT_LOCALE}`, fallback: 'question.en' },
    prepare({ question, fallback }) {
      return { title: question || fallback || 'Question' }
    },
  },
})

/** A single line of a doctor's credentials. `accent` highlights the standout one. */
export const credential = defineType({
  name: 'credential',
  title: 'Credential',
  type: 'object',
  fields: [
    localized('text', { title: 'Text', translation: 'all' }),
    defineField({
      name: 'accent',
      readOnly: true,
      title: 'Highlight this credential',
      type: 'boolean',
      description: 'Compatibility value retained for existing records. Credential emphasis follows the current website layout.',
      initialValue: false,
    }),
  ],
  preview: {
    select: { text: `text.${DEFAULT_LOCALE}`, fallback: 'text.en', accent: 'accent' },
    prepare({ text, fallback, accent }) {
      return { title: text || fallback || 'Credential', subtitle: accent ? 'Highlighted' : undefined }
    },
  },
})

/**
 * A doctor as introduced on the Home page.
 *
 * Phase 2 shipped this object with the doctor's name, essence and a `doctorKey`
 * string, because the `doctor` document did not exist yet and the key was the
 * column that would make the swap mechanical. Phase 3A makes that swap: the
 * identity is now a reference, so a doctor is named, described and photographed
 * in one place and cannot say two different things on two pages.
 *
 * What did *not* move to the reference is as important as what did. The Home
 * introduction and the team card are genuinely different pieces of writing —
 * Home is second-person and warm ("He'll sit with you, draw the picture…"),
 * the team page is formal — and Home's credentials are a shorter, punchier
 * selection than the profile's. Both stay here, edited on the page they appear
 * on. DOCTOR_CONTENT_MAPPING.md §4 sets out the field-by-field comparison that
 * this split is based on.
 */
export const homeDoctor = defineType({
  name: 'homeDoctor',
  title: 'Doctor (Home introduction)',
  type: 'object',
  fields: [
    defineField({
      name: 'doctor',
      title: 'Doctor',
      type: 'reference',
      to: [{ type: 'doctor' }],
      description:
        'Supplies the name, the one-line essence and the link to the full profile. Edit those on the doctor\'s own document.',
      validation: (rule) => rule.custom((value, context) => !!value || !!(context.parent as { profileSlug?: string } | undefined)?.profileSlug || 'Select a doctor or an existing website profile.'),
    }),
    defineField({ name: 'profileSlug', title: 'Existing website profile', type: 'string', description: 'Use until the matching approved Doctor document is available. A selected Doctor takes precedence.', options: { list: ['gorakh-mandrupkar', 'saie-mandrupkar'] } }),
    localized('intro', {
      title: 'Introduction',
      type: 'localizedText',
      description:
        'Written for the Home page specifically — warmer and more direct than the introduction on the team page.',
      translation: 'all',
    }),
    defineField({
      name: 'credentials',
      title: 'Previous Home qualifications (compatibility)',
      readOnly: true,
      type: 'array',
      of: [{ type: 'credential' }],
      description:
        'Retained for existing records. The current Home cards show the quotation and introduction; edit qualifications on the Doctor for Team and profile pages.',
      validation: (rule) => rule.max(6),
    }),
    localized('ctaLabel', { title: 'Consultation button text', translation: 'all' }),
    localized('storyLabel', { title: 'Profile link text', translation: 'all' }),
  ],
  preview: {
    select: {
      name: `doctor.name.${DEFAULT_LOCALE}`,
      fallback: 'doctor.name.en',
      essence: `doctor.essence.${DEFAULT_LOCALE}`,
      media: 'doctor.portrait',
    },
    prepare({ name, fallback, essence, media }) {
      return { title: name || fallback || 'Doctor', subtitle: essence, media }
    },
  },
})

/**
 * One scroll slide's optional desktop and mobile photos.
 * Retain older desktop/mobile crops for saved artwork frames.
 */
const costOfWaitingPhotoFields = (['desktop', 'mobile'] as const).map(name => (
    { ...defineImageField({ name, title: name === 'desktop' ? 'Desktop photo' : 'Mobile photo',
      fields: [localized('alt', { title: 'Photo description', description: 'Describe the selected photo in English and Marathi.', translation: 'all' })],
    }), description: name === 'desktop' ? 'Optional landscape photo for large screens. Keep space for slide text; set the crop and hotspot.' : 'Optional portrait photo for small screens. Keep space for slide text; set the crop and hotspot.',
      options: { hotspot: true, accept: 'image/jpeg,image/png,image/webp,image/avif' },
    }
))

export const editorialImage = defineType({
  name: 'editorialImage', title: 'Artwork frame', type: 'object',
  fields: [
    defineImageField({
      name: 'desktop',
      title: 'Desktop artwork', required: true,
    }),
    defineImageField({
      name: 'mobile',
      title: 'Mobile artwork', required: true,
      description: 'The portrait-oriented crop of the same artwork.',
    }),
  ],
  preview: {
    select: { media: 'desktop', alt: `desktop.alt.${DEFAULT_LOCALE}` },
    prepare({ media, alt }) { return { title: alt || 'Artwork frame', media } },
  },
})

export const costOfWaitingLine = defineType({
  name: 'costOfWaitingLine', title: 'Narrative line', type: 'object',
  fields: [...localizedString.fields, ...costOfWaitingPhotoFields,
    defineField({ name: 'image', type: 'image', hidden: true, readOnly: true, fields: [localized('alt', { title: 'Previous photo description', translation: 'optional' })] }),
    defineField({ name: 'imageType', type: 'string', hidden: true, readOnly: true }),
  ],
  preview: {
    select: { en: 'en', mr: 'mr', desktop: 'desktop', mobile: 'mobile' },
    prepare({ en, mr, desktop, mobile }) { return { title: (DEFAULT_LOCALE === 'mr' ? mr || en : en || mr) || 'Narrative line', media: desktop ?? mobile } },
  },
})
