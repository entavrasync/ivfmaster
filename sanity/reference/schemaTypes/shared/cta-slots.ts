import type { Path } from 'sanity'

// These layouts render specific parts of the shared object, not every CTA slot.
const slots: Record<string, readonly string[]> = {
  'homePage.painCta': ['eyebrow', 'heading', 'body', 'primary', 'microCopy'],
  'homePage.whyTrust.closing': ['primary', 'microCopy'],
  'homePage.costOfWaiting.closing': ['body', 'primary', 'microCopy'],
  'homePage.understandingIvf.closing': ['body', 'primary', 'microCopy'],
  'homePage.mythsFacts.closing': ['body', 'primary', 'microCopy'],
  'homePage.finalCta.intro': ['eyebrow', 'heading', 'body'],
  'teamPage.closing': ['heading', 'primary', 'microCopy'],
  'proceduresPage.closing': ['body', 'primary'],
}

export function isUnusedCtaSlot(document: { _type?: unknown } | undefined, path: Path = []): boolean {
  const key = [document?._type, ...path.filter(segment => typeof segment === 'string')].join('.')
  const slot = Object.entries(slots).find(([parent]) => key.startsWith(parent + '.'))
  return slot ? !slot[1].includes(key.slice(slot[0].length + 1).split('.')[0]) : false
}
