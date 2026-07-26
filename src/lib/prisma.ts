import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";
import { getCloudflareContext } from "@opennextjs/cloudflare";

let cachedDb: PrismaClient | null = null;

export async function getDb(): Promise<PrismaClient> {
  let env: any = process.env;
  try {
    const cf = await getCloudflareContext({ async: true });
    if (cf?.env) {
      env = { ...env, ...cf.env };
    }
  } catch {
    env = (globalThis as any).__env__ || process.env;
  }

  const d1Binding = env?.DB || env?.greenroots_db || (globalThis as any).__env__?.DB || (globalThis as any).__env__?.greenroots_db;

  if (d1Binding) {
    return new PrismaClient({ adapter: new PrismaD1(d1Binding) });
  }

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

