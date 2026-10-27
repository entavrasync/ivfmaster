import { defineArrayMember, defineField } from 'sanity'
import { BacklinksInput } from '../studio/BacklinksInput'
import { backlinkIssues } from '../lib/backlinks'

export const backlinksField = (siteUrl: string) => defineField({
  name: 'backlinks', title: 'Backlinks', type: 'array',
  description: 'Add the address of an external page that links to this page. Adding it here does not create or verify that link.',
  components: { input: BacklinksInput },
  of: [defineArrayMember({
    name: 'backlink', title: 'Backlink', type: 'object',
    fields: [defineField({ name: 'url', title: 'Backlink URL', type: 'url' })],
    preview: { select: { title: 'url' }, prepare: ({ title }) => ({ title: title || 'Enter a backlink URL' }) },
  })],
  validation: rule => rule.custom(value => {
    const issues = backlinkIssues(value, siteUrl)
    return issues.length ? issues : true
  }),
})
