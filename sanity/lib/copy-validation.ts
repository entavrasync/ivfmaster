import type { ValidationContext } from 'sanity'
import { isUnusedCtaSlot } from '../reference/schemaTypes/shared/cta-slots'

/** These fields reach plain text or next-intl messages; markup/variables are not editable slots. */
export function validatePlainCopy(value: unknown, context: ValidationContext) {
  if (value == null || typeof value !== 'string') return true // Native type validation handles malformed values.
  if (isUnusedCtaSlot(context.document, context.path)) return true
  if (context.document?._type === 'siteSettings' && ['contact', 'displayAddress', 'hoursSummary', 'holidays'].includes(String(context.path?.[0]))) return true
  if (context.document?._type === 'doctor' && context.path?.[0] === 'biography') return true // Its own rich-message validator checks supported tags.
  const copyright = context.document?._type === 'footer' && context.path?.[0] === 'copyright'
  const lineBreaks = context.document?._type === 'homePage' && context.path?.[0] === 'painCta' && ['body', 'microCopy'].includes(String(context.path?.[1])) && context.path?.at(-1) === 'mr'
  const copy = copyright ? value.replaceAll('{year}', '') : lineBreaks ? value.replaceAll('<br></br>', '') : value
  return !/[{}]|<\/?[A-Za-z]/.test(copy) || `Use plain text without HTML or message variables${copyright ? '; {year} is the only supported placeholder' : ''}.`
}
