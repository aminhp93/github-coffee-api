import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export function getPrisma(): PrismaClient | null {
  if (!process.env.DATABASE_URL) {
    return null;
  }
  if (!globalForPrisma.prisma) {
    try {
      globalForPrisma.prisma = new PrismaClient();
    } catch {
      return null;
    }
  }
  return globalForPrisma.prisma;
}
