import Link from 'next/link';

export function UnderstandingIVF() {
  const pillars = [
    {
      id: 'safe',
      title: 'Safe',
      description: 'IVF is one of the most researched medical procedures. With proper clinic standards, risks are minimal and well-managed.',
      icon: '✓',
    },
    {
      id: 'proven',
      title: 'Scientifically Proven',
      description: 'Over 40 years of data show IVF&apos;s effectiveness. Millions of healthy children born worldwide through IVF.',
      icon: '🔬',
    },
    {
      id: 'personalized',
      title: 'Personalized',
      description: 'Every protocol is tailored to your specific situation, age, and goals—not a one-size-fits-all approach.',
      icon: '👥',
    },
  ];

  return (
    <section className="section-padding bg-gradient-to-b from-ivf-cream via-ivf-white to-ivf-cream">
      <div className="section-max-width">
        <div className="mb-16 text-center">
          <p className="text-ivf-pink font-semibold text-sm mb-2 uppercase tracking-wide">
            Demystifying Fertility Treatment
          </p>
          <h2 className="text-4xl font-bold text-ivf-dark mb-4">
            IVF Simplified: Here&apos;s What You Should Know
          </h2>
          <p className="text-lg text-ivf-dark/70 max-w-2xl mx-auto">
            {"IVF doesn't have to be intimidating. Here are the fundamentals in plain language."}
          </p>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {pillars.map((pillar) => (
            <div
              key={pillar.id}
              className="text-center bg-ivf-white rounded-xl p-12 border border-ivf-border hover:shadow-lg transition-all"
            >
              <div className="text-5xl font-bold text-ivf-pink mb-4">{pillar.icon}</div>
              <h3 className="text-2xl font-semibold text-ivf-dark mb-3">{pillar.title}</h3>
              <p className="text-ivf-dark/70 leading-relaxed">{pillar.description}</p>
            </div>
          ))}
        </div>

        {/* Simple Process */}
        <div className="bg-ivf-white rounded-2xl border border-ivf-border p-12 mb-12">
          <h3 className="text-2xl font-semibold text-ivf-dark mb-8 text-center">The IVF Process In Simple Steps</h3>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            {[
              { step: 1, label: 'Stimulate Ovaries' },
              { step: 2, label: 'Retrieve Eggs' },
              { step: 3, label: 'Collect Sperm' },
              { step: 4, label: 'Fertilize in Lab' },
              { step: 5, label: 'Grow Embryos' },
              { step: 6, label: 'Transfer & Test' },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-ivf-pink text-white flex items-center justify-center font-bold mb-3">
                  {item.step}
                </div>
                <p className="text-sm font-semibold text-ivf-dark text-center">{item.label}</p>
                {idx < 5 && <div className="hidden md:block absolute left-1/2 -translate-x-1/2 mt-16 text-ivf-pink/30">→</div>}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-lg text-ivf-dark/80 mb-6">
            Confused about any of these steps? That&apos;s exactly what our team is here to explain.
          </p>
          <Link
            href="/educate-ivf"
            className="inline-block btn-primary"
          >
            Learn More About IVF
          </Link>
        </div>
      </div>
    </section>
  );
}
