'use client'
import { useLocale } from 'next-intl'
import { publicationLabels } from './copy'

export function PublicationError({ reset }: { reset: () => void }) {
  const t = publicationLabels[useLocale() === 'en' ? 'en' : 'mr']
  return <main className="mx-auto min-h-[60vh] max-w-4xl px-6 pb-20 pt-44"><h1 className="font-display text-4xl">{t.error}</h1><p className="my-5 text-ink/70">{t.errorBody}</p><button onClick={reset} className="rounded-full bg-navy px-6 py-3 text-white">{t.retry}</button></main>
}
