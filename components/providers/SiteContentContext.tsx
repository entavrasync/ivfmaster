'use client'

import { createContext, useContext, type ReactNode } from 'react'
import type { SiteChrome } from '@/sanity/lib/site-content-mapping'

const SiteContentContext = createContext<SiteChrome>({ navigation: null, footer: null })
export function SiteContentProvider({ content, children }: { content: SiteChrome; children: ReactNode }) {
  return <SiteContentContext.Provider value={content}>{children}</SiteContentContext.Provider>
}
export const useSiteContent = () => useContext(SiteContentContext)
export const useSiteAction = (slot: string, fallback: string) => useSiteContent().actions?.[slot] ?? fallback
