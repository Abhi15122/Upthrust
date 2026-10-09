import { createNewsletterHandler } from "@/server/newsletter/handler.mjs";
import { saveSubmission } from "@/server/newsletter/storage.mjs";
import { newsletterOrigins } from "@/server/newsletter/origins.mjs";
import { getContent } from "@/lib/sanity/content";
export const runtime = "nodejs";
export const POST = createNewsletterHandler({
  save: saveSubmission,
  allowedOrigins: newsletterOrigins(),
  getConsent: async () => (await getContent()).settings.newsletterConsent,
});
