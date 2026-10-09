import { readSubmissions } from "@/server/newsletter/storage.mjs";
export const dynamic = "force-dynamic";
export async function GET() {
  if (process.env.NODE_ENV !== "development")
    return new Response(null, { status: 404 });
  return Response.json(
    { submissions: await readSubmissions() },
    { headers: { "Cache-Control": "no-store" } },
  );
}
