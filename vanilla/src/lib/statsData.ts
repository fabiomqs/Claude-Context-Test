import { Habit, HabitStore } from "@/types";
import { getPastNDates, subtractDays } from "@/lib/dateUtils";

export interface HabitCompletionRate {
  habit: Habit;
  rate: number;
  completions: number;
  activeDays: number;
}

export interface WeeklyRateDatum {
  label: string;
  startDate: string;
  completions: number;
  possible: number;
  rate: number;
}

export interface DayOfWeekDatum {
  day: string;
  dayIndex: number;
  completions: number;
  possible: number;
  rate: number;
}

function activeHabitsOnDate(store: HabitStore, date: string): Habit[] {
  return store.habits.filter(
    (h) =>
      h.createdAt <= date &&
      (h.archivedAt === null || h.archivedAt > date)
  );
}

export function getMostConsistentHabit(
  store: HabitStore,
  today: string
): HabitCompletionRate | null {
  const active = store.habits.filter((h) => h.archivedAt === null);
  if (active.length === 0) return null;

  const rates: HabitCompletionRate[] = active.map((habit) => {
    const start = habit.createdAt;
    const startDate = new Date(start + "T00:00:00");
    const todayDate = new Date(today + "T00:00:00");
    const activeDays =
      Math.floor((todayDate.getTime() - startDate.getTime()) / 86400000) + 1;

    const completions = store.logs.filter(
      (l) => l.date >= start && l.date <= today && l.completedHabitIds.includes(habit.id)
    ).length;

    const rate = activeDays > 0 ? completions / activeDays : 0;
    return { habit, rate, completions, activeDays };
  });

  return rates.reduce((best, curr) => {
    if (curr.rate > best.rate) return curr;
    if (curr.rate === best.rate && curr.completions > best.completions) return curr;
    return best;
  });
}

export function getWeeklyRates(
  store: HabitStore,
  today: string,
  weeks = 4
): WeeklyRateDatum[] {
  const result: WeeklyRateDatum[] = [];

  for (let w = weeks - 1; w >= 0; w--) {
    const endDate = subtractDays(today, w * 7);
    const startDate = subtractDays(endDate, 6);
    const dates = getPastNDates(endDate, 7);

    let completions = 0;
    let possible = 0;

    for (const date of dates) {
      const active = activeHabitsOnDate(store, date);
      const log = store.logs.find((l) => l.date === date);
      possible += active.length;
      if (log) {
        completions += log.completedHabitIds.filter((id) =>
          active.some((h) => h.id === id)
        ).length;
      }
    }

    const label =
      w === 0
        ? "Esta sem."
        : w === 1
        ? "Sem. passada"
        : `Sem. -${w}`;

    result.push({
      label,
      startDate,
      completions,
      possible,
      rate: possible > 0 ? Math.round((completions / possible) * 100) : 0,
    });
  }

  return result;
}

const DAY_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export function getDayOfWeekStats(
  store: HabitStore,
  today: string
): DayOfWeekDatum[] {
  const buckets: { completions: number; possible: number }[] = Array.from(
    { length: 7 },
    () => ({ completions: 0, possible: 0 })
  );

  const allDates = new Set<string>();
  store.logs.forEach((l) => allDates.add(l.date));
  store.habits.forEach((h) => {
    // also count days where habit was active but log is missing
    const start = h.createdAt;
    const end = h.archivedAt ?? today;
    const startD = new Date(start + "T00:00:00");
    const endD = new Date(end + "T00:00:00");
    const days = Math.floor((endD.getTime() - startD.getTime()) / 86400000) + 1;
    for (let i = 0; i < days; i++) {
      const d = new Date(startD);
      d.setDate(d.getDate() + i);
      allDates.add(d.toLocaleDateString("en-CA"));
    }
  });

  for (const date of allDates) {
    if (date > today) continue;
    const active = activeHabitsOnDate(store, date);
    if (active.length === 0) continue;

    const dayIndex = new Date(date + "T00:00:00").getDay();
    const log = store.logs.find((l) => l.date === date);

    buckets[dayIndex].possible += active.length;
    if (log) {
      buckets[dayIndex].completions += log.completedHabitIds.filter((id) =>
        active.some((h) => h.id === id)
      ).length;
    }
  }

  return buckets.map((b, i) => ({
    day: DAY_LABELS[i],
    dayIndex: i,
    completions: b.completions,
    possible: b.possible,
    rate: b.possible > 0 ? Math.round((b.completions / b.possible) * 100) : 0,
  }));
}
