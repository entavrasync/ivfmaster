export const availabilityDays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const
export type AvailabilityDay = typeof availabilityDays[number]
export type ClinicAvailability = {
  timezone: 'Asia/Kolkata'
  weeklyHours: { day: AvailabilityDay; open: string | null; close: string | null }[]
  holidays: { date: string; name: string }[]
}
export type AvailabilityStatus = {
  state: 'open' | 'closed_today' | 'holiday' | 'closed_weekly'
  closeTimeDisplay: string | null
  nextOpenDisplay: string | null
  holidayName: string | null
}
const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const minutes = (time: string) => Number(time.slice(0, 2)) * 60 + Number(time.slice(3))
const clock = (time: string) => {
  const hour = Number(time.slice(0, 2))
  return `${hour % 12 || 12}:${time.slice(3)} ${hour >= 12 ? 'PM' : 'AM'}`
}

/** UTC calendar access keeps clinic time independent of the visitor's timezone/DST. */
export function getAvailabilityStatus(now: Date, schedule: ClinicAvailability): AvailabilityStatus {
  const ist = new Date(now.getTime() + 330 * 60_000)
  const index = (ist.getUTCDay() + 6) % 7
  const date = ist.toISOString().slice(0, 10)
  const current = ist.getUTCHours() * 60 + ist.getUTCMinutes()
  const today = schedule.weeklyHours.find(row => row.day === availabilityDays[index])
  const holiday = schedule.holidays.find(row => row.date === date)
  const nextOpening = () => {
    // A closure may cover more than a week. Each dated closure can skip one open day.
    for (let ahead = 1; ahead <= 7 * (schedule.holidays.length + 1); ahead++) {
      const candidate = new Date(ist)
      candidate.setUTCDate(candidate.getUTCDate() + ahead)
      const nextIndex = (index + ahead) % 7
      const hours = schedule.weeklyHours.find(row => row.day === availabilityDays[nextIndex])
      if (!hours?.open || !hours.close || schedule.holidays.some(row => row.date === candidate.toISOString().slice(0, 10))) continue
      return `${ahead === 1 ? 'tomorrow' : dayNames[nextIndex]} at ${clock(hours.open)}`
    }
    return null
  }
  if (holiday) return { state: 'holiday', closeTimeDisplay: null, nextOpenDisplay: nextOpening(), holidayName: holiday.name }
  if (!today?.open || !today.close) return { state: 'closed_weekly', closeTimeDisplay: null, nextOpenDisplay: nextOpening(), holidayName: null }
  if (current >= minutes(today.open) && current < minutes(today.close)) return { state: 'open', closeTimeDisplay: clock(today.close), nextOpenDisplay: null, holidayName: null }
  return { state: 'closed_today', closeTimeDisplay: null, nextOpenDisplay: current < minutes(today.open) ? `today at ${clock(today.open)}` : nextOpening(), holidayName: null }
}

/** Derive display copy from the same rows as the live indicator; no second hours field. */
export function formatAvailability(schedule: ClinicAvailability, locale = 'en'): string {
  const language = locale === 'mr' ? 'mr-IN' : 'en-IN'
  const day = (index: number) => new Intl.DateTimeFormat(language, { weekday: 'short', timeZone: 'UTC' }).format(new Date(Date.UTC(2026, 0, 5 + index)))
  const time = (value: string) => new Intl.DateTimeFormat(language, { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'UTC' }).format(new Date(Date.UTC(2026, 0, 5, Number(value.slice(0, 2)), Number(value.slice(3)))))
  const groups: { start: number; end: number; open: string; close: string }[] = []
  availabilityDays.forEach((key, index) => {
    const row = schedule.weeklyHours.find(value => value.day === key)
    if (!row?.open || !row.close) return
    const previous = groups[groups.length - 1]
    if (previous && previous.end === index - 1 && previous.open === row.open && previous.close === row.close) previous.end = index
    else groups.push({ start: index, end: index, open: row.open, close: row.close })
  })
  return groups.map(row => `${day(row.start)}${row.end === row.start ? '' : '–' + day(row.end)}: ${time(row.open)}–${time(row.close)}`).join('; ')
}

export function availabilityJsonLd(schedule: ClinicAvailability) {
  return availabilityDays.flatMap((key, index) => {
    const row = schedule.weeklyHours.find(value => value.day === key)
    return row?.open && row.close ? [{ '@type': 'OpeningHoursSpecification', dayOfWeek: [dayNames[index]], opens: row.open, closes: row.close }] : []
  })
}

export function availabilityClosuresJsonLd(schedule: ClinicAvailability) {
  return schedule.holidays.map(row => ({ '@type': 'OpeningHoursSpecification', validFrom: row.date, validThrough: row.date, opens: '00:00', closes: '00:00' }))
}
