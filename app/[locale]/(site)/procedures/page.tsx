import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Footer } from '@/components/shared/Footer'
import { ProceduresHub } from '@/components/sections/ProceduresHub'
import type { Locale } from '@/i18n/routing'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { getProcedures } from '@/sanity/lib/procedures'
import { getSeoContext } from '@/sanity/lib/site-content'
import { SectionJsonLd } from '@/components/SEO/StructuredData'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Procedures' })
  return buildPageMetadata({
    locale: locale as Locale,
    path: '/procedures',
    ...(await getSeoContext(locale, 'procedures')),
    title: t('metaTitle'),
    description: t('metaDescription'),
  })
}

export default async function ProceduresPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const procedures = await getProcedures(locale as Locale)
  return (
    <>
      <ProceduresHub procedures={procedures} />
      <SectionJsonLd locale={locale} section="procedures" seoPage="procedures" />
      <Footer />
    </>
  )
}
