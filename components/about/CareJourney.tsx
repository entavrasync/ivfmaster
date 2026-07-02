import { Container } from '@/components/layout/Container'
import { Reveal } from '@/components/motion/Reveal'
import { aboutContent } from '@/lib/content/about'

export function CareJourney() {
  const { care } = aboutContent

  return (
    <section className="bg-ivory py-20 sm:py-28 lg:py-36">
      <Container>
        <Reveal y={18} className="max-w-3xl">
          <p className="eyebrow mb-5 text-navy">{care.eyebrow}</p>
          <h2 className="display-lg">{care.title}</h2>
          <p className="mt-6 text-lg leading-8 text-slate">{care.intro}</p>
        </Reveal>

        <ol className="relative mt-14 border-l border-periwinkle/70 pl-7 sm:mt-16 sm:pl-10 lg:grid lg:grid-cols-4 lg:gap-8 lg:border-l-0 lg:border-t lg:pl-0">
          {care.steps.map((step, index) => (
            <li key={step.number} className="relative pb-12 last:pb-0 lg:pb-0 lg:pt-9">
              <span className="absolute -left-[2.08rem] top-1 size-2.5 rounded-full bg-blush ring-8 ring-ivory sm:-left-[2.83rem] lg:-top-[0.34rem] lg:left-0" />
              <Reveal delay={index * 0.08} y={14}>
                <p className="font-display text-4xl text-periwinkle">{step.number}</p>
                <h3 className="mt-5 text-[1.45rem] leading-snug text-ink">{step.title}</h3>
                <p className="mt-4 max-w-[30rem] text-base leading-7 text-slate">{step.body}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  )
}
