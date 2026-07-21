import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { cache } from "react";

// One Prisma client per request, backed by the Cloudflare D1 binding.
// `cache` keeps it to a single instance within the same request.
export const getDb = cache(() => {
  const { env } = getCloudflareContext();
  return new PrismaClient({ adapter: new PrismaD1(env.DB) });
});

// Backwards-compatible accessor: existing code does `prisma.product.findMany()`.
// This proxy resolves the real client lazily, at property-access time, so it
// only touches the Cloudflare context inside a request (where it's available).
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getDb();
    return client[prop as keyof PrismaClient];
  },
});
