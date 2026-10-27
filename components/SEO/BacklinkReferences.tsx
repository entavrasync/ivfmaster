import type { Backlink } from '../../sanity/lib/backlinks'

export function BacklinkReferences({ entries = [], locale = 'en' }: { entries?: readonly Backlink[]; locale?: string }) {
  if (!entries.length) return null
  return (
    <section aria-labelledby="backlink-references-heading" className="border-t border-navy/10 bg-ivory py-10 sm:py-12">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <h2 id="backlink-references-heading" className="font-serif text-2xl text-navy">{locale === 'mr' ? 'बॅकलिंक संदर्भ' : 'Backlink references'}</h2>
        <ul className="mt-5 grid list-none gap-3 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {entries.map(entry => <li key={entry.key} className="min-w-0">
            <a href={entry.url} className="block break-words rounded-lg border border-navy/15 px-4 py-3 text-sm text-navy underline underline-offset-4 transition-colors hover:bg-navy/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-navy">{entry.label}</a>
          </li>)}
        </ul>
      </div>
    </section>
  )
}
