import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { Footer } from '@/components/shared/Footer';
import { articles } from '@/lib/content/articles';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'EducateIVF' });
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

export default async function EducateIVFPage({
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
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Fertility Education Hub</h1>
            <p className="text-xl max-w-2xl mx-auto">
              Clear, jargon-free guides to understanding fertility, IVF, and your options.
            </p>
          </div>
        </section>

        <section className="section-padding bg-ivf-cream">
          <div className="section-max-width">
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-ivf-dark mb-2">Featured articles</h2>
              <p className="text-ivf-dark/70">
                Learn about IVF, fertility challenges, and treatment options in simple terms.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  href={`/educate-ivf/${article.slug}`}
                  className="group bg-ivf-white border-2 border-ivf-border rounded-xl overflow-hidden hover:border-ivf-pink hover:shadow-lg transition-all h-full flex flex-col"
                >
                  <div className="bg-gradient-to-br from-ivf-pink/20 to-ivf-mauve/20 h-48 flex items-center justify-center">
                    <div className="text-6xl">📚</div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <p className="text-sm font-semibold text-ivf-pink mb-2">{article.category}</p>
                    <h3 className="text-xl font-bold text-ivf-dark mb-2 group-hover:text-ivf-pink transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-ivf-dark/70 text-sm mb-4 flex-grow line-clamp-2">
                      {article.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-ivf-dark/60">{article.readTime} min read</span>
                      <span className="text-ivf-pink font-semibold group-hover:translate-x-1 transition-transform">
                        Read →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding bg-ivf-pink text-ivf-white text-center">
          <div className="section-max-width max-w-2xl">
            <h2 className="text-4xl font-bold mb-4">Have more questions?</h2>
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
