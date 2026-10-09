"use client";
import { useRef, useState, type FormEvent } from "react";
import { trackNewsletter } from "@/lib/analytics/newsletter";
export type NewsletterCopy = {
  newsletterHeading: string;
  newsletterConsent: string;
  newsletterPlaceholder: string;
  newsletterSubmitLabel: string;
  newsletterSuccessMessage: string;
};
export function Newsletter({
  copy,
  compact = false,
}: {
  copy: NewsletterCopy;
  compact?: boolean;
}) {
  const [status, setStatus] = useState<
    "idle" | "pending" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");
  const busy = useRef(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy.current) return;
    const form = e.currentTarget;
    busy.current = true;
    setStatus("pending");
    setMessage("Saving your sign-up…");
    try {
      const body = new URLSearchParams();
      new FormData(form).forEach((value, key) => body.set(key, String(value)));
      const response = await fetch("/api/newsletter", {
        method: "POST",
        body,
        signal: AbortSignal.timeout(15000),
      });
      const result = await response.json();
      if (!response.ok || !result.success || !result.submissionId)
        throw new Error(
          result.error || "Unable to save your sign-up. Please try again.",
        );
      setStatus("success");
      setMessage(copy.newsletterSuccessMessage);
      form.reset();
      trackNewsletter(result.submissionId);
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error && error.name !== "TimeoutError"
          ? error.message
          : "The request timed out. Please try again.",
      );
    } finally {
      busy.current = false;
    }
  }
  const consent = (
    <label
      className={
        compact
          ? "mb-[9px] flex items-start gap-[7px] text-[9px] leading-[1.18] text-[#eee] max-[540px]:gap-[9px] max-[540px]:text-[10px] max-[540px]:leading-[1.4]"
          : "mt-[18px] flex items-start gap-2.5 text-[10px] leading-[1.7] text-[#aaa]"
      }
    >
      <input
        className={
          compact
            ? "relative m-0 h-[9px] w-2 shrink-0 basis-2 appearance-none rounded-none border border-[#ccc] checked:border-orange checked:bg-orange checked:after:absolute checked:after:-top-1 checked:after:-left-px checked:after:text-[11px] checked:after:text-white checked:after:content-['✓'] max-[540px]:mt-px max-[540px]:size-[13px] max-[540px]:basis-[13px] max-[540px]:checked:after:-top-0.5 max-[540px]:checked:after:left-0"
            : "mt-0.5 size-4 shrink-0 accent-orange"
        }
        type="checkbox"
        name="consent"
        value="yes"
        required
        disabled={status === "pending"}
      />
      <span>{copy.newsletterConsent}</span>
    </label>
  );
  return (
    <form
      name="newsletter"
      onSubmit={submit}
      action="/api/newsletter"
      method="POST"
      aria-labelledby="newsletter-title"
    >
      <h2
        id="newsletter-title"
        className={
          compact
            ? "mt-0 mb-3 text-xs leading-[1.25] font-normal tracking-normal [font-family:Arial,Helvetica,sans-serif] max-[540px]:text-sm"
            : "text-2xl font-medium tracking-tight"
        }
      >
        {copy.newsletterHeading}
      </h2>
      {!compact && (
        <p className="mt-3 mb-7 text-sm text-white/60">
          A little inspiration. A fresh perspective. Straight to your inbox.
        </p>
      )}
      <div hidden aria-hidden="true">
        <label>
          Leave empty
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {compact && consent}
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <div
        className={
          compact
            ? "block border-0"
            : "flex items-stretch border-b border-white/50"
        }
      >
        <input
          className={
            compact
              ? "m-0 block w-full border-0 bg-transparent p-0 text-xs leading-[1.5] text-white shadow-none outline-none placeholder:text-[#808080] [font-family:Arial,Helvetica,sans-serif] focus:outline-none focus-visible:outline-none max-[540px]:py-[7px] max-[540px]:text-base"
              : "min-w-0 flex-1 rounded-none border-0 bg-transparent py-3 text-sm text-white placeholder:text-[#a6a6a6]"
          }
          id="newsletter-email"
          type="email"
          name="email"
          placeholder={copy.newsletterPlaceholder}
          required
          maxLength={254}
          autoComplete="email"
          disabled={status === "pending"}
        />
        <button
          className={
            compact
              ? "block border-0 bg-transparent px-0 pt-[7px] pb-0 text-xs leading-[1.5] font-normal text-white [font-family:Arial,Helvetica,sans-serif] hover:underline disabled:cursor-wait disabled:opacity-60 max-[540px]:min-h-11 max-[540px]:py-[7px] max-[540px]:text-[13px]"
              : "flex items-center gap-[18px] border-0 bg-transparent py-2 pr-0 pl-[15px] text-xs text-white disabled:cursor-wait disabled:opacity-60"
          }
          type="submit"
          disabled={status === "pending"}
        >
          {status === "pending" ? "Saving…" : copy.newsletterSubmitLabel}
          <span
            className={compact ? "hidden" : "text-[27px] text-[#ff6830]"}
            aria-hidden="true"
          >
            ↗
          </span>
        </button>
      </div>
      {!compact && consent}
      <p
        className={
          compact
            ? "mt-2 mb-0 min-h-0 text-[11px] text-[#ffbb9f] empty:m-0 data-[state=success]:text-[#b7e5bd]"
            : "mt-3.5 min-h-6 text-xs leading-[1.6] text-[#ffbb9f] data-[state=success]:text-[#b7e5bd]"
        }
        role="status"
        aria-live="polite"
        data-state={status}
      >
        {message}
      </p>
    </form>
  );
}
