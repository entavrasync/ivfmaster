import type { Metadata } from 'next'
import { Footer } from '@/components/shared/Footer'
import { EducateHub } from '@/components/sections/EducateHub'

export const metadata: Metadata = {
  title:       'Educate IVF — Understanding fertility, one question at a time | IVF Master',
  description: 'Honest, plain-language articles on IVF, fertility conditions, and common myths — written by the team who will care for you.',
}

export default async function EducateIVFPage() {
  return (
    <>
      <EducateHub />
      <Footer />
    </>
  )
}
