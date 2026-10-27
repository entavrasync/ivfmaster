import { defineArrayMember, defineField, defineType } from 'sanity'

import { DEFAULT_LOCALE } from '../../lib/locales'
import { defineImageField, localized } from '../shared/fields'
import { validateWebsiteImage } from '../../../lib/image-validation'

/**
 * Objects used only by the team page.
 *
 * The doctors are documents, because they appear on three pages and are linked
 * to from the Home page. Everything here is *not* a document, and for the same
 * reason in each case: it appears in exactly one grid on exactly one page, has
 * no URL of its own, and nothing references it. Promoting these to documents
 * would put orphans in the Studio's root list with nothing to point at them.
 */

/**
 * A member of the care team — currently the embryologist.
 *
 * `lib/team.ts` also carries a commented-out fertility-nurse card, held back
 * until the clinic supplies a name and a photograph. Its translated strings
 * exist in both message files. Reinstating that card is now an editorial act:
 * add an entry here. That is precisely the code change this object removes the
 * need for, and it is why `defineVisibilityField` exists on the documents.
 */
export const careTeamMember = defineType({
  name: 'careTeamMember',
  title: 'Care team member',
  type: 'object',
  fields: [
    localized('name', {
      title: 'Name',
      description: 'Including the honorific, as it should read in each language.',
      translation: 'all',
    }),
    localized('role', {
      title: 'Role',
      description: 'e.g. "Embryologist & reproductive biologist".',
      translation: 'all',
    }),
    localized('blurb', {
      title: 'Introduction',
      type: 'localizedText',
      description: 'One or two sentences on the card.',
      translation: 'all',
    }),
    defineField({
      name: 'credentials',
      title: 'Credentials',
      type: 'array',
      of: [{ type: 'credential' }],
      description: 'Optional. Omitted entirely from the card when empty.',
      validation: (rule) => rule.max(6),
    }),
    defineImageField({
      name: 'portrait',
      title: 'Portrait',
      description:
        'Use the hotspot to choose where the face sits in the circular crop — this replaces the hand-written crop values that used to live in code.',
    }),
  ],
  preview: {
    select: {
      name: `name.${DEFAULT_LOCALE}`,
      fallback: 'name.en',
      role: `role.${DEFAULT_LOCALE}`,
      roleFallback: 'role.en',
      media: 'portrait',
    },
    prepare({ name, fallback, role, roleFallback, media }) {
      return {
        title: name || fallback || 'Care team member',
        subtitle: role || roleFallback,
        media,
      }
    },
  },
})

/**
 * One area of the clinic in the facility gallery.
 *
 * The images array is the behaviour: a tile with one photograph renders as a
 * still image, and a tile with two or more turns into an in-place carousel with
 * auto-play, arrows and dots. That is how the embryology lab, which has three
 * photographs, differs from reception, which has one — and it means growing a
 * tile into a carousel is an upload rather than a code change.
 */
export const facilityTile = defineType({
  name: 'facilityTile',
  title: 'Facility area',
  type: 'object',
  fields: [
    localized('caption', {
      title: 'Caption',
      description:
        'Overlaid on the photograph — "Reception — a calm first hello."',
      translation: 'all',
    }),
    defineField({
      name: 'images',
      title: 'Photographs',
      type: 'array',
      // Spelled out rather than built with defineImageField() because Sanity's
      // array members are a different type from fields. The two conventions
      // that matter — a hotspot, and alt text required in every language — are
      // the same ones that helper encodes.
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true, accept: 'image/jpeg,image/png,image/webp,image/avif' },
          validation: rule => [rule.assetRequired(), rule.custom(validateWebsiteImage)],
          fields: [
            localized('alt', {
              title: 'Alternative text',
              description:
                'Describes the photograph for screen readers. Required in every language.',
              translation: 'all',
            }),
          ],
        }),
      ],
      description:
        'One photograph renders as a still tile. Add a second and this tile becomes a carousel that advances on its own.',
      validation: (rule) => rule.min(1).max(8),
    }),
  ],
  preview: {
    select: {
      caption: `caption.${DEFAULT_LOCALE}`,
      fallback: 'caption.en',
      media: 'images.0',
      images: 'images',
    },
    prepare({ caption, fallback, media, images }) {
      const count = Array.isArray(images) ? images.length : 0
      return {
        title: caption || fallback || 'Facility area',
        subtitle: count > 1 ? `${count} photographs — carousel` : undefined,
        media,
      }
    },
  },
})
