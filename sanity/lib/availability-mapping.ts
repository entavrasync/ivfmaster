import { z } from 'zod'
import { availabilityDays, type ClinicAvailability } from '../../lib/clinic-availability'

const text = z.string().trim().min(1).max(500).refine(value => !/[<>]/.test(value), 'Use plain text.')
const time = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Use 24-hour HH:MM, for example 18:00.').nullish()
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(value => {
  const parsed = new Date(value + 'T00:00:00Z')
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value
}, 'Use a real calendar date.')
const content = z.object({
  timezone: z.literal('Asia/Kolkata'),
  weeklyHours: z.array(z.object({ day: z.enum(availabilityDays), closed: z.boolean(), open: time, close: time })).length(7),
  closures: z.array(z.object({ date, reason: text.refine(value => value.length <= 160, 'Keep the public closure name within 160 characters.') })).nullish().transform(rows => rows ?? []),
  confirmationNote: text,
})
function contentRules(value: z.infer<typeof content>, context: z.RefinementCtx) {
  const issue = (path: (string | number)[], message: string) => context.addIssue({ code: 'custom', path, message })
  if (new Set(value.weeklyHours.map(row => row.day)).size !== 7) issue(['weeklyHours'], 'Include each weekday exactly once.')
  if (value.weeklyHours.every(row => row.closed)) issue(['weeklyHours'], 'Keep at least one regular open day; use dated closures for temporary shutdowns.')
  value.weeklyHours.forEach((row, index) => {
    if (!row.closed && (!row.open || !row.close || row.close <= row.open)) issue(['weeklyHours', index], 'An open day needs valid opening/closing times; closing must be later on the same day.')
  })
  if (new Set(value.closures.map(row => row.date)).size !== value.closures.length) issue(['closures'], 'A closure date can appear only once.')
}
export const availabilityContent = content.superRefine(contentRules)

/** Exact normalized snapshot, rather than a collision-prone custom hash. */
export function availabilitySnapshot(input: unknown): string | null {
  const parsed = availabilityContent.safeParse(input)
  if (!parsed.success) return null
  return JSON.stringify({
    timezone: parsed.data.timezone,
    weeklyHours: availabilityDays.map(day => {
      const row = parsed.data.weeklyHours.find(value => value.day === day)!
      return { day, closed: row.closed, open: row.closed ? null : row.open, close: row.closed ? null : row.close }
    }),
    closures: [...parsed.data.closures].sort((a, b) => a.date.localeCompare(b.date)),
    confirmationNote: parsed.data.confirmationNote,
  })
}
export const availabilityDocument = content.extend({
  _id: z.literal('clinicAvailability'),
  confirmedAt: z.string().datetime(),
  confirmedSnapshot: z.string().min(1),
}).superRefine(contentRules).superRefine((value, context) => {
  if (availabilitySnapshot(value) !== value.confirmedSnapshot) context.addIssue({ code: 'custom', path: ['confirmedSnapshot'], message: 'Hours changed after confirmation. Ask the clinic to review them and record confirmation again.' })
})

export function resolveAvailability(input: unknown, requireApproval = false): { value: ClinicAvailability | null; status: string } {
  if (!Array.isArray(input)) return { value: null, status: 'invalid' }
  if (!input.length) return { value: null, status: 'missing' }
  if (input.length !== 1) return { value: null, status: 'ambiguous' }
  const parsed = availabilityDocument.safeParse(input[0])
  if (!parsed.success || requireApproval && input[0].reviewStatus !== 'approved') return { value: null, status: 'invalid' }
  return { status: 'sanity', value: {
    timezone: parsed.data.timezone,
    weeklyHours: availabilityDays.map(day => {
      const row = parsed.data.weeklyHours.find(value => value.day === day)!
      return { day, open: row.closed ? null : row.open!, close: row.closed ? null : row.close! }
    }),
    holidays: parsed.data.closures.map(row => ({ date: row.date, name: row.reason })),
  } }
}
