import { appendFile, mkdir, readFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { getSanitySubmissionStore } from "./sanity.mjs";

export const submissionStorage = () =>
  process.env.NEWSLETTER_STORAGE ||
  (process.env.NEWSLETTER_WEBHOOK_URL
    ? "webhook"
    : process.env.NODE_ENV === "production"
      ? "sanity"
      : "local");
export const submissionsPath = () =>
  resolve(process.cwd(), ".data", "newsletter.ndjson");
export async function saveSubmission(record) {
  const provider = submissionStorage();
  if (provider === "sanity") return getSanitySubmissionStore().save(record);
  if (provider !== "webhook" && provider !== "local")
    throw new Error("Unknown submission storage provider.");
  if (provider === "webhook") {
    if (!process.env.NEWSLETTER_WEBHOOK_URL)
      throw new Error("Production submission storage is not configured.");
    const url = new URL(process.env.NEWSLETTER_WEBHOOK_URL);
    if (url.protocol !== "https:")
      throw new Error("The submission webhook must use HTTPS.");
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.NEWSLETTER_WEBHOOK_TOKEN
          ? { Authorization: `Bearer ${process.env.NEWSLETTER_WEBHOOK_TOKEN}` }
          : {}),
      },
      body: JSON.stringify(record),
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok)
      throw new Error("Submission storage rejected the record.");
    return;
  }
  if (process.env.NODE_ENV === "production")
    throw new Error("Production submission storage is not configured.");
  const path = submissionsPath();
  await mkdir(dirname(path), { recursive: true, mode: 0o700 });
  await appendFile(path, JSON.stringify(record) + "\n", {
    encoding: "utf8",
    mode: 0o600,
  });
}
export async function readSubmissions() {
  if (process.env.NODE_ENV === "production")
    throw new Error("Submission previews are unavailable in production.");
  if (submissionStorage() === "sanity")
    return getSanitySubmissionStore().read();
  if (submissionStorage() === "webhook")
    throw new Error(
      "View webhook submissions in the connected storage service.",
    );
  try {
    return (await readFile(submissionsPath(), "utf8"))
      .trim()
      .split("\n")
      .filter(Boolean)
      .map((line) => JSON.parse(line))
      .reverse()
      .slice(0, 50);
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
}
