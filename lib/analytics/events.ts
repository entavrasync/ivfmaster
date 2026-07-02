'use client'

import { sendGTMEvent } from '@next/third-parties/google'

import type { AnalyticsEventName } from './constants'

export type AnalyticsEventPayload = Record<
  string,
  string | number | boolean | null | undefined
>

export function trackEvent(
  event: AnalyticsEventName,
  payload: AnalyticsEventPayload = {}
) {
  sendGTMEvent({
    event,
    ...payload,
  })
}

export function trackCtaClick(label: string, location: string) {
  trackEvent('cta_click', {
    cta_label: label,
    cta_location: location,
  })
}
