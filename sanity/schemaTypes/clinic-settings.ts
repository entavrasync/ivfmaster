import { Building2 } from 'lucide-react'
import { defineField, defineType, getPublishedId } from 'sanity'
import { approvalField, localizedField } from './editorial-fields.ts'
import { settingsDocument } from '../lib/clinic-mapping.ts'

export const clinicSettings = defineType({
  name: 'clinicSettings', title: 'Shared clinic settings', type: 'document', icon: Building2,
  groups: [
    { name: 'review', title: 'Approval', default: true },
    { name: 'contact', title: 'Contact' },
    { name: 'location', title: 'Address & map' },
    { name: 'social', title: 'Social' },
  ],
  description: 'Shared contact/location information. Edit the schedule in Clinic hours & availability. Branding, routing, navigation and SEO behavior remain separate.',
  fields: [
    approvalField,
    defineField({ name: 'telephone', title: 'Display phone number', type: 'string', description: 'As visitors should read it, for example +91 75593 79192.', validation: (r) => r.required().custom((value) => value == null || /^\+?[0-9 ()-]{7,24}$/.test(value) && settingsDocument.shape.telephone.safeParse(value).success || 'Use digits, spaces, brackets or hyphens, for example +91 75593 79192.') }),
    defineField({ name: 'whatsappNumber', title: 'WhatsApp digits with country code', type: 'string', description: 'Digits only, country code first, no + or spaces, for example 917559379192.', validation: (r) => r.required().custom((value) => value == null || /^[1-9][0-9]{6,14}$/.test(value) || 'Use digits only with the country code first, for example 917559379192.') }),
    defineField({ name: 'email', type: 'string', validation: (r) => r.required().email() }),
    localizedField('displayAddress', 'Public address'),
    defineField({
      name: 'address', title: 'Postal address for existing structured data', type: 'object',
      fields: (['streetAddress', 'addressLocality', 'addressRegion', 'postalCode', 'addressCountry'] as const).map((name) => defineField({ name, type: 'string',
        ...(name === 'addressCountry' ? { description: 'Two uppercase country-code letters, such as IN.' } : {}),
        validation: (r) => r.required().custom((value) => value == null || settingsDocument.shape.address.shape[name].safeParse(value).success || (name === 'addressCountry' ? 'Use a two-letter uppercase country code.' : 'Enter nonblank address text.')),
      })),
      validation: (r) => r.required(),
    }),
    defineField({ name: 'mapUrl', title: 'Google Maps place URL', type: 'url', description: 'Use an HTTPS Google Maps link on maps.app.goo.gl, maps.google.com, google.com or www.google.com.',
      validation: (r) => r.required().uri({ scheme: ['https'] }).custom((value) => value == null || settingsDocument.shape.mapUrl.safeParse(value).success || 'Use the existing Google Maps destination on a supported Google host.'),
    }),
    defineField({ name: 'latitude', type: 'number', validation: (r) => r.required().min(-90).max(90) }),
    defineField({ name: 'longitude', type: 'number', validation: (r) => r.required().min(-180).max(180) }),
    defineField({ name: 'instagram', title: 'Instagram URL', type: 'url', description: 'Use the clinic HTTPS profile on instagram.com or www.instagram.com.',
      validation: (r) => r.required().uri({ scheme: ['https'] }).custom((value) => value == null || settingsDocument.shape.instagram.safeParse(value).success || 'Use an HTTPS Instagram profile URL.'),
    }),
  ].map((field) => ({ ...field, group: field.name === 'reviewStatus' ? 'review' : ['telephone', 'whatsappNumber', 'email'].includes(field.name) ? 'contact' : field.name === 'instagram' ? 'social' : 'location' })),
  validation: (r) => r.custom((_, context) => !context.document?._id || getPublishedId(context.document._id) === 'clinicSettings' || 'Use the Shared clinic settings singleton in Studio.'),
  preview: { prepare: () => ({ title: 'Shared clinic settings' }) },
})
