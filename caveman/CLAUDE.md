# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # start dev server (localhost:3000)
npm run build    # production build + TypeScript check
npm run start    # serve production build
```

No test runner or linter configured.

## Architecture

**Next.js 16 App Router**, TypeScript, Tailwind CSS v4, Recharts, lucide-react.

All logic lives in one hook: `src/hooks/useHabits.ts`. It owns the `Habit[]` state, reads/writes `localStorage` key `habits-v1` on mount/change, and exports every computed value and mutation the UI needs. Pages and components hold no local state beyond form inputs — they call into `useHabits`.

**Data model** (`src/types/habit.ts`):
```ts
Habit { id, name, completedDates: string[], createdAt: string, color: HabitColor }
// completedDates stores "YYYY-MM-DD" strings (local date via toISOString().split("T")[0])
```

**Routes:**
- `/` (`src/app/page.tsx`) — daily dashboard: stats summary, 7-day bar chart, habit checklist, add form
- `/stats` (`src/app/stats/page.tsx`) — analytics: per-habit table, consistency card, weekly rate line chart, day-of-week bar chart

**Component split:**
- `src/components/` — home-page components (StatsHeader, HabitList, HabitItem, WeeklyChart, AddHabitForm)
- `src/components/stats/` — stats-page components (ConsistencyCard, WeeklyRateChart, DayOfWeekChart)

**Styling:** `.card` utility class defined in `globals.css` (`bg #12121a`, border, border-radius, padding). Habit accent colors are handled via inline Tailwind class maps in each component (not dynamic class generation) — keep this pattern when adding colors.

**Path alias:** `@/` maps to `src/`.
