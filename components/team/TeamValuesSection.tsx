import { Heart, Users, Award, type LucideIcon } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { Reveal } from '@/components/motion/Reveal'
import type { TeamValues } from '@/sanity/lib/team-values-mapping'

const icons: Record<TeamValues['cards'][number]['icon'], LucideIcon> = { heart: Heart, users: Users, award: Award }
export function TeamValuesSection({ values }: { values: TeamValues | null }) {
  if (!values?.cards.length) return null
  return <section className="bg-lavender/65 py-20 sm:py-24 lg:py-28" aria-labelledby="team-values-heading">
    <Container>
      <Reveal><div className="mb-12 max-w-[46rem] sm:mb-16">
        {values.eyebrow && <p className="eyebrow mb-4 normal-case text-navy">{values.eyebrow}</p>}
        <h2 id="team-values-heading" className="display-lg text-ink">{values.heading}</h2>
        {values.subheading && <p className="mt-5 text-lg leading-8 text-slate">{values.subheading}</p>}
      </div></Reveal>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{values.cards.map(card => {
        const Icon = icons[card.icon]
        return <Reveal key={card._key}>
          <article className="h-full rounded-[2rem] border border-taupe/55 bg-ivory p-7 shadow-[0_18px_48px_-28px_rgba(28,42,72,0.28)] sm:p-8">
            <div className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-lavender"><Icon aria-hidden="true" className="size-7 text-navy" /></div>
            <h3 className="font-display text-2xl leading-tight text-ink">{card.title}</h3>
            <p className="mt-4 text-lg leading-8 text-slate">{card.description}</p>
          </article>
        </Reveal>
      })}</div>
    </Container>
  </section>
}
