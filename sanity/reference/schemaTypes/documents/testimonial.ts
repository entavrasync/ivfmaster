import { defineField, defineType, type Rule } from 'sanity'

import { isSupportedLocale, LOCALE_LABELS, SUPPORTED_LOCALES } from '../../lib/locales'
import {
  defineOrderField,
  defineVisibilityField,
  localized,
} from '../shared/fields'

/** Retained compatibility schema for testimonial documents. Historical reference quotations lacked verified consent; no public testimonial section is active. Keep consent, provenance and publication validation intact. Never infer permission from the presence of stored content. */
export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  groups: [
    { name: 'quote', title: 'The quote', default: true },
    { name: 'identity', title: 'How it is shown' },
    { name: 'consent', title: 'Consent & publication' },
  ],

  fields: [
    // ── The quote ──────────────────────────────────────────────────────────
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'text',
      rows: 5,
      group: 'quote',
      description:
        "The patient's own words, exactly as they gave them. Do not translate, tidy or shorten a quote — record the language it was given in below instead.",
      validation: (rule) => rule.required().min(20),
    }),
    defineField({
      name: 'quoteLanguage',
      title: 'Language of the quote',
      type: 'string',
      group: 'quote',
      description:
        'Which language the text above is written in. The quote is shown in that language to every visitor rather than being translated.',
      options: {
        list: SUPPORTED_LOCALES.map((locale) => ({
          title: LOCALE_LABELS[locale],
          value: locale,
        })),
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),

    // ── How it is shown ────────────────────────────────────────────────────
    localized('displayName', {
      title: 'Displayed name',
      group: 'identity',
      translation: 'optional',
      description:
        'How the person wishes to be credited — and only as far as they agreed to. Leave empty to keep the testimonial anonymous; that is a legitimate choice, not a missing field.',
    }),
    localized('displayContext', {
      title: 'Displayed context',
      group: 'identity',
      translation: 'optional',
      description:
        'The short line beneath the name — "After two IVF cycles". Say no more about someone than they agreed to have said.',
    }),
    defineField({
      name: 'initials',
      title: 'Initials',
      type: 'string',
      group: 'identity',
      description:
        'Shown in the avatar circle where the design has one. Not derived from the name: a couple may prefer one initial each, or none at all.',
      validation: (rule) => rule.max(4),
    }),

    // ── Consent & publication ──────────────────────────────────────────────
    defineField({
      name: 'consentOnFile',
      title: 'Written consent is on file',
      type: 'boolean',
      group: 'consent',
      description:
        'Tick only when the clinic holds written permission from this person to publish these words. This testimonial cannot be shown to visitors until it is ticked.',
      initialValue: false,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'consentDate',
      title: 'Date consent was given',
      type: 'date',
      group: 'consent',
      description: 'The date on the signed permission.',
      validation: (rule) =>
        rule.custom((value, context) => {
          const consented = (context.document as { consentOnFile?: boolean } | undefined)
            ?.consentOnFile
          if (consented === true && !value) {
            return 'Add the date on the signed permission. Consent without a date is not a record of anything.'
          }
          if (consented !== true && value) {
            return 'There is a consent date but consent is not marked as on file. Tick the box above, or clear this date.'
          }
          return true
        }),
    }),
    defineField({
      name: 'procedure',
      title: 'Treatment this testimonial is about',
      type: 'reference',
      to: [{ type: 'procedure' }],
      group: 'consent',
      description:
        'Optional, and only where the clinic can confirm the relationship. Attaching a testimonial to a treatment presents it as evidence for that treatment, so it must not be inferred from a quote that happens to mention IVF.',
    }),

    defineOrderField({ group: 'consent' }),
    defineVisibilityField({
      group: 'consent',
      initialValue: false,
      description:
        'Off by default, and it cannot be turned on until consent is on file above.',
      validation: (rule: Rule) =>
        rule.custom((value, context) => {
          if (value !== true) return true
          return context.document?.consentOnFile === true
            ? true
            : 'This testimonial cannot be shown to visitors until written consent is on file. Record the consent first, or leave this off.'
        }),
    }),
  ],

  orderings: [
    {
      name: 'displayOrder',
      title: 'Display order',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],

  preview: {
    select: {
      quote: 'quote',
      name: 'displayName.en',
      nameMr: 'displayName.mr',
      order: 'order',
      isPublished: 'isPublished',
      consentOnFile: 'consentOnFile',
      language: 'quoteLanguage',
    },
    prepare({ quote, name, nameMr, order, isPublished, consentOnFile, language }) {
      const notes = [
        typeof order === 'number' ? `#${order}` : undefined,
        name || nameMr || 'Anonymous',
        isSupportedLocale(language) ? LOCALE_LABELS[language] : undefined,
        consentOnFile === true ? undefined : 'No consent on file',
        isPublished === true ? undefined : 'Hidden',
      ].filter(Boolean)
      return {
        title: typeof quote === 'string' ? quote : 'Testimonial',
        subtitle: notes.join(' · '),
      }
    },
  },
})
