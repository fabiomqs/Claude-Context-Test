import { HabitStore, WeeklyChartDatum } from "@/types";
import { getPastNDates, formatDayLabel } from "@/lib/dateUtils";

export function deriveWeeklyData(
  store: HabitStore,
  today: string
): WeeklyChartDatum[] {
  const dates = getPastNDates(today, 7);

  return dates.map((date) => {
    const activeHabits = store.habits.filter(
      (h) =>
        h.createdAt <= date &&
        (h.archivedAt === null || h.archivedAt > date)
    );

    const log = store.logs.find((l) => l.date === date);
    const completions = log
      ? log.completedHabitIds.filter((id) =>
          activeHabits.some((h) => h.id === id)
        ).length
      : 0;

    return {
      day: formatDayLabel(date),
      date,
      completions,
      total: activeHabits.length,
    };
  });
}
