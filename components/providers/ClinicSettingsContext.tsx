'use client'

import { createContext, useContext, type ReactNode } from 'react'
import type { ClinicSettings } from '@/sanity/lib/clinic-mapping'

const ClinicSettingsContext = createContext<ClinicSettings | null>(null)

export function ClinicSettingsProvider({ settings, children }: { settings: ClinicSettings | null; children: ReactNode }) {
  return <ClinicSettingsContext.Provider value={settings}>{children}</ClinicSettingsContext.Provider>
}

export const useClinicSettings = () => useContext(ClinicSettingsContext)
