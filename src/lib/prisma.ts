import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";
import { getCloudflareContext } from "@opennextjs/cloudflare";

let cachedDb: PrismaClient | null = null;

export async function getDb(): Promise<PrismaClient> {
  try {
    const cf = await getCloudflareContext({ async: true });
    const env = cf?.env as any;
    const d1 = env?.DB || env?.greenroots_db || (process.env as any)?.DB;
    if (d1) {
      return new PrismaClient({ adapter: new PrismaD1(d1) });
    }
  } catch {}

  if (!cachedDb) {
    cachedDb = new PrismaClient();
  }
  return cachedDb;
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop: string | symbol) {
    if (typeof prop === "symbol" || prop === "then" || prop === "toJSON" || prop === "$$typeof") {
      return undefined;
    }
    return new Proxy({}, {
      get(_modelTarget, method: string | symbol) {
        if (typeof method === "symbol" || method === "then" || method === "toJSON" || method === "$$typeof") {
          return undefined;
        }
        return async (...args: any[]) => {
          const db = await getDb();
          const targetObj = (db as any)[prop];
          if (typeof targetObj === "function") {
            return targetObj.bind(db)(...args);
          }
          if (targetObj && typeof targetObj[method] === "function") {
            return targetObj[method].bind(targetObj)(...args);
          }
          throw new Error(`Method ${String(prop)}.${String(method)} not found on PrismaClient`);
        };
      },
    });
  },
});

