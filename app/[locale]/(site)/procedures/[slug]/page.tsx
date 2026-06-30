import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Footer } from '@/components/shared/Footer';
import { procedures } from '@/lib/content/procedures';
import { routing } from '@/i18n/routing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { slug } = await params;
  const procedure = procedures.find((p) => p.slug === slug);
  if (!procedure) return { title: 'Procedure Not Found' };
  return {
    title: `${procedure.name} - IVF Master`,
    description: procedure.description,
  };
}

export async function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    procedures.map((procedure) => ({ locale, slug: procedure.slug }))
  );
}

export default async function ProcedureDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { slug } = await params;
  const procedure = procedures.find((p) => p.slug === slug);
  if (!procedure) notFound();

  return (
    <>
      <main className="min-h-screen">
        <section className="section-padding bg-gradient-to-b from-ivf-pink/10 to-ivf-cream">
          <div className="section-max-width max-w-3xl">
            <Link
              href="/procedures"
              className="text-ivf-pink font-semibold mb-6 inline-block hover:text-ivf-mauve transition-colors"
            >
              ← Back to Procedures
            </Link>
            <h1 className="text-5xl font-bold text-ivf-dark mb-4">{procedure.name}</h1>
            <p className="text-xl text-ivf-dark/80">{procedure.description}</p>
          </div>
        </section>

        <section className="section-padding bg-ivf-white">
          <div className="section-max-width max-w-3xl space-y-12">
            <div>
              <h2 className="text-3xl font-bold text-ivf-dark mb-4">Is this for us?</h2>
              <ul className="space-y-2">
                {procedure.isForUs.map((reason, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-ivf-dark/80">
                    <span className="text-ivf-pink font-bold">✓</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-ivf-dark mb-4">The Process</h2>
              <ol className="space-y-4">
                {procedure.process.map((step, idx) => (
                  <li key={idx} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-ivf-pink text-ivf-white flex items-center justify-center font-bold">
                      {idx + 1}
                    </div>
                    <p className="text-ivf-dark/80 flex-grow">{step}</p>
                  </li>
                ))}
              </ol>
            </div>

            <div className="bg-ivf-cream rounded-lg p-6 border-l-4 border-ivf-pink">
              <h3 className="font-bold text-ivf-dark mb-2">Timeline</h3>
              <p className="text-ivf-dark/80">{procedure.timeline}</p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-ivf-dark mb-4">What to expect</h2>
              <p className="text-ivf-dark/80">{procedure.whatToExpect}</p>
            </div>

            {procedure.faqs.length > 0 && (
              <div>
                <h2 className="text-3xl font-bold text-ivf-dark mb-4">Frequently asked questions</h2>
                <div className="space-y-4">
                  {procedure.faqs.map((faq, idx) => (
                    <div key={idx} className="bg-ivf-cream rounded-lg p-6">
                      <h3 className="font-bold text-ivf-dark mb-2">{faq.question}</h3>
                      <p className="text-ivf-dark/80">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="section-padding bg-ivf-pink text-ivf-white text-center">
          <div className="section-max-width max-w-2xl">
            <h2 className="text-4xl font-bold mb-4">Want to discuss this procedure?</h2>
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
