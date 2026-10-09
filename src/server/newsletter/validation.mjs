import { randomUUID } from "node:crypto";

export const CONSENT_VERSION = "2026-10-08";

export function validateNewsletter(body) {
  if (typeof body !== "string" || Buffer.byteLength(body, "utf8") > 8192) {
    return { error: "The submission is too large.", status: 413 };
  }
  const fields = new URLSearchParams(body);
  const email = (fields.get("email") || "").trim().toLowerCase();
  if (fields.get("website"))
    return { error: "Unable to accept this submission.", status: 400 };
  if (
    !email ||
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    return { error: "Enter a valid email address.", status: 400 };
  }
  if (fields.get("consent") !== "yes") {
    return {
      error: "Please confirm that you want to receive our emails.",
      status: 400,
    };
  }
  return {
    record: {
      id: randomUUID(),
      form: "newsletter",
      email,
      consent: true,
      consentVersion: CONSENT_VERSION,
      submittedAt: new Date().toISOString(),
    },
  };
}
