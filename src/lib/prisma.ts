import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";
import { getCloudflareContext } from "@opennextjs/cloudflare";

function isD1Binding(obj: any): boolean {
  return Boolean(obj && typeof obj === "object" && typeof obj.prepare === "function");
}

function findD1(sources: any[]): any {
  for (const src of sources) {
    if (!src || typeof src !== "object") continue;
    if (isD1Binding(src.DB)) return src.DB;
    if (isD1Binding(src.greenroots_db)) return src.greenroots_db;
    for (const key of Object.keys(src)) {
      try {
        if (isD1Binding(src[key])) return src[key];
      } catch {}
    }
  }
  return null;
}

export async function getDb(): Promise<PrismaClient> {
  const sources: any[] = [process.env, (globalThis as any).__env__, globalThis];
  try {
    const cf = await getCloudflareContext({ async: true });
    if (cf?.env) sources.unshift(cf.env);
  } catch {}
  try {
    const cfSync = (getCloudflareContext as any)();
    if (cfSync?.env) sources.unshift(cfSync.env);
  } catch {}

  const d1Binding = findD1(sources);

  if (d1Binding) {
    return new PrismaClient({ adapter: new PrismaD1(d1Binding) });
  }

  throw new Error(
    "Cloudflare D1 database binding was not found in environment context. Please check Worker Bindings in Cloudflare Dashboard."
  );
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

