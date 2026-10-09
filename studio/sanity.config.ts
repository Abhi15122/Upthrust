import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {schemaTypes} from './schemaTypes'
import {singletonTypes, structure} from './structure'
import {newsletterSubmission} from './schemaTypes/newsletterSubmission'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'lrx8bnhn'

export default defineConfig([
  {
    name: 'upthrust',
    title: 'Website content',
    basePath: '/content',
    projectId,
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',
    plugins: [structureTool({structure})],
    schema: {
      types: schemaTypes,
      templates: (templates) =>
        templates.filter((template) => !singletonTypes.has(template.schemaType)),
    },
    document: {
      actions: (actions, context) =>
        singletonTypes.has(context.schemaType)
          ? actions.filter((action) => action.action !== 'duplicate' && action.action !== 'delete')
          : actions,
    },
  },
  {
    name: 'submissions',
    title: 'Form submissions',
    basePath: '/submissions',
    projectId,
    dataset: process.env.SANITY_STUDIO_SUBMISSIONS_DATASET || 'submissions',
    plugins: [
      structureTool({
        structure: (S) =>
          S.list()
            .title('Form submissions')
            .items([S.listItem().title('Newsletter sign-ups').child(S.documentTypeList('newsletterSubmission').title('Newsletter sign-ups').initialValueTemplates([]))]),
      }),
    ],
    schema: {types: [newsletterSubmission], templates: []},
    document: {
      newDocumentOptions: () => [],
      actions: (actions) => actions.filter((action) => action.action === 'delete'),
    },
  },
])
