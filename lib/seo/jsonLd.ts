import { siteConfig } from '../../config/site.ts'
import { availabilityJsonLd, availabilityClosuresJsonLd, type ClinicAvailability } from '../clinic-availability.ts'
import type { ClinicSettings } from '../../sanity/lib/clinic-mapping.ts'

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

export function buildRootJsonLd(settings: ClinicSettings | null = null, availability: ClinicAvailability | null = null) {
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
