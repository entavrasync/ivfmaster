import { AnimatedCounter } from '@/components/ui/AnimatedCounter';

export function TrustIndicators() {
  const indicators = [
    {
      id: 'experience',
      value: 15,
      suffix: '+',
      label: 'Years of Experience',
      description: 'Trusted expertise in reproductive medicine',
    },
    {
      id: 'couples',
      value: 2500,
      suffix: '+',
      label: 'Couples Guided',
      description: 'Real people, real results',
    },
    {
      id: 'consultations',
      value: 100,
      suffix: '%',
      label: 'Confidential Consultations',
      description: 'Your privacy, always protected',
    },
    {
      id: 'success',
      value: 40,
      suffix: '%',
      label: 'IVF Success Rate',
      description: 'Above national average for our patient demographic',
    },
  ];

  return (
    <section className="relative bg-gradient-to-b from-ivf-white via-ivf-cream to-ivf-white overflow-hidden">
      {/* Premium Background Decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-ivf-pink/6 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-ivf-mauve/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 section-max-width px-6 sm:px-8 lg:px-16 py-24 sm:py-32 lg:py-40">
        {/* Header */}
        <div className="mb-20 max-w-3xl">
          <div className="mb-5 inline-flex flex-col items-center gap-2.5">
            <p className="text-sm font-light tracking-[0.24em] uppercase text-ivf-mauve/80">
              Proven Expertise
            </p>
            <div className="relative h-px w-20 bg-gradient-to-r from-transparent via-ivf-pink/70 to-transparent">
              <span className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ivf-pink" />
            </div>
          </div>
          <h2 className="headline-lg text-ivf-dark mb-6">
            The Metrics That Matter
          </h2>
          <p className="body-lg text-ivf-dark/75">
            {"These aren't just numbers—they're stories of families, dreams realized, and lives changed. Every metric represents real couples who chose to understand their fertility options with IVF Master."}
          </p>
        </div>

        {/* Premium Stats Grid - Floating with Glassmorphism */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {indicators.map((indicator, index) => (
            <div
              key={indicator.id}
              className="glassmorphic p-8 text-center group hover:bg-white/15 transition-all duration-300 transform hover:-translate-y-2"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <div className="mb-6 relative">
                <div className="text-5xl md:text-6xl font-bold text-ivf-pink mb-2">
                  <AnimatedCounter
                    value={indicator.value}
                    suffix={indicator.suffix}
                    duration={2500}
                  />
                </div>
              </div>
              <h3 className="font-semibold text-ivf-dark mb-2 leading-tight">{indicator.label}</h3>
              <p className="text-sm text-ivf-dark/60 leading-relaxed">{indicator.description}</p>
            </div>
          ))}
        </div>

        {/* Premium Trust Message - Editorial Style */}
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="space-y-6">
            <h3 className="headline-md text-center text-ivf-dark">
              We Don&apos;t Just Treat Conditions
            </h3>
            <p className="body-lg text-center text-ivf-dark/75 leading-relaxed">
              We guide whole people through their most important life decisions. Every consultation, every test, every conversation is shaped by one principle: your wellbeing comes first. We believe in earning your trust through expertise, compassion, and transparency.
            </p>
          </div>
          
          {/* Three Core Values */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {[
              {title: 'Expertise', desc: 'Decades of reproductive medicine experience'},
              {title: 'Compassion', desc: 'Understanding your emotional journey'},
              {title: 'Transparency', desc: 'Complete honesty about all options'}
            ].map((value, i) => (
              <div key={i} className="text-center space-y-3">
                <div className="text-3xl text-ivf-pink">✓</div>
                <h4 className="font-semibold text-ivf-dark text-lg">{value.title}</h4>
                <p className="text-ivf-dark/60 text-sm">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
