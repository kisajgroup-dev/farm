import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};

/**
 * Reuse the client in a warm Vercel serverless function. Neon supplies the
 * pooled Postgres connection, so this avoids creating a new client per call.
 */
export async function getDb(): Promise<PrismaClient> {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured.");
  }

  const prisma = new PrismaClient();
  globalForPrisma.prisma = prisma;
  return prisma;
}

