import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Footer } from '@/components/shared/Footer';
import { doctors } from '@/lib/content/team';
import { routing } from '@/i18n/routing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; doctor: string }>
}): Promise<Metadata> {
  const { doctor: slug } = await params;
  const doc = doctors.find((d) => d.slug === slug);
  if (!doc) return { title: 'Doctor Not Found' };
  return {
    title: `${doc.name} - IVF Master`,
    description: `Meet ${doc.name}, ${doc.title} at IVF Master fertility clinic.`,
  };
}

export async function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    doctors.map((doctor) => ({ locale, doctor: doctor.slug }))
  );
}

export default async function DoctorDetailPage({
  params,
}: {
  params: Promise<{ locale: string; doctor: string }>
}) {
  const { doctor: slug } = await params;
  const doc = doctors.find((d) => d.slug === slug);
  if (!doc) notFound();

  const otherDoctors = doctors.filter((d) => d.id !== doc.id).slice(0, 3);

  return (
    <>
      <main className="min-h-screen">
        <section className="section-padding bg-gradient-to-b from-ivf-pink/10 to-ivf-cream">
          <div className="section-max-width">
            <Link
              href="/team"
              className="text-ivf-pink font-semibold mb-6 inline-block hover:text-ivf-mauve transition-colors"
            >
              ← Back to Team
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="bg-gradient-to-br from-ivf-pink/20 to-ivf-mauve/20 rounded-xl h-80 flex items-center justify-center text-8xl">
                👨‍⚕️
              </div>
              <div>
                <h1 className="text-5xl font-bold text-ivf-dark mb-2">{doc.name}</h1>
                <p className="text-2xl font-semibold text-ivf-pink mb-2">{doc.title}</p>
                <p className="text-lg text-ivf-dark/80 mb-6 italic">{doc.specialization}</p>
                <p className="text-ivf-dark/80 mb-8 leading-relaxed">{doc.shortBio}</p>
                <Link href="/contact" className="inline-block btn-primary">
                  Book Consultation
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="section-padding bg-ivf-white">
          <div className="section-max-width max-w-3xl">
            <h2 className="text-4xl font-bold text-ivf-dark mb-8">My approach to fertility care</h2>
            <div
              className="text-ivf-dark leading-relaxed whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: doc.philosophy }}
            />
          </div>
        </section>

        <section className="section-padding bg-ivf-cream">
          <div className="section-max-width max-w-3xl">
            <h2 className="text-4xl font-bold text-ivf-dark mb-8">Qualifications & expertise</h2>
            <ul className="space-y-3">
              {doc.qualifications.map((qual, idx) => (
                <li key={idx} className="flex items-start gap-3 text-ivf-dark/80">
                  <span className="text-ivf-pink font-bold flex-shrink-0">✓</span>
                  <span>{qual}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {otherDoctors.length > 0 && (
          <section className="section-padding bg-ivf-white">
            <div className="section-max-width">
              <h2 className="text-3xl font-bold text-ivf-dark mb-8 text-center">Meet our other doctors</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {otherDoctors.map((other) => (
                  <Link
                    key={other.id}
                    href={`/team/${other.slug}`}
                    className="group bg-gradient-to-br from-ivf-cream to-ivf-white border-2 border-ivf-border rounded-xl overflow-hidden hover:border-ivf-pink hover:shadow-lg transition-all"
                  >
                    <div className="bg-gradient-to-br from-ivf-pink/20 to-ivf-mauve/20 h-48 flex items-center justify-center text-6xl">
                      👨‍⚕️
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-ivf-dark group-hover:text-ivf-pink transition-colors mb-1">
                        {other.name}
                      </h3>
                      <p className="text-sm text-ivf-pink font-semibold">{other.title}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="section-padding bg-ivf-pink text-ivf-white text-center">
          <div className="section-max-width max-w-2xl">
            <h2 className="text-4xl font-bold mb-4">Ready to consult?</h2>
            <Link
              href="/contact"
              className="inline-block bg-ivf-white text-ivf-pink font-bold py-3 px-8 rounded-lg hover:bg-ivf-cream transition-colors"
            >
              Book Consultation
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
