import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Footer } from '@/components/shared/Footer';
import { doctors } from '@/lib/content/team';

export async function generateMetadata({ params }: { params: { doctor: string } }) {
  const doc = doctors.find((d) => d.slug === params.doctor);
  if (!doc) return { title: 'Doctor Not Found' };

  return {
    title: `${doc.name} - IVF Master`,
    description: `Meet ${doc.name}, ${doc.title} at IVF Master fertility clinic.`,
  };
}

export async function generateStaticParams() {
  return doctors.map((doctor) => ({
    doctor: doctor.slug,
  }));
}

export default function DoctorDetailPage({ params }: { params: { doctor: string } }) {
  const doc = doctors.find((d) => d.slug === params.doctor);

  if (!doc) {
    notFound();
  }

  const otherDoctors = doctors.filter((d) => d.id !== doc.id).slice(0, 3);

  return (
    <>
      <main className="min-h-screen">
        {/* Header */}
        <section className="section-padding bg-gradient-to-b from-ivf-pink/10 to-ivf-cream">
          <div className="section-max-width">
            <Link
              href="/team"
              className="text-ivf-pink font-semibold mb-6 inline-block hover:text-ivf-mauve transition-colors"
            >
              ← Back to Team
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              {/* Avatar */}
              <div className="bg-gradient-to-br from-ivf-pink/20 to-ivf-mauve/20 rounded-xl h-80 flex items-center justify-center text-8xl">
                👨‍⚕️
              </div>

              {/* Info */}
              <div>
                <h1 className="text-5xl font-bold text-ivf-dark mb-2">{doc.name}</h1>
                <p className="text-2xl font-semibold text-ivf-pink mb-2">{doc.title}</p>
                <p className="text-lg text-ivf-dark/80 mb-6 italic">{doc.specialization}</p>
                <p className="text-ivf-dark/80 mb-8 leading-relaxed">{doc.shortBio}</p>

                <div className="flex items-center gap-2 text-sm text-ivf-dark/60 mb-6">
                  <span>⏱️ {doc.experience}</span>
                </div>

                <Link
                  href="/contact"
                  className="inline-block btn-primary"
                >
                  Book Consultation With {doc.name.split(' ')[1]}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Philosophy */}
        <section className="section-padding bg-ivf-white">
          <div className="section-max-width max-w-3xl">
            <h2 className="text-4xl font-bold text-ivf-dark mb-8">My approach to fertility care</h2>

            <div className="prose prose-lg max-w-none">
              <div
                className="text-ivf-dark leading-relaxed whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: doc.philosophy }}
              />
            </div>
          </div>
        </section>

        {/* Qualifications */}
        <section className="section-padding bg-ivf-cream">
          <div className="section-max-width max-w-3xl">
            <h2 className="text-4xl font-bold text-ivf-dark mb-8">Qualifications & expertise</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-bold text-ivf-dark mb-4">Education & training</h3>
                <ul className="space-y-3">
                  {doc.qualifications.map((qual, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-ivf-dark/80">
                      <span className="text-ivf-pink font-bold flex-shrink-0">✓</span>
                      <span>{qual}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-ivf-white rounded-lg p-8 border-2 border-ivf-border">
                <h3 className="font-bold text-ivf-dark mb-4">Experience</h3>
                <p className="text-lg font-semibold text-ivf-pink mb-2">{doc.experience}</p>
                <p className="text-ivf-dark/80">
                  Dedicated to advancing fertility care and supporting every couple through their unique journey.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Other Doctors */}
        {otherDoctors.length > 0 && (
          <section className="section-padding bg-ivf-white">
            <div className="section-max-width">
              <h2 className="text-3xl font-bold text-ivf-dark mb-8 text-center">Meet our other doctors</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {otherDoctors.map((otherDoc) => (
                  <Link
                    key={otherDoc.id}
                    href={`/team/${otherDoc.slug}`}
                    className="group bg-gradient-to-br from-ivf-cream to-ivf-white border-2 border-ivf-border rounded-xl overflow-hidden hover:border-ivf-pink hover:shadow-lg transition-all"
                  >
                    <div className="bg-gradient-to-br from-ivf-pink/20 to-ivf-mauve/20 h-48 flex items-center justify-center text-6xl">
                      👨‍⚕️
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-ivf-dark group-hover:text-ivf-pink transition-colors mb-1">
                        {otherDoc.name}
                      </h3>
                      <p className="text-sm text-ivf-pink font-semibold mb-2">{otherDoc.title}</p>
                      <p className="text-xs text-ivf-dark/70 line-clamp-2">{otherDoc.shortBio}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="section-padding bg-ivf-pink text-ivf-white text-center">
          <div className="section-max-width max-w-2xl">
            <h2 className="text-4xl font-bold mb-4">Ready to consult?</h2>
            <p className="text-xl mb-8 text-ivf-white/90">
              Book a consultation to discuss your fertility journey.
            </p>
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
