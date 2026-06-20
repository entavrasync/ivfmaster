import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Navigation } from '@/components/shared/Navigation';
import { Footer } from '@/components/shared/Footer';
import { procedures } from '@/lib/content/procedures';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const procedure = procedures.find((p) => p.slug === params.slug);
  if (!procedure) return { title: 'Procedure Not Found' };

  return {
    title: `${procedure.name} - IVF Master`,
    description: procedure.description,
  };
}

export async function generateStaticParams() {
  return procedures.map((procedure) => ({
    slug: procedure.slug,
  }));
}

export default function ProcedureDetailPage({ params }: { params: { slug: string } }) {
  const procedure = procedures.find((p) => p.slug === params.slug);

  if (!procedure) {
    notFound();
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen">
        {/* Header */}
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

        {/* Content */}
        <section className="section-padding bg-ivf-white">
          <div className="section-max-width max-w-3xl space-y-12">
            {/* Is This For Us */}
            <div>
              <h2 className="text-3xl font-bold text-ivf-dark mb-4">Is This For Us?</h2>
              <p className="text-ivf-dark/80 mb-4">
                {procedure.name} may be recommended if you have any of the following:
              </p>
              <ul className="space-y-2">
                {procedure.isForUs.map((reason, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-ivf-dark/80">
                    <span className="text-ivf-pink font-bold">✓</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* The Process */}
            <div>
              <h2 className="text-3xl font-bold text-ivf-dark mb-4">The Process</h2>
              <ol className="space-y-4">
                {procedure.process.map((step, idx) => (
                  <li key={idx} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-ivf-pink text-ivf-white flex items-center justify-center font-bold">
                      {idx + 1}
                    </div>
                    <div className="flex-grow">
                      <p className="text-ivf-dark/80">{step}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* Timeline */}
            <div className="bg-ivf-cream rounded-lg p-6 border-l-4 border-ivf-pink">
              <h3 className="font-bold text-ivf-dark mb-2">Timeline</h3>
              <p className="text-ivf-dark/80">{procedure.timeline}</p>
            </div>

            {/* What To Expect */}
            <div>
              <h2 className="text-3xl font-bold text-ivf-dark mb-4">What To Expect</h2>
              <p className="text-ivf-dark/80">{procedure.whatToExpect}</p>
            </div>

            {/* Common Concerns */}
            {procedure.commonConcerns.length > 0 && (
              <div>
                <h2 className="text-3xl font-bold text-ivf-dark mb-4">Common Concerns</h2>
                <div className="space-y-4">
                  {procedure.commonConcerns.map((concern, idx) => (
                    <div key={idx} className="bg-ivf-cream rounded-lg p-6">
                      <h3 className="font-bold text-ivf-dark mb-2">{concern.concern}</h3>
                      <p className="text-ivf-dark/80">{concern.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Success Rate */}
            <div className="bg-gradient-to-r from-ivf-pink/10 to-ivf-mauve/10 rounded-lg p-6 border border-ivf-border">
              <h3 className="font-bold text-ivf-dark mb-2">Success Rate</h3>
              <p className="text-ivf-dark/80">{procedure.successRate}</p>
            </div>

            {/* FAQs */}
            {procedure.faqs.length > 0 && (
              <div>
                <h2 className="text-3xl font-bold text-ivf-dark mb-4">Frequently Asked Questions</h2>
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

        {/* CTA */}
        <section className="section-padding bg-ivf-pink text-ivf-white text-center">
          <div className="section-max-width max-w-2xl">
            <h2 className="text-4xl font-bold mb-4">Want To Discuss This Procedure?</h2>
            <p className="text-xl mb-8 text-ivf-white/90">
              Our doctors can explain how this procedure applies to your specific situation.
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
