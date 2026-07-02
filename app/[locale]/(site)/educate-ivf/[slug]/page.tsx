import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Footer } from '@/components/shared/Footer'
import { ArticleDetail } from '@/components/sections/ArticleDetail'
import { ARTICLES } from '@/lib/articles'
import { routing } from '@/i18n/routing'

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
  const { slug } = await params
  const article = ARTICLES.find((a) => a.slug === slug)
  if (!article) return { title: 'Article not found' }
  return {
    title:       `${article.title} | IVF Master`,
    description: article.excerpt,
  }
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
