import { BacklinkReferences } from '@/components/SEO/BacklinkReferences'
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
import { getAboutInformation } from '@/sanity/lib/editorial'
import { getSiteContent } from '@/sanity/lib/site-content'
import { mergeAboutPage, at, plain } from '@/sanity/lib/site-content-mapping'
import { aboutContent } from '@/lib/content/about'
import { getSeoContext } from '@/sanity/lib/site-content'
import { SectionJsonLd } from '@/components/SEO/StructuredData'

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
    ...(await getSeoContext(locale, 'about')),
    title: t('metaTitle'),
    description: t('metaDescription'),
  })
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const [information, page] = await Promise.all([getAboutInformation(locale as Locale), getSiteContent(locale)])
  const chapters = at(page.about, 'doctorsSection.chapters')
  const content = mergeAboutPage(aboutContent, { ...page.about, doctors: aboutContent.doctors.map((doctor) => Array.isArray(chapters) ? chapters.find((chapter) => at(chapter, 'slug') === `${doctor.id}-mandrupkar`) : null) })
  return (
    <>
      <main className="min-h-screen bg-ivory">
        <AboutHero content={content.hero} />
        <AboutOrigin content={page.about ? content.origin : information?.origin ?? content.origin} />
        <CareJourney content={page.about ? content.care : information?.care ?? content.care} />
        <DoctorStories content={content.doctors} eyebrow={plain(at(page.about, 'doctorsSection.eyebrow'))} />
        <CareTeam content={content.team} />
        <TrustInPractice content={page.about ? content.trust : information?.trust ?? content.trust} />
        <AboutClosing content={content.closing} />
      </main>
      <SectionJsonLd locale={locale} section="about" seoPage="about" />
      <BacklinkReferences entries={(await getSeoContext(locale, 'about')).seo?.backlinks} locale={locale} />
      <Footer />
    </>
  )
}
