import { defineQuery } from 'next-sanity'
import { localizedValue } from '../../lib/localized-query'

/**
 * Contact page copy, keyed by the existing `Contact.*` message keys.
 *
 * The key list lives here rather than in the schema so the website can map the
 * result without importing Studio code. The projection is generated from it:
 * every field resolves to the visitor's locale, falling back to the other one.
 */
export const CONTACT_FIELDS = {
  intro: ['eyebrow', 'headline', 'lead'],
  form: [
    'formNameLabel', 'formNamePlaceholder', 'formNameRequired',
    'formReachingAsLabel', 'formReachingAsCouple', 'formReachingAsIndividual',
    'formDurationLabel', 'formDuration6m', 'formDuration6to12m', 'formDuration1to2y', 'formDuration2yPlus',
    'formReasonLabel', 'formReasonIVF', 'formReasonSecondOpinion', 'formReasonTests', 'formReasonOther',
    'formContactLabel', 'formContactWhatsApp', 'formContactCall',
    'formDayLabel', 'formTimeLabel', 'formTimeMorning', 'formTimeAfternoon',
    'formMessageLabel', 'formMessagePlaceholder', 'formSubmit', 'formSubmitSecondary',
  ],
  panel: [
    'panelTitle', 'panelWhatsapp', 'panelWhatsappSub', 'panelCall', 'panelCallSub',
    'panelEmail', 'panelEmailSub', 'panelInstagram', 'panelInstagramSub',
    'panelAddressLabel', 'panelHoursLabel', 'panelMapCta',
  ],
  seo: ['metaTitle', 'metaDescription'],
} as const

/** Fields edited as multi-line text rather than a single line. */
export const CONTACT_LONG_FIELDS: ReadonlySet<string> = new Set(['lead', 'formMessagePlaceholder', 'metaDescription'])

const pick = (key: string) => `"${key}": ${localizedValue(key)}`

export const contactPageQuery = defineQuery(`*[_type == "contactPage" && _id == "contactPage" && reviewStatus == "approved"][0]{
  ${Object.entries(CONTACT_FIELDS).map(([section, keys]) => `${section}{ ${keys.map(pick).join(', ')}${section === 'seo' ? ', backlinks[]{_key,url}' : ''} }`).join(',\n  ')}
}`)
