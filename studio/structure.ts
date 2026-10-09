import type {StructureResolver} from 'sanity/structure'

export const singletonTypes = new Set(['homePage', 'siteSettings'])

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Website content')
    .items([
      S.listItem()
        .id('homepage')
        .title('Homepage')
        .child(S.document().schemaType('homePage').documentId('homePage').title('Homepage')),
      S.documentTypeListItem('service').title('Services'),
      S.divider(),
      S.listItem()
        .id('site-settings')
        .title('Footer & site settings')
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('Footer & site settings'),
        ),
    ])
