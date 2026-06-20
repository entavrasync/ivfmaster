import { StoryCard } from '@/components/ui/StoryCard';
import { recognitionStories } from '@/lib/content/stories';
import { ArrowRight } from 'lucide-react';

export function RecognitionStories() {
  return (
    <section className="relative bg-ivf-white overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 right-0 w-96 h-96 bg-ivf-pink/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 section-max-width px-6 sm:px-8 lg:px-16 py-24 sm:py-32 lg:py-40">
        {/* Header - Editorial Style */}
        <div className="mb-24 space-y-6 max-w-3xl">
          <div>
            <div className="mb-5 inline-flex flex-col items-center gap-2.5">
              <p className="text-sm font-light tracking-[0.24em] uppercase text-ivf-mauve/80">
                Recognition
              </p>
              <div className="relative h-px w-20 bg-gradient-to-r from-transparent via-ivf-pink/70 to-transparent">
                <span className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ivf-pink" />
              </div>
            </div>
            <h2 className="headline-lg text-ivf-dark mb-6">
              Do Any Of These Moments Feel Familiar?
            </h2>
          </div>
          <p className="body-lg text-ivf-dark/75 leading-relaxed">
            The journey to parenthood can feel isolating, overwhelming, and deeply personal. These are conversations we have every day—moments of doubt, hope, frustration, and courage. You are not alone in this.
          </p>
        </div>

        {/* Stories - Asymmetrical, Documentary Layout */}
        <div className="space-y-16 mb-24">
          {recognitionStories.slice(0, 3).map((story, index) => {
            const isEven = index % 2 === 0;
            return (
              <div
                key={story.id}
                className={`grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center ${
                  !isEven ? 'md:grid-flow-dense' : ''
                }`}
              >
                {/* Story Content */}
                <div className={`space-y-6 ${!isEven ? 'md:col-start-2' : ''}`}>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="text-4xl flex-shrink-0">{story.icon}</div>
                      <div>
                        <h3 className="headline-md text-ivf-dark">{story.title}</h3>
                      </div>
                    </div>
                    <p className="text-lg text-ivf-dark/75 leading-relaxed">
                      {story.description}
                    </p>
                    <p className="italic text-ivf-dark/60 border-l-4 border-ivf-pink pl-4 py-2 text-lg">
                      &quot;{story.quote}&quot;
                    </p>
                  </div>
                </div>

                {/* Visual Accent */}
                <div className={`relative h-64 md:h-72 ${!isEven ? 'md:col-start-1 md:row-start-1' : ''}`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-ivf-pink/10 to-ivf-mauve/8 rounded-3xl flex items-center justify-center overflow-hidden group">
                    <div className="text-7xl opacity-60 group-hover:scale-110 transition-transform duration-500">
                      {story.icon}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Premium Recognition Message */}
        <div className="bg-gradient-to-br from-ivf-pink/8 to-ivf-mauve/6 border border-ivf-pink/20 rounded-3xl p-10 md:p-14 space-y-6">
          <div>
            <h3 className="headline-md text-ivf-dark mb-4">
              {"If This Is You—Let's Begin With Understanding"}
            </h3>
            <p className="body-lg text-ivf-dark/75">
              {"The first step isn't making decisions. It's gaining clarity. We begin by listening deeply, evaluating thoroughly, and educating compassionately. Only then—when you have all the information and support—do you and your partner decide what's right for your journey."}
            </p>
          </div>
          <a
            href="#final-cta"
            className="inline-flex items-center gap-3 btn-primary"
          >
            Schedule Your Understanding Consultation
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
}
