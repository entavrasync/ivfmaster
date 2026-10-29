import { defineField, defineType, type Path } from 'sanity'

import { isUnusedAction } from './cta'
import { isUnusedCtaSlot } from '../shared/cta-slots'
import { isSiteMenuPath } from '../../../lib/site-content-mapping'

/** The object two levels above a link field — its call to action, when it has one. */
function enclosingObject(document: unknown, path: Path | undefined): unknown {
  let node = document
  for (const segment of path?.slice(0, -2) ?? []) {
    if (!node || typeof node !== 'object') return undefined
    node = typeof segment === 'object' && segment && '_key' in segment
      ? (node as { _key?: string }[]).find?.((item) => item?._key === segment._key)
      : (node as Record<string | number, unknown>)[segment as string | number]
  }
  return node
}

/** Hidden destinations may retain old values when a header becomes a dropdown. */
function isDropdownOnlyDestination(document: { _type?: string } | undefined, path: Path | undefined): boolean {
  if (document?._type !== 'navigation' || path?.[0] !== 'items' || path[2] !== 'link') return false
  const item = enclosingObject(document, path)
  return !!item && typeof item === 'object' && 'behavior' in item && item.behavior === 'dropdown'
}

/**
 * A destination, expressed as intent rather than as a raw href.
 *
 * Editors choose *what kind* of destination this is; the application resolves
 * it to an actual URL. That indirection matters here for three reasons:
 *
 *   - Locale prefixes are applied by next-intl at render time, so an editor
 *     must never type `/en/contact` — they type `/contact` and both languages
 *     work.
 *   - The clinic's phone, WhatsApp and email live in one place. A `whatsapp`
 *     link carries no number; the number comes from site settings, so changing
 *     it once changes every link. This is what kills the five duplicated
 *     copies of the contact details that exist in the code today.
 *   - Free-text hrefs rot. A typo becomes a 404 that nobody notices.
 *
 * Phase 2 adds an `internalRef` reference field alongside `internalPath`, once
 * page documents exist to point at; a reference survives a slug change, which
 * a path does not. `internalPath` is the honest option while there is nothing
 * to reference.
 */
export const LINK_KINDS = [
  { title: 'Page on this site', value: 'internal' },
  { title: 'External website', value: 'external' },
  { title: 'WhatsApp (clinic number)', value: 'whatsapp' },
  { title: 'Phone call (clinic number)', value: 'phone' },
  { title: 'Email (clinic address)', value: 'email' },
  { title: 'Section on the same page', value: 'anchor' },
] as const

export type LinkKind = (typeof LINK_KINDS)[number]['value']

const showWhen =
  (kind: LinkKind) =>
  ({ parent }: { parent?: { kind?: string } }) =>
    parent?.kind !== kind

export const link = defineType({
  name: 'link',
  title: 'Link',
  type: 'object',
  fields: [
    defineField({
      name: 'kind',
      title: 'Destination type',
      type: 'string',
      options: { list: [...LINK_KINDS], layout: 'radio' },
      initialValue: 'internal',
      validation: rule => rule.custom((value, context) => isDropdownOnlyDestination(context.document, context.path) || isUnusedCtaSlot(context.document, context.path) || (context.document?._type === 'footer'
        ? ['internal', 'external', 'anchor'].includes(String(value)) || 'Choose Page on this site, External website, or the Home FAQ section.'
        : LINK_KINDS.some(kind => kind.value === value) || 'Choose a destination type.')),
    }),
    defineField({
      name: 'internalPath',
      title: 'Path',
      type: 'string',
      description:
        'Start with "/" — for example "/contact" or "/procedures/ivf". Do not include a language prefix; it is added automatically.',
      hidden: showWhen('internal'),
      validation: (rule) =>
        rule.custom((value, context) => {
          if (isDropdownOnlyDestination(context.document, context.path) || isUnusedCtaSlot(context.document, context.path)) return true
          const kind = (context.parent as { kind?: string } | undefined)?.kind
          if (kind !== 'internal') return true
          if (typeof value !== 'string' || value.trim().length === 0) {
            const action = enclosingObject(context.document, context.path)
            if ((action as { _type?: string } | undefined)?._type === 'cta' && isUnusedAction(action)) return true
            return 'Enter the path this link should open.'
          }
          if (!value.startsWith('/')) return 'The path must start with "/".'
          if (/^\/(mr|en)(\/|$)/.test(value)) {
            return 'Leave the language prefix out — write "/about", not "/en/about". The locale is added for you.'
          }
          if (context.document?._type === 'footer' && !isSiteMenuPath(value)) {
            return `No page exists at "${value}". Enter an existing page path, choose External website, or remove this link.`
          }
          return true
        }),
    }),
    defineField({
      name: 'externalUrl',
      title: 'Web address',
      // The url primitive always validates hidden stale values after switching kind.
      type: 'string',
      hidden: showWhen('external'),
      validation: rule => rule.custom((value, validationContext) => {
          if (isDropdownOnlyDestination(validationContext.document, validationContext.path) || isUnusedCtaSlot(validationContext.document, validationContext.path)) return true
          if ((validationContext.parent as { kind?: string } | undefined)?.kind !== 'external') return true
          if (!value) return 'Paste the full website address, for example https://example.com/privacy.'
          try {
            const url = new URL(value)
            if (/^https?:\/\//.test(value) && url.hostname) return true
          } catch { /* The message below explains how to repair the URL. */ }
          return 'Use a full website address starting with https:// or http://.'
        }),
    }),
    defineField({
      name: 'anchor',
      title: 'Section id',
      type: 'string',
      description: 'The id of a section on the same page, without the "#".',
      hidden: showWhen('anchor'),
      validation: (rule) =>
        rule.custom((value, context) => {
          if (isDropdownOnlyDestination(context.document, context.path) || isUnusedCtaSlot(context.document, context.path)) return true
          const kind = (context.parent as { kind?: string } | undefined)?.kind
          if (kind !== 'anchor') return true
          if (context.document?._type === 'footer') return value === 'faq' || 'Enter faq to link to the FAQ section on the Home page.'
          if (typeof value !== 'string' || value.trim().length === 0) {
            return 'Enter the id of the section to scroll to.'
          }
          return /^[a-z0-9-]+$/.test(value)
            ? true
            : 'Use lowercase letters, numbers and hyphens only.'
        }),
    }),
    defineField({
      name: 'opensInNewTab',
      title: 'Open in a new tab',
      type: 'boolean',
      initialValue: false,
      hidden: showWhen('external'),
    }),
  ],
  preview: {
    select: { kind: 'kind', internalPath: 'internalPath', externalUrl: 'externalUrl', anchor: 'anchor' },
    prepare({ kind, internalPath, externalUrl, anchor }) {
      const label = LINK_KINDS.find((entry) => entry.value === kind)?.title ?? 'Link'
      const target =
        kind === 'internal'
          ? internalPath
          : kind === 'external'
            ? externalUrl
            : kind === 'anchor'
              ? `#${anchor ?? ''}`
              : 'From site settings'
      return { title: label, subtitle: target || undefined }
    },
  },
})
