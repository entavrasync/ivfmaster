'use client'

import { createContext, useContext, type ReactNode } from 'react'
import type { ClinicAvailability } from '../../lib/clinic-availability'

const AvailabilityContext = createContext<ClinicAvailability | null>(null)
export function ClinicAvailabilityProvider({ value, children }: { value: ClinicAvailability | null; children: ReactNode }) {
  return <AvailabilityContext.Provider value={value}>{children}</AvailabilityContext.Provider>
}
export const useClinicAvailability = () => useContext(AvailabilityContext)
