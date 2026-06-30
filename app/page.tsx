import { Footer } from '@/components/shared/Footer';
import { StickyWhatsApp } from '@/components/shared/StickyWhatsApp';
import { StickyConsultation } from '@/components/shared/StickyConsultation';
import { Hero } from '@/components/sections/Hero';
import { RecognitionStories } from '@/components/sections/RecognitionStories';
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

export default function Home() {
  return (
    <>
      <main className="min-h-screen">
        {/* Section 1: Hero */}
        <Hero />

        {/* Section 2: Recognition Stories */}
        <RecognitionStories />

        {/* Section 3: Trust Indicators */}
        <TrustIndicators />

        {/* Section 4: Hidden Cost */}
        <HiddenCost />

        {/* Section 5: Understanding IVF */}
        <UnderstandingIVF />

        {/* Section 6: Fertility Challenges */}
        <FertilityChallenges />

        {/* Section 7: Why IVF Master */}
        <WhyIVFMaster />

        {/* Section 8: Patient Journey */}
        <PatientJourney />

        {/* Section 9: Meet Team */}
        <MeetTeam />

        {/* Section 10: Myths & Facts */}
        <MythsFacts />

        {/* Section 11: Success Stories */}
        <SuccessStories />

        {/* Section 12: Facility Experience */}
        <FacilityExperience />

        {/* Section 13: FAQ */}
        <FAQ />

        {/* Section 14: Final CTA */}
        <FinalCTA />
      </main>

      <Footer />

      {/* Sticky CTAs */}
      <StickyWhatsApp />
      <StickyConsultation />
    </>
  );
}
