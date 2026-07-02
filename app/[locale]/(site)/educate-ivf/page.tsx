import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Footer } from '@/components/shared/Footer'
import { EducateHub } from '@/components/sections/EducateHub'
import type { Locale } from '@/i18n/routing'
import { buildPageMetadata } from '@/lib/seo/metadata'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'EducateIVF' })

  return buildPageMetadata({
    locale: locale as Locale,
    path: '/educate-ivf',
    title: t('hubMetaTitle'),
    description: t('hubMetaDesc'),
  })
}

export default async function EducateIVFPage() {
  return (
    <>
      <EducateHub />
      <Footer />
    </>
  )
}
