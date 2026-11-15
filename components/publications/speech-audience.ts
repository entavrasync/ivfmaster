import type { SpeechKind } from '@/lib/speeches-availability'

type SearchDefaults = { readonly description: string; readonly keywords: readonly string[] }
type Audience = { readonly audienceType: 'Clinician' | 'Patient'; readonly search?: Record<'en' | 'mr', SearchDefaults> }

/**
 * Who each speech type is written for. Both types share one design and schema; only search
 * metadata differs. `search` fills page fields an editor left empty — CMS SEO always wins.
 */
export const speechAudience = {
  news: { audienceType: 'Clinician' },
  event: {
    audienceType: 'Patient',
    search: {
      en: {
        description: 'Speeches by the IVFMaster fertility team for patients and families — IVF and fertility treatment explained in simple, reassuring language.',
        keywords: ['IVF speeches for patients', 'fertility talks for patients', 'IVF patient education', 'understanding IVF treatment', 'fertility treatment explained', 'IVFMaster'],
      },
      mr: {
        description: 'रुग्ण आणि कुटुंबीयांसाठी IVFMaster च्या फर्टिलिटी टीमची भाषणे — IVF आणि वंध्यत्व उपचार सोप्या, आश्वासक भाषेत.',
        keywords: ['रुग्णांसाठी IVF भाषणे', 'IVF माहिती', 'वंध्यत्व उपचार माहिती', 'IVF उपचार', 'IVFMaster'],
      },
    },
  },
} as const satisfies Record<SpeechKind, Audience>

/** schema.org audience node for speech structured data. */
export const audienceJsonLd = (kind: SpeechKind) => ({ '@type': 'MedicalAudience', audienceType: speechAudience[kind].audienceType })

export function searchDefaults(kind: SpeechKind, locale: 'en' | 'mr'): SearchDefaults | undefined {
  const audience: Audience = speechAudience[kind]
  return audience.search?.[locale]
}
