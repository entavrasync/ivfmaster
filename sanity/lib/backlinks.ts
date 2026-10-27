import { z } from 'zod'

const siteHostname = (value: string) => new URL(value).hostname.toLowerCase().replace(/^www\./, '').replace(/\.$/, '')

export function backlinkUrlProblem(value: unknown, siteUrl: string): string | undefined {
  if (typeof value !== 'string' || !value.trim()) return 'Enter the external page address, or remove this backlink.'
  if (!/^https?:\/\//i.test(value) || /[\s\\\u0000-\u001f\u007f]/.test(value)) return 'Use a full address starting with http:// or https://, without spaces.'
  try {
    const url = new URL(value)
    if (!url.hostname || url.username || url.password) return 'Use a website address without a username or password.'
    if (siteHostname(url.href) === siteHostname(siteUrl)) return 'Enter a page on another website that links to this page.'
  } catch { return 'Enter a valid external website address.' }
}

export const normalizedBacklinkUrl = (value: string): string => new URL(value).href

export function backlinkIssues(value: unknown, siteUrl: string): { message: string; path: (number | string | { _key: string })[] }[] {
  if (value == null) return []
  if (!Array.isArray(value)) return [{ message: 'Use Add backlink to enter website addresses.', path: [] }]
  const seen = new Set<string>()
  return value.flatMap((entry, index) => {
    const key = entry && typeof entry === 'object' && typeof entry._key === 'string' ? entry._key : undefined
    const path = [key && value.filter(item => item?._key === key).length === 1 ? { _key: key } : index, 'url']
    const problem = backlinkUrlProblem(entry?.url, siteUrl)
    if (problem) return [{ message: problem, path }]
    const url = normalizedBacklinkUrl(entry.url)
    if (seen.has(url)) return [{ message: 'This backlink is already listed. Keep each external page once.', path }]
    seen.add(url)
    return []
  })
}

export type Backlink = { readonly key: string; readonly url: string; readonly label: string }

/** Invalid entries cannot erase valid sibling links or unrelated page metadata. */
export function resolveBacklinks(value: unknown, siteUrl: string): readonly Backlink[] {
  if (value == null) return []
  const entrySchema = z.object({ _key: z.string().trim().min(1), url: z.string().refine(url => !backlinkUrlProblem(url, siteUrl)) })
  const seen = new Set<string>(), keys = new Set<string>()
  const entries: { key: string; url: string }[] = []
  let invalid = !Array.isArray(value)
  if (Array.isArray(value)) for (const raw of value) {
    const parsed = entrySchema.safeParse(raw)
    if (!parsed.success) { invalid = true; continue }
    const url = normalizedBacklinkUrl(parsed.data.url)
    if (seen.has(url) || keys.has(parsed.data._key)) { invalid = true; continue }
    seen.add(url); keys.add(parsed.data._key)
    entries.push({ key: parsed.data._key, url })
  }
  if (invalid) console.error('[backlinks] Invalid or repeated backlink references were omitted.')
  return entries.map(entry => {
    const url = new URL(entry.url), host = url.hostname.replace(/^www\./, '')
    const repeatedHost = entries.filter(other => new URL(other.url).hostname === url.hostname).length > 1
    const path = url.pathname === '/' ? '' : url.pathname
    return { ...entry, label: host + (repeatedHost ? path + url.search + url.hash : '') }
  })
}
