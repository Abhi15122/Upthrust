import {getCliClient} from 'sanity/cli'
import {page} from '../../src/content/defaults'
const client = getCliClient({apiVersion: '2025-02-19'})
async function main() {
  const home = await client.getDocument('homePage')
  if (!home) throw new Error('Existing homepage not found; refusing to replace content.')
  const defaults = {
    introHeading: page.introHeading,
    introBody: page.introBody,
    faqHeading: page.faqHeading,
    faqs: page.faqs.map((faq) => ({...faq, _type: 'faq'})),
    testimonials: [],
  }
  await client.patch('homePage').setIfMissing(defaults).commit()
  const draft = await client.getDocument('drafts.homePage')
  if (draft) await client.patch('drafts.homePage').setIfMissing(defaults).commit()
  const saved = await client.getDocument('homePage')
  console.log(
    JSON.stringify({
      project: client.config().projectId,
      dataset: client.config().dataset,
      homepage: saved?._id,
      faqCount: saved?.faqs?.length,
      introHeading: saved?.introHeading,
    }),
  )
}
main().catch((error) => {
  console.error(error.message)
  process.exitCode = 1
})
