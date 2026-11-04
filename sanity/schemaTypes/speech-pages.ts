import { defineField, defineType } from 'sanity'
import { publicationLabels as labels } from '../../components/publications/copy'
import { localized } from '../reference/schemaTypes/shared/fields'
import { approvalField } from './editorial-fields'

const pairs = (values: Record<'en' | 'mr', string>, type = 'localizedString') => ({ _type: type, ...values })

/** The listing page itself: its heading copy and SEO. Individual speeches are separate documents. */
function speechPage(name: string, title: string, keys: { heading: 'newsTitle' | 'eventsTitle'; intro: 'newsIntro' | 'eventsIntro' }) {
  return defineType({
    name, title, type: 'document',
    initialValue: () => ({
      reviewStatus: 'pendingReview',
      eyebrow: pairs({ en: labels.en.eyebrow, mr: labels.mr.eyebrow }),
      heading: pairs({ en: labels.en[keys.heading], mr: labels.mr[keys.heading] }),
      intro: pairs({ en: labels.en[keys.intro], mr: labels.mr[keys.intro] }, 'localizedText'),
    }),
    groups: [{ name: 'heading', title: 'Page heading', default: true }, { name: 'seo', title: 'SEO' }],
    fields: [
      { ...approvalField, group: 'heading' },
      localized('eyebrow', { title: 'Small line above the heading', group: 'heading', translation: 'optional', description: 'Leave empty to keep the website default.' }),
      localized('heading', { title: 'Heading title', group: 'heading', translation: 'optional', description: 'The main heading of this page. It is also the search title unless the SEO tab sets its own. Leave empty to keep the website default.' }),
      localized('intro', { title: 'Introduction', type: 'localizedText', group: 'heading', translation: 'optional', description: 'The sentence under the heading, and the search description unless the SEO tab sets its own.' }),
      defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'seo' }),
    ],
    preview: { select: { id: '_id' }, prepare: () => ({ title }) },
  })
}

export const medicalSpeechesPage = speechPage('medicalSpeechesPage', 'Speeches for Medical Professionals page', { heading: 'newsTitle', intro: 'newsIntro' })
export const patientSpeechesPage = speechPage('patientSpeechesPage', 'Speeches for Patients page', { heading: 'eventsTitle', intro: 'eventsIntro' })
