import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { getSession } from "@/lib/session";

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/svg+xml", "image/gif"];

export async function POST(request: Request) {
  try {
    // Only signed-in admins can upload.
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    if (!ALLOWED.includes(file.type)) {
      return NextResponse.json({ error: "Please upload a PNG, JPG, WEBP, SVG or GIF image." }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "Image must be under 5 MB." }, { status: 400 });
    }

    // Attempt Vercel Blob upload if BLOB_READ_WRITE_TOKEN is configured
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const ext = (file.name.split(".").pop() || "png").toLowerCase().replace(/[^a-z0-9]/g, "");
        const safeBase = (file.name.replace(/\.[^.]+$/, "") || "image")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "")
          .slice(0, 40) || "image";
        const key = `uploads/${safeBase}-${Date.now().toString(36)}.${ext}`;

        const blob = await put(key, file, {
          access: "public",
          contentType: file.type,
        });

        return NextResponse.json({ url: blob.url });
      } catch (err: any) {
        console.warn("[upload] Vercel Blob upload failed, falling back to Data URL:", err?.message);
      }
    }

    // Fallback: Convert file to Base64 Data URL so uploading always succeeds cleanly
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const dataUrl = `data:${file.type};base64,${buffer.toString("base64")}`;

    return NextResponse.json({ url: dataUrl });
  } catch (err: any) {
    console.error("[upload] Upload handler error:", err);
    return NextResponse.json({ error: err?.message || "Upload failed" }, { status: 500 });
  }
}
