import { successStories } from '@/lib/content/stories';

export function SuccessStories() {
  return (
    <section className="relative bg-gradient-to-b from-ivf-white via-ivf-cream to-ivf-white overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 right-1/4 w-96 h-96 bg-ivf-pink/6 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 section-max-width px-6 sm:px-8 lg:px-16 py-24 sm:py-32 lg:py-40">
        {/* Header */}
        <div className="mb-24 space-y-6 max-w-3xl">
          <p className="text-sm font-light tracking-widest uppercase text-ivf-mauve/70">Real Journeys</p>
          <h2 className="headline-lg text-ivf-dark mb-6">
            Couples Who Found Their Way
          </h2>
          <p className="body-lg text-ivf-dark/75">
            {"These aren't generic testimonials. These are real families with real doubts, real decisions, and real joy. Every story represents the moment when uncertainty transformed into hope."}
          </p>
        </div>

        {/* Stories - Magazine-Style Panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {successStories.slice(0, 4).map((story, index) => (
            <div
              key={story.id}
              className="group relative bg-white/60 backdrop-blur-sm rounded-3xl p-10 md:p-12 border border-white/40 hover:bg-white/80 hover:border-ivf-pink/30 transition-all duration-300 transform hover:-translate-y-2"
            >
              {/* Decorative Number */}
              <div className="absolute -top-6 -right-4 text-8xl font-bold text-ivf-pink/8 group-hover:text-ivf-pink/12 transition-colors">
                {String(index + 1).padStart(2, '0')}
              </div>

              <div className="relative space-y-5">
                {/* Couple Name - Prominent */}
                <h3 className="headline-md text-ivf-dark group-hover:text-ivf-pink transition-colors">
                  {story.couple}
                </h3>

                {/* Challenge */}
                <div>
                  <p className="text-xs font-semibold tracking-widest uppercase text-ivf-mauve/70 mb-2">
                    Their Challenge
                  </p>
                  <p className="text-lg text-ivf-dark/80 font-light leading-relaxed">
                    {story.initialConcern}
                  </p>
                </div>

                {/* Journey */}
                <div className="border-t border-ivf-pink/10 pt-5">
                  <p className="text-xs font-semibold tracking-widest uppercase text-ivf-mauve/70 mb-2">
                    Their Journey
                  </p>
                  <p className="text-base text-ivf-dark/75 leading-relaxed">
                    {story.journey}
                  </p>
                </div>

                {/* Outcome - Highlighted */}
                <div className="bg-gradient-to-br from-ivf-pink/8 to-ivf-mauve/6 rounded-2xl p-4 border border-ivf-pink/20">
                  <p className="text-xs font-semibold tracking-widest uppercase text-ivf-pink mb-1">
                    Their Result
                  </p>
                  <p className="text-lg font-semibold text-ivf-pink">
                    {story.outcome}
                  </p>
                </div>

                {/* Duration */}
                <p className="text-xs text-ivf-dark/50 pt-2">
                  Timeline: <span className="font-semibold text-ivf-dark/70">{story.duration}</span>
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Hope */}
        <div className="mt-16 bg-gradient-to-r from-ivf-pink to-ivf-mauve rounded-2xl p-12 text-center text-ivf-white">
          <h3 className="text-3xl font-bold mb-4">Your Story Could Be Next</h3>
          <p className="text-lg text-ivf-white/90 max-w-2xl mx-auto">
            Every person&apos;s fertility journey is different. These stories represent different ages, 
            different diagnoses, and different paths—but they all led to parenthood with expert guidance and support.
          </p>
        </div>
      </div>
    </section>
  );
}
