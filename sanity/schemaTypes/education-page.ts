import { defineField, defineType } from 'sanity'
import { approvalField } from './editorial-fields'

export const educationPage = defineType({
  name: 'educationPage', title: 'IVF education page', type: 'document',
  fields: [approvalField, defineField({ name: 'seo', title: 'SEO', type: 'seo' })],
  preview: { prepare: () => ({ title: 'IVF education page' }) },
})
