export function WhyIVFMaster() {
  const differences = [
    {
      id: 'philosophy',
      title: 'Philosophy First',
      description: 'We share our approach to fertility care openly. You&apos;ll understand not just what we do, but why.',
      icon: '🧠',
    },
    {
      id: 'approach',
      title: 'Personalized Approach',
      description: 'No two situations are identical. Every protocol is tailored to your specific needs, age, and goals.',
      icon: '👥',
    },
    {
      id: 'education',
      title: 'Education-Centric',
      description: 'We believe informed couples make better decisions. We prioritize your understanding.',
      icon: '📚',
    },
    {
      id: 'experience',
      title: 'Expert Care',
      description: 'Experienced doctors, advanced technology, and proven protocols—all combined with genuine care.',
      icon: '⭐',
    },
    {
      id: 'support',
      title: 'Emotional Support',
      description: 'Fertility treatment is emotional. We provide counseling, reassurance, and real human connection.',
      icon: '❤️',
    },
    {
      id: 'transparency',
      title: 'Complete Transparency',
      description: 'No hidden costs, no pressure tactics. You&apos;ll always know what to expect.',
      icon: '✓',
    },
  ];

  return (
    <section className="section-padding bg-ivf-white">
      <div className="section-max-width">
        <div className="mb-16 text-center">
          <p className="text-ivf-pink font-semibold text-sm mb-2 uppercase tracking-wide">
            What Makes Us Different
          </p>
          <h2 className="text-4xl font-bold text-ivf-dark mb-4">
            Why Couples Choose IVF Master
          </h2>
          <p className="text-lg text-ivf-dark/70 max-w-2xl mx-auto">
            In a fertility landscape filled with options, here&apos;s what truly sets IVF Master apart.
          </p>
        </div>

        {/* Differences Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {differences.map((diff) => (
            <div
              key={diff.id}
              className="bg-gradient-to-br from-ivf-cream to-ivf-white border border-ivf-border rounded-xl p-8 hover:shadow-lg transition-all"
            >
              <div className="text-5xl mb-4">{diff.icon}</div>
              <h3 className="text-xl font-semibold text-ivf-dark mb-3">{diff.title}</h3>
              <p className="text-ivf-dark/70">{diff.description}</p>
            </div>
          ))}
        </div>

        {/* Core Promise */}
        <div className="mt-16 bg-gradient-to-r from-ivf-pink/5 to-ivf-mauve/5 border border-ivf-border rounded-2xl p-12">
          <h3 className="text-3xl font-bold text-ivf-dark mb-6 text-center">Our core promise</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-lg font-semibold text-ivf-pink mb-2">You Will Understand</p>
              <p className="text-ivf-dark/70">
                Every test, procedure, and recommendation will be explained clearly.
              </p>
            </div>
            <div>
              <p className="text-lg font-semibold text-ivf-pink mb-2">You Will Be Heard</p>
              <p className="text-ivf-dark/70">
                Your concerns, questions, and preferences matter in every decision.
              </p>
            </div>
            <div>
              <p className="text-lg font-semibold text-ivf-pink mb-2">You Will Succeed</p>
              <p className="text-ivf-dark/70">
                We&apos;ll work together toward your goal with expert guidance and support.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
