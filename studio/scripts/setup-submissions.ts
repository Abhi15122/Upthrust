import {chmod, readFile, writeFile} from 'node:fs/promises'
import {fileURLToPath} from 'node:url'
import {getCliClient} from 'sanity/cli'

// Run with `sanity exec scripts/setup-submissions.ts --with-user-token`.
// Secret values are written directly to the ignored .env file, never logged.
async function main() {
  const client = getCliClient({apiVersion: '2025-02-19'})
  const projectId = client.config().projectId!
  const dataset = 'submissions'
  const datasets = await client.datasets.list()
  const existing = datasets.find((entry) => entry.name === dataset)
  if (existing && existing.aclMode !== 'private')
    throw new Error('The submissions dataset exists but is not private. No changes made.')
  if (!existing) await client.datasets.create(dataset, {aclMode: 'private'})
  const envPath = fileURLToPath(new URL('../../.env', import.meta.url))
  const env = await readFile(envPath, 'utf8').catch((error: NodeJS.ErrnoException) => {
    if (error.code !== 'ENOENT') throw error
    return ''
  })
  let token = env.match(/^SANITY_WRITE_TOKEN=(.+)$/m)?.[1]?.trim()
  if (!token) {
    const created = await client.withConfig({useProjectHostname: false}).request<{key: string}>({
      url: `/projects/${projectId}/tokens`,
      method: 'POST',
      body: {label: 'Upthrust website newsletter storage', roleName: 'editor'},
    })
    if (!created.key) throw new Error('Sanity did not return a robot token.')
    token = created.key
  }
  const settings: Record<string, string> = {
    SANITY_PROJECT_ID: projectId,
    SANITY_SUBMISSIONS_DATASET: dataset,
    SANITY_WRITE_TOKEN: token,
    NEWSLETTER_STORAGE: 'sanity',
  }
  const preserved = env
    .split('\n')
    .filter((line) => !Object.keys(settings).some((key) => line.startsWith(`${key}=`)))
    .join('\n')
    .trimEnd()
  await writeFile(
    envPath,
    `${preserved}\n\n# Server-only private submission storage\n${Object.entries(settings)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n')}\n`,
    {mode: 0o600},
  )
  await chmod(envPath, 0o600)
  const writer = client.withConfig({dataset, token})
  const accessible = await writer.datasets.list()
  if (accessible.find((entry) => entry.name === dataset)?.aclMode !== 'private')
    throw new Error('Private dataset verification failed.')
  await writer.fetch('count(*[_type == "newsletterSubmission"])')
  console.log(`Connected private dataset "${dataset}" in project ${projectId}.`)
  console.log('Dedicated server token saved to ignored .env; no secret was printed.')
}
main().catch((error: Error) => {
  console.error(error.message)
  process.exitCode = 1
})
