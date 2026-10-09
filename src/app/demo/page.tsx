import { notFound } from "next/navigation";
import { getContent } from "@/lib/sanity/content";
import { submissionStorage } from "@/server/newsletter/storage.mjs";
import { DemoDashboard } from "@/components/demo/demo-dashboard";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Form & tracking demo | Upthrust",
  robots: { index: false, follow: false },
};
export default async function Demo() {
  if (process.env.NODE_ENV !== "development") notFound();
  const { settings } = await getContent();
  return (
    <main className="mx-auto max-w-6xl px-6 py-14">
      <a href="/" className="text-sm underline">
        ← Back to website
      </a>
      <p className="mt-12 text-xs uppercase tracking-widest">
        Local interview walkthrough
      </p>
      <h1 className="mt-4 mb-6 text-5xl font-semibold tracking-tight">
        From submit to stored.
      </h1>
      <p className="mb-12 max-w-2xl text-black/60">
        1. Submit the form. Watch the server save the record, then watch the
        browser trigger its conversion event. This page is available only during
        local development.
      </p>
      <DemoDashboard copy={settings} storage={submissionStorage()} />
    </main>
  );
}
