import 'server-only'
import { cache } from 'react'
import { client } from './client'
import { homePageQuery } from '../reference/queries/home'
import { aboutPageQuery } from '../reference/queries/about'
import { teamPageQuery } from '../reference/queries/team'
import { proceduresHubQuery } from '../reference/queries/procedures'
import { globalsQuery } from '../reference/queries/globals'
import { contactPageQuery } from '../reference/queries/contact'
import { record } from './site-content-mapping'

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
