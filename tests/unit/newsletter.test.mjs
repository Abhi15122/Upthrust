import test from "node:test";
import assert from "node:assert/strict";
import { validateNewsletter } from "../../src/server/newsletter/validation.mjs";
import { createNewsletterHandler } from "../../src/server/newsletter/handler.mjs";
import { saveSubmission } from "../../src/server/newsletter/storage.mjs";
const body = "email=INTERVIEW%40EXAMPLE.COM&consent=yes";
const request = (data = body, headers = {}) =>
  new Request("http://localhost:4321/api/newsletter", {
    method: "POST",
    headers: {
      origin: "http://localhost:4321",
      "content-type": "application/x-www-form-urlencoded",
      ...headers,
    },
    body: data,
  });
test("validation requires a valid email, affirmative consent and an empty honeypot", () => {
  for (const invalid of [
    "email=invalid&consent=yes",
    "email=a%40example.com",
    "email=a%40example.com&consent=no",
    "email=a%40example.com&consent=yes&website=bot",
  ])
    assert.equal(validateNewsletter(invalid).status, 400);
  assert.equal(validateNewsletter("x".repeat(8193)).status, 413);
  const { record } = validateNewsletter(body);
  assert.equal(record.email, "interview@example.com");
  assert.equal(record.consent, true);
  assert.ok(record.id);
});
test("handler persists consent evidence before returning a matching submission ID", async () => {
  let saved;
  const handler = createNewsletterHandler({
    save: async (r) => {
      saved = r;
    },
    getConsent: async () => "I agree to receive emails.",
  });
  const response = await handler(request());
  assert.equal(response.status, 201);
  assert.equal((await response.json()).submissionId, saved.id);
  assert.equal(saved.consentText, "I agree to receive emails.");
  assert.equal(saved.consentTextHash.length, 64);
  assert.equal(response.headers.get("cache-control"), "no-store");
});
test("invalid, cross-origin, unsupported and oversized requests never reach storage", async () => {
  let writes = 0;
  const handler = createNewsletterHandler({
    save: async () => {
      writes++;
    },
    getConsent: async () => "Consent",
  });
  for (const [req, status] of [
    [request("email=bad&consent=yes"), 400],
    [request(body, { origin: "https://other.example" }), 403],
    [request(body, { "content-type": "application/json" }), 415],
    [request("x".repeat(8193)), 413],
    [request(body, { "content-length": "9000" }), 413],
  ])
    assert.equal((await handler(req)).status, status);
  assert.equal(writes, 0);
});
test("failed storage or content lookup never returns success", async () => {
  for (const options of [
    {
      save: async () => {
        throw Error("offline");
      },
      getConsent: async () => "Consent",
    },
    {
      save: async () => {},
      getConsent: async () => {
        throw Error("offline");
      },
    },
  ]) {
    const response = await createNewsletterHandler(options)(request());
    assert.equal(response.status, 503);
    assert.equal((await response.json()).success, undefined);
  }
});
test("production storage fails closed without a configured destination and checks webhook acceptance", async () => {
  const before = {
    NODE_ENV: process.env.NODE_ENV,
    NEWSLETTER_WEBHOOK_URL: process.env.NEWSLETTER_WEBHOOK_URL,
    NEWSLETTER_WEBHOOK_TOKEN: process.env.NEWSLETTER_WEBHOOK_TOKEN,
  };
  const previousFetch = globalThis.fetch;
  try {
    process.env.NODE_ENV = "production";
    delete process.env.NEWSLETTER_WEBHOOK_URL;
    await assert.rejects(
      () => saveSubmission({ id: "test" }),
      /not configured/,
    );
    process.env.NEWSLETTER_WEBHOOK_URL = "http://example.com";
    await assert.rejects(() => saveSubmission({ id: "test" }), /HTTPS/);
    process.env.NEWSLETTER_WEBHOOK_URL = "https://example.com/store";
    process.env.NEWSLETTER_WEBHOOK_TOKEN = "test-only";
    globalThis.fetch = async (url, options) => {
      assert.equal(url.href, "https://example.com/store");
      assert.equal(options.headers.Authorization, "Bearer test-only");
      return new Response(null, { status: 201 });
    };
    await saveSubmission({ id: "test" });
    globalThis.fetch = async () => new Response(null, { status: 500 });
    await assert.rejects(() => saveSubmission({ id: "test" }), /rejected/);
  } finally {
    globalThis.fetch = previousFetch;
    for (const [key, value] of Object.entries(before)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
});

test("configured browser origin works even when Next uses an internal localhost URL", async () => {
  const handler = createNewsletterHandler({
    save: async () => {},
    getConsent: async () => "Consent",
    allowedOrigins: ["http://127.0.0.1:4321"],
  });
  assert.equal(
    (await handler(request(body, { origin: "http://127.0.0.1:4321" }))).status,
    201,
  );
  assert.equal(
    (await handler(request(body, { origin: "https://untrusted.example" })))
      .status,
    403,
  );
});
