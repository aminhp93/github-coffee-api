import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export function getPrisma(): PrismaClient | null {
  const connectionString =
    process.env.DATABASE_URL ||
    'postgresql://postgres:postgrespassword@localhost:5432/githubcoffee?schema=public';

  if (!globalForPrisma.prisma) {
    try {
      const adapter = new PrismaPg({ connectionString });
      globalForPrisma.prisma = new PrismaClient({ adapter });
    } catch (err) {
      console.warn('[Prisma] Failed to initialize PostgreSQL adapter:', err);
      return null;
    }
  }
  return globalForPrisma.prisma;
}
