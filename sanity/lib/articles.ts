import 'server-only'
import { getMessages } from 'next-intl/server'
import type { AbstractIntlMessages } from 'next-intl'
import type { Locale } from '../../i18n/routing'
import { ARTICLES } from '../../lib/articles'
import { client } from './client'
import { articlesQuery } from './article-query'
import { mergeArticleMessages, resolveArticles, type CmsArticle } from './article-mapping'

export async function getArticles(locale: Locale): Promise<{ articles: readonly CmsArticle[]; messages: AbstractIntlMessages }> {
  const messages = await getMessages({ locale })
  try {
    const input = await client.fetch<unknown>(articlesQuery, {}, {
      cache: 'force-cache', next: { revalidate: 60, tags: ['articles'] },
    })
    const result = resolveArticles(input, ARTICLES, locale)
    if (result.status === 'invalid' || result.status === 'ambiguous') console.error('[articles] Invalid or ambiguous approved CMS content; retaining existing articles.')
    return { articles: result.articles, messages: mergeArticleMessages(messages, result.overrides) }
  } catch {
    console.error('[articles] CMS read failed; retaining existing articles.')
    return { articles: ARTICLES, messages }
  }
}
