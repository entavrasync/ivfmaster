import { FEATURED_LIMIT, type PublicationDocument } from '../../sanity/lib/publication-model.ts'

/** Newest speeches first; ties keep a stable order. Returns a copy so cached CMS records are not mutated. */
export function orderPublications(documents: PublicationDocument[]) {
  return [...documents].sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt) || a._id.localeCompare(b._id))
}

/**
 * The top cards: featured speeches by their CMS position (1 = large card), then the newest speeches
 * fill any empty slots. Studio keeps positions unique, but published data is still bounded here.
 */
export function spotlightPublications(ordered: PublicationDocument[]) {
  const position = (doc: PublicationDocument) => doc.featuredPosition ?? FEATURED_LIMIT + 1
  const featured = ordered.filter(doc => doc.featured).sort((a, b) => position(a) - position(b)).slice(0, FEATURED_LIMIT)
  return [...featured, ...ordered.filter(doc => !featured.includes(doc))].slice(0, FEATURED_LIMIT)
}
