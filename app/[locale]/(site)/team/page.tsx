import { BacklinkReferences } from '@/components/SEO/BacklinkReferences'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import { Footer } from '@/components/shared/Footer'
import { TeamPageContent } from '@/components/team/TeamPageContent'
import type { Locale } from '@/i18n/routing'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { getSeoContext } from '@/sanity/lib/site-content'
import { SectionJsonLd } from '@/components/SEO/StructuredData'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Team' })

  return buildPageMetadata({
    locale: locale as Locale,
    path: '/team',
    ...(await getSeoContext(locale, 'team')),
    title: t('metaTitle'),
    description: t('metaDescription'),
  })
}

export default async function TeamPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return (
    <>
      <main className="min-h-screen bg-ivory">
        <TeamPageContent />
      </main>
      <SectionJsonLd locale={locale} section="team" seoPage="team" />
      <BacklinkReferences entries={(await getSeoContext(locale, 'team')).seo?.backlinks} locale={locale} />
      <Footer />
    </>
  )
}
