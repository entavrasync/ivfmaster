import Link from 'next/link';
import { Footer } from '@/components/shared/Footer';

export const metadata = {
  title: 'About IVF Master - Our Story & Mission',
  description: 'Learn about IVF Master fertility clinic in Sangli and our commitment to compassionate fertility care.',
};

export default function AboutPage() {
  return (
    <>
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="section-padding bg-gradient-to-b from-ivf-pink to-ivf-mauve">
          <div className="section-max-width text-center text-ivf-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              About IVF Master
            </h1>
            <p className="text-xl max-w-2xl mx-auto">
              Where Advanced Fertility Science Meets Compassionate Care
            </p>
          </div>
        </section>

        {/* Our Story */}
        <section className="section-padding bg-ivf-cream">
          <div className="section-max-width max-w-3xl">
            <h2 className="text-4xl font-bold text-ivf-dark mb-6">Our story</h2>
            <div className="space-y-4 text-ivf-dark/80 leading-relaxed">
              <p>
                IVF Master was founded on a simple belief: fertility treatment should be about more than medical protocols. 
                It should be about understanding, compassion, and empowering couples to make informed decisions about their 
                most important life goals.
              </p>
              <p>
                Our founders recognized a gap in fertility care. Many couples felt rushed through consultations, confused 
                about their options, and left to navigate emotionally complex journeys alone. That changed when we opened IVF Master.
              </p>
              <p>
                Today, we're proud to serve couples throughout Sangli and Maharashtra with evidence-based treatment, 
                personalized care plans, and genuine emotional support.
              </p>
            </div>
          </div>
        </section>

        {/* Our Mission */}
        <section className="section-padding bg-ivf-white">
          <div className="section-max-width max-w-3xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-bold text-ivf-dark mb-4">Our mission</h3>
                <div className="bg-gradient-to-br from-ivf-pink/10 to-ivf-mauve/10 rounded-lg p-6 border-l-4 border-ivf-pink">
                  <p className="text-ivf-dark/80 leading-relaxed">
                    To guide couples through their fertility journey with clarity, compassion, and cutting-edge science—
                    helping them understand their options, make confident decisions, and achieve their dreams of parenthood.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-ivf-dark mb-4">Our values</h3>
                <ul className="space-y-3">
                  {[
                    { title: 'Compassion', desc: 'Every couple deserves genuine care' },
                    { title: 'Transparency', desc: 'Clear communication, no surprises' },
                    { title: 'Excellence', desc: 'Evidence-based treatment protocols' },
                    { title: 'Respect', desc: 'Honoring your autonomy and choices' },
                  ].map((value) => (
                    <li key={value.title} className="flex gap-3">
                      <span className="text-ivf-pink font-bold flex-shrink-0">✓</span>
                      <div>
                        <p className="font-semibold text-ivf-dark">{value.title}</p>
                        <p className="text-sm text-ivf-dark/70">{value.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Our Commitment */}
        <section className="section-padding bg-ivf-cream">
          <div className="section-max-width max-w-3xl">
            <h2 className="text-4xl font-bold text-ivf-dark mb-8 text-center">Our commitment to you</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  icon: '📞',
                  title: 'Accessible Support',
                  desc: 'Response within 24 hours. Consultations available online and in-person.',
                },
                {
                  icon: '🔒',
                  title: 'Complete Confidentiality',
                  desc: 'Your privacy is paramount. All information is treated with utmost discretion.',
                },
                {
                  icon: '💡',
                  title: 'Education First',
                  desc: 'Every decision is an informed decision. We explain everything clearly.',
                },
                {
                  icon: '❤️',
                  title: 'Emotional Support',
                  desc: 'Counseling and support services to help you through every step.',
                },
                {
                  icon: '✓',
                  title: 'Evidence-Based Care',
                  desc: 'All protocols are based on latest research and best practices.',
                },
                {
                  icon: '🎯',
                  title: 'Results Focused',
                  desc: 'Our goal is your goal: a healthy pregnancy and healthy baby.',
                },
              ].map((commitment) => (
                <div key={commitment.title} className="bg-ivf-white rounded-lg p-6 border-2 border-ivf-border hover:border-ivf-pink transition-colors">
                  <p className="text-4xl mb-3">{commitment.icon}</p>
                  <h3 className="font-bold text-ivf-dark mb-2">{commitment.title}</h3>
                  <p className="text-sm text-ivf-dark/70">{commitment.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Community Impact */}
        <section className="section-padding bg-ivf-white">
          <div className="section-max-width max-w-3xl text-center">
            <h2 className="text-4xl font-bold text-ivf-dark mb-6">Our community impact</h2>
            <p className="text-lg text-ivf-dark/80 mb-8 leading-relaxed">
              Beyond clinical excellence, IVF Master is committed to advancing fertility awareness and education 
              in Sangli and Maharashtra. We host community workshops, provide educational resources, and support 
              couples at every stage of their journey—whether they choose fertility treatment or not.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="section-padding bg-ivf-pink text-ivf-white text-center">
          <div className="section-max-width max-w-2xl">
            <h2 className="text-4xl font-bold mb-4">Join our community</h2>
            <p className="text-xl mb-8 text-ivf-white/90">
              Start your fertility journey with a team that genuinely cares about your success.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-ivf-white text-ivf-pink font-bold py-3 px-8 rounded-lg hover:bg-ivf-cream transition-colors"
            >
              Get In Touch
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
