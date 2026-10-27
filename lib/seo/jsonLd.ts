import { siteConfig } from '../../config/site.ts'
import { buildAbsoluteUrl, buildLocalizedPath } from './routes.ts'
import { availabilityJsonLd, availabilityClosuresJsonLd, type ClinicAvailability } from '../clinic-availability.ts'
import type { ClinicSettings } from '../../sanity/lib/clinic-mapping.ts'
import type { SiteIdentity } from '../../sanity/lib/site-content-mapping.ts'

export type JsonLdValue =
  | string
  | number
  | boolean
  | null
  | readonly JsonLdValue[]
  | { readonly [key: string]: JsonLdValue }

/** Serializes JSON-LD, escaping `<` so the payload can never close its script tag. */
export function serializeJsonLd(data: JsonLdValue | object): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}

export function buildRootJsonLd(settings: ClinicSettings | null = null, availability: ClinicAvailability | null = null, identity: SiteIdentity = {}) {
  const clinicId = `${siteConfig.url}/#medical-clinic`
  const websiteId = `${siteConfig.url}/#website`

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': websiteId,
        name: identity.name ?? siteConfig.name,
        url: siteConfig.url,
        inLanguage: ['en-IN', 'hi-IN', 'mr-IN'],
        publisher: {
          '@id': clinicId,
        },
      },
      {
        '@type': 'MedicalClinic',
        '@id': clinicId,
        name: identity.legalName ?? siteConfig.legalName,
        alternateName: identity.name ?? siteConfig.name,
        description: identity.description ?? siteConfig.description,
        url: siteConfig.url,
        email: settings?.email ?? siteConfig.contact.email,
        telephone: settings?.telephone ?? siteConfig.contact.telephone,
        medicalSpecialty: [
          'ReproductiveMedicine',
          'Obstetrics',
          'Gynecology',
        ],
        address: {
          '@type': 'PostalAddress',
          streetAddress: settings?.address.streetAddress ?? siteConfig.address.streetAddress,
          addressLocality: settings?.address.addressLocality ?? siteConfig.address.addressLocality,
          addressRegion: settings?.address.addressRegion ?? siteConfig.address.addressRegion,
          postalCode: settings?.address.postalCode ?? siteConfig.address.postalCode,
          addressCountry: settings?.address.addressCountry ?? siteConfig.address.addressCountry,
        },
        hasMap: settings?.mapUrl ?? siteConfig.maps.placeUrl,
        geo: {
          '@type': 'GeoCoordinates',
          latitude: settings?.latitude ?? siteConfig.maps.latitude,
          longitude: settings?.longitude ?? siteConfig.maps.longitude,
        },
        openingHoursSpecification: availability ? availabilityJsonLd(availability) : [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: [
              'Monday',
              'Tuesday',
              'Wednesday',
              'Thursday',
              'Friday',
              'Saturday',
            ],
            opens: '10:00',
            closes: '18:00',
          },
        ],
        ...(availability ? { specialOpeningHoursSpecification: availabilityClosuresJsonLd(availability) } : {}),
        sameAs: [settings?.instagram ?? siteConfig.social.instagram],
      },
      {
        '@type': 'Physician',
        '@id': `${siteConfig.url}/#dr-gorakh-mandrupkar`,
        name: 'Dr. Gorakh Mandrupkar',
        worksFor: {
          '@id': clinicId,
        },
        medicalSpecialty: 'ReproductiveMedicine',
      },
      {
        '@type': 'Physician',
        '@id': `${siteConfig.url}/#dr-saie-mandrupkar`,
        name: 'Dr. Saie Mandrupkar',
        worksFor: {
          '@id': clinicId,
        },
        medicalSpecialty: ['Obstetrics', 'Gynecology', 'ReproductiveMedicine'],
      },
    ],
  } as const
}

/* ─── Per-page structured data ───────────────────────────────────────────── */
// Page builders reference the clinic node above by @id, so clinic facts stay
// code-owned and are never repeated or contradicted per page.

type Crumb = { readonly name: string; readonly path: string }
type PageLocale = 'mr' | 'en'

const clinicReference = { '@id': `${siteConfig.url}/#medical-clinic` }
const pageUrl = (locale: PageLocale, path: string) => buildAbsoluteUrl(buildLocalizedPath(locale, path))
const inLanguage = (locale: PageLocale) => (locale === 'mr' ? 'mr-IN' : 'en-IN')

export function buildBreadcrumbJsonLd(locale: PageLocale, trail: readonly Crumb[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: pageUrl(locale, crumb.path),
    })),
  }
}

/** Breadcrumbs only, for listing and information pages. */
export function buildPageJsonLd(locale: PageLocale, trail: readonly Crumb[]) {
  return { '@context': 'https://schema.org', '@graph': [buildBreadcrumbJsonLd(locale, trail)] }
}

export function buildProcedureJsonLd({ locale, trail, name, alternateName, description, faqs, image }: {
  readonly locale: PageLocale
  readonly trail: readonly Crumb[]
  readonly name: string
  readonly alternateName: string
  readonly description: string
  /** Only the questions and answers visible on the page. */
  readonly faqs: readonly { readonly q: string; readonly a: string }[]
  readonly image?: string
}) {
  const url = pageUrl(locale, trail[trail.length - 1].path)
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'MedicalWebPage',
        '@id': `${url}#webpage`,
        url,
        name: `${name} — ${alternateName}`,
        description,
        inLanguage: inLanguage(locale),
        about: { '@id': `${url}#procedure` },
        publisher: clinicReference,
        ...(image ? { primaryImageOfPage: image } : {}),
      },
      {
        '@type': 'MedicalProcedure',
        '@id': `${url}#procedure`,
        name: alternateName,
        alternateName: name,
        description,
        url,
        ...(image ? { image } : {}),
        provider: clinicReference,
      },
      ...(faqs.length
        ? [{
            '@type': 'FAQPage',
            '@id': `${url}#faq`,
            mainEntity: faqs.map((faq) => ({
              '@type': 'Question',
              name: faq.q,
              acceptedAnswer: { '@type': 'Answer', text: faq.a },
            })),
          }]
        : []),
      buildBreadcrumbJsonLd(locale, trail),
    ],
  }
}

export function buildArticleJsonLd({ locale, trail, headline, description, datePublished, image }: {
  readonly locale: PageLocale
  readonly trail: readonly Crumb[]
  readonly headline: string
  readonly description: string
  readonly datePublished: string
  readonly image?: string
}) {
  const url = pageUrl(locale, trail[trail.length - 1].path)
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        '@id': `${url}#article`,
        mainEntityOfPage: url,
        headline,
        description,
        datePublished,
        inLanguage: inLanguage(locale),
        author: clinicReference,
        publisher: clinicReference,
        ...(image ? { image } : {}),
      },
      buildBreadcrumbJsonLd(locale, trail),
    ],
  }
}

/** Extends the doctor's root Physician node (same @id) with their profile page details. */
export function buildPhysicianJsonLd({ locale, trail, slug, name, jobTitle, description, image }: {
  readonly locale: PageLocale
  readonly trail: readonly Crumb[]
  readonly slug: string
  readonly name: string
  readonly jobTitle: string
  readonly description: string
  readonly image?: string
}) {
  const url = pageUrl(locale, trail[trail.length - 1].path)
  const physicianId = `${siteConfig.url}/#dr-${slug}`
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfilePage',
        '@id': `${url}#webpage`,
        url,
        inLanguage: inLanguage(locale),
        mainEntity: { '@id': physicianId },
      },
      {
        '@type': 'Physician',
        '@id': physicianId,
        url,
        name,
        description,
        ...(jobTitle ? { jobTitle } : {}),
        ...(image ? { image } : {}),
        worksFor: clinicReference,
      },
      buildBreadcrumbJsonLd(locale, trail),
    ],
  }
}
