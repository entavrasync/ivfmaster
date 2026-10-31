import { eventLifecycle, type PublicationDocument } from '../../sanity/lib/publication-model.ts'

/** Dated, attendable events come before cancellations and dates still to be confirmed. */
export function orderPublications(documents: PublicationDocument[], group: 'upcoming' | 'past', now: number) {
  return [...documents].sort((a, b) => {
    if (a._type === 'event' && b._type === 'event' && group === 'upcoming') {
      const rank = (doc: typeof a) => eventLifecycle(doc, now).state === 'inProgress' ? 0 : doc.status === 'scheduled' ? 1 : doc.status === 'cancelled' ? 2 : 3
      return rank(a) - rank(b) || Date.parse(a.startAt) - Date.parse(b.startAt) || a._id.localeCompare(b._id)
    }
    const date = (doc: PublicationDocument) => doc._type === 'news' ? doc.publishedAt : doc.endAt
    return Date.parse(date(b)) - Date.parse(date(a)) || a._id.localeCompare(b._id)
  })
}
