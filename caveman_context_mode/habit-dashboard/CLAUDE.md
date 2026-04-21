# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repo Purpose

Test bed for comparing Claude Code token usage across sessions. Each sub-project is an independently runnable Next.js habit tracker app built under different session constraints (caveman mode, context-mode MCP, vanilla, etc.). The goal is to measure token reduction, not to share code between projects.

## Projects

| Directory | Role | localStorage key | Notes |
|-----------|------|-----------------|-------|
| `caveman/` | Built with caveman mode active | `habits-v1` | Minimal, no tests, no lint |
| `vanilla/` | Reference implementation | `habits-v1` | ESLint, basic vitest tests |
| `context-mode/habit-tracker/` | Built with context-mode MCP | `habit-tracker-v1` | Most complex: soft-delete, grace-period streaks, full test suite |
| `habit-dashboard/` | Latest build, includes `/stats` analytics page | `habit-dashboard-v1` | Recharts analytics, no tests yet |

Each project runs on port 3000. Run only one at a time.

## Commands

All commands must be run from within the project directory.

```bash
# Development
npm run dev

# Production build
npm run build

# Lint (vanilla, context-mode, habit-dashboard only)
npm run lint

# Tests (caveman, vanilla, context-mode only)
npm run test         # watch mode (context-mode)
npm run test:run     # single run (context-mode)
npx vitest run       # single run (caveman, vanilla)

# Run a single test file
npx vitest run src/__tests__/streaks.test.ts
```

## Shared Conventions

All projects follow the same core patterns:

**Habit data model:**
```ts
interface Habit {
  id: string
  name: string
  color: string          // one of: violet|emerald|rose|amber|sky|orange
  completedDates: string[] // ISO dates: "YYYY-MM-DD"
  createdAt: string      // ISO timestamp
}
```
`context-mode` extends this with `archivedAt?: string` for soft-delete.

**Date format:** always `YYYY-MM-DD` via `.toISOString().split('T')[0]` (caveman/habit-dashboard) or `.toLocaleDateString('en-CA')` (vanilla/context-mode). Never mix within a project.

**State pattern:** All domain state lives in `useHabits()`. Components hold no habit state — only UI state (form inputs, hover). localStorage writes fire in a `useEffect` on `habits` change, gated by a `mounted` boolean to avoid SSR writes.

## Per-Project Notes

**`context-mode/habit-tracker/`** is the most complete reference:
- `lib/` contains pure functions (no React): `streaks.ts`, `statsData.ts`, `storage.ts`, `dateUtils.ts`, `chartData.ts`
- Streak logic includes a grace period (yesterday counts as active)
- `HabitStore` shape: `{ habits: Habit[], logs: LogEntry[], version: number }`
- Vitest alias: `@/` → project root (not `src/`)

**`habit-dashboard/`** is the newest:
- Has `/stats` route with 3 Recharts charts: line (weekly rate), bar (day-of-week), trophy card (most consistent)
- Vitest not configured — add if tests are needed
- Stats utilities in `src/lib/utils.ts`: `getWeeklyRates()`, `getDayOfWeekStats()`, `getMostConsistentHabit()`

## Testing Setup

`caveman/` and `vanilla/`: jsdom environment, alias `@/` → `src/`, setup file at `src/test/setup.ts` or `src/__tests__/setup.ts`.

`context-mode/`: jsdom environment, alias `@/` → `.` (root), setup file `vitest.setup.ts` at project root.
