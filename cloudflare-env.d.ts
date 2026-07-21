// Types for the Cloudflare bindings this app uses.
// Regenerate/extend with: npm run cf-typegen
/// <reference types="@cloudflare/workers-types" />

interface CloudflareEnv {
  DB: D1Database;
  BUCKET: R2Bucket;
  ASSETS: Fetcher;

  // Secrets / vars (also available on process.env at runtime)
  AUTH_SECRET: string;
  BOOTSTRAP_TOKEN: string;
  ADMIN_EMAIL?: string;
  ADMIN_PASSWORD?: string;
  ADMIN_NAME?: string;
}
