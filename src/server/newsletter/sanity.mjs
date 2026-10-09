import { createClient } from "@sanity/client";

export function createSanitySubmissionStore({ client, contentDataset }) {
  const dataset = client.config().dataset;
  if (!dataset || dataset === contentDataset)
    throw new Error("Submissions must use a separate private Sanity dataset.");

  async function verifyPrivateDataset() {
    const datasets = await client.datasets.list();
    if (datasets.find((entry) => entry.name === dataset)?.aclMode !== "private")
      throw new Error("The Sanity submissions dataset must be private.");
  }

  return {
    async save(record) {
      await verifyPrivateDataset();
      await client.createIfNotExists({
        ...record,
        _id: `newsletter.${record.id}`,
        _type: "newsletterSubmission",
        status: "new",
      });
    },
    async read() {
      await verifyPrivateDataset();
      return client.fetch(
        '*[_type == "newsletterSubmission"] | order(submittedAt desc)[0...50]{id,email,submittedAt,consentVersion,consentTextHash}',
      );
    },
  };
}

export function getSanitySubmissionStore() {
  const projectId = process.env.SANITY_PROJECT_ID;
  const token = process.env.SANITY_WRITE_TOKEN;
  const dataset = process.env.SANITY_SUBMISSIONS_DATASET;
  if (!projectId || !token || !dataset)
    throw new Error("Sanity submission storage is not configured.");
  const client = createClient({
    projectId,
    dataset,
    token,
    apiVersion: "2025-02-19",
    perspective: "published",
    useCdn: false,
    timeout: 10000,
    maxRetries: 1,
  });
  return createSanitySubmissionStore({
    client,
    contentDataset: process.env.SANITY_DATASET || "production",
  });
}
