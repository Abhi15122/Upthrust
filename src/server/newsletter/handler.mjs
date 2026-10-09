import { createHash } from "node:crypto";
import { validateNewsletter } from "./validation.mjs";
const json = (body, status) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
export function createNewsletterHandler({ save, getConsent, allowedOrigins }) {
  return async function POST(request) {
    if (
      request.headers.get("origin") &&
      !(allowedOrigins || [new URL(request.url).origin]).includes(
        request.headers.get("origin"),
      )
    )
      return json({ error: "Unable to accept this request." }, 403);
    if (
      !(request.headers.get("content-type") || "").startsWith(
        "application/x-www-form-urlencoded",
      )
    )
      return json({ error: "Unsupported submission format." }, 415);
    if (Number(request.headers.get("content-length")) > 8192)
      return json({ error: "The submission is too large." }, 413);
    try {
      const reader = request.body?.getReader();
      let size = 0;
      const chunks = [];
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          size += value.byteLength;
          if (size > 8192) {
            await reader.cancel();
            return json({ error: "The submission is too large." }, 413);
          }
          chunks.push(value);
        }
      }
      const result = validateNewsletter(Buffer.concat(chunks).toString("utf8"));
      if (result.error) return json({ error: result.error }, result.status);
      const consentText = await getConsent();
      const record = {
        ...result.record,
        consentText,
        consentTextHash: createHash("sha256").update(consentText).digest("hex"),
      };
      await save(record);
      return json({ success: true, submissionId: record.id }, 201);
    } catch {
      return json(
        { error: "We couldn't save your sign-up. Please try again." },
        503,
      );
    }
  };
}
