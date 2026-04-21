import { DailyLog } from "@/types";
import { getYesterdayString, subtractDays } from "@/lib/dateUtils";

function buildCompletedSet(habitId: string, logs: DailyLog[]): Set<string> {
  const set = new Set<string>();
  for (const log of logs) {
    if (log.completedHabitIds.includes(habitId)) {
      set.add(log.date);
    }
  }
  return set;
}

export function calculateStreak(
  habitId: string,
  logs: DailyLog[],
  today: string
): number {
  const completed = buildCompletedSet(habitId, logs);
  const yesterday = getYesterdayString(today);

  let startDate: string;
  if (completed.has(today)) {
    startDate = today;
  } else if (completed.has(yesterday)) {
    startDate = yesterday;
  } else {
    return 0;
  }

  let streak = 0;
  let current = startDate;
  while (completed.has(current)) {
    streak++;
    current = subtractDays(current, 1);
  }
  return streak;
}

export function calculateLongestStreak(
  habitId: string,
  logs: DailyLog[]
): number {
  const completed = buildCompletedSet(habitId, logs);
  if (completed.size === 0) return 0;

  const sorted = Array.from(completed).sort();
  let longest = 1;
  let current = 1;

  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1] + "T00:00:00");
    const curr = new Date(sorted[i] + "T00:00:00");
    const diff = (curr.getTime() - prev.getTime()) / 86400000;
    if (diff === 1) {
      current++;
      longest = Math.max(longest, current);
    } else {
      current = 1;
    }
  }
  return longest;
}
