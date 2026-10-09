import {createReadStream} from 'node:fs'
import {fileURLToPath} from 'node:url'
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2025-02-19'})
const collages = [
  {slug: 'strategy', file: 'strategy-bento.png', alt: 'Brand strategy research, audience personas, typography and project planning collage'},
  {slug: 'brand', file: 'brand-bento.png', alt: 'Brand identity collage with team photography, website design, colour palettes and graphic elements'},
  {slug: 'product', file: 'product-bento.png', alt: 'Product and digital design collage featuring app interfaces, Inter typography, purple and pink colour palettes, and Neatlogs branding'},
  {slug: 'creative', file: 'creative-bento.svg', alt: 'Campaign production collage with print brochures, outdoor advertising, presentation design and blue and white marketing creative'},
]
async function main() {
  for (const collage of collages) {
    const documents = await client.fetch<Array<{_id: string; image?: {asset?: {_ref: string}}}>>(
      '*[_type == "service" && slug.current == $slug]{_id,image}', {slug: collage.slug},
    )
    if (!documents.length) throw new Error(`Service ${collage.slug} was not found.`)
    const missing = documents.filter(document => !document.image?.asset?._ref)
    if (!missing.length) {console.log(`${collage.slug}: existing CMS image preserved`); continue}
    const path = fileURLToPath(new URL(`../../public/images/${collage.file}`, import.meta.url))
    const asset = await client.assets.upload('image', createReadStream(path), {filename: collage.file})
    for (const document of missing) {
      await client.patch(document._id).setIfMissing({
        image: {_type: 'accessibleImage', asset: {_type: 'reference', _ref: asset._id}, alt: collage.alt},
      }).commit()
    }
    console.log(`${collage.slug}: ${asset.metadata.dimensions.width} × ${asset.metadata.dimensions.height}, linked to ${missing.length} service document(s)`)
  }
}
main().catch(error => {console.error(error.message); process.exitCode = 1})
