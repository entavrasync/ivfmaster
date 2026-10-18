import type { ReactNode } from 'react'

// A separate root keeps the locale layout and public styles out of Studio.
export default function StudioLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
