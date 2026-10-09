import {createReadStream} from 'node:fs'
import {fileURLToPath} from 'node:url'
import {getCliClient} from 'sanity/cli'
import {settings} from '../../src/content/defaults'

const client = getCliClient({apiVersion: '2025-02-19'})

async function main() {
  const published = await client.getDocument('siteSettings')
  if (!published) throw new Error('Existing site settings not found; refusing to replace content.')
  const draft = await client.getDocument('drafts.siteSettings')
  const documents = [published, ...(draft ? [draft] : [])]
  let emblem = documents.find((document) => document.footerEmblem?.asset?._ref)?.footerEmblem
  if (!emblem) {
    const path = fileURLToPath(new URL('../../public/images/footer-emblem.png', import.meta.url))
    const asset = await client.assets.upload('image', createReadStream(path), {
      filename: 'footer-emblem.png',
    })
    emblem = {
      _type: 'accessibleImage',
      asset: {_type: 'reference', _ref: asset._id},
      alt: 'Orange Upthrust emblem',
    }
  }
  for (const document of documents) {
    const missing: Record<string, unknown> = {
      footerEmblem: emblem,
      footerNote: settings.footerNote,
      socialText: settings.socialText,
      privacyPolicyLabel: settings.privacyPolicyLabel,
      copyrightName: settings.copyrightName,
      newsletterHeading: settings.newsletterHeading,
      newsletterConsent: settings.newsletterConsent,
      newsletterPlaceholder: settings.newsletterPlaceholder,
      newsletterSubmitLabel: settings.newsletterSubmitLabel,
      newsletterSuccessMessage: settings.newsletterSuccessMessage,
    }
    for (const contact of document.contacts || []) {
      if (typeof contact._key !== 'string') continue
      missing[`contacts[_key==${JSON.stringify(contact._key)}].description`] =
        'add description here'
    }
    await client.patch(document._id).ifRevisionId(document._rev).setIfMissing(missing).commit()
    console.log(`${document._id}: missing footer fields filled; existing content preserved`)
  }
}

main().catch((error) => {
  console.error(error.message)
  process.exitCode = 1
})
