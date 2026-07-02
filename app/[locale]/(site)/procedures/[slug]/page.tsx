import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Footer } from '@/components/shared/Footer'
import { ProcedureDetail } from '@/components/sections/ProcedureDetail'
import { PROCEDURES } from '@/lib/procedures'
import { routing, type Locale } from '@/i18n/routing'
import { buildPageMetadata } from '@/lib/seo/metadata'

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
  const { locale, slug } = await params
  const proc = PROCEDURES.find((p) => p.slug === slug)
  if (!proc) return { title: 'Procedure not found' }
  return buildPageMetadata({
    locale: locale as Locale,
    path: '/procedures/' + slug,
    title: proc.name + ' — ' + proc.fullName,
    description: proc.oneLiner,
  })
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
