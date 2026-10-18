import { defineArrayMember, defineField, defineType, type FieldDefinition } from 'sanity'

import { siteConfig } from '../../../../config/site'
import { DEFAULT_LOCALE } from '../../lib/locales'
import { SEO_LIMITS, warnOnLength } from '../../lib/localizedValidation'
import { SeoPanel } from '../../../studio/SeoPanel'
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

/** Groups the advanced controls so the common fields stay at the top. */
export const SEO_FIELDSETS = [
  { name: 'keywords', title: 'Keywords', options: { collapsible: true, collapsed: false } },
  { name: 'social', title: 'Social sharing (WhatsApp, Facebook, LinkedIn, X)', options: { collapsible: true, collapsed: true } },
  { name: 'visibility', title: 'Search visibility (advanced)', options: { collapsible: true, collapsed: true } },
]

type SeoParent = { noIndex?: boolean; noFollow?: boolean; canonicalUrl?: string }
const changesVisibility = (seo: SeoParent | undefined) => Boolean(seo?.noIndex || seo?.noFollow || seo?.canonicalUrl)

/**
 * Keyword, social and visibility controls shared by every SEO object, including
 * the procedure, article and doctor objects that keep their own title/description
 * field types. Every field is optional: empty fields keep the website's defaults.
 */
export function seoAdvancedFields(): FieldDefinition[] {
  return [
    defineField({
      name: 'focusKeyword',
      title: 'Focus keyword',
      type: 'string',
      fieldset: 'keywords',
      description: 'The main phrase people search for that this page should rank for, e.g. "IVF treatment in Sangli". The checks below show where it is missing.',
      validation: (rule) => rule.max(80),
    }),
    defineField({
      name: 'secondaryKeywords',
      title: 'Related keywords',
      type: 'array',
      fieldset: 'keywords',
      of: [defineArrayMember({ type: 'string' })],
      options: { layout: 'tags' },
      description: 'Up to eight related phrases or spellings, e.g. "test tube baby", "IVF cost". Used for the keywords tag and the checks.',
      validation: (rule) => rule.max(8).unique(),
    }),
    localized('ogTitle', {
      title: 'Social title',
      fieldset: 'social',
      description: 'Headline shown when the page is shared. Leave empty to use the search result title.',
      translation: 'optional',
    }),
    localized('ogDescription', {
      title: 'Social description',
      type: 'localizedText',
      fieldset: 'social',
      description: 'Text shown under the headline when shared. Leave empty to use the search result description.',
      translation: 'optional',
    }),
    {
      ...defineImageField({ name: 'ogImage', title: 'Social sharing image', fieldset: 'social' }),
      description: 'Shown when this page is shared on WhatsApp, Facebook, LinkedIn or X. Use 1200×630 with the subject centred. Falls back to the site-wide image if empty.',
    },
    defineField({
      name: 'noIndex',
      title: 'Hide from search engines',
      type: 'boolean',
      fieldset: 'visibility',
      description: 'Removes this page from the sitemap and asks search engines not to list it. The page stays reachable by link.',
      initialValue: false,
    }),
    defineField({
      name: 'noFollow',
      title: 'Ask search engines not to follow links on this page',
      type: 'boolean',
      fieldset: 'visibility',
      description: 'Rarely needed. Leave off unless an SEO specialist asks for it.',
      initialValue: false,
    }),
    defineField({
      name: 'canonicalUrl',
      title: 'Canonical page',
      type: 'url',
      fieldset: 'visibility',
      description: `Only when another page on this site should rank instead of this one, e.g. ${siteConfig.url}/procedures/ivf. Leave empty otherwise; the correct canonical is generated automatically. Removes this page from the sitemap.`,
      validation: (rule) => rule.uri({ scheme: ['https'] }).custom((value) =>
        !value || value.startsWith(`${siteConfig.url}/`) || value === siteConfig.url || `Use a page on ${siteConfig.url}.`),
    }),
    defineField({
      name: 'visibilityReason',
      title: 'Reason for the visibility change',
      type: 'text',
      rows: 2,
      fieldset: 'visibility',
      description: 'Required when this page is hidden, not followed or points to another canonical page, so the decision can be reviewed later.',
      validation: (rule) => rule.custom((value, context) =>
        !changesVisibility(context.parent as SeoParent | undefined) || (typeof value === 'string' && value.trim().length > 0) || 'Explain why search visibility is changed for this page.'),
    }),
    defineField({
      name: 'structuredData',
      title: 'Include structured data (schema markup)',
      type: 'boolean',
      fieldset: 'visibility',
      description: 'Unset means Yes. Turns this page’s schema markup (breadcrumbs, procedure, article or doctor details) on or off. Clinic details are always included.',
    }),
  ]
}

export const seo = defineType({
  name: 'seo',
  title: 'Search engine listing',
  type: 'object',
  options: { collapsible: true, collapsed: true },
  fieldsets: SEO_FIELDSETS,
  components: { input: SeoPanel },
  fields: [
    localized('metaTitle', {
      title: 'Search result title',
      description: `Shown as the clickable heading in search results. Around ${SEO_LIMITS.title.max} characters; put the focus keyword near the start. Leave empty to fall back to the document title.`,
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
      description: `The summary beneath the title in search results. Around ${SEO_LIMITS.description.min}–${SEO_LIMITS.description.max} characters; include the focus keyword naturally.`,
      translation: 'any',
      warn: (value) =>
        warnOnLength(value, {
          min: SEO_LIMITS.description.min,
          max: SEO_LIMITS.description.max,
          fieldLabel: 'Search result description',
        }),
    }),
    ...seoAdvancedFields(),
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
