import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'

import { Container } from '@/components/layout/Container'
import { Pressable } from '@/components/motion/Pressable'
import { Reveal } from '@/components/motion/Reveal'
import { Footer } from '@/components/shared/Footer'
import { Link } from '@/i18n/navigation'
import { routing, type Locale } from '@/i18n/routing'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { doctors, getDoctorBySlug } from '@/lib/team'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; doctor: string }>
}): Promise<Metadata> {
  const { locale, doctor: slug } = await params
  const doctor = getDoctorBySlug(slug)
  if (!doctor) return {}

  const t = await getTranslations({ locale, namespace: 'Team' })
  const prefix = `doctors.${doctor.messageKey}` as const

  return buildPageMetadata({
    locale: locale as Locale,
    path: `/team/${slug}`,
    title: t(`${prefix}.name`),
    description: t(`${prefix}.metaDescription`),
  })
}

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    doctors.map((doctor) => ({ locale, doctor: doctor.slug }))
  )
}

export default async function DoctorDetailPage({
  params,
}: {
  params: Promise<{ locale: string; doctor: string }>
}) {
  const { doctor: slug } = await params
  const doctor = getDoctorBySlug(slug)
  if (!doctor) notFound()

  const t = await getTranslations('Team')
  const prefix = `doctors.${doctor.messageKey}` as const
  const name = t(`${prefix}.name`)
  const credentials = t.raw(`${prefix}.credentials`) as string[]

  return (
    <>
      <main className="min-h-screen bg-ivory pb-20 pt-36 sm:pt-40">
        <Container>
          <Link
            href="/team"
            className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-base font-semibold text-navy outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-4"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            {t('detailBack')}
          </Link>

          <div className="mt-8 flex flex-col overflow-hidden rounded-[2rem] border border-taupe/55 bg-[#f6efe6] shadow-[0_28px_80px_-36px_rgba(28,42,72,0.34)] lg:flex-row lg:items-stretch lg:rounded-[2.5rem]">
            
            {/* Image Section (30%) */}
            <div className="relative w-full flex-shrink-0 bg-white/40 p-6 sm:p-8 lg:w-[30%] lg:border-r lg:border-taupe/30 lg:p-10">
              <Reveal className="relative aspect-square w-full overflow-hidden rounded-[1.5rem] bg-white shadow-sm ring-1 ring-black/5" y={16}>
                <Image
                  src={doctor.image.src}
                  alt={t(`${prefix}.imageAlt`)}
                  fill
                  sizes="(max-width: 1023px) 100vw, 30vw"
                  className="object-contain"
                />
              </Reveal>
            </div>

            {/* Content Section (70%) */}
            <div className="flex w-full flex-col justify-center p-7 sm:p-10 lg:w-[70%] lg:p-16">
              <Reveal>
                <p className="font-display text-xl italic leading-8 text-[#8a5d3a] sm:text-2xl">
                  “{t(`${prefix}.essence`)}”
                </p>
                <h1 className="mt-5 font-display text-[2.75rem] leading-[1.06] tracking-[-0.025em] text-ink sm:text-6xl">
                  {name}
                </h1>
                <p className="mt-3 text-lg font-semibold leading-8 text-navy">{t(`${prefix}.title`)}</p>
                <div className="mt-7 text-lg leading-8 text-slate">
                  {t.rich(`${prefix}.biography`, {
                    br: () => <br />,
                    b: (chunks) => (
                      <strong className="mt-6 mb-2 block font-display text-2xl text-ink">
                        {chunks}
                      </strong>
                    ),
                  })}
                </div>
                {credentials && credentials.length > 0 && (
                  <>
                    <h2 className="mt-10 font-display text-3xl text-ink">{t('detailCredentialsHeading')}</h2>
                    <ul className="mt-5 space-y-3 border-t border-taupe/60 pt-6">
                      {credentials.map((credential) => (
                        <li key={credential} className="flex gap-3 text-lg leading-8 text-ink/78">
                          <span aria-hidden="true" className="mt-[0.8rem] size-1.5 shrink-0 rounded-full bg-periwinkle" />
                          {credential}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                <div className="mt-9">
                  <Pressable className="w-full sm:w-auto sm:inline-block" haptic>
                    <Link
                      href={`/contact?doctor=${doctor.slug}`}
                      className="inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-full bg-blush px-8 py-3.5 text-base font-semibold text-ink shadow-[0_14px_32px_rgba(226,132,156,0.28)] sm:w-auto"
                    >
                      {t('doctorTalkCta', { name: name.replace('Dr. ', '') })}
                      <ArrowUpRight aria-hidden="true" className="size-4" />
                    </Link>
                  </Pressable>
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  )
}
