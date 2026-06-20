import Link from 'next/link';
import { Navigation } from '@/components/shared/Navigation';
import { Footer } from '@/components/shared/Footer';
import { procedures } from '@/lib/content/procedures';

export const metadata = {
  title: 'Fertility Treatment Options - IVF Master Procedures',
  description: 'Learn about IVF, IUI, ICSI, egg freezing, and other fertility treatment options.',
};

export default function ProceduresPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="section-padding bg-gradient-to-b from-ivf-mauve to-ivf-pink">
          <div className="section-max-width text-center text-ivf-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Treatment Options
            </h1>
            <p className="text-xl max-w-2xl mx-auto">
              Understanding your fertility treatment options—from simple to advanced, with clear explanations.
            </p>
          </div>
        </section>

        {/* Introduction */}
        <section className="section-padding bg-ivf-cream">
          <div className="section-max-width max-w-3xl text-center mb-12">
            <p className="text-lg text-ivf-dark/80">
              The right procedure depends on your unique situation. Our doctors will discuss all options 
              and recommend the approach most likely to succeed for you.
            </p>
          </div>
        </section>

        {/* Procedures Grid */}
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

                    <p className="text-ivf-dark/70 mb-4 flex-grow">
                      {procedure.shortDescription}
                    </p>

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

        {/* CTA */}
        <section className="section-padding bg-ivf-pink text-ivf-white text-center">
          <div className="section-max-width max-w-2xl">
            <h2 className="text-4xl font-bold mb-4">Unsure Which Option Is Right For You?</h2>
            <p className="text-xl mb-8 text-ivf-white/90">
              Our doctors will review your situation and recommend the best approach.
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
