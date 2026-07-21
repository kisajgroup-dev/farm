import { getCloudflareContext } from "@opennextjs/cloudflare";

export const runtime = "nodejs";

// Serves images stored in the R2 bucket, e.g. /api/files/uploads/logo-abc.png
export async function GET(_request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const key = path.join("/");

  const { env } = getCloudflareContext();
  const object = await env.BUCKET.get(key);
  if (!object) return new Response("Not found", { status: 404 });

  const headers = new Headers();
  headers.set("content-type", object.httpMetadata?.contentType || "application/octet-stream");
  headers.set("cache-control", "public, max-age=31536000, immutable");
  headers.set("etag", object.httpEtag);

  return new Response(object.body, { headers });
}
