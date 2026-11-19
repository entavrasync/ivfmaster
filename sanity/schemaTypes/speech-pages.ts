import { defineField, defineType } from 'sanity'
import { localized } from '../reference/schemaTypes/shared/fields'
import { approvalField } from './editorial-fields'
import { publicationLabels as defaults, SPEECH_LABEL_FIELDS } from '../../components/publications/copy'

/** Interface wording for this Speeches page. Each label falls back to its default when left empty. */
const labelsField = defineField({
  name: 'labels', title: 'Labels', type: 'object', group: 'labels',
  description: 'Buttons, headings and messages on this Speeches page and its speech pages. Leave a label empty to use the default wording shown under it.',
  options: { collapsible: false },
  fields: SPEECH_LABEL_FIELDS.map(({ key, title }) => {
    const description = `Default: “${defaults.en[key]}” / “${defaults.mr[key]}”.`
    // The shared text field rejects {placeholders}; the progress text needs {shown} and {total}.
    if (key === 'showing') return defineField({ name: key, title, description, type: 'object', options: { columns: 2 },
      fields: [defineField({ name: 'en', title: 'English', type: 'string' }), defineField({ name: 'mr', title: 'Marathi', type: 'string' })] })
    return localized(key, { title, translation: 'optional', description })
  }),
  validation: rule => rule.custom((value: Record<string, { en?: string; mr?: string } | undefined> | undefined) => {
    const showing = value?.showing
    const broken = (['en', 'mr'] as const).filter(locale => showing?.[locale]?.trim() && !(showing[locale]!.includes('{shown}') && showing[locale]!.includes('{total}')))
    return broken.length ? { message: 'Keep both {shown} and {total} in the progress text, e.g. “Showing {shown} of {total}”.', paths: [['showing', broken[0]]] } : true
  }),
})

/**
 * The listing page itself: its heading copy and SEO. Individual speeches are separate documents.
 * The website has no built-in copy for these pages, so new documents start empty.
 */
function speechPage(name: string, title: string) {
  return defineType({
    name, title, type: 'document',
    initialValue: () => ({ reviewStatus: 'pendingReview' }),
    groups: [{ name: 'heading', title: 'Page heading', default: true }, { name: 'labels', title: 'Labels' }, { name: 'seo', title: 'SEO' }],
    fields: [
      { ...approvalField, group: 'heading' },
      localized('eyebrow', { title: 'Small line above the heading', group: 'heading', translation: 'optional', description: 'Optional. Leave empty to hide this line.' }),
      localized('heading', { title: 'Heading title', group: 'heading', translation: 'any', description: 'The main heading of this page. It is also the search title unless the SEO tab sets its own.' }),
      localized('intro', { title: 'Introduction', type: 'localizedText', group: 'heading', translation: 'optional', description: 'The sentence under the heading, and the search description unless the SEO tab sets its own. Leave empty to hide it.' }),
      labelsField,
      defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'seo' }),
    ],
    preview: { select: { id: '_id' }, prepare: () => ({ title }) },
  })
}

export const medicalSpeechesPage = speechPage('medicalSpeechesPage', 'Speeches for Medical Professionals page')
export const patientSpeechesPage = speechPage('patientSpeechesPage', 'Speeches for Patients page')
