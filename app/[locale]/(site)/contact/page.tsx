import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { ContactPage } from '@/components/sections/ContactPage'
import { Footer } from '@/components/shared/Footer'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Contact' })

  return buildPageMetadata({
    locale: locale as Locale,
    path: '/contact',
    title: t('metaTitle'),
    description: t('metaDescription'),
  })
}

export default function ContactRoute() {
  return (
    <>
      <ContactPage />
      <Footer />
    </>
  )
}
