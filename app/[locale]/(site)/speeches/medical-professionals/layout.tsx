import type { ReactNode } from 'react'
import { Footer } from '@/components/shared/Footer'

export default function NewsLayout({ children }: { children: ReactNode }) { return <>{children}<Footer /></> }
