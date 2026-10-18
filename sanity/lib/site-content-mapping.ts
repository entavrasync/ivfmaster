import { z } from 'zod'
import { createTranslator, type AbstractIntlMessages } from 'next-intl'
import { PROCEDURES } from '../../lib/procedures'
import { articleSlugs } from '../article-model'
import { createImageUrlBuilder } from '@sanity/image-url'
import { projectId, dataset } from '../project'
import type { StaticImageData } from 'next/image'
import { CONTACT_FIELDS } from '../reference/queries/contact'

const object = z.record(z.string(), z.unknown())
export function record(value: unknown): Record<string, unknown> | null {
  const result = object.safeParse(value)
  return result.success ? result.data : null
}
export function at(value: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((item, key) => Array.isArray(item) ? item[Number(key)] : record(item)?.[key], value)
}
export function plain(value: unknown): string | undefined {
  const parsed = z.string().trim().min(1).refine((text) => !/[{}]|<\/?[A-Za-z]/.test(text)).safeParse(value)
  return parsed.success ? parsed.data : undefined
}
const allowedRoutes = new Set(['/', '/about', '/team', '/contact', '/procedures', '/educate-ivf', '/team/gorakh-mandrupkar', '/team/saie-mandrupkar', ...PROCEDURES.map((item) => '/procedures/' + item.slug), ...articleSlugs.map((slug) => '/educate-ivf/' + slug)])
export type SiteMenuItem = { key: string; href: string; label: string }
export type SiteImage = { image: StaticImageData; alt: string; position?: string }
export type SiteChrome = { navigation: SiteMenuItem[] | null; footer: { heading: string; items: SiteMenuItem[] }[] | null; actions?: Record<string, string>; frames?: { desktop: StaticImageData; mobile: StaticImageData; alt: string }[]; hero?: { desktop: SiteImage | null; mobile: SiteImage | null }; procedures?: { id: string; label: string; description: string; href: string }[] }

const fraction = z.number().min(0).max(1)
const nativeImage = z.object({ assetId: z.string().regex(/^image-[A-Za-z0-9]+-\d+x\d+-(jpg|png|webp|avif)$/),
  url: z.url().refine((url) => url.startsWith(`https://cdn.sanity.io/images/${projectId}/${dataset}/`)),
  dimensions: z.object({ width: z.number().positive(), height: z.number().positive() }),
  alt: z.string().trim().min(1), lqip: z.string().regex(/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/).nullish(),
  crop: z.object({ left: fraction, right: fraction, top: fraction, bottom: fraction }).refine((crop) => crop.left + crop.right < 1 && crop.top + crop.bottom < 1).nullish(),
  hotspot: z.object({ x: fraction, y: fraction, width: fraction.positive(), height: fraction.positive() }).nullish(),
})
export function resolveSiteImage(input: unknown): SiteImage | null {
  const parsed = nativeImage.safeParse(input)
  if (!parsed.success) return null
  const image = parsed.data, crop = image.crop ?? { left: 0, right: 0, top: 0, bottom: 0 }
  try {
    return { image: { src: createImageUrlBuilder({ projectId, dataset }).image({ asset: { _ref: image.assetId }, crop: image.crop ?? undefined, hotspot: image.hotspot ?? undefined }).auto('format').url(),
      width: Math.max(1, Math.round(image.dimensions.width * (1 - crop.left - crop.right))), height: Math.max(1, Math.round(image.dimensions.height * (1 - crop.top - crop.bottom))), ...(image.lqip ? { blurDataURL: image.lqip } : {}) },
      alt: image.alt,
      position: image.hotspot ? `${Math.max(0, Math.min(100, (image.hotspot.x - crop.left) / (1 - crop.left - crop.right) * 100))}% ${Math.max(0, Math.min(100, (image.hotspot.y - crop.top) / (1 - crop.top - crop.bottom) * 100))}%` : undefined }
  } catch { return null }
}

function menuItems(input: unknown): SiteMenuItem[] | null {
  if (!Array.isArray(input) || input.length === 0 || input.length > 7) return null
  const items: SiteMenuItem[] = []
  for (const [index, value] of input.entries()) {
    const label = plain(at(value, 'label')), kind = at(value, 'link.kind')
    const path = kind === 'anchor' && at(value, 'link.anchor') === 'faq' ? '/#faq' : at(value, 'link.internalPath')
    if (!label || typeof path !== 'string' || ![...allowedRoutes, '/#faq'].includes(path) || !['internal', 'anchor'].includes(String(kind))) return null
    const key = ({ '/': 'home', '/educate-ivf': 'educateIVF', '/procedures': 'procedures', '/about': 'about', '/team': 'team', '/contact': 'contact' } as Record<string, string>)[path] ?? `cms-${index}`
    items.push({ key, href: path, label })
  }
  return new Set(items.map((item) => item.href)).size === items.length ? items : null
}
export function resolveSiteChrome(globals: unknown, home?: unknown, pages?: { procedures: unknown; team: unknown }): SiteChrome {
  const navigation = menuItems(at(globals, 'navigation.items'))
  const groups = at(globals, 'footer.linkGroups')
  const footer = Array.isArray(groups) && groups.length === 2 ? groups.map((group) => ({ heading: plain(at(group, 'heading')), items: menuItems(at(group, 'items')) })) : null
  const sourceFrames = at(home, 'costOfWaiting.frames')
  const frames = Array.isArray(sourceFrames) && sourceFrames.length === 7 ? sourceFrames.map((frame) => ({ desktop: resolveSiteImage(at(frame, 'desktop')), mobile: resolveSiteImage(at(frame, 'mobile')) })) : []
  const hero = { desktop: resolveSiteImage(at(home, 'hero.desktopImage')), mobile: resolveSiteImage(at(home, 'hero.mobileImage')) }
  const actions: Record<string, string> = {}
  const action = (slot: string, value: unknown) => { const path = at(value, 'link.internalPath'); if (at(value, 'link.kind') === 'internal' && typeof path === 'string' && allowedRoutes.has(path)) actions[slot] = path }
  for (const slot of ['hero.primaryCta', 'hero.secondaryCta', 'painCta.primary', 'whyTrust.closing.primary', 'costOfWaiting.closing.primary', 'understandingIvf.closing.primary', 'mythsFacts.closing.primary', 'finalCta.formCta']) action('home.' + slot, at(home, slot))
  action('nav.primary', at(globals, 'navigation.primaryCta'))
  action('procedures.closing', at(pages?.procedures, 'closing.primary'))
  action('team.closing', at(pages?.team, 'closing.primary'))
  return { navigation, footer: footer?.every((group) => group.heading && group.items) ? footer as NonNullable<SiteChrome['footer']> : null, actions,
    ...(frames.length === 7 && frames.every((frame) => frame.desktop && frame.mobile) ? { frames: frames.map((frame) => ({ desktop: frame.desktop!.image, mobile: frame.mobile!.image, alt: frame.desktop!.alt })) } : {}),
    ...(hero.desktop || hero.mobile ? { hero } : {}),
  }
}

type Sources = { home: unknown; about: unknown; team: unknown; procedures: unknown; globals: unknown; contact?: unknown }
/** Only known message paths are writable; layout, protected facts and operational strings stay intact. */
export function mergeSiteMessages(base: AbstractIntlMessages, source: Sources, locale: string): AbstractIntlMessages {
  const result = structuredClone(base)
  function assign(path: string, value: unknown) {
    const existing = at(base, path)
    if (typeof existing !== 'string' || typeof value !== 'string' || !value.trim()) return
    try {
      const tags = [...existing.matchAll(/<([A-Za-z][A-Za-z0-9]*)>/g)].map((match) => match[1])
      const variables = [...existing.matchAll(/\{([A-Za-z][A-Za-z0-9_]*)\}/g)].map((match) => match[1])
      if (/[{}]/.test(value.replace(/\{([A-Za-z][A-Za-z0-9_]*)\}/g, (_, name: string) => variables.includes(name) ? '' : '{invalid}')) || [...value.matchAll(/<\/?([A-Za-z][A-Za-z0-9]*)[^>]*>/g)].some((match) => !tags.includes(match[1]))) return
      const translator = createTranslator({ locale, messages: { value }, onError: (error) => { throw error } })
      if (tags.length) translator.rich('value', Object.fromEntries(tags.map((tag) => [tag, (chunks: unknown) => String(chunks)])))
      else if (variables.length) translator('value', Object.fromEntries(variables.map((variable) => [variable, 'value'])))
      else if (translator('value') !== value) return
      const keys = path.split('.'), leaf = keys.pop()!
      let target: Record<string, unknown> = result
      for (const key of keys) { const next = target[key]; if (!next || typeof next !== 'object') return; target = next as Record<string, unknown> }
      target[leaf] = value
    } catch { /* Malformed editorial copy retains the existing message. */ }
  }
  function copy(namespace: string, data: unknown, mapping: Record<string, string>) {
    for (const [target, from] of Object.entries(mapping)) assign(`${namespace}.${target}`, at(data, from))
  }
  const h = source.home
  copy('Meta', at(source.globals, 'settings'), { siteDescription: 'description' })
  copy('Meta', at(source.globals, 'settings.defaultSeo'), { siteTitle: 'metaTitle', siteDescription: 'metaDescription' })
  copy('Hero', at(h, 'hero'), { eyebrow: 'eyebrow', headline: 'headline', subheadline: 'subheadline', body: 'body', ctaPrimary: 'primaryCta.label', ctaSecondary: 'secondaryCta.label', ctaMicroTrust: 'microTrust' })
  copy('PainRecognition', at(h, 'painRecognition'), { eyebrow: 'eyebrow', headline: 'headline', body: 'body' })
  if (Array.isArray(at(h, 'painStory.chapters')) && (at(h, 'painStory.chapters') as unknown[]).length === 3) for (let i = 0; i < 3; i++) copy(`PainRecognitionStory.chapters.${i}`, at(h, `painStory.chapters.${i}`), { eyebrow: 'eyebrow', headline: 'headline', body: 'body' })
  copy('PainRecognitionCTA', at(h, 'painCta'), { eyebrow: 'eyebrow', heading: 'heading', body: 'body', button: 'primary.label', helperText: 'microCopy' })
  copy('WhyTrust', at(h, 'whyTrust'), { eyebrow: 'eyebrow', heading: 'heading', body: 'body', ctaButton: 'closing.primary.label', ctaSub: 'closing.microCopy' })
  assign('WhyTrust.gestosisNote', at(h, 'whyTrust.credentialNote'))
  const citation = at(h, 'whyTrust.credentialCitation')
  if (typeof at(citation, 'textBefore') === 'string' && typeof at(citation, 'textAfter') === 'string' && plain(at(citation, 'link.label'))) assign('WhyTrust.gestosisLink', `${at(citation, 'textBefore')}<link>${at(citation, 'link.label')}</link>${at(citation, 'textAfter')}`)
  if (Array.isArray(at(h, 'whyTrust.cards')) && (at(h, 'whyTrust.cards') as unknown[]).length === 3) for (let i = 0; i < 3; i++) copy(`WhyTrust.card${i}`, at(h, `whyTrust.cards.${i}`), { label: 'label', worry: 'worry', response: 'response' })
  copy('CostOfWaiting', at(h, 'costOfWaiting'), { eyebrow: 'eyebrow', closeBody: 'closing.body', ctaButton: 'closing.primary.label', ctaSub: 'closing.microCopy' })
  for (const [field, prefix, count] of [['narrativeLines', 'line', 5], ['hopeLines', 'hopeLine', 2]] as const) if (Array.isArray(at(h, `costOfWaiting.${field}`)) && (at(h, `costOfWaiting.${field}`) as unknown[]).length === count) for (let i = 0; i < count; i++) assign(`CostOfWaiting.${prefix}${i + 1}`, at(h, `costOfWaiting.${field}.${i}.text`))
  copy('UnderstandingIVF', at(h, 'understandingIvf'), { eyebrow: 'eyebrow', heading: 'heading', body: 'body', closeBody: 'closing.body', ctaButton: 'closing.primary.label', ctaSub: 'closing.microCopy' })
  const steps = at(h, 'understandingIvf.steps')
  if (Array.isArray(steps) && steps.length === 6) for (const step of steps) { const id = at(step, 'illustrationKey'); if (['stimulation', 'retrieval', 'fertilisation', 'culture', 'transfer', 'wait'].includes(String(id))) copy(`UnderstandingIVF.steps.${id}`, step, { heading: 'heading', body: 'body' }) }
  copy('MeetTheDoctors', at(h, 'meetTheDoctors'), { eyebrow: 'eyebrow', heading: 'heading', body: 'body', coupleNote: 'coupleNote' })
  const homeDoctors = at(h, 'meetTheDoctors.doctors')
  if (Array.isArray(homeDoctors)) for (const doctor of homeDoctors) {
    const slug = at(doctor, 'slug'), id = slug === 'gorakh-mandrupkar' ? 'gorakh' : slug === 'saie-mandrupkar' ? 'saie' : null
    if (!id) continue
    assign(`MeetTheDoctors.${id}Intro`, at(doctor, 'intro'))
    assign(`MeetTheDoctors.${id}Cta`, at(doctor, 'ctaLabel'))
    assign(`MeetTheDoctors.${id}Story`, at(doctor, 'storyLabel'))
    const credentials = at(doctor, 'credentials')
    if (Array.isArray(credentials) && credentials.length === (id === 'gorakh' ? 4 : 3)) for (let i = 0; i < credentials.length; i++) assign(`MeetTheDoctors.${id}Cred${i + 1}`, at(credentials[i], 'text'))
  }
  copy('MythsFacts', at(h, 'mythsFacts'), { eyebrow: 'eyebrow', heading: 'heading', body: 'body', closeBody: 'closing.body', ctaButton: 'closing.primary.label', ctaSub: 'closing.microCopy' })
  const myths = at(h, 'mythsFacts.items')
  if (Array.isArray(myths) && myths.length === 7) for (let i = 0; i < myths.length; i++) copy(`MythsFacts.faqs.q${i + 1}`, myths[i], { q: 'question', a: 'answer' })
  copy('FinalCTA', at(h, 'finalCta'), { eyebrow: 'intro.eyebrow', headline: 'intro.heading', body: 'intro.body', clinicLabel: 'contactLabels.clinic', hoursLabel: 'contactLabels.hours', reachLabel: 'contactLabels.reach', whatsappCta: 'whatsappCta.label', contactFormCta: 'formCta.label' })
  copy('Meta', at(h, 'seo'), { siteTitle: 'metaTitle', siteDescription: 'metaDescription' })
  copy('About', at(source.about, 'seo'), { metaTitle: 'metaTitle', metaDescription: 'metaDescription' })
  copy('Procedures', source.procedures, { hubEyebrow: 'hero.eyebrow', hubHeading: 'hero.heading', hubBody: 'hero.body', hubCloseText: 'closing.body', hubCtaButton: 'closing.primary.label', metaTitle: 'seo.metaTitle', metaDescription: 'seo.metaDescription' })
  copy('Team', source.team, { eyebrow: 'hero.eyebrow', headline: 'hero.headline', lead: 'hero.lead', doctorsEyebrow: 'doctorsSection.eyebrow', doctorsHeading: 'doctorsSection.heading', doctorsLead: 'doctorsSection.lead', coupleNote: 'doctorsSection.coupleNote', careTeamEyebrow: 'careTeamSection.eyebrow', careTeamHeading: 'careTeamSection.heading', careTeamLead: 'careTeamSection.lead', facilityEyebrow: 'facilitySection.eyebrow', facilityHeading: 'facilitySection.heading', facilityLead: 'facilitySection.lead', closingHeadline: 'closing.heading', closingCta: 'closing.primary.label', closingNote: 'closing.microCopy', metaTitle: 'seo.metaTitle', metaDescription: 'seo.metaDescription' })
  copy('Footer', at(source.globals, 'footer'), { tagline: 'tagline', byline: 'byline', colContact: 'contactHeading', colLanguage: 'languageHeading', copyright: 'copyright' })
  copy('Nav', at(source.globals, 'navigation'), { talkToExperts: 'primaryCta.label', openMenu: 'mobileMenuLabel' })
  for (const [section, keys] of Object.entries(CONTACT_FIELDS)) copy('Contact', at(source.contact, section), Object.fromEntries(keys.map((key: string) => [key, key])))
  return result
}

/** Merge the reference's About layout data into existing target props, preserving images, IDs and destinations. */
export function mergeAboutPage<T extends object>(base: T, input: unknown): T {
  function merge(original: unknown, incoming: unknown, key = ''): unknown {
    if (typeof original === 'string') return ['src', 'ctaHref', 'id', 'name', 'role', 'number'].includes(key) ? original : plain(incoming) ?? original
    if (Array.isArray(original)) {
      if (key === 'paragraphs' && Array.isArray(incoming) && incoming.length > 0 && incoming.length <= 10) {
        const rows = incoming.map((item) => plain(at(item, 'text') ?? item))
        return rows.every(Boolean) ? rows : original
      }
      if (!Array.isArray(incoming) || incoming.length !== original.length) return original
      return original.map((value, i) => merge(value, typeof value === 'string' ? at(incoming[i], 'text') ?? incoming[i] : incoming[i]))
    }
    const object = record(original), next = record(incoming)
    if (!object || !next) return original
    return Object.fromEntries(Object.entries(object).map(([name, value]) => [name, name === 'image' ? value : merge(value, next[name] ?? next[name === 'primaryCta' ? 'primaryCtaLabel' : name === 'secondaryCta' ? 'secondaryCtaLabel' : name], name)]))
  }
  return merge(base, input) as T
}

export function resolveHomePageFaq(home: unknown) {
  const section = at(home, 'mythsFacts')
  const selected = at(section, 'referencedItems')
  if (Array.isArray(selected) && selected.length && selected.some((item) => { const id = plain(at(item, '_id')); return !id || id.startsWith('drafts.') || id.startsWith('versions.') })) return null
  const items = Array.isArray(selected) && selected.length ? selected : at(section, 'items')
  const eyebrow = plain(at(section, 'eyebrow')), heading = plain(at(section, 'heading')), body = plain(at(section, 'body')), closeBody = plain(at(section, 'closing.body'))
  if (!eyebrow || !heading || !body || !closeBody || !Array.isArray(items) || !items.length || items.length > 20) return null
  const faqs = items.map((item, index) => ({ id: plain(at(item, '_key')) ?? plain(at(item, '_id')) ?? `page-faq-${index}`, q: plain(at(item, 'question')), a: plain(at(item, 'answer')) }))
  if (faqs.some((item) => !item.q || !item.a) || new Set(faqs.map((item) => item.id)).size !== faqs.length) return null
  return { eyebrow, heading, body, closeBody, faqs: faqs.map((item) => ({ id: item.id, q: item.q!, a: item.a! })) }
}
