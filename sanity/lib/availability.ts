import 'server-only'
import { cache } from 'react'
import { client } from './client'
import { resolveAvailability } from './availability-mapping'
import { availabilityQuery } from './clinic-queries'

export const getClinicAvailability = cache(async () => {
  try {
    const input = await client.fetch<unknown>(availabilityQuery, {}, { cache: 'force-cache', next: { revalidate: 60, tags: ['clinicAvailability'] } })
    const result = resolveAvailability(input, true)
    if (result.status === 'invalid' || result.status === 'ambiguous') console.error('[clinicAvailability] Invalid, unconfirmed or ambiguous schedule; retaining existing hours.')
    return result.value
  } catch {
    console.error('[clinicAvailability] CMS read failed; retaining existing hours.')
    return null
  }
})
