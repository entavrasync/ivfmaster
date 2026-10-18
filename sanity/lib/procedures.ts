import 'server-only'

import type { Locale } from '../../i18n/routing'
import { PROCEDURES } from '../../lib/procedures'
import { client } from './client'
import { resolveProcedures, type CmsProcedure } from './procedure-mapping'
import { allProceduresQuery } from './procedure-query'

export async function getProcedures(locale: Locale): Promise<ReadonlyArray<CmsProcedure>> {
  try {
    const documents = await client.fetch<unknown>(allProceduresQuery, { slugs: PROCEDURES.map((procedure) => procedure.slug) }, {
      cache: 'force-cache',
      next: { revalidate: 60, tags: ['procedure:ivf'] },
    })
    const result = resolveProcedures(documents, PROCEDURES, locale)
    if (result.status === 'invalid' || result.status === 'ambiguous') {
      console.error('[procedure:ivf] Invalid or ambiguous approved CMS content; retaining existing website content.')
    }
    return result.procedures
  } catch {
    // Do not log upstream response bodies or credentials; keep the public site available.
    console.error('[procedure:ivf] CMS read failed; retaining existing website content.')
    return PROCEDURES
  }
}
