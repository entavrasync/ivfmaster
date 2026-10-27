import { z } from 'zod'
import type { Locale } from '../../i18n/routing'
import initialContent from '../reference/initial-content.json' with { type: 'json' }

export const teamValueIcons = ['heart', 'users', 'award'] as const
const plain = (max: number) => z.string().max(max).refine(value => !/<\/?[A-Za-z][^>]*>/.test(value))
const copy = (max: number, required = false) => z.preprocess(value => value == null ? {} : value, z.object({
  en: required ? plain(max).refine(value => !!value.trim()) : plain(max).nullish(), mr: plain(max).nullish(),
}))
export const teamValuesContent = z.object({
  eyebrow: copy(180), heading: copy(180), subheading: copy(800),
  cards: z.array(z.object({ _key: z.string().min(1).max(200), title: copy(180, true), description: copy(4000, true), icon: z.enum(teamValueIcons) })).max(20).nullish().transform(value => value ?? []),
}).superRefine((value, context) => {
  if (value.cards.length && !value.heading.en?.trim()) context.addIssue({ code: 'custom', path: ['heading', 'en'], message: 'Add an English heading before publishing cards.' })
  const keys = new Set<string>()
  value.cards.forEach((card, index) => {
    if (keys.has(card._key)) context.addIssue({ code: 'custom', path: ['cards', index], message: 'This card has a duplicate identity. Remove it and add it again.' })
    keys.add(card._key)
  })
})
export const teamValuesQuery = `*[_id == "teamValues" && _type == "teamValues" && reviewStatus == "approved" && !(_id in path("drafts.**")) && !(_id in path("versions.**"))][0...2]{_id,_type,reviewStatus,eyebrow,heading,subheading,cards[]{_key,title,description,icon}}`
const document = z.object({ _id: z.literal('teamValues'), _type: z.literal('teamValues'), reviewStatus: z.literal('approved') }).passthrough()
export function resolveTeamValues(input: unknown, locale: Locale) {
  const records = z.array(document).max(1).safeParse(input)
  if (!records.success) return { value: null, status: 'invalid' } as const
  if (!records.data.length) return { value: null, status: 'missing' } as const
  const parsed = teamValuesContent.safeParse(records.data[0])
  if (!parsed.success) return { value: null, status: 'invalid' } as const
  const localize = (value: { en?: string | null; mr?: string | null }) => (locale === 'mr' && value.mr?.trim() ? value.mr : value.en) ?? ''
  return { status: 'sanity', value: { eyebrow: localize(parsed.data.eyebrow), heading: localize(parsed.data.heading), subheading: localize(parsed.data.subheading), cards: parsed.data.cards.map(card => ({ _key: card._key, title: localize(card.title), description: localize(card.description), icon: card.icon })) } } as const
}
export type TeamValues = NonNullable<ReturnType<typeof resolveTeamValues>['value']>

export function teamValuesErrors(value: unknown) {
  const result = teamValuesContent.safeParse(value)
  if (result.success) return true
  // Cross-field readiness must remain visible even while another card is incomplete.
  const errors = result.error.issues.filter(issue => issue.message !== 'Add an English heading before publishing cards.').map(issue => {
    let current = value
    const path = issue.path.map(segment => {
      if (typeof segment === 'number' && Array.isArray(current)) {
        current = current[segment]
        if (current && typeof current === 'object' && '_key' in current && typeof current._key === 'string') return { _key: current._key }
      } else current = current && typeof current === 'object' ? Reflect.get(current, segment) : undefined
      return typeof segment === 'symbol' ? String(segment) : segment
    })
    const field = issue.path.findLast(segment => !['en', 'mr'].includes(String(segment)))
    const message = issue.code === 'custom' && /duplicate identity|Add an English heading/.test(issue.message) ? issue.message
      : field === 'icon' ? 'Choose Heart, Users or Award.'
      : field === 'title' ? 'Enter the card title in English, up to 180 characters. Marathi is optional. Use plain text.'
      : field === 'description' ? 'Enter the card description in English, up to 4,000 characters. Marathi is optional. Use plain text.'
      : field === '_key' ? 'Remove this incomplete card and add it again.'
      : field === 'eyebrow' ? 'Use plain text up to 180 characters, or leave this empty.'
      : field === 'heading' ? 'Use a plain-text heading up to 180 characters. English is required when cards exist.'
      : field === 'subheading' ? 'Use plain text up to 800 characters, or leave this empty.'
      : 'Keep up to 20 cards. Complete each card, or remove it.'
    if (field === '_key') path.pop()
    return { message, paths: [path] }
  })
  if (value && typeof value === 'object') {
    const cards = Reflect.get(value, 'cards'), heading = Reflect.get(value, 'heading')
    const english = heading && typeof heading === 'object' ? Reflect.get(heading, 'en') : undefined
    if (Array.isArray(cards) && cards.length && (english == null || typeof english === 'string' && !english.trim())) errors.push({ message: 'Add an English heading before publishing cards.', paths: [['heading', 'en']] })
  }
  return errors
}

const sourceTrust = z.object({ eyebrow: copy(180), title: copy(180), intro: copy(800), points: z.array(z.object({ _key: z.string().min(1), title: copy(180, true), body: copy(4000, true) })).max(20).nullish() })
const sources = z.array(z.object({ _id: z.string(), _type: z.string(), trust: sourceTrust.nullish() }))
export function teamValuesFromTrust(trust: unknown) {
  const parsed = sourceTrust.parse(trust)
  return { eyebrow: parsed.eyebrow, heading: parsed.title, subheading: parsed.intro, cards: (parsed.points ?? []).map(point => ({ _type: 'teamValueCard', _key: point._key, title: point.title, description: point.body, icon: 'heart' as const })), reviewStatus: 'pendingReview' }
}
export async function initialTeamValues(client: { fetch: (query: string) => Promise<unknown> }) {
  // A read failure must stop initialization, rather than replacing saved source edits.
  const result = sources.safeParse(await client.fetch('*[_id in ["drafts.teamValues","teamValues","drafts.aboutPage","aboutPage"]]{_id,_type,trust}'))
  if (!result.success) throw new Error('Could not read the saved About page. Check your connection and reopen Team Values.')
  if (result.data.some(doc => ['teamValues', 'drafts.teamValues'].includes(doc._id))) return {}
  const source = result.data.find(doc => doc._id === 'drafts.aboutPage' && doc._type === 'aboutPage') ?? result.data.find(doc => doc._id === 'aboutPage' && doc._type === 'aboutPage')
  return teamValuesFromTrust(source ? source.trust ?? {} : initialContent.singletons.aboutPage.trust)
}
