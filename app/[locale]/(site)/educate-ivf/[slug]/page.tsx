import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { buildLocalizedPath } from '@/lib/seo/routes'
import { Footer } from '@/components/shared/Footer'
import { ArticleDetail } from '@/components/sections/ArticleDetail'
import { PcosArticle } from '@/components/sections/PcosArticle'
import { WhatIvfArticle } from '@/components/sections/WhatIvfArticle'
import { MythsArticle } from '@/components/sections/MythsArticle'
import { MaleFertilityArticle } from '@/components/sections/MaleFertilityArticle'
import { RecurrentLossArticle } from '@/components/sections/RecurrentLossArticle'
import { UnexplainedArticle } from '@/components/sections/UnexplainedArticle'
import { AgeArticle } from '@/components/sections/AgeArticle'
import { ARTICLES } from '@/lib/articles'
import { routing, type Locale } from '@/i18n/routing'
import { buildPageMetadata } from '@/lib/seo/metadata'

export async function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    ARTICLES.flatMap((article) => [
      { locale, slug: article.slug },
      // Keep renamed URLs routable so they can 308-redirect (see below).
      ...(article.legacySlugs ?? []).map((slug) => ({ locale, slug })),
    ])
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

  // Some articles carry localised, hand-written meta in a dedicated namespace.
  if (slug === 'pcos') {
    const t = await getTranslations({ locale, namespace: 'ArticlePcos' })
    return buildPageMetadata({
      locale: locale as Locale,
      path: '/educate-ivf/pcos',
      title: t('metaTitle'),
      description: t('metaDescription'),
      type: 'article',
      publishedTime: article.date,
    })
  }

  if (slug === 'what-ivf-really-is') {
    const t = await getTranslations({ locale, namespace: 'ArticleWhatIvf' })
    return buildPageMetadata({
      locale: locale as Locale,
      path: '/educate-ivf/what-ivf-really-is',
      title: t('metaTitle'),
      description: t('metaDescription'),
      type: 'article',
      publishedTime: article.date,
    })
  }

  if (slug === 'ivf-myths-vs-facts') {
    const t = await getTranslations({ locale, namespace: 'ArticleMyths' })
    return buildPageMetadata({
      locale: locale as Locale,
      path: '/educate-ivf/ivf-myths-vs-facts',
      title: t('metaTitle'),
      description: t('metaDescription'),
      type: 'article',
      publishedTime: article.date,
    })
  }

  if (slug === 'male-fertility-explained') {
    const t = await getTranslations({ locale, namespace: 'ArticleMaleFertility' })
    return buildPageMetadata({
      locale: locale as Locale,
      path: '/educate-ivf/male-fertility-explained',
      title: t('metaTitle'),
      description: t('metaDescription'),
      type: 'article',
      publishedTime: article.date,
    })
  }

  if (slug === 'recurrent-pregnancy-loss') {
    const t = await getTranslations({ locale, namespace: 'ArticleRecurrentLoss' })
    return buildPageMetadata({
      locale: locale as Locale,
      path: '/educate-ivf/recurrent-pregnancy-loss',
      title: t('metaTitle'),
      description: t('metaDescription'),
      type: 'article',
      publishedTime: article.date,
    })
  }

  if (slug === 'unexplained-infertility') {
    const t = await getTranslations({ locale, namespace: 'ArticleUnexplained' })
    return buildPageMetadata({
      locale: locale as Locale,
      path: '/educate-ivf/unexplained-infertility',
      title: t('metaTitle'),
      description: t('metaDescription'),
      type: 'article',
      publishedTime: article.date,
    })
  }

  if (slug === 'age-and-ivf-success') {
    const t = await getTranslations({ locale, namespace: 'ArticleAge' })
    return buildPageMetadata({
      locale: locale as Locale,
      path: '/educate-ivf/age-and-ivf-success',
      title: t('metaTitle'),
      description: t('metaDescription'),
      type: 'article',
      publishedTime: article.date,
    })
  }

  let title = article.title
  let description = article.excerpt
  if (article.i18nKey) {
    const t = await getTranslations({ locale, namespace: 'EducateIVF' })
    title = t(`articles.${article.i18nKey}.metaTitle`)
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
  const { locale, slug } = await params
  const article = ARTICLES.find((a) => a.slug === slug)
  if (!article) {
    // A previously-published slug that has since been renamed: send it to the
    // current URL with a permanent (308) redirect so search ranking carries over.
    const moved = ARTICLES.find((a) => a.legacySlugs?.includes(slug))
    if (moved) {
      permanentRedirect(buildLocalizedPath(locale as Locale, `/educate-ivf/${moved.slug}`))
    }
    notFound()
  }
  const components: Record<string, any> = {
    'pcos': PcosArticle,
    'what-ivf-really-is': WhatIvfArticle,
    'ivf-myths-vs-facts': MythsArticle,
    'male-fertility-explained': MaleFertilityArticle,
    'recurrent-pregnancy-loss': RecurrentLossArticle,
    'unexplained-infertility': UnexplainedArticle,
    'age-and-ivf-success': AgeArticle,
  }

  const Selected = components[slug] ?? ArticleDetail

  return (
    <>
      <Selected article={article} allArticles={ARTICLES} />
      <Footer />
    </>
  )
}
