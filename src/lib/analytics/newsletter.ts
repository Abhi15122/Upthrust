export type Conversion = {
  event: "form_submit";
  form_id: "newsletter";
  submission_id: string;
};
declare global {
  interface Window {
    dataLayer: Array<Record<string, unknown>>;
  }
}
export function trackNewsletter(submissionId: string) {
  const event: Conversion = {
    event: "form_submit",
    form_id: "newsletter",
    submission_id: submissionId,
  };
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(event);
  window.dispatchEvent(
    new CustomEvent("upthrust:conversion", { detail: event }),
  );
  if (process.env.NODE_ENV === "development")
    console.info("[Upthrust conversion]", event);
  return event;
}
