import { defineField, defineType } from 'sanity'

import { DEFAULT_LOCALE } from '../../lib/locales'
import { localized } from '../shared/fields'
import { requireAllLocalesInEach } from '../../lib/localizedValidation'

/**
 * Objects used only by the About page.
 *
 * Like the Home objects, each one exists because a specific component needs
 * that exact shape. The About page is fixed editorial choreography — a hero, an
 * origin story, a four-step timeline, two full-bleed doctor chapters that
 * alternate sides, a three-card row, a bordered list and a closing panel — and
 * none of these is a generic block.
 *
 * Every localized field here takes the default `'any'` policy rather than
 * `'all'`. The About page has never had Marathi copy — it is CONTENT-MISSING,
 * not lost in migration — so requiring both languages would leave the document
 * permanently invalid and block every unrelated edit behind an error no editor
 * can clear. `coalesce()` keeps the page rendering exactly as it renders today
 * and the Studio shows which fields are still English only.
 * ABOUT_CONTENT_MAPPING.md §4.
 *
 * See ABOUT_CONTENT_MAPPING.md for the evidence behind every shape here, and
 * for the fields that were deliberately not created.
 */

/**
 * One step of "how care begins".
 *
 * The numeral the page draws ("01" … "04") is not stored: it is the step's
 * position written out, derived in `CareJourney` exactly as `CareTeam` already
 * derives `0{index + 1}` for its own cards. Storing it would allow a document
 * whose third step is labelled "02".
 */
export const aboutCareStep = defineType({
  name: 'aboutCareStep',
  title: 'Care step',
  type: 'object',
  fields: [
    localized('title', { title: 'Title' }),
    localized('body', { title: 'Body', type: 'localizedText' }),
  ],
  preview: {
    select: { title: `title.${DEFAULT_LOCALE}`, fallback: 'title.en' },
    prepare({ title, fallback }) {
      return { title: title || fallback || 'Care step' }
    },
  },
})

/**
 * One doctor's chapter on the About page.
 *
 * The doctor's identity is a reference, not a copy: the name, the role and the
 * photograph come from the `doctor` document created in Phase 3A, so a doctor
 * cannot say two different things on two pages and the Marathi About page gets
 * their name and role in Marathi even while the surrounding prose is still
 * English. ABOUT_CONTENT_MAPPING.md §2.
 *
 * What stays here is About's own writing. The chapter is three paragraphs of
 * narrative in the page's voice; `doctor.biography` is a Portable Text CV with
 * headings and a bulleted list. They are not the same text and merging them
 * would delete one of the two. This is the same split Phase 3A made for
 * `homeDoctor` (DOCTOR_CONTENT_MAPPING.md §4).
 */
export const aboutDoctor = defineType({
  name: 'aboutDoctor',
  title: 'Doctor chapter',
  type: 'object',
  fields: [
    defineField({
      name: 'doctor',
      title: 'Doctor',
      type: 'reference',
      to: [{ type: 'doctor' }],
      description:
        "Supplies the name, the role and the photograph. Edit those on the doctor's own document.",
      validation: (rule) => rule.custom((value, context) => !!value || !!(context.parent as { profileSlug?: string } | undefined)?.profileSlug || 'Select a doctor or an existing website profile.'),
    }),
    defineField({ name: 'profileSlug', title: 'Existing website profile', type: 'string', description: 'Use until the matching approved Doctor document is available. A selected Doctor takes precedence.', options: { list: ['gorakh-mandrupkar', 'saie-mandrupkar'] } }),
    localized('pullQuote', {
      title: 'Pull quote',
      type: 'localizedText',
      description:
        'Fallback quotation when the approved Doctor has no About story. To change an active Doctor story, edit Doctor → About story.',
    }),
    defineField({
      name: 'paragraphs',
      title: 'Paragraphs',
      type: 'array',
      of: [{ type: 'localizedText' }],
      description: 'Fallback narrative when the approved Doctor has no About story. Otherwise edit Doctor → About story. One paragraph per entry.',
      validation: rule => [rule.required().min(1).max(6), rule.custom(requireAllLocalesInEach)],
    }),
    localized('evidence', {
      title: 'Closing note',
      type: 'localizedText',
      description:
        'Fallback closing note when the approved Doctor has no About story. Otherwise edit Doctor → About story.',
    }),
    localized('ctaLabel', {
      title: 'Consultation button text',
      description:
        'The button beneath the chapter. Where it goes is fixed by the page — the contact form, carrying this doctor.',
    }),
  ],
  preview: {
    select: {
      name: `doctor.name.${DEFAULT_LOCALE}`,
      fallback: 'doctor.name.en',
      quote: `pullQuote.${DEFAULT_LOCALE}`,
      quoteFallback: 'pullQuote.en',
      media: 'doctor.portrait',
    },
    prepare({ name, fallback, quote, quoteFallback, media }) {
      return {
        title: name || fallback || 'Doctor chapter',
        subtitle: quote || quoteFallback,
        media,
      }
    },
  },
})

/** One of the three cards in the "people beside every step" row. */
export const aboutMoment = defineType({
  name: 'aboutMoment',
  title: 'Care moment',
  type: 'object',
  fields: [
    localized('title', { title: 'Title' }),
    localized('body', { title: 'Body', type: 'localizedText' }),
  ],
  preview: {
    select: { title: `title.${DEFAULT_LOCALE}`, fallback: 'title.en' },
    prepare({ title, fallback }) {
      return { title: title || fallback || 'Care moment' }
    },
  },
})

/**
 * One row of "what you can expect from the relationship".
 *
 * `label` is the small stage marker in the left column ("Before treatment",
 * "Through uncertainty") and is a separate field rather than a prefix inside the
 * title, because the design sets it in its own grid column at a different size.
 */
export const aboutTrustPoint = defineType({
  name: 'aboutTrustPoint',
  title: 'Trust point',
  type: 'object',
  fields: [
    localized('label', {
      title: 'Stage',
      description: 'The short marker in the left column — "Before treatment", "Over time".',
    }),
    localized('title', { title: 'Title' }),
    localized('body', { title: 'Body', type: 'localizedText' }),
  ],
  preview: {
    select: {
      label: `label.${DEFAULT_LOCALE}`,
      labelFallback: 'label.en',
      title: `title.${DEFAULT_LOCALE}`,
      fallback: 'title.en',
    },
    prepare({ label, labelFallback, title, fallback }) {
      return {
        title: title || fallback || 'Trust point',
        subtitle: label || labelFallback,
      }
    },
  },
})
