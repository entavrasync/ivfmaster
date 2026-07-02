import { ArrowDownRight, ArrowUpRight } from 'lucide-react'

import { Container } from '@/components/layout/Container'
import { Parallax } from '@/components/motion/Parallax'
import { Pressable } from '@/components/motion/Pressable'
import { Reveal } from '@/components/motion/Reveal'
import { Link } from '@/i18n/navigation'
import { aboutContent } from '@/lib/content/about'

import { EditorialPicture } from './EditorialPicture'

export function AboutHero() {
  const { hero } = aboutContent

  return (
    <section className="relative overflow-hidden bg-ivory pb-16 pt-28 sm:pb-20 sm:pt-32 lg:min-h-[88svh] lg:pb-24 lg:pt-36">
      <Container className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="relative z-10 lg:col-span-7 lg:pr-10">
          <Reveal y={16}>
            <p className="eyebrow mb-6 text-navy">{hero.eyebrow}</p>
          </Reveal>
          <Reveal delay={0.08} y={20}>
            <h1 className="display-xl max-w-[11ch] text-ink">{hero.title}</h1>
          </Reveal>
          <Reveal delay={0.16} y={18}>
            <p className="mt-7 max-w-[36rem] text-[1.08rem] leading-8 text-slate sm:text-xl sm:leading-9">
              {hero.body}
            </p>
          </Reveal>
          <Reveal delay={0.24} y={14}>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Pressable className="w-full sm:w-auto" haptic>
                <Link
                  href="/contact"
                  className="inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-full bg-blush px-7 py-3.5 text-[0.95rem] font-semibold text-ink shadow-[0_14px_32px_rgba(226,132,156,0.22)] outline-none transition-colors hover:bg-[#d97792] focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-4 sm:w-auto"
                >
                  {hero.primaryCta}
                  <ArrowUpRight aria-hidden="true" className="size-4" />
                </Link>
              </Pressable>
              <Link
                href="#our-story"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-navy outline-none transition-colors hover:text-ink focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-4 sm:justify-start"
              >
                {hero.secondaryCta}
                <ArrowDownRight aria-hidden="true" className="size-4" />
              </Link>
            </div>
          </Reveal>
        </div>

        <div className="relative lg:col-span-5">
          <Parallax range={22}>
            <Reveal delay={0.12} y={18}>
              <div className="relative mx-auto max-w-[34rem]">
                <div className="absolute -inset-3 rounded-[2.25rem] border border-taupe/70 sm:-inset-4 sm:rounded-[2.75rem]" />
                <EditorialPicture
                  image={hero.image}
                  priority
                  sizes="(max-width: 767px) 90vw, (max-width: 1023px) 70vw, 38vw"
                  className="relative aspect-[4/5] rounded-[1.75rem] bg-ink shadow-[0_28px_70px_rgba(28,42,72,0.16)] sm:rounded-[2.25rem] md:aspect-[16/11] lg:aspect-[4/5]"
                />
                <p className="mt-5 text-xs leading-5 tracking-[0.08em] text-ash">
                  LISTENING · EXPLANATION · INDIVIDUAL CARE
                </p>
              </div>
            </Reveal>
          </Parallax>
        </div>
      </Container>
    </section>
  )
}
