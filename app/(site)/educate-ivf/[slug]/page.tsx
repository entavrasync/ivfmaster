import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Footer } from '@/components/shared/Footer';
import { articles } from '@/lib/content/articles';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const article = articles.find((a) => a.slug === params.slug);
  if (!article) return { title: 'Article Not Found' };

  return {
    title: `${article.title} - IVF Master`,
    description: article.description,
  };
}

export async function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export default function ArticleDetailPage({ params }: { params: { slug: string } }) {
  const article = articles.find((a) => a.slug === params.slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = articles
    .filter((a) => a.category === article.category && a.id !== article.id)
    .slice(0, 3);

  return (
    <>
      <main className="min-h-screen">
        {/* Article Header */}
        <section className="section-padding bg-gradient-to-b from-ivf-pink/10 to-ivf-cream">
          <div className="section-max-width max-w-3xl">
            <Link
              href="/educate-ivf"
              className="text-ivf-pink font-semibold mb-6 inline-block hover:text-ivf-mauve transition-colors"
            >
              ← Back to Articles
            </Link>

            <div className="mb-6">
              <span className="inline-block bg-ivf-pink text-ivf-white px-3 py-1 rounded-full text-sm font-semibold mb-4">
                {article.category}
              </span>
            </div>

            <h1 className="text-5xl font-bold text-ivf-dark mb-4">{article.title}</h1>

            <p className="text-xl text-ivf-dark/80 mb-6">{article.description}</p>

            <div className="flex items-center gap-4 text-sm text-ivf-dark/60">
              <span>📖 {article.readTime} min read</span>
              <span>📅 Published on IVF Master</span>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section className="section-padding bg-ivf-white">
          <div className="section-max-width max-w-3xl">
            <div className="prose prose-lg max-w-none">
              <div
                className="text-ivf-dark leading-relaxed space-y-6"
                dangerouslySetInnerHTML={{
                  __html: article.content
                    .replace(/^# /gm, '')
                    .replace(/^## /gm, '<h2 class="text-3xl font-bold text-ivf-dark mt-8 mb-4">')
                    .replace(/\n\n/g, '</h2></p><p class="text-ivf-dark/80">')
                    .replace(/^### /gm, '<h3 class="text-2xl font-semibold text-ivf-dark mt-6 mb-3">')
                    .replace(/\n/g, '<br />'),
                }}
              />
            </div>

            {/* FAQs */}
            {article.faqs.length > 0 && (
              <div className="mt-16 pt-12 border-t-2 border-ivf-border">
                <h2 className="text-3xl font-bold text-ivf-dark mb-8">Common questions</h2>

                <div className="space-y-6">
                  {article.faqs.map((faq, idx) => (
                    <div key={idx} className="bg-ivf-cream rounded-lg p-6">
                      <h3 className="font-semibold text-ivf-dark mb-3">{faq.question}</h3>
                      <p className="text-ivf-dark/80">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="section-padding bg-ivf-cream">
            <div className="section-max-width">
              <h2 className="text-3xl font-bold text-ivf-dark mb-8">Related articles</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedArticles.map((relatedArticle) => (
                  <Link
                    key={relatedArticle.id}
                    href={`/educate-ivf/${relatedArticle.slug}`}
                    className="group bg-ivf-white border-2 border-ivf-border rounded-lg p-6 hover:border-ivf-pink hover:shadow-lg transition-all"
                  >
                    <p className="text-sm font-semibold text-ivf-pink mb-2">{relatedArticle.category}</p>
                    <h3 className="font-bold text-ivf-dark group-hover:text-ivf-pink transition-colors line-clamp-2">
                      {relatedArticle.title}
                    </h3>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="section-padding bg-ivf-pink text-ivf-white text-center">
          <div className="section-max-width max-w-2xl">
            <h2 className="text-4xl font-bold mb-4">Ready to take the next step?</h2>
            <p className="text-xl mb-8 text-ivf-white/90">
              Book a consultation with our doctors to discuss your specific situation.
            </p>
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
