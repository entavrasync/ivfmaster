import type { SpeechKind } from '@/lib/speeches-availability'

/** Who each speech type is written for, as a schema.org audience. Search text comes only from the CMS. */
const AUDIENCE_TYPE = { news: 'Clinician', event: 'Patient' } as const satisfies Record<SpeechKind, 'Clinician' | 'Patient'>

/** schema.org audience node for speech structured data. */
export const audienceJsonLd = (kind: SpeechKind) => ({ '@type': 'MedicalAudience', audienceType: AUDIENCE_TYPE[kind] })
