import type { PublicationDocument } from '../../sanity/lib/publication-model.ts'

/** Newest speeches first; ties keep a stable order. Returns a copy so cached CMS records are not mutated. */
export function orderPublications(documents: PublicationDocument[]) {
  return [...documents].sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt) || a._id.localeCompare(b._id))
}
