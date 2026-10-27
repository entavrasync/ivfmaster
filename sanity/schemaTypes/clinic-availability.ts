import { defineArrayMember, defineField, defineType, getPublishedId } from 'sanity'
import { defaultAvailability } from '../../lib/clinicHours'
import { availabilityContent, availabilityDocument } from '../lib/availability-mapping'
import { approvalField } from './editorial-fields'
import { HoursConfirmationInput } from '../studio/RecordHoursConfirmationAction'

const days = [
  ['mon', 'Monday'], ['tue', 'Tuesday'], ['wed', 'Wednesday'], ['thu', 'Thursday'],
  ['fri', 'Friday'], ['sat', 'Saturday'], ['sun', 'Sunday'],
]
export const clinicAvailability = defineType({
  name: 'clinicAvailability', title: 'Clinic hours & availability', type: 'document',
  components: { input: HoursConfirmationInput },
  description: 'One schedule for public hours, the open/closed indicator and structured data. Defaults copy current website hours; they are not automatically approved or published.',
  groups: [{ name: 'hours', title: 'Weekly hours', default: true }, { name: 'closures', title: 'Dated closures' }, { name: 'confirmation', title: 'Clinic confirmation' }],
  initialValue: () => ({
    timezone: 'Asia/Kolkata',
    weeklyHours: defaultAvailability.weeklyHours.map(row => ({ _type: 'clinicAvailabilityDay', _key: row.day, day: row.day, closed: !row.open, ...(row.open ? { open: row.open, close: row.close } : {}) })),
    closures: defaultAvailability.holidays.map((row, index) => ({ _type: 'clinicAvailabilityClosure', _key: 'closure-' + index, date: row.date, reason: row.name })),
    reviewStatus: 'pendingReview',
  }),
  fields: [
    { ...approvalField, title: 'Clinic approval', group: 'confirmation',
      description: 'After the clinic has checked the current hours and closures, select Approved. Recording the confirmation and publishing are separate steps.',
      validation: rule => rule.required().custom(value => value === 'approved' || 'Ask the clinic to check this schedule, then select Approved here before publishing.') },
    defineField({ name: 'timezone', title: 'Clinic timezone', type: 'string', group: 'hours', readOnly: true,
      description: 'Asia/Kolkata (IST). Opening status always uses clinic time, never the visitor’s timezone.',
      validation: rule => rule.required().custom(value => value === 'Asia/Kolkata' || 'Use the clinic timezone Asia/Kolkata.') }),
    defineField({ name: 'weeklyHours', title: 'Weekly opening hours', type: 'array', group: 'hours',
      description: 'Keep all seven weekdays. Switch Closed all day on for weekly holidays. Use 24-hour times; overnight shifts are not supported.',
      validation: rule => rule.required().length(7),
      of: [defineArrayMember({ name: 'clinicAvailabilityDay', type: 'object',
        fields: [
          defineField({ name: 'day', title: 'Weekday', type: 'string', options: { list: days.map(([value, title]) => ({ value, title })) }, validation: rule => rule.required() }),
          defineField({ name: 'closed', title: 'Closed all day', type: 'boolean', validation: rule => rule.required() }),
          ...(['open', 'close'] as const).map(name => defineField({ name, title: name === 'open' ? 'Opens at' : 'Closes at', type: 'string',
            description: '24-hour HH:MM, for example 10:00 or 18:00.',
            hidden: ({ parent }) => parent?.closed === true,
            validation: rule => rule.custom((value, context) => {
              if ((context.parent as { closed?: boolean } | undefined)?.closed) return true
              return typeof value === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(value) || 'Enter a 24-hour time, for example 18:00.'
            }),
          })),
        ],
        preview: { select: { day: 'day', closed: 'closed', open: 'open', close: 'close' }, prepare: ({ day, closed, open, close }) => ({
          title: days.find(row => row[0] === day)?.[1] ?? 'Choose weekday',
          subtitle: closed ? 'Closed all day' : `${open ?? '?'}–${close ?? '?'} IST`,
        }) },
      })],
    }),
    defineField({ name: 'closures', title: 'Dated closures', type: 'array', group: 'closures',
      description: 'Specific full-day closures, such as a clinic-confirmed holiday. These override the weekly schedule. Leave empty for normal weekly hours.',
      of: [defineArrayMember({ name: 'clinicAvailabilityClosure', type: 'object', fields: [
        defineField({ name: 'date', title: 'Closure date (IST)', type: 'date', validation: rule => rule.required() }),
        defineField({ name: 'reason', title: 'Public closure name', type: 'string', description: 'Shown to visitors. Use a confirmed public reason; never include patient or private information.', validation: rule => rule.required().max(160) }),
      ], preview: { select: { title: 'reason', subtitle: 'date' } } })],
    }),
    defineField({ name: 'confirmationNote', title: 'Clinic confirmation reference', type: 'text', rows: 2, group: 'confirmation',
      description: 'Write who confirmed the hours and closures, when, and how (for example, a phone call or email). Use real confirmation details, not the website defaults. Then press Record hours confirmation above. No patient information.',
      validation: rule => rule.required().max(500) }),
    defineField({ name: 'confirmedAt', title: 'Last recorded confirmation', type: 'datetime', group: 'confirmation', readOnly: true,
      description: 'Recorded by the confirmation action. This action saves only your draft and does not publish it.' }),
    defineField({ name: 'confirmedSnapshot', title: 'Confirmed schedule snapshot', type: 'text', hidden: true, readOnly: true }),
  ],
  validation: rule => rule.custom((value, context) => {
    if (context.document?._id && getPublishedId(context.document._id) !== 'clinicAvailability') return 'Use the Clinic hours & availability singleton.'
    const content = availabilityContent.safeParse(value)
    if (!content.success) return content.error.issues.map(issue => {
      let current: unknown = value
      const path = issue.path.map(segment => {
        if (typeof segment === 'number' && Array.isArray(current)) {
          current = current[segment]
          if (current && typeof current === 'object' && '_key' in current && typeof current._key === 'string') return { _key: current._key }
        } else current = current && typeof current === 'object' ? Reflect.get(current, segment) : undefined
        return typeof segment === 'symbol' ? String(segment) : segment
      })
      const field = issue.path.at(-1)
      if (issue.path[0] === 'weeklyHours' && typeof field === 'number') path.push('close')
      const message = issue.code === 'custom' ? issue.message
        : issue.path[0] === 'confirmationNote' ? 'Write who confirmed the schedule, when and how. Use plain text, up to 500 characters.'
        : field === 'open' || field === 'close' ? 'Enter the time as HH:MM using the 24-hour clock, for example 18:00 for 6 PM.'
        : field === 'day' ? 'Choose the weekday for this row.'
        : field === 'closed' ? 'Choose whether the clinic is closed all day.'
        : field === 'date' ? 'Choose a valid calendar date for this closure.'
        : field === 'reason' ? 'Enter a public reason for the closure, up to 160 characters.'
        : issue.path[0] === 'closures' ? 'Add a date and public reason for each closure, or leave this list empty.'
        : issue.path[0] === 'timezone' ? 'The clinic timezone must be Asia/Kolkata.'
        : 'Keep one row for each of the seven weekdays.'
      return { message, paths: [path] }
    })
    return availabilityDocument.safeParse({ ...(value as Record<string, unknown>), _id: 'clinicAvailability' }).success || {
      message: 'The current schedule has no matching confirmation. After the clinic checks it, press Record hours confirmation above the form.',
      paths: [['confirmedAt']],
    }
  }),
  preview: { prepare: () => ({ title: 'Clinic hours & availability', subtitle: 'IST · confirmation required before publication' }) },
})
