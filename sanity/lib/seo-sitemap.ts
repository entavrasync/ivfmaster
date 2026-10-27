import 'server-only'

import type { SitemapOverrides } from '../../lib/seo/sitemap'
import { client } from './client'

const PAGE_PATHS: Record<string, string> = { homePage: '/', aboutPage: '/about', teamPage: '/team', proceduresPage: '/procedures', contactPage: '/contact', educationPage: '/educate-ivf' }
const COLLECTION_PATHS: Record<string, string> = { procedure: '/procedures/', article: '/educate-ivf/', doctor: '/team/' }

const sitemapQuery = `{
  "procedures": *[_type == "procedure" && reviewStatus == "approved" && defined(slug.current)
    && !(_id in path("drafts.**")) && !(_id in path("versions.**"))].slug.current,
  "hidden": *[_type in $types && reviewStatus == "approved" && (seo.noIndex == true || seo.canonicalUrl match "*")
    && !(_id in path("drafts.**")) && !(_id in path("versions.**"))]{_type, "slug": slug.current}
}`

/** Published CMS decisions that change the sitemap; any failure keeps the code-defined sitemap. */
export async function getSitemapOverrides(): Promise<SitemapOverrides> {
  try {
    const result = await client.fetch<unknown>(sitemapQuery, { types: [...Object.keys(PAGE_PATHS), ...Object.keys(COLLECTION_PATHS)] }, {
      cache: 'force-cache', next: { revalidate: 60, tags: ['procedure:ivf', 'sitemap'] },
    })
    const procedures = Reflect.get(Object(result), 'procedures'), hidden = Reflect.get(Object(result), 'hidden')
    const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
    const excludedPaths = new Set<string>()
    if (Array.isArray(hidden)) for (const record of hidden) {
      const type = Reflect.get(Object(record), '_type'), slug = Reflect.get(Object(record), 'slug')
      if (typeof type !== 'string') continue
      if (PAGE_PATHS[type]) excludedPaths.add(PAGE_PATHS[type])
      else if (COLLECTION_PATHS[type] && typeof slug === 'string' && slugPattern.test(slug)) excludedPaths.add(COLLECTION_PATHS[type] + slug)
    }
    return {
      extraProcedureSlugs: Array.isArray(procedures) ? procedures.filter((slug): slug is string => typeof slug === 'string' && slugPattern.test(slug)) : [],
      excludedPaths,
    }
  } catch {
    console.error('[sitemap] CMS read failed; using the code-defined sitemap.')
    return {}
  }
}
