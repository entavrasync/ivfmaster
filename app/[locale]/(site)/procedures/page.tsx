import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { Footer } from '@/components/shared/Footer';
import { procedures } from '@/lib/content/procedures';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Procedures' });
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

export default async function ProceduresPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  await params;

  return (
    <>
      <main className="min-h-screen">
        <section className="section-padding bg-gradient-to-b from-ivf-mauve to-ivf-pink">
          <div className="section-max-width text-center text-ivf-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Treatment Options</h1>
            <p className="text-xl max-w-2xl mx-auto">
              Understanding your fertility treatment options—from simple to advanced.
            </p>
          </div>
        </section>

        <section className="section-padding bg-ivf-white">
          <div className="section-max-width">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {procedures.map((procedure) => (
                <Link
                  key={procedure.id}
                  href={`/procedures/${procedure.slug}`}
                  className="group bg-gradient-to-br from-ivf-cream to-ivf-white border-2 border-ivf-border rounded-xl overflow-hidden hover:border-ivf-pink hover:shadow-lg transition-all h-full flex flex-col"
                >
                  <div className="bg-gradient-to-br from-ivf-pink/20 to-ivf-mauve/20 h-40 flex items-center justify-center text-5xl">
                    💊
                  </div>
                  <div className="p-8 flex flex-col flex-grow">
                    <h3 className="text-2xl font-bold text-ivf-dark mb-2 group-hover:text-ivf-pink transition-colors">
                      {procedure.name}
                    </h3>
                    <p className="text-ivf-dark/70 mb-4 flex-grow">{procedure.shortDescription}</p>
                    <div className="pt-4 border-t border-ivf-border">
                      <div className="text-sm font-semibold text-ivf-pink group-hover:translate-x-1 transition-transform">
                        Learn More →
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
            <h2 className="text-4xl font-bold mb-4">Unsure which option is right for you?</h2>
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
