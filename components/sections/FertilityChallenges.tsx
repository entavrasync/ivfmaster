import Link from 'next/link';

export function FertilityChallenges() {
  const challenges = [
    {
      id: 'delayed-pregnancy',
      title: 'Delayed Pregnancy',
      icon: '⏳',
      slug: 'delayed-pregnancy',
    },
    {
      id: 'pcos',
      title: 'PCOS',
      icon: '⚖️',
      slug: 'pcos-fertility',
    },
    {
      id: 'male-fertility',
      title: 'Male Fertility',
      icon: '♂️',
      slug: 'male-fertility-guide',
    },
    {
      id: 'age-related',
      title: 'Age Related Challenges',
      icon: '📅',
      slug: 'age-fertility-timeline',
    },
    {
      id: 'pregnancy-loss',
      title: 'Recurrent Pregnancy Loss',
      icon: '❤️',
      slug: 'recurrent-loss',
    },
    {
      id: 'unexplained',
      title: 'Unexplained Infertility',
      icon: '❓',
      slug: 'unexplained-infertility',
    },
  ];

  return (
    <section className="section-padding bg-ivf-cream">
      <div className="section-max-width">
        <div className="mb-16 text-center">
          <p className="text-ivf-pink font-semibold text-sm mb-2 uppercase tracking-wide">
            Understanding Fertility Challenges
          </p>
          <h2 className="text-4xl font-bold text-ivf-dark mb-4">
            Explore Common Fertility Concerns
          </h2>
          <p className="text-lg text-ivf-dark/70 max-w-2xl mx-auto">
            Each fertility situation is unique. Click any concern below to understand what it means and what options exist.
          </p>
        </div>

        {/* Challenges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((challenge) => (
            <Link
              key={challenge.id}
              href={`/educate-ivf/${challenge.slug}`}
              className="group bg-ivf-white border-2 border-ivf-border rounded-xl p-8 hover:border-ivf-pink hover:shadow-lg transition-all h-full flex flex-col items-center text-center"
            >
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">{challenge.icon}</div>
              <h3 className="text-xl font-semibold text-ivf-dark group-hover:text-ivf-pink transition-colors">
                {challenge.title}
              </h3>
              <div className="mt-4 text-ivf-pink font-semibold text-sm group-hover:translate-y-1 transition-transform">
                Learn More →
              </div>
            </Link>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-12 bg-ivf-white rounded-xl border border-ivf-border p-8 text-center">
          <p className="text-ivf-dark/80 mb-4">
            Don&apos;t see your specific situation? Every fertility journey is unique.
          </p>
          <Link
            href="/contact"
            className="inline-block text-ivf-pink font-semibold hover:text-ivf-mauve transition-colors"
          >
            Book a consultation to discuss your specific concerns →
          </Link>
        </div>
      </div>
    </section>
  );
}
