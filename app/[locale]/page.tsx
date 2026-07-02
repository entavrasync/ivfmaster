import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { Footer } from '@/components/shared/Footer';
import { Hero } from '@/components/sections/Hero';
import { PainRecognition } from '@/components/sections/PainRecognition';
import { PainRecognitionStory } from '@/components/sections/PainRecognitionStory';
import { PainRecognitionCTA } from '@/components/sections/PainRecognitionCTA';
import { WhyTrust } from '@/components/sections/WhyTrust';
import { CostOfWaiting } from '@/components/sections/CostOfWaiting';
import { UnderstandingIVF } from '@/components/sections/UnderstandingIVF';
import { MeetTheDoctors } from '@/components/sections/MeetTheDoctors';
import { MythsFacts } from '@/components/sections/MythsFacts';
import { SuccessStories } from '@/components/sections/SuccessStories';
import { FinalCTA } from '@/components/sections/FinalCTA';
import { RevealSection } from '@/components/motion';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Meta' })

  return buildPageMetadata({
    locale: locale as Locale,
    path: '/',
    title: t('siteTitle'),
    description: t('siteDescription'),
  })
}

export default function Home() {
  return (
    <>
      <main className="min-h-screen">
        {/* Hero handles its own GSAP internally */}
        <Hero />

        {/*
         * Pain Recognition arc — ONE continuous surface.
         * Intro headline → pinned scroll-story → soft closing CTA.
         * Child sections are transparent; this wrapper owns the background
         * so there is no tonal seam between the three beats.
         *
         * Background: barely-there lavender that warms very slightly top→bottom.
         * The range is narrow (~F5F3FB → ECEAF4) so within any one viewport
         * it reads as a single calm tone.
         */}
        <div style={{
          background: 'linear-gradient(180deg, #F5F3FB 0%, #ECEAF4 100%)',
          position: 'relative',
        }}>
          <PainRecognition />
          <PainRecognitionStory />
        </div>

        {/* Closing beat — separate surface, intentional warm landing after the arc */}
        <PainRecognitionCTA />

        {/* Why couples trust us — conversational cards */}
        <WhyTrust />

        {/* Cinematic dark section — GSAP-pinned, scroll-driven lines */}
        <CostOfWaiting />

        <RevealSection y={48}>
          <UnderstandingIVF />
        </RevealSection>

        <RevealSection y={48}>
          <MeetTheDoctors />
        </RevealSection>

        <RevealSection y={48}>
          <MythsFacts />
        </RevealSection>

        <RevealSection y={40}>
          <SuccessStories />
        </RevealSection>

        {/* Dark closing block — FinalCTA flows directly into Footer (shared navy bg) */}
        <FinalCTA />
      </main>

      <Footer />
    </>
  );
}
