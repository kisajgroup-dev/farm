import { list } from "@vercel/blob";

// Compatibility redirect for image URLs saved before the Vercel Blob migration.
export async function GET(_request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const key = path.join("/");

  const { blobs } = await list({ prefix: key, limit: 1 });
  const blob = blobs.find((candidate) => candidate.pathname === key);
  if (!blob) return new Response("Not found", { status: 404 });

  return Response.redirect(blob.url, 307);
}
