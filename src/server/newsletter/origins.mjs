/** Exact configured origins only; never trust a client-supplied forwarded host. */
export function newsletterOrigins(env = process.env) {
  const origins = new Set();
  if (env.SITE_URL) origins.add(new URL(env.SITE_URL).origin);
  for (const key of [
    "VERCEL_URL",
    "VERCEL_BRANCH_URL",
    "VERCEL_PROJECT_PRODUCTION_URL",
  ])
    if (env[key]) origins.add(new URL(`https://${env[key]}`).origin);
  if (env.NODE_ENV === "development") {
    origins.add("http://localhost:4321");
    origins.add("http://127.0.0.1:4321");
  }
  return [...origins];
}
