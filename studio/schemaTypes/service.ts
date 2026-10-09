import {defineArrayMember, defineField, defineType} from 'sanity'

export const service = defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Service title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Section ID',
      type: 'slug',
      description: 'Used for links to this section. Keep it unchanged after launch.',
      options: {source: 'title', maxLength: 80},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'eyebrow',
      title: 'Small heading above the title',
      type: 'string',
      initialValue: 'WHAT CAN WE DO FOR YOU',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Introduction',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'capabilities',
      title: 'Service bullet points',
      type: 'array',
      description: 'One capability per row. Drag rows to change the order.',
      of: [defineArrayMember({type: 'string'})],
      validation: (Rule) => Rule.required().min(1).max(8),
    }),
    defineField({
      name: 'image',
      title: 'Project collage',
      type: 'accessibleImage',
      description: 'Upload the original collage exported from the supplied Figma design. The page can display text while the export is pending.',
      validation: (Rule) => Rule.required().warning('Add the supplied collage before the final design review.'),
    }),
    defineField({
      name: 'note',
      title: 'Additional note',
      type: 'text',
      rows: 3,
      description: 'Optional italic copy below the bullet points.',
    }),
    defineField({
      name: 'contactLink',
      title: 'Contact button',
      type: 'ctaLink',
      initialValue: {label: 'CONTACT', href: 'mailto:hello@upthrust.agency'},
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {select: {title: 'title', subtitle: 'summary', media: 'image'}},
})
