import 'server-only'
import type { SpeechKind } from '@/lib/speeches-availability'
import { getSiteContent } from '@/sanity/lib/site-content'
import { mergeSpeechLabels, type SpeechLabelSet } from './copy'

/** The interface labels for one Speeches page: the approved CMS Labels tab, with defaults for empty labels. */
export async function speechLabels(kind: SpeechKind, locale: 'en' | 'mr'): Promise<SpeechLabelSet> {
  const page = (await getSiteContent(locale))[kind === 'news' ? 'medicalSpeeches' : 'patientSpeeches']
  return mergeSpeechLabels(locale, page && typeof page === 'object' ? (page as Record<string, unknown>).labels : undefined)
}
