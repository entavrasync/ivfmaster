import 'server-only'
import { cache } from 'react'
import { client } from './client'
import { homePageQuery } from '../reference/queries/home'
import { aboutPageQuery } from '../reference/queries/about'
import { teamPageQuery } from '../reference/queries/team'
import { proceduresHubQuery } from '../reference/queries/procedures'
import { globalsQuery } from '../reference/queries/globals'
import { contactPageQuery } from '../reference/queries/contact'
import { at, record } from './site-content-mapping'
import { resolvePageSeo, type PageSeo } from './seo-mapping'

/** Reference queries, target project/client, published perspective and existing ISR policy. */
export const getSiteContent = cache(async (locale: string) => {
  const read = async (query: string, tag: string): Promise<unknown> => {
    try { return await client.fetch<unknown>(query, { locale }, { cache: 'force-cache', next: { revalidate: 60, tags: [tag] } }) }
    catch { console.error(`[${tag}] CMS read failed; retaining existing website content.`); return null }
  }
  const [home, about, team, procedures, globals, contact] = await Promise.all([
    read(homePageQuery, 'homePage'), read(aboutPageQuery, 'aboutPage'), read(teamPageQuery, 'teamPage'),
    read(proceduresHubQuery, 'proceduresPage'), read(globalsQuery, 'siteGlobals'),
    read(contactPageQuery, 'contactPage'),
  ])
  return { home: record(home), about: record(about), team: record(record(team)?.page), procedures: record(record(procedures)?.page), globals: record(globals), contact: record(contact) }
})

type SeoPage = 'home' | 'about' | 'team' | 'procedures' | 'contact'

/** A page singleton's SEO plus the site-wide defaults, ready to spread into `buildPageMetadata`. */
export async function getSeoContext(locale: string, page?: SeoPage): Promise<{ seo?: PageSeo; fallbackSeo?: PageSeo }> {
  const content = await getSiteContent(locale)
  const typedLocale = locale === 'en' ? 'en' : 'mr'
  const seo = page ? resolvePageSeo(at(content[page], 'seo'), typedLocale) : undefined
  const fallbackSeo = resolvePageSeo(at(content.globals, 'settings.defaultSeo'), typedLocale)
  return { ...(seo ? { seo } : {}), ...(fallbackSeo ? { fallbackSeo } : {}) }
}
