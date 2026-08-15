import { createSchema, createYoga } from 'graphql-yoga';
import { GraphQLJSON } from 'graphql-type-json';
import { esm, pmp, foresight } from '@/lib/mock-data';
import { kvStore } from '@/lib/kv-store';
import { getPrisma } from '@/lib/db';
import { getOrSetCache } from '@/lib/redis';

// Mock initial data for Gap Items P1-P11
const defaultGapItems = [
  { id: 'P1', title: 'Automated Tests', category: 'Backend', status: 'TODO', description: 'Unit tests for auth service and integration tests' },
  { id: 'P2', title: 'Versioned Database Migrations', category: 'Backend', status: 'TODO', description: 'Prisma / node-pg-migrate setup' },
  { id: 'P3', title: 'Caching Layer (Redis)', category: 'Backend', status: 'TODO', description: 'Redis stats caching' },
  { id: 'P4', title: 'Structured Logging (pino)', category: 'Backend', status: 'TODO', description: 'JSON logging with request ID' },
  { id: 'P5', title: 'CI Upgrades', category: 'DevOps', status: 'TODO', description: 'tsc --noEmit and test runs in GitHub Actions' },
  { id: 'P6', title: 'Frontend Auth Integration', category: 'Security', status: 'TODO', description: 'Keycloak JWT flow & HTTP-only refresh cookies' },
  { id: 'P7', title: 'Senior Artifacts', category: 'Backend', status: 'TODO', description: 'Postmortem & Technical due diligence report' },
  { id: 'P8', title: 'Security Headers (helmet)', category: 'Security', status: 'TODO', description: 'CSP, HSTS, X-Frame-Options' },
  { id: 'P9', title: 'Remediate npm audit Findings', category: 'Security', status: 'TODO', description: 'Dependabot CVE tracking' },
  { id: 'P10', title: 'Least-Privilege Database Role', category: 'Security', status: 'TODO', description: 'Restricted app role for SELECT/INSERT/UPDATE' },
  { id: 'P11', title: 'HEALTHCHECK in Dockerfile', category: 'DevOps', status: 'TODO', description: 'Container orchestrator health check' },
];

const defaultDropshipMilestones = [
  { id: 'ds-m1', month: 'T1 (08/2026)', focus: 'Niche research, Unit Economics 3x COGS, cap ads $300', targetMetric: 'ROAS > 2.0', status: 'IN_PROGRESS' },
  { id: 'ds-m2', month: 'T2 (09/2026)', focus: 'Store setup, CRO, load < 2.0s, Stripe/PayPal, legal', targetMetric: 'CVR > 3.0%', status: 'TODO' },
  { id: 'ds-m3', month: 'T3 (10/2026)', focus: 'Creative testing, $5-10/day, Kill Adset $15', targetMetric: 'CPA < $10', status: 'TODO' },
  { id: 'ds-m4', month: 'T4 (11/2026)', focus: 'Peak season, auto-fulfillment, scale 20%/day', targetMetric: 'Net Profit > $0', status: 'TODO' },
  { id: 'ds-m5', month: 'T5 (12/2026)', focus: 'Retention, Klaviyo flows, P&L sheet', targetMetric: 'Repeat Rate > 15%', status: 'TODO' },
  { id: 'ds-m6', month: 'T6 (01/2027)', focus: 'Audit profit, decide scale/stop', targetMetric: 'Net Profit >= $0', status: 'TODO' },
];

const { handleRequest } = createYoga({
  schema: createSchema({
    typeDefs: /* GraphQL */ `
      scalar JSON

      type Query {
        esm: ESMQuery
        pmp: PMPQuery
        foresight: ForesightQuery
        kv(key: String!): JSON

        # Roadmap Core API
        roadmapGapItems: [GapItem!]!
        roadmapStats: RoadmapStats!

        # Dropship API
        dropshipMilestones: [DropshipMilestone!]!
        dropshipReadingNotes: [ReadingNote!]!
      }

      type Mutation {
        setKv(key: String!, value: JSON!, metadata: JSON): JSON

        # Roadmap Mutations
        logDailyTask(gapItemId: String!, description: String!, hours: Float): DailyLog!
        updateGapItemStatus(gapItemId: String!, status: String!): GapItem!

        # Dropship Mutations
        saveReadingNote(title: String!, topic: String!, content: String!): ReadingNote!
      }

      type GapItem {
        id: ID!
        title: String!
        category: String!
        status: String!
        description: String!
      }

      type DailyLog {
        id: ID!
        gapItemId: String!
        description: String!
        hours: Float!
        loggedAt: String!
      }

      type RoadmapStats {
        totalItems: Int!
        doneItems: Int!
        inProgressItems: Int!
        todoItems: Int!
        completionPercentage: Float!
      }

      type DropshipMilestone {
        id: ID!
        month: String!
        focus: String!
        targetMetric: String!
        status: String!
      }

      type ReadingNote {
        id: ID!
        title: String!
        topic: String!
        content: String!
        createdAt: String!
      }

      type ESMQuery {
        stations: [ESMStation]
        metrics(stationId: ID!): ESMMetrics
      }

      type ESMStation {
        id: ID!
        name: String
        status: String
        capacity: Float
        power: Float
        soc: Float
      }

      type ESMMetrics {
        stationId: ID!
        timestamp: String
        charge: Float
        discharge: Float
        efficiency: Float
      }

      type PMPQuery {
        devices: [PMPDevice]
        alarms: [PMPAlarm]
      }

      type PMPDevice {
        id: ID!
        name: String
        type: String
        lastSync: String
        points: [PMPPoint]
      }

      type PMPPoint {
        id: ID!
        name: String
        value: String
        unit: String
      }

      type PMPAlarm {
        id: ID!
        severity: String
        message: String
        timestamp: String
      }

      type ForesightQuery {
        portfolio: Portfolio
      }

      type Portfolio {
        id: ID!
        name: String
        sites: [Site]
      }

      type Site {
        id: ID!
        name: String
        buildings: [Building]
      }

      type Building {
        id: ID!
        name: String
        co2: Float
        temperature: Float
      }
    `,
    resolvers: {
      JSON: GraphQLJSON,
      Query: {
        esm: () => ({}),
        pmp: () => ({}),
        foresight: () => ({}),
        kv: (_: unknown, { key }: { key: string }) => kvStore.get(key),

        roadmapGapItems: async () => {
          const db = getPrisma();
          if (db) {
            try {
              const items = await db.gapItem.findMany();
              if (items.length > 0) return items;
            } catch {
              // DB fallback
            }
          }
          const stored = await kvStore.get('roadmap:gap-items');
          return stored || defaultGapItems;
        },

        roadmapStats: async () => {
          return getOrSetCache('roadmap:stats', 30, async () => {
            let items = defaultGapItems;
            const db = getPrisma();
            if (db) {
              try {
                const dbItems = await db.gapItem.findMany();
                if (dbItems.length > 0) items = dbItems as typeof defaultGapItems;
              } catch {
                // Fallback
              }
            } else {
              const stored = (await kvStore.get('roadmap:gap-items')) as typeof defaultGapItems;
              if (stored) items = stored;
            }

            const total = items.length;
            const done = items.filter((i) => i.status === 'DONE').length;
            const inProgress = items.filter((i) => i.status === 'IN_PROGRESS').length;
            const todo = total - done - inProgress;

            return {
              totalItems: total,
              doneItems: done,
              inProgressItems: inProgress,
              todoItems: todo,
              completionPercentage: total > 0 ? (done / total) * 100 : 0,
            };
          });
        },

        dropshipMilestones: async () => {
          const db = getPrisma();
          if (db) {
            try {
              const items = await db.dropshipMilestone.findMany();
              if (items.length > 0) return items;
            } catch {
              // Fallback
            }
          }
          const stored = await kvStore.get('dropship:milestones');
          return stored || defaultDropshipMilestones;
        },

        dropshipReadingNotes: async () => {
          const db = getPrisma();
          if (db) {
            try {
              const notes = await db.readingNote.findMany({ orderBy: { createdAt: 'desc' } });
              if (notes.length > 0) return notes;
            } catch {
              // Fallback
            }
          }
          const stored = (await kvStore.get('dropship:reading-notes')) || [];
          return stored;
        },
      },

      Mutation: {
        setKv: (_: unknown, { key, value, metadata }: { key: string; value: unknown; metadata?: Record<string, unknown> }) =>
          kvStore.set(key, value, metadata),

        logDailyTask: async (_: unknown, { gapItemId, description, hours = 1.0 }: { gapItemId: string; description: string; hours?: number }) => {
          const logEntry = {
            id: `log-${Date.now()}`,
            gapItemId,
            description,
            hours,
            loggedAt: new Date().toISOString(),
          };

          const db = getPrisma();
          if (db) {
            try {
              await db.dailyLog.create({
                data: {
                  gapItemId,
                  description,
                  hours,
                },
              });
              return logEntry;
            } catch {
              // Fallback
            }
          }

          const currentLogs = ((await kvStore.get('roadmap:daily-logs')) as typeof logEntry[]) || [];
          currentLogs.unshift(logEntry);
          await kvStore.set('roadmap:daily-logs', currentLogs);

          return logEntry;
        },

        updateGapItemStatus: async (_: unknown, { gapItemId, status }: { gapItemId: string; status: string }) => {
          const db = getPrisma();
          if (db) {
            try {
              const updated = await db.gapItem.update({
                where: { id: gapItemId },
                data: { status: status as 'TODO' | 'IN_PROGRESS' | 'DONE' },
              });
              return updated;
            } catch {
              // Fallback
            }
          }

          const items = ((await kvStore.get('roadmap:gap-items')) as typeof defaultGapItems) || [...defaultGapItems];
          const item = items.find((i) => i.id === gapItemId);
          if (item) {
            item.status = status;
            await kvStore.set('roadmap:gap-items', items);
            return item;
          }
          throw new Error(`Gap item ${gapItemId} not found`);
        },

        saveReadingNote: async (_: unknown, { title, topic, content }: { title: string; topic: string; content: string }) => {
          const db = getPrisma();
          if (db) {
            try {
              const note = await db.readingNote.create({
                data: { title, topic, content },
              });
              return note;
            } catch {
              // Fallback
            }
          }

          const notes = ((await kvStore.get('dropship:reading-notes')) as Array<{ id: string; title: string; topic: string; content: string; createdAt: string }>) || [];
          const newNote = {
            id: `note-${Date.now()}`,
            title,
            topic,
            content,
            createdAt: new Date().toISOString(),
          };
          notes.unshift(newNote);
          await kvStore.set('dropship:reading-notes', notes);
          return newNote;
        },
      },

      ESMQuery: {
        stations: async () => (await kvStore.get('esm:stations')) || esm.getStations(),
        metrics: async (_: unknown, { stationId }: { stationId: string }) =>
          (await kvStore.get(`esm:metrics:${stationId}`)) || esm.getMetrics(stationId),
      },
      PMPQuery: {
        devices: async () => (await kvStore.get('pmp:devices')) || pmp.getDevices(),
        alarms: async () => (await kvStore.get('pmp:alarms')) || pmp.getAlarms(),
      },
      ForesightQuery: {
        portfolio: async () => (await kvStore.get('foresight:portfolio')) || foresight.getPortfolio(),
      },
    },
  }),
  graphqlEndpoint: '/api/graphql',
  fetchAPI: { Response },
});

export async function GET(request: Request, context: Record<string, unknown>) {
  return handleRequest(request, context);
}

export async function POST(request: Request, context: Record<string, unknown>) {
  return handleRequest(request, context);
}
