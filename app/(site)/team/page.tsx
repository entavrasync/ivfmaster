import Link from 'next/link';
import { Navigation } from '@/components/shared/Navigation';
import { Footer } from '@/components/shared/Footer';
import { doctors } from '@/lib/content/team';

export const metadata = {
  title: 'Our Fertility Doctors - IVF Master Team',
  description: 'Meet the experienced doctors at IVF Master leading your fertility journey with compassion and expertise.',
};

export default function TeamPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="section-padding bg-gradient-to-b from-ivf-pink to-ivf-mauve">
          <div className="section-max-width text-center text-ivf-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Our Expert Team
            </h1>
            <p className="text-xl max-w-2xl mx-auto">
              Experienced doctors dedicated to personalized, compassionate fertility care.
            </p>
          </div>
        </section>

        {/* Doctors Grid */}
        <section className="section-padding bg-ivf-white">
          <div className="section-max-width">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {doctors.map((doctor) => (
                <Link
                  key={doctor.id}
                  href={`/team/${doctor.slug}`}
                  className="group"
                >
                  <div className="bg-gradient-to-br from-ivf-cream to-ivf-white border-2 border-ivf-border rounded-xl overflow-hidden hover:border-ivf-pink hover:shadow-xl transition-all h-full flex flex-col cursor-pointer">
                    {/* Avatar */}
                    <div className="bg-gradient-to-br from-ivf-pink/20 to-ivf-mauve/20 h-64 flex items-center justify-center text-8xl group-hover:scale-105 transition-transform">
                      👨‍⚕️
                    </div>

                    {/* Info */}
                    <div className="p-8 flex flex-col flex-grow">
                      <h3 className="text-3xl font-bold text-ivf-dark group-hover:text-ivf-pink transition-colors mb-1">
                        {doctor.name}
                      </h3>

                      <p className="text-sm font-semibold text-ivf-pink mb-4">{doctor.title}</p>

                      <p className="text-sm text-ivf-dark/70 mb-4 italic">
                        {doctor.specialization}
                      </p>

                      <p className="text-ivf-dark/80 mb-6 flex-grow">
                        {doctor.shortBio}
                      </p>

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

        {/* Philosophy Section */}
        <section className="section-padding bg-ivf-cream">
          <div className="section-max-width max-w-3xl text-center">
            <h2 className="text-4xl font-bold text-ivf-dark mb-6">Our Shared Philosophy</h2>
            <p className="text-lg text-ivf-dark/80 mb-8 leading-relaxed">
              Each of our doctors brings unique expertise, but we all share a core belief: 
              every couple deserves clear information, personalized care, and emotional support. 
              Your fertility journey is not just medical—it&apos;s deeply personal. And we treat it that way.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-ivf-white rounded-lg p-6 border border-ivf-border">
                <p className="text-3xl mb-3">🧠</p>
                <h3 className="font-bold text-ivf-dark mb-2">Education First</h3>
                <p className="text-sm text-ivf-dark/70">You&apos;ll understand every step of your treatment.</p>
              </div>
              <div className="bg-ivf-white rounded-lg p-6 border border-ivf-border">
                <p className="text-3xl mb-3">❤️</p>
                <h3 className="font-bold text-ivf-dark mb-2">Compassion Always</h3>
                <p className="text-sm text-ivf-dark/70">We recognize the emotional complexity of fertility.</p>
              </div>
              <div className="bg-ivf-white rounded-lg p-6 border border-ivf-border">
                <p className="text-3xl mb-3">✓</p>
                <h3 className="font-bold text-ivf-dark mb-2">Results Matter</h3>
                <p className="text-sm text-ivf-dark/70">Expertise focused on achieving your goal.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section-padding bg-ivf-pink text-ivf-white text-center">
          <div className="section-max-width max-w-2xl">
            <h2 className="text-4xl font-bold mb-4">Ready To Meet Our Team?</h2>
            <p className="text-xl mb-8 text-ivf-white/90">
              Book a consultation to discuss your fertility journey with one of our doctors.
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
