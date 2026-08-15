import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://postgres:postgrespassword@localhost:5432/githubcoffee?schema=public';

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting 100% Real PostgreSQL Database Seeding...');

  // 1. Seed Real Admin User
  const adminUser = await prisma.user.upsert({
    where: { email: 'aminhp@norvin.vn' },
    update: {},
    create: {
      email: 'aminhp@norvin.vn',
      name: 'Minh (Platform Lead)',
      role: 'ADMIN',
    },
  });
  console.log('✅ Created Real User:', adminUser.email);

  // 2. Seed Real Gap Items (P1 - P11)
  const gapItemsData = [
    { id: 'P1', title: 'Automated Tests', category: 'Backend', status: 'TODO', description: 'Unit tests for auth service and integration tests' },
    { id: 'P2', title: 'Versioned Database Migrations', category: 'Backend', status: 'DONE', description: 'Prisma / node-pg-migrate setup with PostgreSQL' },
    { id: 'P3', title: 'Caching Layer (Redis)', category: 'Backend', status: 'DONE', description: 'Redis stats caching with 30s TTL' },
    { id: 'P4', title: 'Structured Logging (pino)', category: 'Backend', status: 'TODO', description: 'JSON logging with request ID' },
    { id: 'P5', title: 'CI Upgrades', category: 'DevOps', status: 'TODO', description: 'tsc --noEmit and test runs in GitHub Actions' },
    { id: 'P6', title: 'Frontend Auth Integration', category: 'Security', status: 'IN_PROGRESS', description: 'Keycloak OIDC JWT flow & HTTP-only refresh cookies' },
    { id: 'P7', title: 'Senior Artifacts', category: 'Backend', status: 'TODO', description: 'Postmortem & Technical due diligence report' },
    { id: 'P8', title: 'Security Headers (helmet)', category: 'Security', status: 'TODO', description: 'CSP, HSTS, X-Frame-Options' },
    { id: 'P9', title: 'Remediate npm audit Findings', category: 'Security', status: 'TODO', description: 'Dependabot CVE tracking' },
    { id: 'P10', title: 'Least-Privilege Database Role', category: 'Security', status: 'DONE', description: 'Restricted app role for SELECT/INSERT/UPDATE' },
    { id: 'P11', title: 'HEALTHCHECK in Dockerfile', category: 'DevOps', status: 'TODO', description: 'Container orchestrator health check' },
  ];

  for (const item of gapItemsData) {
    await prisma.gapItem.upsert({
      where: { id: item.id },
      update: { title: item.title, category: item.category, status: item.status as 'TODO' | 'IN_PROGRESS' | 'DONE', description: item.description },
      create: { id: item.id, title: item.title, category: item.category, status: item.status as 'TODO' | 'IN_PROGRESS' | 'DONE', description: item.description },
    });
  }
  console.log('✅ Seeded 11 Real Gap Items into PostgreSQL');

  // 3. Seed Real Dropship Milestones
  const dropshipMilestonesData = [
    { id: 'ds-m1', month: 'T1 (08/2026)', focus: 'Niche research, Unit Economics 3x COGS, cap ads $300', targetMetric: 'ROAS > 2.0', status: 'IN_PROGRESS' },
    { id: 'ds-m2', month: 'T2 (09/2026)', focus: 'Store setup, CRO, load < 2.0s, Stripe/PayPal, legal', targetMetric: 'CVR > 3.0%', status: 'TODO' },
    { id: 'ds-m3', month: 'T3 (10/2026)', focus: 'Creative testing, $5-10/day, Kill Adset $15', targetMetric: 'CPA < $10', status: 'TODO' },
    { id: 'ds-m4', month: 'T4 (11/2026)', focus: 'Peak season, auto-fulfillment, scale 20%/day', targetMetric: 'Net Profit > $0', status: 'TODO' },
    { id: 'ds-m5', month: 'T5 (12/2026)', focus: 'Retention, Klaviyo flows, P&L sheet', targetMetric: 'Repeat Rate > 15%', status: 'TODO' },
    { id: 'ds-m6', month: 'T6 (01/2027)', focus: 'Audit profit, decide scale/stop', targetMetric: 'Net Profit >= $0', status: 'TODO' },
  ];

  for (const milestone of dropshipMilestonesData) {
    await prisma.dropshipMilestone.upsert({
      where: { id: milestone.id },
      update: { month: milestone.month, focus: milestone.focus, targetMetric: milestone.targetMetric, status: milestone.status as 'TODO' | 'IN_PROGRESS' | 'DONE' },
      create: { id: milestone.id, month: milestone.month, focus: milestone.focus, targetMetric: milestone.targetMetric, status: milestone.status as 'TODO' | 'IN_PROGRESS' | 'DONE' },
    });
  }
  console.log('✅ Seeded 6 Real Dropship Milestones into PostgreSQL');

  console.log('🚀 100% Real Database Seeding Completed Successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding Failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
