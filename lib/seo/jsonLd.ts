import { siteConfig } from '../../config/site.ts'

type JsonLdValue =
  | string
  | number
  | boolean
  | null
  | readonly JsonLdValue[]
  | { readonly [key: string]: JsonLdValue }

export function serializeJsonLd(data: JsonLdValue): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}

export function buildRootJsonLd() {
  const clinicId = `${siteConfig.url}/#medical-clinic`
  const websiteId = `${siteConfig.url}/#website`

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': websiteId,
        name: siteConfig.name,
        url: siteConfig.url,
        inLanguage: ['en-IN', 'hi-IN', 'mr-IN'],
        publisher: {
          '@id': clinicId,
        },
      },
      {
        '@type': 'MedicalClinic',
        '@id': clinicId,
        name: siteConfig.legalName,
        alternateName: siteConfig.name,
        description: siteConfig.description,
        url: siteConfig.url,
        email: siteConfig.contact.email,
        telephone: siteConfig.contact.telephone,
        medicalSpecialty: [
          'ReproductiveMedicine',
          'Obstetrics',
          'Gynecology',
        ],
        address: {
          '@type': 'PostalAddress',
          streetAddress: siteConfig.address.streetAddress,
          addressLocality: siteConfig.address.addressLocality,
          addressRegion: siteConfig.address.addressRegion,
          addressCountry: siteConfig.address.addressCountry,
        },
        openingHoursSpecification: [
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
            closes: '20:00',
          },
        ],
        sameAs: [siteConfig.social.instagram],
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
