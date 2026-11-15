import { HeartHandshake, Stethoscope, Tags } from 'lucide-react'
import { defineArrayMember, defineField, defineType, getPublishedId, type PreviewConfig } from 'sanity'
import { approvalField } from './editorial-fields'
import { FEATURED_LIMIT, publicationSlug, safeWebUrl } from '../lib/publication-model'
import { parsePublicationMedia } from '../lib/publication-media'
import { apiVersion } from '../project'
import { OptionalImageInput } from '../reference/schemaTypes/shared/fields'
import { validateWebsiteImage } from '../lib/image-validation'
import { SEO_FIELDSETS, seoAdvancedFields } from '../reference/schemaTypes/objects/seo'
import { SPEECH_AUDIENCE, speechAudienceInput } from '../studio/SpeechAudienceBanner'
import { FeaturedPositionInput, FeaturedToggleInput } from '../studio/FeaturedSlots'

const english = (value: unknown) => typeof value === 'string' && !!value.trim() || 'Write this field in English. Marathi is optional.'
const hasText = (items: unknown[]) => items.some(item => item != null && typeof item === 'object' && 'children' in item && Array.isArray(item.children) && item.children.some((child: unknown) => child != null && typeof child === 'object' && 'text' in child && typeof child.text === 'string' && child.text.trim()))
const copy = (name: string, title: string, required = true, paragraph = false) => defineField({
  name, title, type: 'object',
  fields: [
    defineField({ name: 'en', title: 'English', type: paragraph ? 'text' : 'string', validation: rule => rule.custom((value, context) => !required && (value == null || typeof value === 'string' && !value.trim()) && !(context.parent as { mr?: string } | undefined)?.mr?.trim() || english(value)) }),
    defineField({ name: 'mr', title: 'Marathi (optional)', type: paragraph ? 'text' : 'string' }),
  ],
  validation: rule => required ? rule.required().error(`Add ${title.toLowerCase()} in English.`) : rule,
})
const linkUrl = (name: string, title: string, required = false) => defineField({
  name, title, type: 'url', validation: rule => (required ? rule.required() : rule).custom(value => !value || safeWebUrl.safeParse(value).success || 'Use a complete HTTPS web address.'),
})

export const publicationImage = defineType({
  name: 'publicationImage', title: 'Publication image', type: 'image', options: { hotspot: true },
  components: { input: OptionalImageInput },
  description: 'JPEG, PNG, WebP or AVIF. Describe the image in English; Marathi is optional. Use crop and hotspot to keep the subject in view.',
  fields: [copy('alt', 'Image description')],
  validation: rule => [rule.assetRequired(), rule.custom(validateWebsiteImage)],
})

const block = () => defineArrayMember({ type: 'block',
  styles: [{ title: 'Paragraph', value: 'normal' }, { title: 'Heading', value: 'h2' }, { title: 'Subheading', value: 'h3' }, { title: 'Quote', value: 'blockquote' }],
  lists: [{ title: 'Bulleted list', value: 'bullet' }, { title: 'Numbered list', value: 'number' }],
  marks: { decorators: [{ title: 'Strong', value: 'strong' }, { title: 'Emphasis', value: 'em' }],
    annotations: [defineArrayMember({ name: 'link', title: 'Website link', type: 'object', fields: [linkUrl('href', 'Web address', true)] })] },
  // The renderer uses single-level lists; reject indentation that would be lost.
  validation: rule => rule.custom(value => !value || !('level' in value) || typeof value.level !== 'number' || value.level <= 1 || 'Use a single-level list; remove this indentation.'),
})
export const publicationRichText = defineType({
  name: 'publicationRichText', title: 'Publication text', type: 'object',
  fields: [
    defineField({ name: 'en', title: 'English', type: 'array', of: [block()], validation: rule => rule.required().min(1).custom(value => value && hasText(value) || 'Write the English content.') }),
    defineField({ name: 'mr', title: 'Marathi (optional complete translation)', type: 'array', of: [block()], validation: rule => rule.min(1).custom(value => value == null || hasText(value) || 'Write the Marathi content, or remove this translation to use English.') }),
  ],
})
export const publicationMedia = defineType({
  name: 'publicationMedia', title: 'YouTube or Instagram', type: 'object',
  fields: [defineField({ name: 'url', title: 'YouTube or Instagram link', type: 'url',
    description: 'Paste a YouTube video, Short or live-video URL, or an Instagram post, Reel or video URL. YouTube thumbnails are automatic. Instagram cards use the optional image below.',
    validation: rule => rule.required().custom(value => !value || !!parsePublicationMedia(value) || 'Paste a supported HTTPS YouTube video or Instagram post/Reel link.'),
  }), defineField({ name: 'thumbnail', title: 'Custom thumbnail (optional fallback)', type: 'publicationImage', description: 'Used if the automatic preview is unavailable. Remove it to use the branded placeholder instead.' })],
  preview: { select: { title: 'url', media: 'thumbnail' } },
})

function slugField(type: 'news' | 'event' | 'publicationCategory') {
  return defineField({ name: 'slug', title: 'Web address', type: 'slug', options: { source: 'title.en', maxLength: 96 },
    description: 'Write the English title, then Generate. Published addresses are protected so existing links keep working.',
    validation: rule => rule.required().custom(async (value, context) => {
      if (!value?.current || !publicationSlug.safeParse(value.current).success) return 'Use lowercase English letters, numbers and single hyphens (up to 96 characters).'
      const id = context.document?._id
      if (!id) return true
      try {
        const reader = context.getClient({ apiVersion }).withConfig({ perspective: 'published', useCdn: false })
        const previous = await reader.fetch<string | null>('*[_id == $id][0].slug.current', { id: getPublishedId(id) })
        if (previous && previous !== value.current) return `Keep the published address: ${previous}.`
        const duplicate = await reader.fetch<boolean>('count(*[_type == $type && slug.current == $slug && _id != $id]) > 0', { type, slug: value.current, id: getPublishedId(id) })
        return !duplicate || 'This address is already used. Generate a different address.'
      } catch { return 'Could not verify this address. Check your connection and retry.' }
    }),
  })
}
export const publicationCategory = defineType({
  name: 'publicationCategory', title: 'Speech category', type: 'document', icon: Tags,
  fields: [copy('title', 'Category name'), slugField('publicationCategory'), defineField({ name: 'scope', title: 'Use for', type: 'string', description: 'Which speeches can use this category. Medical-professional and patient speeches each have their own categories.', options: { list: [{ title: SPEECH_AUDIENCE.news.short, value: 'news' }, { title: SPEECH_AUDIENCE.event.short, value: 'event' }], layout: 'radio' }, validation: rule => rule.required() })],
  preview: { select: { title: 'title.en', scope: 'scope' }, prepare: ({ title, scope }: { title?: string; scope?: string }) => ({
    title: title ?? 'Untitled category', subtitle: scope === 'news' || scope === 'event' ? `For ${SPEECH_AUDIENCE[scope].short.toLowerCase()}` : 'Choose who this category is for',
  }) },
})
function fields(type: 'news' | 'event') {
  return [
    { ...approvalField, group: 'identity' },
    { ...copy('title', 'Title'), group: 'identity' },
    { ...slugField(type), group: 'identity' },
    defineField({ name: 'category', title: 'Category', type: 'reference', to: [{ type: 'publicationCategory' }], options: { filter: 'scope == $scope', filterParams: { scope: type } }, group: 'identity', description: `Only categories for ${SPEECH_AUDIENCE[type].short.toLowerCase()} are listed. Create and publish a category first. Delete is protected while this content references it; clear the reference to remove the category.`, validation: rule => rule.required().custom(async (value, context) => {
      if (!value?._ref) return true
      try { return await context.getClient({ apiVersion }).withConfig({ perspective: 'published' }).fetch<boolean>('count(*[_id == $id && _type == "publicationCategory" && scope == $scope]) == 1', { id: value._ref, scope: type }) || 'Choose a published category for this content type.' } catch { return 'Could not verify the category. Check your connection.' }
    }) }),
    defineField({ name: 'featured', title: 'Featured', type: 'boolean', initialValue: false, group: 'identity', components: { input: FeaturedToggleInput },
      description: `Show this speech in the top cards. Up to ${FEATURED_LIMIT} ${SPEECH_AUDIENCE[type].short.toLowerCase()} speeches can be featured; the panel below shows who holds each spot, live. Empty spots show the newest speeches.` }),
    featuredPositionField(type),
    { ...copy('summary', 'Summary', true, true), group: 'content' },
    defineField({ name: 'body', title: 'Speech', type: 'publicationRichText', group: 'content', validation: rule => rule.required() }),
    defineField({ name: 'coverImage', title: 'Cover image (optional)', type: 'publicationImage', group: 'media' }),
    defineField({ name: 'media', title: 'Video & social posts', type: 'array', of: [defineArrayMember({ type: 'publicationMedia' })], group: 'media', validation: rule => rule.max(8) }),
    defineField({ name: 'seo', title: 'Search & social sharing', type: 'object', group: 'seo', fieldsets: SEO_FIELDSETS, description: 'Optional. Empty fields use the title, summary and cover.' + (type === 'event' ? ' Write for patients and families: use the plain words they would search for, not clinical terms.' : ''), fields: [copy('metaTitle', 'SEO title', false), copy('metaDescription', 'SEO description', false, true), ...seoAdvancedFields()] }),
  ]
}
/** Featured order for the top cards. Unique per speech type, so at most FEATURED_LIMIT can be featured. */
function featuredPositionField(type: 'news' | 'event') {
  return defineField({ name: 'featuredPosition', title: 'Featured position', type: 'number', group: 'identity', components: { input: FeaturedPositionInput },
    description: 'Position 1 is the large blue card; 2 and 3 are the cards beside it. Spots taken by other speeches cannot be chosen.',
    options: { list: Array.from({ length: FEATURED_LIMIT }, (_, i) => ({ title: String(i + 1), value: i + 1 })), layout: 'radio', direction: 'horizontal' },
    hidden: ({ document }) => document?.featured !== true,
    validation: rule => rule.custom(async (value, context) => {
      if (context.document?.featured !== true) return true
      if (typeof value !== 'number' || !Number.isInteger(value) || value < 1 || value > FEATURED_LIMIT) return `Choose a featured position from 1 to ${FEATURED_LIMIT}.`
      const id = context.document._id
      if (!id) return true
      try {
        const reader = context.getClient({ apiVersion }).withConfig({ perspective: 'published', useCdn: false })
        const others = await reader.fetch<{ title: string | null; position: number | null }[]>('*[_type == $type && featured == true && _id != $id]{ "title": title.en, "position": featuredPosition }', { type, id: getPublishedId(id) })
        const taken = others.find(other => other.position === value)
        if (taken) return `Position ${value} is already used by “${taken.title ?? 'another speech'}”. Choose another position, or unfeature that speech first.`
        if (others.length >= FEATURED_LIMIT) return `${FEATURED_LIMIT} speeches are already featured. Unfeature one before featuring this speech.`
        return true
      } catch { return 'Could not check the other featured speeches. Check your connection and retry.' }
    }),
  })
}
/** The audience leads the subtitle so references and search results show which speech type it is. */
const speechPreview = (type: 'news' | 'event'): PreviewConfig<{ title: string; date: string; featured: string; position: string; media: string }> => ({
  select: { title: 'title.en', date: 'publishedAt', featured: 'featured', position: 'featuredPosition', media: 'coverImage' },
  prepare: ({ title, date, featured, position, media }) => ({
    title: typeof title === 'string' ? title : 'Untitled speech', media,
    subtitle: [SPEECH_AUDIENCE[type].short, featured === true && typeof position === 'number' ? `Featured #${position}` : '', typeof date === 'string' ? date.slice(0, 10) : ''].filter(Boolean).join(' · '),
  }),
})
const speechOrderings = [
  { title: 'Featured position', name: 'featuredPosition', by: [{ field: 'featured', direction: 'desc' as const }, { field: 'featuredPosition', direction: 'asc' as const }, { field: 'publishedAt', direction: 'desc' as const }] },
  { title: 'Newest first', name: 'publishedAtDesc', by: [{ field: 'publishedAt', direction: 'desc' as const }] },
]
function publishedAtField() {
  return defineField({ name: 'publishedAt', title: 'Publication date & time', type: 'datetime', group: 'details', description: 'Use the actual publication time. Future-dated speeches stay out of the public listing until this time.', validation: rule => rule.required() })
}
/** Credit and source fields shared by both speech types, shown under Dates & details. */
function creditFields() {
  return [
    { ...copy('author', 'Credited speaker or organization', false), group: 'details' },
    defineField({ name: 'authorKind', title: 'Credit type', type: 'string', group: 'details', options: { list: [{ title: 'Person', value: 'Person' }, { title: 'Organization', value: 'Organization' }] }, hidden: ({ document }) => !(document?.author as { en?: string } | undefined)?.en?.trim(), validation: rule => rule.custom((value, context) => !(context.document?.author as { en?: string } | undefined)?.en?.trim() || value === 'Person' || value === 'Organization' || 'Choose whether the credit is a person or organization.') }),
    defineField({ name: 'relatedLinks', title: 'Sources & related links (optional)', type: 'array', group: 'details', of: [defineArrayMember({ type: 'object', fields: [copy('label', 'Link label'), linkUrl('url', 'Web address', true)] })], validation: rule => rule.max(8) }),
  ]
}
const groups = [{ name: 'identity', title: 'Title & approval', default: true }, { name: 'content', title: 'Content' }, { name: 'details', title: 'Dates & details' }, { name: 'media', title: 'Images & video' }, { name: 'seo', title: 'SEO' }]
// Singular type titles name the document in the Create menu and form header; Studio lists keep their plural titles.
export const news = defineType({
  name: 'news', title: SPEECH_AUDIENCE.news.title, type: 'document', icon: Stethoscope, groups, initialValue: { reviewStatus: 'pendingReview' },
  components: { input: speechAudienceInput('news') },
  fields: [...fields('news'), publishedAtField(), ...creditFields()], orderings: speechOrderings, preview: speechPreview('news'),
})
/** Patient speeches use exactly the medical-speech form; only the stored type, category scope and audience banner differ. */
export const event = defineType({
  name: 'event', title: SPEECH_AUDIENCE.event.title, type: 'document', icon: HeartHandshake, groups, initialValue: { reviewStatus: 'pendingReview' },
  components: { input: speechAudienceInput('event') },
  fields: [...fields('event'), publishedAtField(), ...creditFields()], orderings: speechOrderings, preview: speechPreview('event'),
})
