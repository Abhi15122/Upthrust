"use client";
import { useEffect, useState } from "react";
import { Newsletter, type NewsletterCopy } from "../newsletter/newsletter";
import type { Conversion } from "@/lib/analytics/newsletter";
type RecordRow = {
  id: string;
  email: string;
  submittedAt: string;
  consentVersion: string;
  consentTextHash: string;
};
export function DemoDashboard({
  copy,
  storage,
}: {
  copy: NewsletterCopy;
  storage: string;
}) {
  const [records, setRecords] = useState<RecordRow[]>([]);
  const [events, setEvents] = useState<Conversion[]>([]);
  const [error, setError] = useState("");
  async function refresh() {
    try {
      const r = await fetch("/api/demo/submissions");
      if (!r.ok) throw new Error("Could not load saved submissions.");
      setRecords((await r.json()).submissions);
    } catch (e) {
      setError(String(e));
    }
  }
  useEffect(() => {
    void refresh();
    const listener = (e: Event) => {
      setEvents((previous) => [
        ...previous,
        (e as CustomEvent<Conversion>).detail,
      ]);
      void refresh();
    };
    window.addEventListener("upthrust:conversion", listener);
    return () => window.removeEventListener("upthrust:conversion", listener);
  }, []);
  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div className="rounded-2xl bg-ink p-7 text-white">
        <Newsletter copy={copy} />
        <p className="mt-8 border-t border-white/20 pt-6 text-xs text-white/60">
          Development preview · Use a synthetic email such as
          interview@example.com. This form uses the same endpoint and component
          as the website.
        </p>
      </div>
      <div>
        <h2 className="text-xl font-semibold">2. Watch the conversion event</h2>
        <p className="my-3 text-sm text-black/60">
          A form_submit event fires only after the server confirms storage.
          Match its submission_id to the saved record.
        </p>
        <pre
          className="overflow-auto rounded-xl bg-black/5 p-5 text-xs"
          data-testid="events"
        >
          {JSON.stringify(events, null, 2)}
        </pre>
      </div>
      <div className="min-w-0 lg:col-span-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            3. Inspect saved submissions
          </h2>
          <button onClick={refresh} className="underline">
            Refresh records
          </button>
        </div>
        <p className="my-3 text-sm text-black/60">
          {storage === "sanity"
            ? "Stored permanently in the private Sanity submissions dataset."
            : "Stored in .data/newsletter.ndjson, outside the public directory."}{" "}
          Latest 50 records.
        </p>
        {error && <p role="alert">{error}</p>}
        <div className="overflow-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr>
                {["Email", "Submission ID", "Saved at", "Consent version"].map(
                  (h) => (
                    <th key={h} className="border-b p-3">
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.id}>
                  <td className="border-b p-3">{r.email}</td>
                  <td className="border-b p-3 font-mono">{r.id}</td>
                  <td className="border-b p-3">{r.submittedAt}</td>
                  <td className="border-b p-3">{r.consentVersion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
