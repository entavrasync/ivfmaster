import type { ReactNode } from 'react'
import { Footer } from '@/components/shared/Footer'

export default function EventsLayout({ children }: { children: ReactNode }) { return <>{children}<Footer /></> }
