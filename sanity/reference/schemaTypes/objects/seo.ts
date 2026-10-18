import { defineField, defineType } from 'sanity'

import { DEFAULT_LOCALE } from '../../lib/locales'
import { SEO_LIMITS, warnOnLength } from '../../lib/localizedValidation'
import { defineImageField, localized } from '../shared/fields'

/**
 * Editorial SEO content for a document.
 *
 * This object holds only what a person writes. Everything derived — canonical
 * URL construction, hreflang alternates, sitemap priority, JSON-LD structure —
 * stays in `lib/seo/` where it belongs, and `generateMetadata()` combines the
 * two. Metadata is never generated inside Sanity.
 *
 * Both text fields use the 'any' translation policy rather than 'all'. SEO copy
 * legitimately lags behind page content, and `coalesce()` guarantees the tag is
 * never empty — a Marathi page with an English meta description is far better
 * than a publish blocked on a copywriter. An individual document may tighten
 * this to 'all' where the stakes justify it.
 *
 * Length checks are warnings, not errors, and are measured in grapheme
 * clusters so Devanagari is not penalised for using combining marks.
 */
export const seo = defineType({
  name: 'seo',
  title: 'Search engine listing',
  type: 'object',
  options: { collapsible: true, collapsed: true },
  fields: [
    localized('metaTitle', {
      title: 'Search result title',
      description: `Shown as the clickable heading in search results. Around ${SEO_LIMITS.title.max} characters. Leave empty to fall back to the document title.`,
      translation: 'any',
      warn: (value) =>
        warnOnLength(value, {
          max: SEO_LIMITS.title.max,
          fieldLabel: 'Search result title',
        }),
    }),
    localized('metaDescription', {
      title: 'Search result description',
      type: 'localizedText',
      description: `The summary beneath the title in search results. Around ${SEO_LIMITS.description.min}–${SEO_LIMITS.description.max} characters.`,
      translation: 'any',
      warn: (value) =>
        warnOnLength(value, {
          min: SEO_LIMITS.description.min,
          max: SEO_LIMITS.description.max,
          fieldLabel: 'Search result description',
        }),
    }),
    defineImageField({
      name: 'ogImage',
      title: 'Social sharing image',
      description:
        'Shown when this page is shared on WhatsApp, Facebook or LinkedIn. 1200×630 works everywhere. Falls back to the site-wide image if left empty.',
    }),
    defineField({
      name: 'canonicalUrl',
      title: 'Canonical URL',
      type: 'url',
      description:
        'Only set this when the same content is published at another address that should rank instead. Leave empty otherwise — the correct canonical is generated automatically.',
      validation: (rule) => rule.uri({ scheme: ['https'] }),
    }),
    defineField({
      name: 'noIndex',
      title: 'Hide from search engines',
      type: 'boolean',
      description:
        'Removes this page from the sitemap and asks search engines not to list it. The page stays reachable by anyone with the link.',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: `metaTitle.${DEFAULT_LOCALE}`,
      fallback: 'metaTitle.en',
      noIndex: 'noIndex',
    },
    prepare({ title, fallback, noIndex }) {
      return {
        title: title || fallback || 'No search title set',
        subtitle: noIndex ? 'Hidden from search engines' : undefined,
      }
    },
  },
})
