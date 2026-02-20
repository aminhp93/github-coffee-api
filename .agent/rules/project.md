# Project: github-coffee-api

> ⚠️ **Full rules, workflows, and guidance live in `githubcoffee-workspace`.**
> See: `../githubcoffee-workspace/.agent/`

## Quick Reference

- **Stack**: Next.js (App Router) + TypeScript + GraphQL Yoga
- **Package manager**: pnpm

## Commands

```bash
pnpm dev    # Dev server (http://localhost:3000)
pnpm build  # Production build
```

## Structure

- `src/app/api/` — REST + GraphQL route handlers
- `src/lib/mock-data.ts` — Centralized mock data
- `src/app/page.tsx` — API status landing page

## Endpoints

| Method | Path             | Description                      |
| ------ | ---------------- | -------------------------------- |
| GET    | `/api/esm`       | Energy Storage Management data   |
| GET    | `/api/pmp`       | Building Automation / SCADA data |
| GET    | `/api/foresight` | Facilities Management data       |
| POST   | `/api/graphql`   | Unified GraphQL schema           |

## Tasks

Tracked in `../githubcoffee-workspace/tasks/github-coffee-api/`
