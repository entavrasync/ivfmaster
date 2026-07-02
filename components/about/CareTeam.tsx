import { Container } from '@/components/layout/Container'
import { Parallax } from '@/components/motion/Parallax'
import { Reveal } from '@/components/motion/Reveal'
import { aboutContent } from '@/lib/content/about'

import { EditorialPicture } from './EditorialPicture'

export function CareTeam() {
  const { team } = aboutContent

  return (
    <section className="overflow-hidden bg-ivory py-20 sm:py-28 lg:py-36">
      <Container>
        <div className="grid items-end gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-7" y={18}>
            <p className="eyebrow mb-5 text-navy">{team.eyebrow}</p>
            <h2 className="display-lg max-w-[13ch]">{team.title}</h2>
          </Reveal>
          <Reveal className="lg:col-span-4 lg:col-start-9" delay={0.08} y={14}>
            <p className="text-lg leading-8 text-slate">{team.intro}</p>
          </Reveal>
        </div>

        <Parallax range={18}>
          <Reveal delay={0.1} y={18}>
            <EditorialPicture
              image={team.image}
              sizes="(max-width: 767px) 90vw, 90vw"
              className="mt-12 aspect-[4/5] rounded-[1.75rem] bg-ink shadow-[0_28px_70px_rgba(28,42,72,0.16)] sm:rounded-[2.5rem] md:aspect-[16/8]"
            />
          </Reveal>
        </Parallax>

        <div className="-mx-[var(--gutter-mobile)] mt-10 flex snap-x snap-mandatory gap-0 overflow-x-auto px-[var(--gutter-mobile)] pb-3 sm:-mx-[var(--gutter-tablet)] sm:px-[var(--gutter-tablet)] lg:mx-0 lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-0 lg:pb-0">
          {team.moments.map((moment, index) => (
            <Reveal
              key={moment.title}
              delay={index * 0.07}
              y={12}
              className="w-[82vw] shrink-0 snap-start border-l border-taupe px-6 first:border-l-0 first:pl-0 sm:w-[62vw] lg:w-auto lg:first:border-l lg:first:pl-6"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blush">0{index + 1}</p>
              <h3 className="mt-4 text-2xl text-ink">{moment.title}</h3>
              <p className="mt-3 max-w-sm text-base leading-7 text-slate">{moment.body}</p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
