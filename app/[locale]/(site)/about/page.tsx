import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { Footer } from '@/components/shared/Footer';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'About' });
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  // locale available for future per-locale content variations
  await params;

  return (
    <>
      <main className="min-h-screen">
        <section className="section-padding bg-gradient-to-b from-ivf-pink to-ivf-mauve">
          <div className="section-max-width text-center text-ivf-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">About IVF Master</h1>
            <p className="text-xl max-w-2xl mx-auto">
              Where Advanced Fertility Science Meets Compassionate Care
            </p>
          </div>
        </section>

        <section className="section-padding bg-ivf-cream">
          <div className="section-max-width max-w-3xl">
            <h2 className="text-4xl font-bold text-ivf-dark mb-6">Our story</h2>
            <div className="space-y-4 text-ivf-dark/80 leading-relaxed">
              <p>
                IVF Master was founded on a simple belief: fertility treatment should be about more
                than medical protocols. It should be about understanding, compassion, and empowering
                couples to make informed decisions about their most important life goals.
              </p>
              <p>
                Today, we're proud to serve couples throughout Sangli and Maharashtra with
                evidence-based treatment, personalized care plans, and genuine emotional support.
              </p>
            </div>
          </div>
        </section>

        <section className="section-padding bg-ivf-pink text-ivf-white text-center">
          <div className="section-max-width max-w-2xl">
            <h2 className="text-4xl font-bold mb-4">Join our community</h2>
            <Link
              href="/contact"
              className="inline-block bg-ivf-white text-ivf-pink font-bold py-3 px-8 rounded-lg hover:bg-ivf-cream transition-colors"
            >
              Get In Touch
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
