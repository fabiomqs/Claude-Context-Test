# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # start dev server at localhost:3000 (Turbopack)
npm run build     # production build
npm run lint      # ESLint
npm test          # run all Vitest tests (vitest run)
npx vitest run src/__tests__/streaks.test.ts   # run a single test file
npx tsc --noEmit  # type-check without emitting
```

## Architecture

This is a **Next.js 16 App Router** habit tracker. All data lives in `localStorage` — no backend.

### Data flow

```
localStorage ("habit-tracker-v1")
    └── HabitStore  { habits: Habit[], logs: DailyLog[], version: number }
         │
         └── useLocalStorage (src/hooks/useLocalStorage.ts)
                  │   SSR-safe: always initialises with getDefaultStore(),
                  │   loads real data in useEffect after hydration.
                  │
                  └── useHabits (src/hooks/useHabits.ts)
                           │   Enriches habits with computed stats via useMemo.
                           │   All mutations write to localStorage inline in the setter.
                           │
                           └── src/app/page.tsx  (Dashboard — /)
                       useLocalStorage (raw)
                           └── src/app/stats/page.tsx  (/stats)
```

### Key invariants

- **Dates are always `"YYYY-MM-DD"` in local timezone** — use `new Date().toLocaleDateString("en-CA")` (never `.toISOString()` which is UTC and can be off by one day).
- **Habit deletion is soft-delete**: sets `archivedAt` to today's date string. Archived habits are excluded from the active list but their historical logs remain intact for stats.
- **Streak grace period**: `calculateStreak` preserves a streak if the habit was completed yesterday but not yet today. The streak breaks only when an uncompleted day sits between today and the previous run.
- **Recharts components must be dynamically imported** with `{ ssr: false }` — Recharts uses `window` internally and breaks SSR/hydration otherwise.
- **Color values for Recharts** and inline `style=` must come from `COLOR_MAP` (hex strings in `src/types/index.ts`). Dynamic Tailwind class names are purged at build time.

### Pure logic (`src/lib/`)

| File | Responsibility |
|---|---|
| `dateUtils.ts` | `getTodayString`, `getPastNDates`, `subtractDays`, `formatDayLabel` |
| `storage.ts` | `loadStore` / `saveStore` / `getDefaultStore` — SSR-guarded localStorage access |
| `streaks.ts` | `calculateStreak`, `calculateLongestStreak` — pure functions over `DailyLog[]` |
| `chartData.ts` | `deriveWeeklyData` — last-7-days data for the dashboard bar chart |
| `statsData.ts` | `getMostConsistentHabit`, `getWeeklyRates`, `getDayOfWeekStats` — aggregate stats for `/stats` |

All lib functions are pure (no side effects, no React) and are unit tested in `src/__tests__/`.

### Vitest setup

- Environment: `jsdom`; path alias `@/*` → `src/*`
- Setup file: `src/__tests__/setup.ts` (imports `@testing-library/jest-dom`)
- Tests live in `src/__tests__/` alongside the lib they test
