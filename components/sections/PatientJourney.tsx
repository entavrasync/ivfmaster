export function PatientJourney() {
  const journey = [
    {
      id: 'consultation',
      step: 1,
      title: 'Understanding Consultation',
      description: 'We listen to your story, understand your concerns, and explain what might be happening.',
      icon: '🗣️',
    },
    {
      id: 'evaluation',
      step: 2,
      title: 'Thorough Evaluation',
      description: 'Comprehensive tests help us understand your situation fully—both medical and emotional.',
      icon: '🔍',
    },
    {
      id: 'education',
      step: 3,
      title: 'Clear Education',
      description: 'We explain your results, options, and what each path looks like—in plain language.',
      icon: '💡',
    },
    {
      id: 'planning',
      step: 4,
      title: 'Personalized Planning',
      description: 'Together, we create a plan tailored to your goals, timeline, and preferences.',
      icon: '📋',
    },
    {
      id: 'treatment',
      step: 5,
      title: 'Expert Treatment',
      description: 'We execute the plan with precision, expertise, and continuous support.',
      icon: '⭐',
    },
    {
      id: 'support',
      step: 6,
      title: 'Ongoing Support',
      description: 'Whether success comes quickly or takes time, we&apos;re here for every step.',
      icon: '🤝',
    },
  ];

  return (
    <section className="section-padding bg-ivf-cream">
      <div className="section-max-width">
        <div className="mb-16 text-center">
          <p className="text-ivf-pink font-semibold text-sm mb-2 uppercase tracking-wide">
            The IVF Master Journey
          </p>
          <h2 className="text-4xl font-bold text-ivf-dark mb-4">
            Your Path From Confusion To Confidence
          </h2>
          <p className="text-lg text-ivf-dark/70 max-w-2xl mx-auto">
            This is what the fertility journey looks like with expert guidance at every step.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Mobile/Desktop Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {journey.map((item, idx) => (
              <div key={item.id} className="relative">
                {/* Step Card */}
                <div className="bg-ivf-white border-2 border-ivf-border rounded-xl p-8 h-full hover:border-ivf-pink hover:shadow-lg transition-all">
                  {/* Step Number */}
                  <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-ivf-pink text-white flex items-center justify-center font-bold text-lg">
                    {item.step}
                  </div>

                  <div className="text-5xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-semibold text-ivf-dark mb-2">{item.title}</h3>
                  <p className="text-ivf-dark/70">{item.description}</p>
                </div>

                {/* Connector Arrow (hidden on mobile) */}
                {idx < journey.length - 1 && (
                  <div className="hidden lg:flex absolute -right-4 top-1/2 transform -translate-y-1/2 text-ivf-pink/30 text-2xl">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Key Message */}
        <div className="mt-16 bg-gradient-to-r from-ivf-pink/10 to-ivf-mauve/10 border border-ivf-border rounded-2xl p-12 text-center">
          <h3 className="text-2xl font-bold text-ivf-dark mb-4">
            Every Step Is About Reducing Fear & Building Confidence
          </h3>
          <p className="text-lg text-ivf-dark/80 max-w-3xl mx-auto">
            {"We don't rush through this process. By the time treatment begins, you'll understand everything that's happening and why. That clarity transforms the entire experience."}
          </p>
        </div>
      </div>
    </section>
  );
}
