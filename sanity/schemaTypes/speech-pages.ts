import { defineField, defineType } from 'sanity'
import { localized } from '../reference/schemaTypes/shared/fields'
import { approvalField } from './editorial-fields'

/**
 * The listing page itself: its heading copy and SEO. Individual speeches are separate documents.
 * The website has no built-in copy for these pages, so new documents start empty.
 */
function speechPage(name: string, title: string) {
  return defineType({
    name, title, type: 'document',
    initialValue: () => ({ reviewStatus: 'pendingReview' }),
    groups: [{ name: 'heading', title: 'Page heading', default: true }, { name: 'seo', title: 'SEO' }],
    fields: [
      { ...approvalField, group: 'heading' },
      localized('eyebrow', { title: 'Small line above the heading', group: 'heading', translation: 'optional', description: 'Optional. Leave empty to hide this line.' }),
      localized('heading', { title: 'Heading title', group: 'heading', translation: 'any', description: 'The main heading of this page. It is also the search title unless the SEO tab sets its own.' }),
      localized('intro', { title: 'Introduction', type: 'localizedText', group: 'heading', translation: 'optional', description: 'The sentence under the heading, and the search description unless the SEO tab sets its own. Leave empty to hide it.' }),
      defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'seo' }),
    ],
    preview: { select: { id: '_id' }, prepare: () => ({ title }) },
  })
}

export const medicalSpeechesPage = speechPage('medicalSpeechesPage', 'Speeches for Medical Professionals page')
export const patientSpeechesPage = speechPage('patientSpeechesPage', 'Speeches for Patients page')
