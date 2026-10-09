"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main id="main" className="mx-auto max-w-xl px-6 py-32">
      <p className="text-orange">UPTHRUST</p>
      <h1 className="my-6 text-4xl font-semibold">A little interruption.</h1>
      <p>We couldn't load the page. Please try again in a moment.</p>
      <button className="mt-8 bg-ink px-6 py-3 text-white" onClick={reset}>
        Try again ↗
      </button>
    </main>
  );
}
