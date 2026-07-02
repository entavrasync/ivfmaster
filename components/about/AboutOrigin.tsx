import { Container } from '@/components/layout/Container'
import { Reveal } from '@/components/motion/Reveal'
import { aboutContent } from '@/lib/content/about'

export function AboutOrigin() {
  const { origin } = aboutContent

  return (
    <section id="our-story" className="scroll-mt-24 border-y border-taupe/70 bg-lavender py-20 sm:py-28 lg:py-36">
      <Container>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <Reveal y={18}>
              <p className="eyebrow mb-5 text-navy">{origin.eyebrow}</p>
              <h2 className="display-lg max-w-[12ch]">{origin.title}</h2>
            </Reveal>
            <Reveal delay={0.12} y={14}>
              <blockquote className="mt-10 border-l-2 border-blush pl-6 font-display text-2xl leading-snug text-navy sm:text-3xl">
                “{origin.quote}”
              </blockquote>
            </Reveal>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <div className="space-y-6 text-[1.05rem] leading-8 text-slate sm:text-lg sm:leading-9">
              {origin.paragraphs.map((paragraph, index) => (
                <Reveal key={paragraph} delay={index * 0.07} y={16}>
                  <p>{paragraph}</p>
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.18} y={12}>
              <p className="mt-10 border-t border-periwinkle/60 pt-5 text-sm leading-6 text-navy">
                <span className="mr-2 font-semibold uppercase tracking-[0.12em]">From the beginning</span>
                {origin.note}
              </p>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  )
}
