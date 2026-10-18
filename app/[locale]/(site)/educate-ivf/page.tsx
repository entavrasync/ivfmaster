import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { NextIntlClientProvider } from 'next-intl'
import { Footer } from '@/components/shared/Footer'
import { EducateHub } from '@/components/sections/EducateHub'
import type { Locale } from '@/i18n/routing'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { getArticles } from '@/sanity/lib/articles'
import { getSeoContext } from '@/sanity/lib/site-content'
import { SectionJsonLd } from '@/components/SEO/StructuredData'

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
    ...(await getSeoContext(locale)),
    title: t('hubMetaTitle'),
    description: t('hubMetaDesc'),
  })
}

export default async function EducateIVFPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const { articles, messages } = await getArticles(locale as Locale)
  return (
    <>
      <NextIntlClientProvider messages={messages}>
        <EducateHub articles={articles} />
      </NextIntlClientProvider>
      <SectionJsonLd locale={locale} section="educateIVF" />
      <Footer />
    </>
  )
}
