import { defineField, defineType } from 'sanity'

import { DEFAULT_LOCALE } from '../../lib/locales'
import {
  defineOrderField,
  defineVisibilityField,
  localized,
} from '../shared/fields'

/** Standalone questions selected through homePage.mythsFacts.faqReferences. They require approval and visibility before selection reaches public readers. Existing inline page questions and legacy homepage-question records retain their established ownership. */
export const faq = defineType({
  name: 'faq',
  title: 'Question',
  type: 'document',
  groups: [
    { name: 'content', title: 'Question', default: true },
    { name: 'publication', title: 'Publication' },
  ],

  fields: [
    localized('question', {
      title: 'Question',
      group: 'content',
      description: "As a couple would ask it, not as a clinician would title it.",
    }),
    localized('answer', {
      title: 'Answer',
      type: 'localizedText',
      group: 'content',
      description:
        'One paragraph, in plain language. Anything that needs a heading or a list is a page, not a question.',
    }),
    defineField({
      name: 'procedure',
      title: 'About which treatment?',
      type: 'reference',
      to: [{ type: 'procedure' }],
      group: 'content',
      description:
        'Optional, and only when the question is genuinely about that treatment. A question that merely mentions IVF is not a fact about the IVF procedure. Leave it empty for general questions.',
    }),

    defineOrderField({ group: 'publication' }),
    defineVisibilityField({
      group: 'publication',
      initialValue: false,
      description:
        'Off by default. Turn it on once the answer has been read and confirmed — an unpublished question is invisible to visitors but stays here, ordered and ready.',
    }),
    defineField({
      name: 'reviewStatus',
      title: 'Review status',
      type: 'string',
      group: 'publication',
      description:
        'The same two states a procedure uses. Migrated content starts as "Awaiting review" until a clinician confirms it.',
      options: {
        list: [
          { title: 'Approved', value: 'approved' },
          { title: 'Awaiting review', value: 'pendingReview' },
        ],
        layout: 'radio',
      },
      initialValue: 'pendingReview',
      validation: (rule) => rule.required(),
    }),
  ],

  orderings: [
    {
      name: 'displayOrder',
      title: 'Display order',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],

  preview: {
    select: {
      question: `question.${DEFAULT_LOCALE}`,
      fallback: 'question.en',
      order: 'order',
      isPublished: 'isPublished',
      reviewStatus: 'reviewStatus',
      procedure: `procedure.name.${DEFAULT_LOCALE}`,
      procedureFallback: 'procedure.name.en',
    },
    prepare({
      question,
      fallback,
      order,
      isPublished,
      reviewStatus,
      procedure,
      procedureFallback,
    }) {
      const notes = [
        typeof order === 'number' ? `#${order}` : undefined,
        procedure || procedureFallback,
        isPublished === true ? undefined : 'Hidden',
        reviewStatus === 'approved' ? undefined : 'Awaiting review',
      ].filter(Boolean)
      return {
        title: question || fallback || 'Question',
        subtitle: notes.join(' · '),
      }
    },
  },
})
