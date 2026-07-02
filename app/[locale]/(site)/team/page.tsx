import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { Footer } from '@/components/shared/Footer';
import { doctors } from '@/lib/content/team';
import type { Locale } from '@/i18n/routing';
import { buildPageMetadata } from '@/lib/seo/metadata';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Team' });
  return buildPageMetadata({
    locale: locale as Locale,
    path: '/team',
    title: t('metaTitle'),
    description: t('metaDescription'),
  });
}

export default async function TeamPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  await params;

  return (
    <>
      <main className="min-h-screen">
        <section className="section-padding bg-gradient-to-b from-ivf-pink to-ivf-mauve">
          <div className="section-max-width text-center text-ivf-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Our Expert Team</h1>
            <p className="text-xl max-w-2xl mx-auto">
              Experienced doctors dedicated to personalized, compassionate fertility care.
            </p>
          </div>
        </section>

        <section className="section-padding bg-ivf-white">
          <div className="section-max-width">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {doctors.map((doctor) => (
                <Link key={doctor.id} href={`/team/${doctor.slug}`} className="group">
                  <div className="bg-gradient-to-br from-ivf-cream to-ivf-white border-2 border-ivf-border rounded-xl overflow-hidden hover:border-ivf-pink hover:shadow-xl transition-all h-full flex flex-col cursor-pointer">
                    <div className="bg-gradient-to-br from-ivf-pink/20 to-ivf-mauve/20 h-64 flex items-center justify-center text-8xl group-hover:scale-105 transition-transform">
                      👨‍⚕️
                    </div>
                    <div className="p-8 flex flex-col flex-grow">
                      <h3 className="text-3xl font-bold text-ivf-dark group-hover:text-ivf-pink transition-colors mb-1">
                        {doctor.name}
                      </h3>
                      <p className="text-sm font-semibold text-ivf-pink mb-4">{doctor.title}</p>
                      <p className="text-ivf-dark/80 mb-6 flex-grow">{doctor.shortBio}</p>
                      <div className="flex items-center text-ivf-pink font-semibold text-sm group-hover:translate-x-1 transition-transform">
                        View Full Profile →
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding bg-ivf-pink text-ivf-white text-center">
          <div className="section-max-width max-w-2xl">
            <h2 className="text-4xl font-bold mb-4">Ready to meet our team?</h2>
            <Link
              href="/contact"
              className="inline-block bg-ivf-white text-ivf-pink font-bold py-3 px-8 rounded-lg hover:bg-ivf-cream transition-colors"
            >
              Book a Consultation
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
