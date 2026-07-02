import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Footer } from '@/components/shared/Footer'
import { ProcedureDetail } from '@/components/sections/ProcedureDetail'
import { PROCEDURES } from '@/lib/procedures'
import { routing } from '@/i18n/routing'

export async function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    PROCEDURES.map((proc) => ({ locale, slug: proc.slug }))
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const proc = PROCEDURES.find((p) => p.slug === slug)
  if (!proc) return { title: 'Procedure not found' }
  return {
    title:       `${proc.name} — ${proc.fullName} | IVF Master`,
    description: proc.oneLiner,
  }
}

export default async function ProcedureDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { slug } = await params
  const proc = PROCEDURES.find((p) => p.slug === slug)
  if (!proc) notFound()

  return (
    <>
      <ProcedureDetail proc={proc} allProcs={PROCEDURES} />
      <Footer />
    </>
  )
}
