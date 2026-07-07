import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { Footer } from '@/components/shared/Footer'
import { ArticleDetail } from '@/components/sections/ArticleDetail'
import { ARTICLES } from '@/lib/articles'
import { routing, type Locale } from '@/i18n/routing'
import { buildPageMetadata } from '@/lib/seo/metadata'

export async function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    ARTICLES.map((article) => ({ locale, slug: article.slug }))
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const article = ARTICLES.find((a) => a.slug === slug)
  if (!article) return { title: 'Article not found' }

  let title       = article.title
  let description = article.excerpt
  if (article.i18nKey) {
    const t     = await getTranslations({ locale, namespace: 'EducateIVF' })
    title       = t(`articles.${article.i18nKey}.metaTitle`)
    description = t(`articles.${article.i18nKey}.metaDescription`)
  }

  return buildPageMetadata({
    locale: locale as Locale,
    path: '/educate-ivf/' + slug,
    title,
    description,
    type: 'article',
    publishedTime: article.date,
  })
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { slug } = await params
  const article = ARTICLES.find((a) => a.slug === slug)
  if (!article) notFound()

  return (
    <>
      <ArticleDetail article={article} allArticles={ARTICLES} />
      <Footer />
    </>
  )
}
