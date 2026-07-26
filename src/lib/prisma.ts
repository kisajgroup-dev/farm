import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";
import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * A D1-backed Prisma client for the current request.
 *
 * Workers must not keep a global Prisma client (or fall back to the native
 * Node engine): each request needs the D1 binding supplied by its Worker env.
 */
export async function getDb(): Promise<PrismaClient> {
  const { env } = await getCloudflareContext<CloudflareEnv>({ async: true });
  return new PrismaClient({ adapter: new PrismaD1(env.DB) });
}

