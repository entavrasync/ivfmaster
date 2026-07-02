'use client'

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'

type Ctx = {
  enabled:    boolean
  setEnabled: (v: boolean) => void
}

const ReadingProgressContext = createContext<Ctx>({
  enabled:    false,
  setEnabled: () => {},
})

export function ReadingProgressProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false)
  return (
    <ReadingProgressContext.Provider value={{ enabled, setEnabled }}>
      {children}
    </ReadingProgressContext.Provider>
  )
}

export function useReadingProgress() {
  const { enabled, setEnabled } = useContext(ReadingProgressContext)
  const enableProgress  = useCallback(() => setEnabled(true),  [setEnabled])
  const disableProgress = useCallback(() => setEnabled(false), [setEnabled])
  return { enabled, enableProgress, disableProgress }
}
