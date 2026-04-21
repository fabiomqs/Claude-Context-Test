# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # start dev server (localhost:3000)
npm run build    # production build + type check
npm run lint     # ESLint
```

No test suite is configured. TypeScript errors surface during `npm run build`.

## Stack

- **Next.js 16** — App Router, no `src/` dir, path alias `@/*` → project root
- **React 19** — all interactive components use `"use client"`
- **Tailwind CSS 4** — configured via PostCSS (`postcss.config.mjs`), no `tailwind.config.ts` needed
- **Recharts 3** — used for BarChart (weekly progress, stats page) and RadarChart (day-of-week stats)
- **uuid** — habit IDs generated client-side
- **localStorage** — sole persistence layer (no backend)

## Architecture

### Data model (`lib/types.ts`)
```ts
interface Habit {
  id: string;
  name: string;
  createdAt: string;        // ISO string
  completedDates: string[]; // "YYYY-MM-DD" keys
}
```

### Key utilities (`lib/utils.ts`)
- `getTodayKey()` — returns today as `"YYYY-MM-DD"`
- `calcStreak(habit)` — consecutive days ending today
- `getWeekData(habits)` — last 7 days, % completed per day (used on home page chart)
- `getCompletionRate(habit)` — lifetime % (completions / days since creation)
- `getWeeklyRates(habits, weeks)` — per-week completion % for last N weeks
- `getDayOfWeekStats(habits)` — completion % per weekday over last 90 days

### Pages
- `/` (`app/page.tsx`) — habit list, daily progress ring, weekly bar chart
- `/stats` (`app/stats/page.tsx`) — stat cards, weekly rate bar chart, day-of-week radar, per-habit ranking

All state is loaded from localStorage on mount (`useEffect`) and saved back on every change. Both pages return `null` until mounted to avoid SSR/hydration mismatches with localStorage.

### Adding a new stat or chart
1. Add the computation function to `lib/utils.ts`
2. Import and call it in `app/stats/page.tsx` — habits array is already available there
