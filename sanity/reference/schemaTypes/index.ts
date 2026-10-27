import { type SchemaTypeDefinition } from 'sanity'

import { aboutPage } from './documents/aboutPage'
import { contactPage } from './documents/contactPage'
import { faq } from './documents/faq'
import { footer } from './documents/footer'
import { homePage } from './documents/homePage'
import { navigation } from './documents/navigation'
import { proceduresPage } from './documents/proceduresPage'
import { siteSettings } from './documents/siteSettings'
import { teamPage } from './documents/teamPage'
import { testimonial } from './documents/testimonial'
import { localizedPortableText } from './locale/localizedPortableText'
import { localizedString } from './locale/localizedString'
import { localizedText } from './locale/localizedText'
import {
  aboutCareStep,
  aboutDoctor,
  aboutMoment,
  aboutTrustPoint,
} from './objects/about'
import {
  clinicHoliday,
  contactChannels,
  dayHours,
  geoLocation,
  navItem,
  postalAddress,
  socialLink,
  statistic,
} from './objects/business'
import { cta } from './objects/cta'
import { ctaBlock } from './objects/ctaBlock'
import {
  credential,
  editorialImage,
  costOfWaitingLine,
  homeDoctor,
  mythFact,
  processStep,
  storyChapter,
  trustCard,
} from './objects/home'
import { citedSentence } from './objects/citedSentence'
import { link } from './objects/link'
import { linkGroup } from './objects/linkGroup'
import { seo } from './objects/seo'
import { careTeamMember, facilityTile } from './objects/team'

/** Reused page, global and object definitions. The target registry in sanity/schemaTypes/index.ts combines these with its authoritative procedure, doctor, article and legacy compatibility schemas, then applies target approval and initial-value conventions. Do not register a second procedure or doctor definition here. */
export const schemaTypes: SchemaTypeDefinition[] = [
  // Localization primitives
  localizedString,
  localizedText,
  localizedPortableText,

  // Shared objects
  link,
  cta,
  ctaBlock,
  seo,
  linkGroup,
  citedSentence,

  // Business objects
  postalAddress,
  geoLocation,
  contactChannels,
  dayHours,
  clinicHoliday,
  socialLink,
  statistic,
  navItem,

  // Home objects
  storyChapter,
  trustCard,
  processStep,
  mythFact,
  credential,
  homeDoctor,
  editorialImage,
  costOfWaitingLine,

  // Team objects
  careTeamMember,
  facilityTile,

  // About objects
  aboutCareStep,
  aboutDoctor,
  aboutMoment,
  aboutTrustPoint,

  // Singleton documents
  siteSettings,
  navigation,
  footer,
  homePage,
  proceduresPage,
  teamPage,
  aboutPage,
  contactPage,

  // Collection documents
  faq,
  testimonial,
]
