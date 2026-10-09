import {defineField, defineType} from 'sanity'

export const newsletterSubmission = defineType({
  name: 'newsletterSubmission',
  title: 'Newsletter submission',
  type: 'document',
  liveEdit: true,
  description: 'Submitted through the website. Original consent evidence is read-only.',
  fields: [
    defineField({name: 'email', title: 'Email address', type: 'email', readOnly: true}),
    defineField({name: 'submittedAt', title: 'Submitted at', type: 'datetime', readOnly: true}),
    defineField({
      name: 'status',
      title: 'Review status',
      type: 'string',
      options: {
        list: [
          {title: 'New', value: 'new'},
          {title: 'Reviewed', value: 'reviewed'},
          {title: 'Archived', value: 'archived'},
        ],
      },
    }),
    defineField({name: 'consent', title: 'Consent given', type: 'boolean', readOnly: true}),
    defineField({
      name: 'consentText',
      title: 'Consent wording at submission',
      type: 'text',
      rows: 3,
      readOnly: true,
    }),
    defineField({name: 'consentVersion', title: 'Consent version', type: 'string', readOnly: true}),
    defineField({
      name: 'consentTextHash',
      title: 'Consent wording hash',
      type: 'string',
      readOnly: true,
    }),
    defineField({name: 'id', title: 'Submission ID', type: 'string', readOnly: true}),
    defineField({name: 'form', title: 'Form', type: 'string', readOnly: true}),
  ],
  orderings: [
    {title: 'Newest first', name: 'newest', by: [{field: 'submittedAt', direction: 'desc'}]},
  ],
  preview: {
    select: {title: 'email', submittedAt: 'submittedAt', status: 'status'},
    prepare({title, submittedAt, status}) {
      return {
        title,
        subtitle: `${status || 'new'} · ${submittedAt ? new Date(submittedAt).toLocaleString() : 'Date unavailable'}`,
      }
    },
  },
})
