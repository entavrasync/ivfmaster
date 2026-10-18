/**
 * Editorial SEO checks shown in the Studio. Pure functions so they can be unit
 * tested; every result is guidance only and never blocks publishing.
 */

export const SEO_TITLE_RANGE = { min: 30, max: 60 } as const
export const SEO_DESCRIPTION_RANGE = { min: 120, max: 160 } as const

export type SeoCheckInput = {
  readonly keyword?: string
  readonly title: string
  readonly description: string
  readonly slug?: string
  readonly body?: string
}

export type SeoCheck = { readonly id: string; readonly status: 'good' | 'improve'; readonly message: string }

const normalize = (value: string) => value.toLocaleLowerCase('en-IN').normalize('NFC').replace(/\s+/g, ' ').trim()
const slugify = (value: string) => normalize(value).replace(/[^a-z0-9ऀ-ॿ]+/g, '-').replace(/^-+|-+$/g, '')
/** Grapheme count, so Devanagari combining marks are not double-counted. */
export function textLength(value: string): number {
  return [...new Intl.Segmenter('en', { granularity: 'grapheme' }).segment(value)].length
}

function lengthCheck(id: string, label: string, value: string, range: { min: number; max: number }): SeoCheck {
  const length = textLength(value.trim())
  if (length === 0) return { id, status: 'improve', message: `${label} is empty; the website will use its default.` }
  if (length < range.min) return { id, status: 'improve', message: `${label} is ${length} characters; aim for ${range.min}–${range.max}.` }
  if (length > range.max) return { id, status: 'improve', message: `${label} is ${length} characters; Google may cut it after about ${range.max}.` }
  return { id, status: 'good', message: `${label} length is good (${length} characters).` }
}

export function runSeoChecks({ keyword, title, description, slug, body }: SeoCheckInput): SeoCheck[] {
  const checks: SeoCheck[] = [
    lengthCheck('title-length', 'Search title', title, SEO_TITLE_RANGE),
    lengthCheck('description-length', 'Search description', description, SEO_DESCRIPTION_RANGE),
  ]
  const phrase = keyword ? normalize(keyword) : ''
  if (!phrase) {
    return [{ id: 'keyword', status: 'improve', message: 'Add a focus keyword to get keyword checks.' }, ...checks]
  }
  const has = (text: string | undefined) => Boolean(text) && normalize(text!).includes(phrase)
  const firstParagraph = (body ?? '').trim().split(/\n\s*\n/)[0] ?? ''
  checks.unshift(
    has(title)
      ? { id: 'keyword-title', status: 'good', message: 'Focus keyword is in the search title.' }
      : { id: 'keyword-title', status: 'improve', message: 'Add the focus keyword to the search title, ideally near the start.' },
    has(description)
      ? { id: 'keyword-description', status: 'good', message: 'Focus keyword is in the search description.' }
      : { id: 'keyword-description', status: 'improve', message: 'Use the focus keyword in the search description.' },
  )
  if (slug !== undefined) {
    checks.push(slug && slugify(slug).includes(slugify(phrase))
      ? { id: 'keyword-url', status: 'good', message: 'Focus keyword appears in the page URL.' }
      : { id: 'keyword-url', status: 'improve', message: 'The page URL does not contain the focus keyword. Do not rename a published URL just for this.' })
  }
  if (body !== undefined) {
    checks.push(has(firstParagraph)
      ? { id: 'keyword-intro', status: 'good', message: 'Focus keyword appears in the opening text.' }
      : { id: 'keyword-intro', status: 'improve', message: 'Mention the focus keyword in the opening paragraph.' })
  }
  return checks
}

/** Shortens text the way a search result would, for the preview. */
export function truncateForPreview(value: string, max: number): string {
  const graphemes = [...new Intl.Segmenter('en', { granularity: 'grapheme' }).segment(value.trim())].map((part) => part.segment)
  return graphemes.length <= max ? graphemes.join('') : `${graphemes.slice(0, max - 1).join('').trimEnd()}…`
}
