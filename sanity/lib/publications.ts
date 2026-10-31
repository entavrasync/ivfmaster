import 'server-only'
import { cache } from 'react'
import { draftMode } from 'next/headers'
import { client } from './client'
import { publicationsQuery } from './publication-query'
import { resolvePublications } from './publication-model'

export const getPublications = cache(async (type: 'news' | 'event', publicOnly = false) => {
  const preview = !publicOnly && (await draftMode()).isEnabled
  const token = process.env.SANITY_API_READ_TOKEN
  if (preview && !token) return { documents: [], preview, error: true }
  try {
    const reader = preview ? client.withConfig({ token, perspective: 'drafts', useCdn: false }) : client
    const input = await reader.fetch<unknown>(publicationsQuery, { type, preview }, preview ? { cache: 'no-store' } : {
      cache: 'force-cache', next: { revalidate: 60, tags: [type, 'publications'] },
    })
    if (!Array.isArray(input)) throw new Error('Invalid CMS response')
    const documents = resolvePublications(input, preview)
    if (documents.length !== input.length) console.error('[publications] Invalid or duplicate records excluded.', { type, excluded: input.length - documents.length })
    return { documents, preview, error: false }
  } catch {
    console.error('[publications] CMS read failed.', { type })
    return { documents: [], preview, error: true }
  }
})
