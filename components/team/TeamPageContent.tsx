import { ArrowRight, ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'

import { Container } from '@/components/layout/Container'
import { Pressable } from '@/components/motion/Pressable'
import { Reveal } from '@/components/motion/Reveal'
import { Stagger, StaggerItem } from '@/components/motion/Stagger'
import { Link } from '@/i18n/navigation'
import { careTeam, doctors, facilityPhotos } from '@/lib/team'
import { cn } from '@/lib/utils'

export async function TeamPageContent() {
  const t = await getTranslations('Team')
  const localizedDoctors = doctors.map((doctor) => {
    const prefix = `doctors.${doctor.messageKey}` as const

    return {
      ...doctor,
      name: t(`${prefix}.name`),
      title: t(`${prefix}.title`),
      essence: t(`${prefix}.essence`),
      intro: t(`${prefix}.intro`),
      credentials: t.raw(`${prefix}.credentials`) as string[],
      imageAlt: t(`${prefix}.imageAlt`),
    }
  })
  const localizedCareTeam = careTeam.map((member) => {
    const prefix = `careTeam.${member.messageKey}` as const

    return {
      ...member,
      name: t(`${prefix}.name`),
      role: t(`${prefix}.role`),
      blurb: t(`${prefix}.blurb`),
      imageAlt: t(`${prefix}.imageAlt`),
    }
  })
  const localizedFacilityPhotos = facilityPhotos.map((photo) => {
    const prefix = `facilityPhotos.${photo.messageKey}` as const

    return {
      ...photo,
      caption: t(`${prefix}.caption`),
      imageAlt: t(`${prefix}.imageAlt`),
    }
  })

  return (
    <>
      <section className="relative overflow-hidden bg-ivory pb-20 pt-36 sm:pb-24 sm:pt-40 lg:pb-32 lg:pt-44">
        <div
          aria-hidden="true"
          className="absolute -right-28 top-24 size-[26rem] rounded-full bg-lavender/70 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute -left-40 bottom-0 size-[24rem] rounded-full bg-blush/10 blur-3xl"
        />
        <Container className="relative">
          <div className="max-w-[58rem]">
            <Reveal y={14}>
              <p className="eyebrow mb-6 normal-case text-navy">{t('eyebrow')}</p>
            </Reveal>
            <Reveal delay={0.08} y={18}>
              <h1 className="display-xl max-w-[12ch] text-ink">{t('headline')}</h1>
            </Reveal>
            <Reveal delay={0.16} y={18}>
              <p className="mt-7 max-w-[48rem] text-xl leading-9 text-slate sm:text-[1.35rem] sm:leading-10">
                {t('lead')}
              </p>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="bg-[#f6efe6] py-20 sm:py-24 lg:py-32" aria-labelledby="doctors-heading">
        <Container>
          <Reveal>
            <div className="mb-12 flex flex-col gap-4 sm:mb-16 lg:mb-20 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="eyebrow mb-4 normal-case text-navy">{t('doctorsEyebrow')}</p>
                <h2 id="doctors-heading" className="display-lg max-w-[15ch] text-ink">
                  {t('doctorsHeading')}
                </h2>
              </div>
              <p className="max-w-[34rem] text-lg leading-8 text-slate">{t('doctorsLead')}</p>
            </div>
          </Reveal>

          <div className="space-y-14 sm:space-y-18 lg:space-y-24">
            {localizedDoctors.map((doctor, index) => (
              <Reveal key={doctor.slug} y={20}>
                <article className="overflow-hidden rounded-[2rem] border border-taupe/55 bg-ivory shadow-[0_28px_80px_-36px_rgba(28,42,72,0.34)] sm:rounded-[2.5rem]">
                  <div className="grid items-stretch lg:grid-cols-12">
                    <div
                      className={cn(
                        'relative min-h-[31rem] overflow-hidden sm:min-h-[38rem] lg:col-span-5 lg:min-h-[46rem]',
                        index % 2 === 1 && 'lg:order-2'
                      )}
                    >
                      <Image
                        src={doctor.image.src}
                        alt={doctor.imageAlt}
                        fill
                        sizes="(max-width: 1023px) 100vw, 42vw"
                        className="object-cover transition-transform duration-700 ease-out hover:scale-[1.02] motion-reduce:transition-none"
                        style={{ objectPosition: doctor.image.position }}
                      />
                      <div
                        aria-hidden="true"
                        className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-ink/15 to-transparent"
                      />
                      <p className="absolute bottom-6 left-6 rounded-full border border-white/45 bg-ivory/80 px-4 py-2 text-sm font-medium text-navy shadow-sm backdrop-blur-md sm:bottom-8 sm:left-8">
                        {t('portraitPlaceholder')}
                      </p>
                    </div>

                    <div
                      className={cn(
                        'flex flex-col justify-center p-7 sm:p-10 lg:col-span-7 lg:p-14 xl:p-16',
                        index % 2 === 1 && 'lg:order-1'
                      )}
                    >
                      <p className="font-display text-[1.35rem] italic leading-8 text-[#8a5d3a] sm:text-2xl sm:leading-9">
                        “{doctor.essence}”
                      </p>
                      <h3 className="mt-5 font-display text-[2.35rem] leading-[1.08] tracking-[-0.025em] text-ink sm:text-5xl">
                        {doctor.name}
                      </h3>
                      <p className="mt-3 text-base font-semibold leading-7 text-navy sm:text-lg">
                        {doctor.title}
                      </p>
                      <p className="mt-6 max-w-[42rem] text-lg leading-8 text-slate">{doctor.intro}</p>

                      <ul className="mt-8 grid gap-3 border-t border-taupe/60 pt-7 sm:grid-cols-2 sm:gap-x-8">
                        {doctor.credentials.map((credential) => (
                          <li key={credential} className="flex gap-3 text-[1.02rem] leading-7 text-ink/78">
                            <span aria-hidden="true" className="mt-[0.72rem] size-1.5 shrink-0 rounded-full bg-periwinkle" />
                            <span>{credential}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
                        <Pressable className="w-full sm:w-auto" haptic>
                          <Link
                            href={`/contact?doctor=${doctor.slug}`}
                            className="inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-full bg-blush px-7 py-3.5 text-base font-semibold text-ink shadow-[0_14px_32px_rgba(226,132,156,0.28)] outline-none transition-colors hover:bg-[#d97792] focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-4 sm:w-auto"
                          >
                            {t('doctorTalkCta', { name: doctor.name.replace('Dr. ', '') })}
                            <ArrowUpRight aria-hidden="true" className="size-4" />
                          </Link>
                        </Pressable>
                        <Link
                          href={`/team/${doctor.slug}`}
                          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-4 text-base font-semibold text-navy outline-none transition-colors hover:text-ink focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-4"
                        >
                          {t('doctorStoryCta', { name: doctor.name.replace('Dr. ', '') })}
                          <ArrowRight aria-hidden="true" className="size-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="mx-auto mt-14 flex max-w-[58rem] items-center gap-5 sm:mt-20">
              <span aria-hidden="true" className="h-px flex-1 bg-taupe" />
              <p className="max-w-[42rem] text-center font-display text-xl italic leading-8 text-[#7a5230] sm:text-2xl sm:leading-9">
                {t('coupleNote')}
              </p>
              <span aria-hidden="true" className="h-px flex-1 bg-taupe" />
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="bg-lavender/65 py-20 sm:py-24 lg:py-28" aria-labelledby="care-team-heading">
        <Container>
          <Reveal>
            <div className="mb-12 max-w-[46rem] sm:mb-16">
              <p className="eyebrow mb-4 normal-case text-navy">{t('careTeamEyebrow')}</p>
              <h2 id="care-team-heading" className="display-lg text-ink">{t('careTeamHeading')}</h2>
              <p className="mt-5 text-lg leading-8 text-slate">{t('careTeamLead')}</p>
            </div>
          </Reveal>

          <Stagger className="grid gap-5 md:grid-cols-12" stagger={0.08}>
            {localizedCareTeam.map((member, index) => (
              <StaggerItem
                key={member.id}
                className={cn(
                  'group md:col-span-6',
                  index === 0 && 'md:col-span-7',
                  index === 1 && 'md:col-span-5',
                  index === 2 && 'md:col-span-5',
                  index === 3 && 'md:col-span-7'
                )}
              >
                <article className="grid h-full grid-cols-[7.5rem_1fr] overflow-hidden rounded-[1.5rem] border border-white/75 bg-ivory/90 shadow-[0_18px_48px_-28px_rgba(28,42,72,0.28)] transition-[transform,box-shadow] duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_24px_56px_-26px_rgba(28,42,72,0.34)] motion-reduce:transform-none motion-reduce:transition-none sm:grid-cols-[10rem_1fr]">
                  <div className="relative min-h-48 sm:min-h-56">
                    <Image
                      src={member.image.src}
                      alt={member.imageAlt}
                      fill
                      sizes="(max-width: 639px) 120px, 160px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col justify-center p-5 sm:p-7">
                    <p className="text-sm font-semibold leading-6 text-navy">{member.role}</p>
                    <h3 className="mt-1 font-display text-[1.45rem] leading-tight text-ink sm:text-[1.7rem]">
                      {member.name}
                    </h3>
                    <p className="mt-3 text-base leading-7 text-slate">{member.blurb}</p>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      <section className="bg-ivory py-20 sm:py-24 lg:py-32" aria-labelledby="facility-heading">
        <Container>
          <Reveal>
            <div className="mb-12 max-w-[46rem] sm:mb-16">
              <p className="eyebrow mb-4 normal-case text-navy">{t('facilityEyebrow')}</p>
              <h2 id="facility-heading" className="display-lg text-ink">{t('facilityHeading')}</h2>
              <p className="mt-5 text-lg leading-8 text-slate">{t('facilityLead')}</p>
            </div>
          </Reveal>

          <Stagger
            className="-mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:grid md:grid-cols-12 md:overflow-visible md:px-0 md:pb-0"
            stagger={0.09}
          >
            {localizedFacilityPhotos.map((photo, index) => (
              <StaggerItem
                key={photo.id}
                className={cn(
                  'min-w-[84vw] snap-center md:min-w-0',
                  index === 0 && 'md:col-span-7',
                  index === 1 && 'md:col-span-5',
                  index === 2 && 'md:col-span-5',
                  index === 3 && 'md:col-span-7'
                )}
              >
                <figure className="group overflow-hidden rounded-[1.75rem] border border-taupe/50 bg-lavender shadow-[0_22px_64px_-34px_rgba(28,42,72,0.32)]">
                  <div
                    className={cn(
                      'relative overflow-hidden',
                      index % 3 === 0 ? 'aspect-[5/4] md:aspect-[16/10]' : 'aspect-[4/5] md:aspect-[6/5]'
                    )}
                  >
                    <Image
                      src={photo.image.src}
                      alt={photo.imageAlt}
                      fill
                      sizes="(max-width: 767px) 84vw, 58vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025] motion-reduce:transition-none"
                    />
                  </div>
                  <figcaption className="border-t border-white/70 bg-ivory px-5 py-5 text-base leading-7 text-ink/80 sm:px-7">
                    {photo.caption}
                  </figcaption>
                </figure>
              </StaggerItem>
            ))}
          </Stagger>
          <p className="mt-5 text-sm leading-6 text-ash md:hidden">{t('facilitySwipeHint')}</p>
        </Container>
      </section>

      <section className="bg-[#f3e5e5] py-20 sm:py-24">
        <Container>
          <Reveal>
            <div className="rounded-[2rem] border border-blush/20 bg-ivory px-6 py-12 text-center shadow-[0_24px_70px_-38px_rgba(28,42,72,0.3)] sm:rounded-[2.5rem] sm:px-12 sm:py-16">
              <h2 className="mx-auto max-w-[18ch] font-display text-[2.45rem] leading-[1.1] tracking-[-0.02em] text-ink sm:text-5xl">
                {t('closingHeadline')}
              </h2>
              <div className="mx-auto mt-8 max-w-sm sm:max-w-none">
                <Pressable className="w-full sm:w-auto sm:inline-block" haptic>
                  <Link
                    href="/contact"
                    className="inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-full bg-blush px-8 py-3.5 text-base font-semibold text-ink shadow-[0_14px_32px_rgba(226,132,156,0.28)] outline-none transition-colors hover:bg-[#d97792] focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-4 sm:w-auto"
                  >
                    {t('closingCta')}
                    <ArrowUpRight aria-hidden="true" className="size-4" />
                  </Link>
                </Pressable>
              </div>
              <p className="mt-5 text-base leading-7 text-slate">{t('closingNote')}</p>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  )
}
