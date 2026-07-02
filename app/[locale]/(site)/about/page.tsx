import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import { AboutClosing } from '@/components/about/AboutClosing'
import { AboutHero } from '@/components/about/AboutHero'
import { AboutOrigin } from '@/components/about/AboutOrigin'
import { CareJourney } from '@/components/about/CareJourney'
import { CareTeam } from '@/components/about/CareTeam'
import { DoctorStories } from '@/components/about/DoctorStories'
import { TrustInPractice } from '@/components/about/TrustInPractice'
import { Footer } from '@/components/shared/Footer'
import type { Locale } from '@/i18n/routing'
import { buildPageMetadata } from '@/lib/seo/metadata'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'About' })

  return buildPageMetadata({
    locale: locale as Locale,
    path: '/about',
    title: t('metaTitle'),
    description: t('metaDescription'),
  })
}

export default function AboutPage() {
  return (
    <>
      <main className="min-h-screen bg-ivory">
        <AboutHero />
        <AboutOrigin />
        <CareJourney />
        <DoctorStories />
        <CareTeam />
        <TrustInPractice />
        <AboutClosing />
      </main>
      <Footer />
    </>
  )
}
