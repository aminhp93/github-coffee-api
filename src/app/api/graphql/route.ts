import { createSchema, createYoga } from 'graphql-yoga';
import { GraphQLJSON } from 'graphql-type-json';
import { esm, pmp, foresight } from '@/lib/mock-data';
import { kvStore } from '@/lib/kv-store';

const { handleRequest } = createYoga({
  schema: createSchema({
    typeDefs: /* GraphQL */ `
      scalar JSON

      type Query {
        esm: ESMQuery
        pmp: PMPQuery
        foresight: ForesightQuery
        kv(key: String!): JSON
      }

      type Mutation {
        setKv(key: String!, value: JSON!, metadata: JSON): JSON
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
      },
      Mutation: {
        setKv: (_: unknown, { key, value, metadata }: { key: string; value: unknown; metadata?: Record<string, unknown> }) => 
          kvStore.set(key, value, metadata),
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
      }
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
