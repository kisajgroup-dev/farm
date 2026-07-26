import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";
import { getCloudflareContext } from "@opennextjs/cloudflare";

let cachedDb: PrismaClient | null = null;

export async function getDb(): Promise<PrismaClient> {
  let env: any;
  try {
    const cf = await getCloudflareContext({ async: true });
    env = cf?.env;
  } catch {
    env = (globalThis as any).__env__ || process.env;
  }

  if (env && env.DB) {
    return new PrismaClient({ adapter: new PrismaD1(env.DB) });
  }

  if (!cachedDb) {
    cachedDb = new PrismaClient();
  }
  return cachedDb;
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop: string) {
    return new Proxy({}, {
      get(_modelTarget, method: string) {
        return async (...args: any[]) => {
          const db = await getDb();
          const targetProp = (db as any)[prop];
          if (typeof targetProp === "function") {
            return targetProp.bind(db)(...args);
          }
          if (targetProp && typeof targetProp[method] === "function") {
            return targetProp[method](...args);
          }
          throw new Error(`Property ${prop}.${method} not found on PrismaClient`);
        };
      },
    });
  },
});

