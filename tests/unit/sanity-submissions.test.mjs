import test from "node:test";
import assert from "node:assert/strict";
import { createSanitySubmissionStore } from "../../src/server/newsletter/sanity.mjs";
import { newsletterOrigins } from "../../src/server/newsletter/origins.mjs";

function fakeClient(aclMode = "private", dataset = "submissions") {
  const writes = [];
  return {
    writes,
    config: () => ({ dataset }),
    datasets: { list: async () => [{ name: dataset, aclMode }] },
    createIfNotExists: async (record) => {
      writes.push(record);
    },
    fetch: async () => [],
  };
}
test("Sanity storage preserves consent evidence with an idempotent document ID", async () => {
  const client = fakeClient();
  const store = createSanitySubmissionStore({
    client,
    contentDataset: "production",
  });
  const record = {
    id: "check",
    email: "synthetic@example.com",
    consent: true,
    consentText: "I agree",
    consentTextHash: "hash",
    submittedAt: "2026-10-08T10:00:00Z",
  };
  await store.save(record);
  assert.deepEqual(client.writes[0], {
    ...record,
    _id: "newsletter.check",
    _type: "newsletterSubmission",
    status: "new",
  });
});
test("Sanity storage refuses the content dataset and public submission datasets", async () => {
  assert.throws(
    () =>
      createSanitySubmissionStore({
        client: fakeClient("private", "production"),
        contentDataset: "production",
      }),
    /separate private/,
  );
  const client = fakeClient("public");
  const store = createSanitySubmissionStore({
    client,
    contentDataset: "production",
  });
  await assert.rejects(() => store.save({ id: "test" }), /must be private/);
  await assert.rejects(() => store.read(), /must be private/);
  assert.equal(client.writes.length, 0);
});
test("Vercel origin allowlist includes exact production, preview and branch domains", () => {
  const origins = newsletterOrigins({
    NODE_ENV: "production",
    SITE_URL: "https://upthrust.example",
    VERCEL_URL: "upthrust-unique.vercel.app",
    VERCEL_BRANCH_URL: "upthrust-git-main.vercel.app",
    VERCEL_PROJECT_PRODUCTION_URL: "upthrust.vercel.app",
  });
  assert.equal(origins.length, 4);
  assert.ok(origins.includes("https://upthrust-unique.vercel.app"));
  assert.ok(!origins.includes("https://attacker.vercel.app"));
  assert.ok(!origins.includes("http://localhost:4321"));
});
