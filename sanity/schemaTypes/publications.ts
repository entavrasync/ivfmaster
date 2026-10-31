import { CalendarDays, Newspaper, Tags } from 'lucide-react'
import { defineArrayMember, defineField, defineType, getPublishedId } from 'sanity'
import { approvalField } from './editorial-fields'
import { publicationSlug, eventTimezone, safeWebUrl } from '../lib/publication-model'
import { parsePublicationMedia } from '../lib/publication-media'
import { apiVersion } from '../project'
import { OptionalImageInput } from '../reference/schemaTypes/shared/fields'
import { validateWebsiteImage } from '../lib/image-validation'
import { SEO_FIELDSETS, seoAdvancedFields } from '../reference/schemaTypes/objects/seo'

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
  name: 'publicationCategory', title: 'News & event category', type: 'document', icon: Tags,
  fields: [copy('title', 'Category name'), slugField('publicationCategory'), defineField({ name: 'scope', title: 'Use for', type: 'string', options: { list: [{ title: 'News', value: 'news' }, { title: 'Events', value: 'event' }], layout: 'radio' }, validation: rule => rule.required() })],
  preview: { select: { title: 'title.en', subtitle: 'scope' } },
})
function fields(type: 'news' | 'event') {
  return [
    { ...approvalField, group: 'identity' },
    { ...copy('title', 'Title'), group: 'identity' },
    { ...slugField(type), group: 'identity' },
    defineField({ name: 'category', title: 'Category', type: 'reference', to: [{ type: 'publicationCategory' }], options: { filter: 'scope == $scope', filterParams: { scope: type } }, group: 'identity', description: 'Create and publish a category first. Delete is protected while this content references it; clear the reference to remove the category.', validation: rule => rule.required().custom(async (value, context) => {
      if (!value?._ref) return true
      try { return await context.getClient({ apiVersion }).withConfig({ perspective: 'published' }).fetch<boolean>('count(*[_id == $id && _type == "publicationCategory" && scope == $scope]) == 1', { id: value._ref, scope: type }) || 'Choose a published category for this content type.' } catch { return 'Could not verify the category. Check your connection.' }
    }) }),
    defineField({ name: 'featured', title: 'Featured', type: 'boolean', initialValue: false, group: 'identity', description: 'The most recent featured item leads the page; additional featured items remain in the archive.' }),
    { ...copy('summary', type === 'news' ? 'Summary' : 'Short event description', true, true), group: 'content' },
    defineField({ name: 'body', title: type === 'news' ? 'Story' : 'Event description', type: 'publicationRichText', group: 'content', validation: rule => rule.required() }),
    defineField({ name: 'coverImage', title: type === 'news' ? 'Cover image (optional)' : 'Poster or cover image (optional)', type: 'publicationImage', group: 'media' }),
    defineField({ name: 'media', title: 'Video & social posts', type: 'array', of: [defineArrayMember({ type: 'publicationMedia' })], group: 'media', validation: rule => rule.max(8) }),
    defineField({ name: 'seo', title: 'Search & social sharing', type: 'object', group: 'seo', fieldsets: SEO_FIELDSETS, description: 'Optional. Empty fields use the title, summary and cover.', fields: [copy('metaTitle', 'SEO title', false), copy('metaDescription', 'SEO description', false, true), ...seoAdvancedFields()] }),
  ]
}
const groups = [{ name: 'identity', title: 'Title & approval', default: true }, { name: 'content', title: 'Content' }, { name: 'details', title: 'Dates & details' }, { name: 'media', title: 'Images & video' }, { name: 'seo', title: 'SEO' }]
export const news = defineType({
  name: 'news', title: 'News', type: 'document', icon: Newspaper, groups, initialValue: { reviewStatus: 'pendingReview' },
  fields: [...fields('news'),
    defineField({ name: 'publishedAt', title: 'Publication date & time', type: 'datetime', group: 'details', description: 'For published news, use the actual publication time. Future-dated stories stay out of the public listing until this time.', validation: rule => rule.required() }),
    { ...copy('author', 'Credited author or organization', false), group: 'details' },
    defineField({ name: 'authorKind', title: 'Credit type', type: 'string', group: 'details', options: { list: [{ title: 'Person', value: 'Person' }, { title: 'Organization', value: 'Organization' }] }, hidden: ({ document }) => !(document?.author as { en?: string } | undefined)?.en?.trim(), validation: rule => rule.custom((value, context) => !(context.document?.author as { en?: string } | undefined)?.en?.trim() || value === 'Person' || value === 'Organization' || 'Choose whether the credited author is a person or organization.') }),
    defineField({ name: 'relatedLinks', title: 'Sources & related links (optional)', type: 'array', group: 'details', of: [defineArrayMember({ type: 'object', fields: [copy('label', 'Link label'), linkUrl('url', 'Web address', true)] })], validation: rule => rule.max(8) }),
  ], preview: { select: { title: 'title.en', subtitle: 'publishedAt', media: 'coverImage' } },
})
export const event = defineType({
  name: 'event', title: 'Events', type: 'document', icon: CalendarDays, groups,
  initialValue: { reviewStatus: 'pendingReview', status: 'scheduled', timezone: 'Asia/Kolkata', attendanceMode: 'inPerson' },
  fields: [...fields('event'),
    defineField({ name: 'startAt', title: 'Start date & time', type: 'datetime', group: 'details', description: 'The date picker shows its selected timezone. Stored instants are absolute; choose the matching event timezone below.', validation: rule => rule.required() }),
    defineField({ name: 'endAt', title: 'End date & time', type: 'datetime', group: 'details', validation: rule => rule.required().custom((value, context) => !value || typeof context.document?.startAt !== 'string' || Date.parse(value) > Date.parse(context.document.startAt) || 'End time must be after start time.') }),
    defineField({ name: 'timezone', title: 'Event timezone', type: 'string', group: 'details', description: 'Used for website dates. India: Asia/Kolkata. For overseas events, enter the venue’s IANA timezone.', validation: rule => rule.required().custom(value => !value || eventTimezone.safeParse(value).success || 'Enter an IANA timezone, for example Asia/Kolkata.') }),
    defineField({ name: 'status', title: 'Event status', type: 'string', group: 'details', options: { list: [{ title: 'Scheduled', value: 'scheduled' }, { title: 'Held', value: 'held' }, { title: 'Cancelled', value: 'cancelled' }, { title: 'Postponed — new date pending', value: 'postponed' }] }, description: 'Past dates automatically move scheduled events to Past. Postponed keeps the original dates visible and disables registration. When new dates are confirmed, update both dates and restore Scheduled.', validation: rule => rule.required() }),
    defineField({ name: 'attendanceMode', title: 'How to attend', type: 'string', group: 'details', options: { list: [{ title: 'At a venue', value: 'inPerson' }, { title: 'Online', value: 'online' }, { title: 'Venue and online', value: 'hybrid' }] }, validation: rule => rule.required() }),
    { ...copy('venue', 'Venue name and address', false, true), group: 'details', validation: (rule: import('sanity').Rule) => rule.custom((value, context) => context.document?.attendanceMode === 'online' || !!(value as { en?: string } | undefined)?.en?.trim() || 'Enter the venue name and full address in English.') },
    { ...linkUrl('onlineUrl', 'Online event destination'), group: 'details', validation: (rule: import('sanity').Rule) => rule.custom((value, context) => context.document?.attendanceMode === 'inPerson' && !value || safeWebUrl.safeParse(value).success || 'Enter the HTTPS destination for attending online.') },
    { ...linkUrl('registrationUrl', 'Registration link (optional)'), group: 'details' },
    defineField({ name: 'recap', title: 'Event recap (optional)', type: 'publicationRichText', group: 'content', description: 'Displayed after the event is held or its end time passes.' }),
    defineField({ name: 'gallery', title: 'Event gallery (optional)', type: 'array', group: 'media', of: [defineArrayMember({ type: 'publicationImage' })], validation: rule => rule.max(20) }),
    defineField({ name: 'recordingUrl', title: 'Recording (optional YouTube or Instagram link)', type: 'url', group: 'media', validation: rule => rule.custom(value => !value || !!parsePublicationMedia(value) || 'Use a supported YouTube or Instagram URL.') }),
  ], preview: { select: { title: 'title.en', subtitle: 'status', media: 'coverImage' } },
})
