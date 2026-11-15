import { createElement as h, type ComponentType } from 'react'
import type { ObjectInputProps } from 'sanity'
import { SPEECH_PATHS, type SpeechKind } from '../../lib/speeches-availability'
import { siteConfig } from '../../config/site'

/** Editor-facing names for the two speech types. Both share one form, so the audience must be stated on it. */
export const SPEECH_AUDIENCE = {
  news: {
    title: 'Speech for Medical Professionals', short: 'Medical professionals', accent: '#2f4f9f',
    reader: 'doctors, nurses and other clinicians', tone: 'Clinical terms are fine.',
  },
  event: {
    title: 'Speech for Patients', short: 'Patients', accent: '#1f7a6d',
    reader: 'patients and their families', tone: 'Use plain, reassuring words and explain any medical term.',
  },
} as const satisfies Record<SpeechKind, { title: string; short: string; accent: string; reader: string; tone: string }>

/** Wraps the speech form with a coloured banner naming its audience and public page. */
export function speechAudienceInput(kind: SpeechKind): ComponentType<ObjectInputProps> {
  const audience = SPEECH_AUDIENCE[kind]
  const page = new URL(SPEECH_PATHS[kind], siteConfig.url).href.replace(/^https?:\/\//, '')
  function SpeechAudienceInput(props: ObjectInputProps) {
    return h('div', {},
      h('aside', { 'aria-label': 'Speech audience', style: { padding: '12px 16px', marginBottom: 20, borderLeft: `4px solid ${audience.accent}`, borderRadius: 6, background: `${audience.accent}1f` } },
        h('strong', { style: { display: 'block', fontSize: 16, color: audience.accent } }, `You are editing a ${audience.title}`),
        h('p', { style: { margin: '6px 0 0' } }, `Written for ${audience.reader}. Published on ${page}. ${audience.tone} Only ${audience.short.toLowerCase()} categories can be chosen.`)),
      props.renderDefault(props))
  }
  SpeechAudienceInput.displayName = `SpeechAudienceInput(${kind})`
  return SpeechAudienceInput
}
