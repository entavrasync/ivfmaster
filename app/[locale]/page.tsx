import { Footer } from '@/components/shared/Footer';
import { Hero } from '@/components/sections/Hero';
import { PainRecognition } from '@/components/sections/PainRecognition';
import { PainRecognitionStory } from '@/components/sections/PainRecognitionStory';
import { PainRecognitionCTA } from '@/components/sections/PainRecognitionCTA';
import { WhyTrust } from '@/components/sections/WhyTrust';
import { TrustIndicators } from '@/components/sections/TrustIndicators';
import { HiddenCost } from '@/components/sections/HiddenCost';
import { UnderstandingIVF } from '@/components/sections/UnderstandingIVF';
import { FertilityChallenges } from '@/components/sections/FertilityChallenges';
import { WhyIVFMaster } from '@/components/sections/WhyIVFMaster';
import { PatientJourney } from '@/components/sections/PatientJourney';
import { MeetTeam } from '@/components/sections/MeetTeam';
import { MythsFacts } from '@/components/sections/MythsFacts';
import { SuccessStories } from '@/components/sections/SuccessStories';
import { FacilityExperience } from '@/components/sections/FacilityExperience';
import { FAQ } from '@/components/sections/FAQ';
import { FinalCTA } from '@/components/sections/FinalCTA';
import { RevealSection } from '@/components/motion';

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

        {/* Why couples trust us — warmth-first, editorial, no motion yet (Sub-prompt A) */}
        <WhyTrust />

        <RevealSection y={48}>
          <HiddenCost />
        </RevealSection>

        <RevealSection y={48}>
          <UnderstandingIVF />
        </RevealSection>

        <RevealSection y={48}>
          <FertilityChallenges />
        </RevealSection>

        <RevealSection y={48}>
          <WhyIVFMaster />
        </RevealSection>

        <RevealSection y={40}>
          <PatientJourney />
        </RevealSection>

        <RevealSection y={48}>
          <MeetTeam />
        </RevealSection>

        <RevealSection y={48}>
          <MythsFacts />
        </RevealSection>

        <RevealSection y={40}>
          <SuccessStories />
        </RevealSection>

        <RevealSection y={48}>
          <FacilityExperience />
        </RevealSection>

        <RevealSection y={36}>
          <FAQ />
        </RevealSection>

        <RevealSection y={36}>
          <FinalCTA />
        </RevealSection>
      </main>

      <Footer />
    </>
  );
}
