import {defineField, defineType} from 'sanity'

export function validateLink(value: string | undefined) {
  if (!value) return true
  if (/^#[a-zA-Z][\w-]*$/.test(value) || /^\/(?!\/)/.test(value)) return true
  try {
    return (
      ['https:', 'http:', 'mailto:', 'tel:'].includes(new URL(value).protocol) ||
      'Use an https:// URL, email link, telephone link, /page or #section.'
    )
  } catch {
    return 'Use an https:// URL, email link, telephone link, /page or #section.'
  }
}

export const accessibleImage = defineType({
  name: 'accessibleImage',
  title: 'Image',
  type: 'image',
  options: {hotspot: true},
  fields: [
    defineField({
      name: 'alt',
      title: 'Image description',
      type: 'string',
      description:
        'Describe the image for people using screen readers. For a logo, use the brand name.',
      validation: (Rule) => Rule.required(),
    }),
  ],
})

export const ctaLink = defineType({
  name: 'ctaLink',
  title: 'Button or link',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Button text',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'href',
      title: 'Destination',
      type: 'string',
      description:
        'For example: mailto:hello@upthrust.agency, #newsletter, or an https:// address.',
      validation: (Rule) => Rule.required().custom(validateLink),
    }),
  ],
  preview: {select: {title: 'label', subtitle: 'href'}},
})

export const seo = defineType({
  name: 'seo',
  title: 'Search and social sharing',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Page title',
      type: 'string',
      description: 'The title shown in search results and the browser tab.',
      validation: (Rule) => [
        Rule.required(),
        Rule.max(60).warning('Aim for 60 characters or fewer.'),
      ],
    }),
    defineField({
      name: 'description',
      title: 'Page description',
      type: 'text',
      rows: 3,
      validation: (Rule) => [
        Rule.required(),
        Rule.max(160).warning('Aim for 160 characters or fewer.'),
      ],
    }),
    defineField({
      name: 'image',
      title: 'Social sharing image',
      type: 'accessibleImage',
      description: 'Shown when someone shares the page. A 1200 × 630 image is recommended.',
      validation: (Rule) =>
        Rule.required().warning('Add the supplied sharing image before launch.'),
    }),
  ],
})
