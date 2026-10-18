import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Footer } from '@/components/shared/Footer'
import { ProcedureDetail } from '@/components/sections/ProcedureDetail'
import { PROCEDURES } from '@/lib/procedures'
import { routing, type Locale } from '@/i18n/routing'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { getProcedures } from '@/sanity/lib/procedures'
import { getSeoContext } from '@/sanity/lib/site-content'
import { JsonLdScript, absoluteImage, breadcrumbTrail, pageLocale } from '@/components/SEO/StructuredData'
import { buildProcedureJsonLd } from '@/lib/seo/jsonLd'

// Website procedures are prebuilt; procedures added in the CMS render on demand.
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
  const procedures = await getProcedures(locale as Locale)
  const proc = procedures.find((p) => p.slug === slug)
  if (!proc) return { title: 'Procedure not found' }
  return buildPageMetadata({
    locale: locale as Locale,
    path: '/procedures/' + slug,
    title: proc.seo?.title ?? proc.name + ' — ' + proc.fullName,
    description: proc.seo?.description ?? proc.oneLiner,
    ...(await getSeoContext(locale)),
    ...(proc.pageSeo ? { seo: proc.pageSeo } : {}),
  })
}

export default async function ProcedureDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const procedures = await getProcedures(locale as Locale)
  const proc = procedures.find((p) => p.slug === slug)
  if (!proc) notFound()
  const path = `/procedures/${proc.slug}`
  const structuredData = proc.pageSeo?.structuredData === false ? null : buildProcedureJsonLd({
    locale: pageLocale(locale), trail: await breadcrumbTrail(locale, 'procedures', { name: proc.name, path }),
    name: proc.name, alternateName: proc.fullName, description: proc.pageSeo?.description ?? proc.oneLiner,
    faqs: proc.faqs, image: absoluteImage(proc.bannerImage?.src),
  })

  return (
    <>
      <ProcedureDetail proc={proc} allProcs={procedures} />
      {structuredData && <JsonLdScript data={structuredData} />}
      <Footer />
    </>
  )
}
