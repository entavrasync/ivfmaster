import { defineField, defineType, type ValidationContext } from 'sanity'

import { localized } from '../shared/fields'

// Site Settings retains this hidden object only for stored-data compatibility.
// Shared clinic settings owns the website address and validates it independently.
const retiredSiteAddress = (context: ValidationContext | undefined) =>
  context?.document?._type === 'siteSettings' && context.path?.[0] === 'address' && context.hidden === true

/**
 * Business-information objects for `siteSettings`.
 *
 * These deliberately mirror schema.org shapes, because the same values feed
 * both the visible footer and the `MedicalClinic` JSON-LD. Modelling them once,
 * in the shape structured data already expects, is what lets the five current
 * duplicate sources of the clinic's phone number collapse into one.
 *
 * Nothing here is localized. A postal address, a phone number, a set of
 * coordinates and an opening time are the same facts in Marathi and English;
 * translating them would create two versions of a single truth and guarantee
 * they eventually disagree. Only the *labels* around them are localized, and
 * those live in `next-intl` (they are UI chrome) or on the consuming document.
 */

export const postalAddress = defineType({
  name: 'postalAddress',
  title: 'Postal address',
  type: 'object',
  description:
    'Mirrors schema.org PostalAddress exactly, so the footer and the structured data can never disagree.',
  fields: [
    defineField({
      name: 'streetAddress',
      title: 'Street address',
      type: 'string',
      validation: (rule, context) => retiredSiteAddress(context) ? rule : rule.required(),
    }),
    defineField({
      name: 'addressLocality',
      title: 'Town / city',
      type: 'string',
      validation: (rule, context) => retiredSiteAddress(context) ? rule : rule.required(),
    }),
    defineField({
      name: 'addressRegion',
      title: 'State',
      type: 'string',
      validation: (rule, context) => retiredSiteAddress(context) ? rule : rule.required(),
    }),
    defineField({
      name: 'postalCode',
      title: 'PIN code',
      type: 'string',
      validation: (rule, context) => retiredSiteAddress(context) ? rule :
        rule.required().regex(/^\d{6}$/, { name: 'six-digit Indian PIN code' }),
    }),
    defineField({
      name: 'addressCountry',
      title: 'Country code',
      type: 'string',
      description: 'Two-letter ISO country code, e.g. IN.',
      initialValue: 'IN',
      validation: (rule, context) => retiredSiteAddress(context) ? rule :
        rule.required().regex(/^[A-Z]{2}$/, { name: 'two-letter ISO country code' }),
    }),
  ],
  preview: {
    select: { street: 'streetAddress', locality: 'addressLocality' },
    prepare({ street, locality }) {
      return { title: locality || 'Address', subtitle: street }
    },
  },
})

export const geoLocation = defineType({
  name: 'geoLocation',
  title: 'Map location',
  type: 'object',
  fields: [
    defineField({
      name: 'placeUrl',
      title: 'Google Maps link',
      type: 'url',
      description: 'Used by every "View on Google Maps" link and by JSON-LD hasMap.',
      validation: (rule) => rule.required().uri({ scheme: ['https'] }),
    }),
    defineField({
      name: 'latitude',
      title: 'Latitude',
      type: 'number',
      validation: (rule) => rule.required().min(-90).max(90),
    }),
    defineField({
      name: 'longitude',
      title: 'Longitude',
      type: 'number',
      validation: (rule) => rule.required().min(-180).max(180),
    }),
  ],
})

export const contactChannels = defineType({
  name: 'contactChannels',
  title: 'Contact channels',
  type: 'object',
  description:
    'The single source of truth for how to reach the clinic. Replaces the phone number currently repeated in five places.',
  fields: [
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: 'telephone',
      title: 'Phone (display)',
      type: 'string',
      description:
        'Shown to visitors, spaces and all — e.g. +91 75593 79192. The tel: link is built from this by stripping spaces.',
      validation: (rule) =>
        rule
          .required()
          .regex(/^\+[\d ]{8,20}$/, { name: 'international format starting with +' }),
    }),
    defineField({
      name: 'whatsappNumber',
      title: 'WhatsApp number',
      type: 'string',
      description:
        'wa.me format: country code + digits only, no plus sign and no spaces — e.g. 917559379192.',
      validation: (rule) =>
        rule.required().regex(/^\d{10,15}$/, { name: 'digits only, no + or spaces' }),
    }),
    localized('whatsappPrefill', {
      title: 'WhatsApp prefilled message',
      type: 'localizedText',
      description:
        'The message already typed for the visitor when they open WhatsApp. Written in each language so a Marathi visitor does not open a chat in English.',
      translation: 'all',
    }),
  ],
})

const DAY_OPTIONS = [
  { title: 'Monday', value: 'mon' },
  { title: 'Tuesday', value: 'tue' },
  { title: 'Wednesday', value: 'wed' },
  { title: 'Thursday', value: 'thu' },
  { title: 'Friday', value: 'fri' },
  { title: 'Saturday', value: 'sat' },
  { title: 'Sunday', value: 'sun' },
]

/**
 * One weekday's hours. `closed` is an explicit flag rather than "leave the
 * times blank", because a blank field is indistinguishable from an unfinished
 * one — and the live open/closed indicator would then be wrong rather than absent.
 */
export const dayHours = defineType({
  name: 'dayHours',
  title: 'Opening hours',
  type: 'object',
  fields: [
    defineField({
      name: 'day',
      title: 'Day',
      type: 'string',
      options: { list: DAY_OPTIONS },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'closed',
      title: 'Closed all day',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'open',
      title: 'Opens',
      type: 'string',
      description: '24-hour HH:MM, e.g. 10:00.',
      hidden: ({ parent }) => Boolean(parent?.closed),
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as { closed?: boolean } | undefined
          if (parent?.closed) return true
          if (typeof value !== 'string' || !/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) {
            return 'Enter a 24-hour time such as 10:00, or tick "Closed all day".'
          }
          return true
        }),
    }),
    defineField({
      name: 'close',
      title: 'Closes',
      type: 'string',
      description: '24-hour HH:MM, e.g. 18:00. Must be later than the opening time.',
      hidden: ({ parent }) => Boolean(parent?.closed),
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as
            | { closed?: boolean; open?: string }
            | undefined
          if (parent?.closed) return true
          if (typeof value !== 'string' || !/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) {
            return 'Enter a 24-hour time such as 18:00, or tick "Closed all day".'
          }
          if (typeof parent?.open === 'string' && value <= parent.open) {
            return 'The closing time must be later than the opening time.'
          }
          return true
        }),
    }),
  ],
  preview: {
    select: { day: 'day', open: 'open', close: 'close', closed: 'closed' },
    prepare({ day, open, close, closed }) {
      const label = DAY_OPTIONS.find((option) => option.value === day)?.title ?? 'Day'
      return { title: label, subtitle: closed ? 'Closed' : `${open ?? '—'} – ${close ?? '—'}` }
    },
  },
})

export const clinicHoliday = defineType({
  name: 'clinicHoliday',
  title: 'Holiday',
  type: 'object',
  fields: [
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
      options: { dateFormat: 'YYYY-MM-DD' },
      validation: (rule) => rule.required(),
    }),
    localized('name', {
      title: 'Holiday name',
      translation: 'all',
      description: 'Shown to visitors when the clinic is closed, so it is needed in both languages.',
    }),
  ],
  preview: {
    select: { date: 'date', name: 'name.mr', fallback: 'name.en' },
    prepare({ date, name, fallback }) {
      return { title: name || fallback || 'Holiday', subtitle: date }
    },
  },
})

export const socialLink = defineType({
  name: 'socialLink',
  title: 'Social profile',
  type: 'object',
  fields: [
    defineField({
      name: 'platform',
      title: 'Platform',
      type: 'string',
      options: {
        list: [
          { title: 'Instagram', value: 'instagram' },
          { title: 'Facebook', value: 'facebook' },
          { title: 'YouTube', value: 'youtube' },
          { title: 'LinkedIn', value: 'linkedin' },
          { title: 'X (Twitter)', value: 'x' },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'Profile URL',
      type: 'url',
      validation: (rule) => rule.required().uri({ scheme: ['https'] }),
    }),
  ],
  preview: {
    select: { platform: 'platform', url: 'url' },
    prepare({ platform, url }) {
      return { title: platform ?? 'Social profile', subtitle: url }
    },
  },
})

/**
 * A headline number in the hero stat bar.
 *
 * `value` is a number, not a string, because the count-up animation eases
 * toward it numerically. `suffix` is separate so "2000" can animate while "+"
 * stays put — storing "2000+" as one string would break the animation.
 */
export const statistic = defineType({
  name: 'statistic',
  title: 'Statistic',
  type: 'object',
  fields: [
    defineField({
      name: 'value',
      title: 'Number',
      type: 'number',
      description: 'Digits only. The count-up animation eases toward this number.',
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: 'suffix',
      title: 'Suffix',
      type: 'string',
      description: 'Shown immediately after the number and never animated — for example + or %.',
      validation: (rule) => rule.max(3),
    }),
    localized('label', {
      title: 'Label',
      translation: 'all',
      description: 'The short caption beneath the number. Visible to every visitor, so both languages are required.',
    }),
  ],
  preview: {
    select: { value: 'value', suffix: 'suffix', label: 'label.mr', fallback: 'label.en' },
    prepare({ value, suffix, label, fallback }) {
      return { title: `${value ?? '—'}${suffix ?? ''}`, subtitle: label || fallback }
    },
  },
})

export const navItem = defineType({
  name: 'navItem',
  title: 'Navigation item',
  type: 'object',
  fields: [
    localized('label', {
      title: 'Label',
      translation: 'all',
      description: 'Navigation is visible on every page in every language, so both are required.',
    }),
    defineField({
      name: 'link',
      title: 'Destination',
      type: 'link',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { label: 'label.mr', fallback: 'label.en', path: 'link.internalPath' },
    prepare({ label, fallback, path }) {
      return { title: label || fallback || 'Untitled', subtitle: path }
    },
  },
})
