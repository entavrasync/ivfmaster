import { defineArrayMember, defineField, defineType, getPublishedId } from 'sanity'
import { initialTeamValues, teamValueIcons, teamValuesErrors } from '../lib/team-values-mapping'
import { approvalField } from './editorial-fields'
import { apiVersion } from '../project'

const localized = (name: string, title: string, max: number, paragraph = false) => defineField({
  name, title, type: 'object', fields: [
    defineField({ name: 'en', title: 'English', type: paragraph ? 'text' : 'string', ...(paragraph ? { rows: 3 } : {}), description: `Up to ${max.toLocaleString('en-IN')} characters.` }),
    defineField({ name: 'mr', title: 'Marathi (optional)', type: paragraph ? 'text' : 'string', ...(paragraph ? { rows: 3 } : {}), description: 'Leave empty to use the English text.' }),
  ],
})
export const teamValues = defineType({
  name: 'teamValues', title: 'Team Values', type: 'document',
  description: 'Shown on the Team page after the clinic gallery. Remove all cards and publish to hide the section. New drafts copy the About page’s Trust principles; review them before approving.',
  initialValue: (_, context) => initialTeamValues(context.getClient({ apiVersion }).withConfig({ perspective: 'raw' })),
  fields: [
    approvalField,
    { ...localized('eyebrow', 'Small label (optional)', 180), description: 'Above the heading. Leave empty to show no label.' },
    { ...localized('heading', 'Section heading', 180), description: 'English is required when you add cards.' },
    { ...localized('subheading', 'Introduction (optional)', 800, true), description: 'Below the heading. Leave empty to show no introduction.' },
    defineField({ name: 'cards', title: 'Value cards', type: 'array', description: 'Add up to 20 cards. Drag to change their order. An empty list hides this section.', of: [defineArrayMember({
      name: 'teamValueCard', title: 'Value card', type: 'object', fields: [
        { ...localized('title', 'Card title', 180), description: 'English is required. Marathi is optional.' },
        { ...localized('description', 'Card description', 4000, true), description: 'English is required. Marathi is optional.' },
        defineField({ name: 'icon', title: 'Icon', type: 'string', options: { list: teamValueIcons.map(value => ({ value, title: value[0].toUpperCase() + value.slice(1) })) }, description: 'Choose an icon for this card.' }),
      ], preview: { select: { title: 'title.en', subtitle: 'description.en' } },
    })] }),
  ],
  validation: rule => rule.custom((value, context) => context.document?._id && getPublishedId(context.document._id) !== 'teamValues' ? 'Open Team Values from the Studio sidebar.' : teamValuesErrors(value)),
  preview: { prepare: () => ({ title: 'Team Values', subtitle: '/team · Values section' }) },
})
