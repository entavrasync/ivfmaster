export function HiddenCost() {
  const costs = [
    {
      id: 'time',
      title: 'Lost Time',
      description: 'Every cycle without clarity is time you could have been taking action.',
      impact: 'Months turn to years wondering what you could have done differently.',
    },
    {
      id: 'emotional',
      title: 'Emotional Weight',
      description: 'Confusion, uncertainty, and lack of support take a psychological toll.',
      impact: 'The fertility journey becomes isolating instead of supported.',
    },
    {
      id: 'misinformation',
      title: 'Misinformation Costs',
      description: 'Bad advice leads to wrong decisions or missed opportunities.',
      impact: 'You might pursue treatments that won\'t work for your situation.',
    },
    {
      id: 'delayed',
      title: 'Delayed Decisions',
      description: 'Without expert guidance, important decisions get postponed.',
      impact: 'Age-related fertility decline accelerates while you&apos;re still deciding.',
    },
  ];

  return (
    <section className="section-padding bg-ivf-white">
      <div className="section-max-width">
        <div className="mb-16">
          <p className="text-ivf-pink font-semibold text-sm mb-2 uppercase tracking-wide">
            The Hidden Cost Of Not Knowing
          </p>
          <h2 className="text-4xl font-bold text-ivf-dark mb-4">
            What Uncertainty Really Costs You
          </h2>
          <p className="text-lg text-ivf-dark/70 max-w-3xl">
            Beyond medical costs, the cost of not understanding your fertility situation is measured in months, 
            emotional energy, and opportunities. That&apos;s why understanding comes first.
          </p>
        </div>

        {/* Cost Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {costs.map((cost) => (
            <div
              key={cost.id}
              className="bg-gradient-to-br from-ivf-cream to-ivf-cream/50 border-l-4 border-ivf-pink rounded-lg p-8"
            >
              <h3 className="text-xl font-semibold text-ivf-dark mb-3">{cost.title}</h3>
              <p className="text-ivf-dark/80 mb-4">{cost.description}</p>
              <div className="bg-ivf-pink/10 rounded-lg p-4 border border-ivf-pink/20">
                <p className="text-sm font-semibold text-ivf-pink">The Real Impact:</p>
                <p className="text-sm text-ivf-dark mt-2">{cost.impact}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Solution */}
        <div className="bg-ivf-dark text-ivf-white rounded-2xl p-12 text-center">
          <h3 className="text-3xl font-bold mb-4">That&apos;s Why We Start With Understanding</h3>
          <p className="text-lg text-ivf-white/90 max-w-2xl mx-auto mb-6">
            A thorough evaluation and clear explanation about your situation eliminates confusion, 
            reduces anxiety, and helps you make decisions with confidence—not because you&apos;re forced to, 
            but because you understand.
          </p>
          <div className="inline-block bg-ivf-pink px-8 py-3 rounded-lg font-semibold">
            Understanding changes everything
          </div>
        </div>
      </div>
    </section>
  );
}
