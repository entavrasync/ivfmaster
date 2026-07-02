import { ArrowRight, BookOpen } from 'lucide-react'

import { Container } from '@/components/layout/Container'
import { Pressable } from '@/components/motion/Pressable'
import { Reveal } from '@/components/motion/Reveal'
import { Link } from '@/i18n/navigation'
import { aboutContent } from '@/lib/content/about'

export function AboutClosing() {
  const { closing } = aboutContent

  return (
    <section className="bg-navy py-20 text-ivory sm:py-28 lg:py-36">
      <Container>
        <div className="mx-auto max-w-4xl text-center">
          <Reveal y={16}>
            <p className="eyebrow mb-5 text-periwinkle">{closing.eyebrow}</p>
            <h2 className="display-lg text-ivory">{closing.title}</h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-lavender/80">{closing.body}</p>
          </Reveal>

          <Reveal delay={0.12} y={14}>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Pressable haptic className="w-full sm:w-auto">
                <Link
                  href="/contact"
                  className="inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-full bg-blush px-7 py-3.5 text-sm font-semibold text-ink outline-none transition-colors hover:bg-[#d97792] focus-visible:ring-2 focus-visible:ring-ivory focus-visible:ring-offset-4 focus-visible:ring-offset-navy sm:w-auto"
                >
                  {closing.primaryCta}
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
              </Pressable>
              <Pressable className="w-full sm:w-auto">
                <Link
                  href="/educate-ivf"
                  className="inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-full border border-periwinkle/70 px-7 py-3.5 text-sm font-semibold text-ivory outline-none transition-colors hover:bg-ivory/10 focus-visible:ring-2 focus-visible:ring-ivory focus-visible:ring-offset-4 focus-visible:ring-offset-navy sm:w-auto"
                >
                  <BookOpen aria-hidden="true" className="size-4" />
                  {closing.secondaryCta}
                </Link>
              </Pressable>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
