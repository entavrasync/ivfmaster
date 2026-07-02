/**
 * Clinic hours, holidays, and contact details — single source of truth.
 * ⚠️  FLAG — confirm ALL values with the clinic before launch.
 */

export const CLINIC_TIMEZONE = 'Asia/Kolkata' as const

export type DayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'

export interface DayHours {
  day:   DayKey
  open:  string | null  // 'HH:MM' 24-h; null = closed all day
  close: string | null
}

// ⚠️  FLAG — confirm actual clinic operating hours before launch
export const CLINIC_WEEKLY_HOURS: ReadonlyArray<DayHours> = [
  { day: 'mon', open: '10:00', close: '18:00' },
  { day: 'tue', open: '10:00', close: '18:00' },
  { day: 'wed', open: '10:00', close: '18:00' },
  { day: 'thu', open: '10:00', close: '18:00' },
  { day: 'fri', open: '10:00', close: '18:00' },
  { day: 'sat', open: '10:00', close: '18:00' },
  { day: 'sun', open: null,    close: null    },
]

// ⚠️  FLAG — populate with real holiday dates each year; format: 'YYYY-MM-DD'
export const CLINIC_HOLIDAYS: ReadonlyArray<{ date: string; name: string }> = [
  // { date: '2026-01-26', name: 'Republic Day' },
  // { date: '2026-08-15', name: 'Independence Day' },
]

// ⚠️  FLAG — replace with real contact details before launch
export const CLINIC_CONTACT = {
  whatsappNumber: '+91 95610 96416',    // international format, no + or spaces
  phoneNumber:    '+91 95610 96416',
} as const

/* ─── Status types ───────────────────────────────────────────────── */

export type ClinicState =
  | 'open'           // currently within operating hours
  | 'closed_today'   // has hours today but currently before-open or after-close
  | 'holiday'        // today is in CLINIC_HOLIDAYS
  | 'closed_weekly'  // no hours scheduled for this weekday

export interface ClinicStatus {
  state:            ClinicState
  closeTimeDisplay: string | null  // e.g. '8:00 PM' — only set when state === 'open'
  nextOpenDisplay:  string | null  // e.g. 'tomorrow at 10:00 AM' or 'Monday at 10:00 AM'
  holidayName:      string | null  // only set when state === 'holiday'
}

/* ─── Internal helpers ───────────────────────────────────────────── */

const DAY_KEY_ORDER: DayKey[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

/**
 * Convert a UTC Date to an IST wall-clock Date.
 * After conversion, getHours() / getDay() / getDate() return IST values.
 */
function toIST(utc: Date): Date {
  // IST = UTC+5:30  →  add (local-TZ-to-UTC offset + 330 min) to normalise
  const IST_OFFSET_MIN = 5 * 60 + 30
  return new Date(utc.getTime() + (utc.getTimezoneOffset() + IST_OFFSET_MIN) * 60_000)
}

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

function formatTime12h(hhmm: string): string {
  const [hStr, mStr] = hhmm.split(':')
  const h      = Number(hStr)
  const m      = Number(mStr)
  const suffix = h >= 12 ? 'PM' : 'AM'
  const h12    = h % 12 === 0 ? 12 : h % 12
  return m === 0
    ? `${h12}:00 ${suffix}`
    : `${h12}:${String(m).padStart(2, '0')} ${suffix}`
}

function isoDate(ist: Date): string {
  const y = ist.getFullYear()
  const m = String(ist.getMonth() + 1).padStart(2, '0')
  const d = String(ist.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** Search up to 7 days ahead for the next day that is open and not a holiday. */
function findNextOpen(fromDayIndex: number, fromIST: Date): string | null {
  for (let ahead = 1; ahead <= 7; ahead++) {
    const dayIdx = (fromDayIndex + ahead) % 7
    const dayKey = DAY_KEY_ORDER[dayIdx]
    const hours  = CLINIC_WEEKLY_HOURS.find((d) => d.day === dayKey)
    if (!hours?.open) continue

    const candidate = new Date(fromIST)
    candidate.setDate(candidate.getDate() + ahead)
    if (CLINIC_HOLIDAYS.some((h) => h.date === isoDate(candidate))) continue

    const label = ahead === 1 ? 'tomorrow' : DAY_NAMES[dayIdx]
    return `${label} at ${formatTime12h(hours.open)}`
  }
  return null
}

/* ─── Main export ────────────────────────────────────────────────── */

/** Returns live clinic availability status computed entirely in IST. */
export function getClinicStatus(now: Date = new Date()): ClinicStatus {
  const ist = toIST(now)

  const todayDateStr   = isoDate(ist)
  const todayDayIndex  = ist.getDay()   // 0 = Sun … 6 = Sat
  const currentMinutes = ist.getHours() * 60 + ist.getMinutes()

  // ── Holiday check ────────────────────────────────────────────────
  const holiday = CLINIC_HOLIDAYS.find((h) => h.date === todayDateStr)
  if (holiday) {
    return {
      state:            'holiday',
      closeTimeDisplay: null,
      nextOpenDisplay:  findNextOpen(todayDayIndex, ist),
      holidayName:      holiday.name,
    }
  }

  // ── Weekly-off check ─────────────────────────────────────────────
  const todayKey   = DAY_KEY_ORDER[todayDayIndex]
  const todayHours = CLINIC_WEEKLY_HOURS.find((d) => d.day === todayKey)

  if (!todayHours?.open || !todayHours.close) {
    return {
      state:            'closed_weekly',
      closeTimeDisplay: null,
      nextOpenDisplay:  findNextOpen(todayDayIndex, ist),
      holidayName:      null,
    }
  }

  const openMin  = toMinutes(todayHours.open)
  const closeMin = toMinutes(todayHours.close)

  // ── Open right now ───────────────────────────────────────────────
  if (currentMinutes >= openMin && currentMinutes < closeMin) {
    return {
      state:            'open',
      closeTimeDisplay: formatTime12h(todayHours.close),
      nextOpenDisplay:  null,
      holidayName:      null,
    }
  }

  // ── Closed today (before open OR after close) ────────────────────
  const beforeOpen = currentMinutes < openMin
  return {
    state:            'closed_today',
    closeTimeDisplay: null,
    nextOpenDisplay:  beforeOpen
      ? `today at ${formatTime12h(todayHours.open)}`
      : findNextOpen(todayDayIndex, ist),
    holidayName:      null,
  }
}
