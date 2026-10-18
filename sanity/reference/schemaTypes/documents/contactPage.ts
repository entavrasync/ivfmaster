import { defineField, defineType } from 'sanity'

import en from '../../../../messages/en.json' with { type: 'json' }
import mr from '../../../../messages/mr.json' with { type: 'json' }
import { CONTACT_FIELDS, CONTACT_LONG_FIELDS } from '../../queries/contact'
import { localized } from '../shared/fields'

/**
 * Editable copy for the Contact page and its WhatsApp enquiry form.
 *
 * Field names are the existing `Contact.*` message keys, so every field maps
 * one-to-one onto copy the page already renders. Every field is optional: an
 * empty field keeps the website's built-in wording. Clinic facts (address,
 * hours), weekday names and open/closed statuses stay in code and Shared clinic
 * settings, where they are validated.
 */
type Section = keyof typeof CONTACT_FIELDS
type ContactKey = (typeof CONTACT_FIELDS)[Section][number]

const SECTIONS: Record<Section, { title: string; description: string }> = {
  intro: { title: 'Page introduction', description: 'The heading area above the form.' },
  form: { title: 'Enquiry form', description: 'Labels, choices and buttons of the form. Visitors’ answers are sent to the clinic on WhatsApp.' },
  panel: { title: 'Contact options panel', description: 'The card beside the form. Phone, email, address and hours come from Shared clinic settings.' },
  seo: { title: 'Search listing', description: 'Title and description shown by search engines.' },
}

const TITLES: Record<ContactKey, string> = {
  eyebrow: 'Eyebrow', headline: 'Headline', lead: 'Introduction',
  formNameLabel: 'Name — label', formNamePlaceholder: 'Name — placeholder', formNameRequired: 'Name — missing-name message',
  formReachingAsLabel: 'Who is reaching out — label', formReachingAsCouple: 'Who is reaching out — couple', formReachingAsIndividual: 'Who is reaching out — individual',
  formDurationLabel: 'How long trying — label', formDuration6m: 'How long — under 6 months', formDuration6to12m: 'How long — 6 to 12 months', formDuration1to2y: 'How long — 1 to 2 years', formDuration2yPlus: 'How long — over 2 years',
  formReasonLabel: 'Reason — label', formReasonIVF: 'Reason — IVF', formReasonSecondOpinion: 'Reason — second opinion', formReasonTests: 'Reason — tests', formReasonOther: 'Reason — other',
  formContactLabel: 'Preferred contact — label', formContactWhatsApp: 'Preferred contact — WhatsApp', formContactCall: 'Preferred contact — call',
  formDayLabel: 'Preferred day — label', formTimeLabel: 'Preferred time — label', formTimeMorning: 'Preferred time — morning', formTimeAfternoon: 'Preferred time — afternoon',
  formMessageLabel: 'Message — label', formMessagePlaceholder: 'Message — placeholder', formSubmit: 'Send button', formSubmitSecondary: 'Call-instead button',
  panelTitle: 'Panel heading', panelWhatsapp: 'WhatsApp — title', panelWhatsappSub: 'WhatsApp — note', panelCall: 'Call — title', panelCallSub: 'Call — note',
  panelEmail: 'Email — title', panelEmailSub: 'Email — note', panelInstagram: 'Instagram — title', panelInstagramSub: 'Instagram — note',
  panelAddressLabel: 'Address heading', panelHoursLabel: 'Hours heading', panelMapCta: 'Map link text',
  metaTitle: 'Search title', metaDescription: 'Search description',
}

const sections = Object.entries(CONTACT_FIELDS) as [Section, readonly ContactKey[]][]
const typeOf = (key: string) => CONTACT_LONG_FIELDS.has(key) ? 'localizedText' : 'localizedString'

// New documents start with the wording the website shows today.
const initialValue = Object.fromEntries(sections.map(([section, keys]) => [section,
  Object.fromEntries(keys.map((key) => [key, { _type: typeOf(key), mr: mr.Contact[key], en: en.Contact[key] }]))]))

export const contactPage = defineType({
  name: 'contactPage',
  title: 'Contact page',
  type: 'document',
  groups: sections.map(([section], index) => ({ name: section, title: SECTIONS[section].title, ...(index === 0 ? { default: true } : {}) })),
  initialValue: () => structuredClone(initialValue),
  fields: sections.map(([section, keys]) => defineField({
    name: section, title: SECTIONS[section].title, description: SECTIONS[section].description, type: 'object', group: section,
    options: { collapsible: true, collapsed: false },
    fields: keys.map((key) => localized(key, {
      title: TITLES[key], type: typeOf(key), translation: 'optional',
      description: 'Leave empty to keep the website’s built-in wording.',
    })),
  })),
  preview: { select: { id: '_id' }, prepare: () => ({ title: 'Contact page' }) },
})
