import { ArrowUpRight } from 'lucide-react'

import { Container } from '@/components/layout/Container'
import { Parallax } from '@/components/motion/Parallax'
import { Pressable } from '@/components/motion/Pressable'
import { Reveal } from '@/components/motion/Reveal'
import { Link } from '@/i18n/navigation'
import { aboutContent, type DoctorStory } from '@/lib/content/about'

import { EditorialPicture } from './EditorialPicture'

function DoctorChapter({ doctor, index }: { doctor: DoctorStory; index: number }) {
  const reversed = index % 2 === 1

  return (
    <article className={reversed ? 'bg-lavender' : 'bg-ink'}>
      <Container className="py-20 sm:py-28 lg:py-36">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className={reversed ? 'lg:order-2 lg:col-span-5' : 'lg:col-span-5'}>
            <Parallax range={20}>
              <Reveal y={18}>
                <EditorialPicture
                  image={doctor.image}
                  sizes="(max-width: 767px) 90vw, (max-width: 1023px) 70vw, 38vw"
                  className="aspect-[4/5] rounded-[1.75rem] bg-navy shadow-[0_28px_70px_rgba(10,22,50,0.22)] sm:rounded-[2.5rem]"
                />
              </Reveal>
            </Parallax>
          </div>

          <div className={reversed ? 'lg:order-1 lg:col-span-6 lg:col-start-1' : 'lg:col-span-6 lg:col-start-7'}>
            <Reveal y={18}>
              <p className={`eyebrow mb-4 ${reversed ? 'text-navy' : 'text-periwinkle'}`}>
                Two doctors, one continuity of care
              </p>
              <h2 className={`display-lg ${reversed ? 'text-ink' : 'text-ivory'}`}>{doctor.name}</h2>
              <p className={`mt-3 text-sm uppercase tracking-[0.1em] ${reversed ? 'text-navy' : 'text-periwinkle'}`}>
                {doctor.role}
              </p>
              <blockquote className={`mt-8 border-l-2 border-blush pl-5 font-display text-2xl leading-snug sm:text-3xl ${reversed ? 'text-navy' : 'text-lavender'}`}>
                “{doctor.pullQuote}”
              </blockquote>
            </Reveal>

            <div className={`mt-8 space-y-5 text-[1.02rem] leading-8 ${reversed ? 'text-slate' : 'text-lavender/80'}`}>
              {doctor.paragraphs.map((paragraph, paragraphIndex) => (
                <Reveal key={paragraph} delay={paragraphIndex * 0.06} y={14}>
                  <p>{paragraph}</p>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.18} y={12}>
              <p className={`mt-8 border-y py-5 text-sm leading-6 ${reversed ? 'border-periwinkle/60 text-navy' : 'border-periwinkle/30 text-periwinkle'}`}>
                {doctor.evidence}
              </p>
              <Pressable className="mt-8 w-full sm:w-fit" haptic>
                <Link
                  href={doctor.ctaHref}
                  className={`inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-full px-7 py-3.5 text-sm font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-blush focus-visible:ring-offset-4 sm:w-auto ${
                    reversed
                      ? 'bg-ink text-ivory hover:bg-navy focus-visible:ring-offset-lavender'
                      : 'bg-blush text-ink hover:bg-[#d97792] focus-visible:ring-offset-ink'
                  }`}
                >
                  {doctor.ctaLabel}
                  <ArrowUpRight aria-hidden="true" className="size-4" />
                </Link>
              </Pressable>
            </Reveal>
          </div>
        </div>
      </Container>
    </article>
  )
}

export function DoctorStories() {
  return (
    <section aria-label="Meet the doctors">
      {aboutContent.doctors.map((doctor, index) => (
        <DoctorChapter key={doctor.id} doctor={doctor} index={index} />
      ))}
    </section>
  )
}
