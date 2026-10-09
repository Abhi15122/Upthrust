import {defineArrayMember, defineField, defineType} from 'sanity'
import {validateLink} from './objects'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Footer & site settings',
  type: 'document',
  groups: [
    {name: 'brand', title: 'Site brand'},
    {name: 'contact', title: 'Footer', default: true},
    {name: 'newsletter', title: 'Newsletter'},
  ],
  fields: [
    defineField({
      name: 'siteName',
      title: 'Site name',
      type: 'string',
      group: 'brand',
      initialValue: 'Upthrust Design',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'siteUrl',
      title: 'Live website address',
      type: 'url',
      group: 'brand',
      description:
        'The final https:// staging or production address. Used for canonical URLs and structured data.',
      validation: (Rule) =>
        Rule.uri({scheme: ['https']})
          .required()
          .warning('Set this after deploying the frontend.'),
    }),
    defineField({
      name: 'logo',
      title: 'Header logo',
      type: 'accessibleImage',
      group: 'brand',
      description: 'Use the supplied Upthrust logo export.',
      validation: (Rule) => Rule.required().warning('Add the original logo export before launch.'),
    }),
    defineField({
      name: 'footerWordmark',
      title: 'Footer wordmark',
      type: 'accessibleImage',
      group: 'contact',
      description: 'The supplied UPTHRUST DESIGN wordmark, including the orange emblem.',
    }),
    defineField({
      name: 'footerEmblem',
      title: 'Emblem between UPTHRUST and DESIGN',
      type: 'accessibleImage',
      group: 'contact',
      description:
        'The original orange emblem. Used when a complete footer wordmark is not supplied.',
    }),
    defineField({
      name: 'contacts',
      title: 'Contact columns',
      type: 'array',
      group: 'contact',
      of: [
        defineArrayMember({
          name: 'contactColumn',
          title: 'Contact column',
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              title: 'Link text',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'Website link',
              type: 'url',
              validation: (Rule) => Rule.required().uri({scheme: ['https']}),
            }),
            defineField({name: 'description', title: 'Description', type: 'text', rows: 2}),
            defineField({
              name: 'email',
              title: 'Contact email',
              type: 'email',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {select: {title: 'label', subtitle: 'email'}},
        }),
      ],
      validation: (Rule) => Rule.required().min(1).max(3),
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social links',
      type: 'array',
      group: 'contact',
      description: 'These replace the social names below once destinations are available.',
      of: [defineArrayMember({type: 'ctaLink'})],
    }),
    defineField({
      name: 'socialText',
      title: 'Social names without links',
      type: 'string',
      group: 'contact',
      description: 'Shown when there are no social links. Clear this to hide the social line.',
      initialValue: 'Instagram, LinkedIn',
    }),
    defineField({
      name: 'footerNote',
      title: 'Footer note',
      type: 'text',
      rows: 2,
      group: 'contact',
    }),
    defineField({
      name: 'privacyPolicyLabel',
      title: 'Privacy policy text',
      type: 'string',
      group: 'contact',
      initialValue: 'Privacy Policy',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'privacyPolicyUrl',
      title: 'Privacy policy link',
      type: 'string',
      group: 'contact',
      validation: (Rule) => Rule.custom(validateLink),
    }),
    defineField({
      name: 'copyrightName',
      title: 'Copyright name',
      type: 'string',
      group: 'contact',
      initialValue: 'Upthrust Design',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'newsletterHeading',
      title: 'Newsletter heading',
      type: 'string',
      group: 'newsletter',
      initialValue: 'Sign up for our emails',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'newsletterConsent',
      title: 'Consent checkbox text',
      type: 'text',
      rows: 3,
      group: 'newsletter',
      description:
        'Displayed beside the required consent checkbox. Editing this text does not change form-processing rules.',
      initialValue:
        'By checking this box sign up for our newsletter and receive marketing emails and updates on our services. You can unsubscribe at any time.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'newsletterPlaceholder',
      title: 'Email placeholder',
      type: 'string',
      group: 'newsletter',
      initialValue: 'typehere@youremail.com',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'newsletterSubmitLabel',
      title: 'Submit button text',
      type: 'string',
      group: 'newsletter',
      initialValue: 'Submit',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'newsletterSuccessMessage',
      title: 'Successful submission message',
      type: 'text',
      rows: 2,
      group: 'newsletter',
      initialValue: "Thanks — we've received your sign-up.",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    prepare: () => ({
      title: 'Footer & site settings',
      subtitle: 'Footer artwork, contacts, links and newsletter copy',
    }),
  },
})
