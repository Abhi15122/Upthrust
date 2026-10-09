import {createReadStream} from 'node:fs'
import {fileURLToPath} from 'node:url'
import {getCliClient} from 'sanity/cli'
import {services} from '../../src/content/defaults'

const client = getCliClient({apiVersion: '2025-02-19'})
const product = services.find((service) => service.id === 'product')!
const ids = ['service-product', 'drafts.service-product', 'homePage', 'drafts.homePage']

async function main() {
  const [published, draft, home, homeDraft] = await client.getDocuments(ids)
  if (!home) throw new Error('Existing homepage not found; refusing to replace content.')

  let image = published?.image || draft?.image
  if (!image?.asset?._ref) {
    const path = fileURLToPath(new URL('../../public/images/product-bento.png', import.meta.url))
    const asset = await client.assets.upload('image', createReadStream(path), {
      filename: 'product-bento.png',
    })
    image = {
      _type: 'accessibleImage',
      asset: {_type: 'reference', _ref: asset._id},
      alt: product.imageAlt,
    }
  }

  const defaults = {
    _type: 'service',
    title: draft?.title || product.title,
    slug: draft?.slug || {_type: 'slug', current: 'product'},
    eyebrow: draft?.eyebrow || 'WHAT CAN WE DO FOR YOU',
    summary: draft?.summary || product.summary,
    capabilities: draft?.capabilities?.length ? draft.capabilities : product.capabilities,
    note: draft?.note || product.note,
    image,
    contactLink: draft?.contactLink || {
      _type: 'ctaLink',
      label: 'CONTACT',
      href: 'mailto:hello@upthrust.agency',
    },
  }

  const transaction = client.transaction().createIfNotExists({
    _id: 'service-product',
    ...defaults,
  })
  if (published) {
    transaction.patch(published._id, (patch) =>
      patch.ifRevisionId(published._rev).setIfMissing(defaults),
    )
  }
  if (draft) {
    transaction.patch(draft._id, (patch) => patch.ifRevisionId(draft._rev).setIfMissing(defaults))
  }
  for (const document of [home, homeDraft]) {
    if (
      !document ||
      document.services?.some((service: {_ref: string}) => service._ref === 'service-product')
    )
      continue
    const references = [...(document.services || [])]
    const brandIndex = references.findIndex((service) => service._ref === 'service-brand')
    references.splice(brandIndex >= 0 ? brandIndex + 1 : Math.min(2, references.length), 0, {
      _key: 'product',
      _type: 'reference',
      _ref: 'service-product',
    })
    transaction.patch(document._id, (patch) =>
      patch.ifRevisionId(document._rev).set({services: references}),
    )
  }
  await transaction.commit()
  const saved = await client.getDocument('service-product')
  const savedHome = await client.getDocument('homePage')
  console.log(
    JSON.stringify(
      {
        service: saved?._id,
        title: saved?.title,
        capabilities: saved?.capabilities,
        image: saved?.image?.asset?._ref,
        serviceOrder: savedHome?.services?.map((service: {_ref: string}) => service._ref),
      },
      null,
      2,
    ),
  )
}

main().catch((error) => {
  console.error(error.message)
  process.exitCode = 1
})
