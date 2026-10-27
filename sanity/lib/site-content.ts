import 'server-only'
import { cache } from 'react'
import { client } from './client'
import { homePageQuery } from '../reference/queries/home'
import { aboutPageQuery } from '../reference/queries/about'
import { teamPageQuery } from '../reference/queries/team'
import { proceduresHubQuery } from '../reference/queries/procedures'
import { globalsQuery } from '../reference/queries/globals'
import { contactPageQuery } from '../reference/queries/contact'
import { at, plain, record, resolveSiteImage } from './site-content-mapping'
import { resolvePageSeo, SEO_RAW_PROJECTION, type PageSeo } from './seo-mapping'

/** Reference queries, target project/client, published perspective and existing ISR policy. */
export const getSiteContent = cache(async (locale: string) => {
  const read = async (query: string, tag: string): Promise<unknown> => {
    try { return await client.fetch<unknown>(query, { locale }, { cache: 'force-cache', next: { revalidate: 60, tags: [tag] } }) }
    catch { console.error(`[${tag}] CMS read failed; retaining existing website content.`); return null }
  }
  const [home, about, team, procedures, globals, contact, education] = await Promise.all([
    read(homePageQuery, 'homePage'), read(aboutPageQuery, 'aboutPage'), read(teamPageQuery, 'teamPage'),
    read(proceduresHubQuery, 'proceduresPage'), read(globalsQuery, 'siteGlobals'),
    read(contactPageQuery, 'contactPage'),
    read(`*[_type == "educationPage" && _id == "educationPage" && reviewStatus == "approved" && !(_id in path("drafts.**")) && !(_id in path("versions.**"))][0]{${SEO_RAW_PROJECTION}}`, 'educationPage'),
  ])
  if (home && (!resolveSiteImage(at(home, 'hero.desktopImage')) || !resolveSiteImage(at(home, 'hero.mobileImage')))) {
    console.error('[homePage] Published hero is missing a valid desktop or mobile banner. Upload both images and publish Home page; no local artwork will be substituted.')
  }
  return { home: record(home), about: record(about), team: record(record(team)?.page), procedures: record(record(procedures)?.page), globals: record(globals), contact: record(contact), education: record(education) }
})

type SeoPage = 'home' | 'about' | 'team' | 'procedures' | 'contact' | 'education'

/** A page singleton's SEO plus the site-wide defaults, ready to spread into `buildPageMetadata`. */
export async function getSeoContext(locale: string, page?: SeoPage): Promise<{ seo?: PageSeo; fallbackSeo?: PageSeo; siteName?: string }> {
  const content = await getSiteContent(locale)
  const typedLocale = locale === 'en' ? 'en' : 'mr'
  const seo = page ? resolvePageSeo(at(content[page], 'seo'), typedLocale) : undefined
  const siteName = plain(at(content.globals, 'settings.name'))
  let fallbackSeo = resolvePageSeo(at(content.globals, 'settings.defaultSeo'), typedLocale)
  const banner = resolveSiteImage(at(content.home, 'hero.desktopImage'))
  if (!fallbackSeo?.ogImage && banner) fallbackSeo = {
    noIndex: false, noFollow: false, structuredData: true, ...fallbackSeo,
    ogImage: { url: banner.image.src, width: banner.image.width, height: banner.image.height, alt: banner.alt },
  }
  return { ...(seo ? { seo } : {}), ...(fallbackSeo ? { fallbackSeo } : {}), ...(siteName ? { siteName } : {}) }
}
