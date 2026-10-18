/**
 * Existing fallback hours, holidays and contact details.
 * A confirmed published Clinic hours & availability document overrides the schedule.
 */

import { getAvailabilityStatus, type ClinicAvailability } from './clinic-availability'

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
  whatsappNumber: '917559379192',       // wa.me format — country code + digits only, NO + or spaces
  phoneNumber:    '+91 75593 79192',    // display / tel: (spaces stripped when building the tel: href)
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

/** Existing fallback values remain authoritative until a confirmed schedule is published. */
export const defaultAvailability: ClinicAvailability = {
  timezone: CLINIC_TIMEZONE, weeklyHours: [...CLINIC_WEEKLY_HOURS], holidays: [...CLINIC_HOLIDAYS],
}

export function getClinicStatus(now: Date = new Date(), availability: ClinicAvailability | null = null): ClinicStatus {
  return getAvailabilityStatus(now, availability ?? defaultAvailability)
}
