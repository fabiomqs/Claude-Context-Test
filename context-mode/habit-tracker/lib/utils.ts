import { Habit } from "./types";

export function getTodayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function calcStreak(habit: Habit): number {
  const dates = new Set(habit.completedDates);
  let streak = 0;
  const cursor = new Date();

  while (true) {
    const key = cursor.toISOString().slice(0, 10);
    if (!dates.has(key)) break;
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

export interface WeekDay {
  day: string;
  pct: number;
  completed: number;
  total: number;
}

export function getWeekData(habits: Habit[]): WeekDay[] {
  const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const result: WeekDay[] = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const completed = habits.filter((h) => h.completedDates.includes(key)).length;
    const total = habits.length;
    result.push({
      day: days[d.getDay()],
      pct: total > 0 ? Math.round((completed / total) * 100) : 0,
      completed,
      total,
    });
  }

  return result;
}

export function getCompletionRate(habit: Habit): number {
  const created = new Date(habit.createdAt);
  const today = new Date();
  const daysSince = Math.max(1, Math.floor((today.getTime() - created.getTime()) / 86400000) + 1);
  return Math.round((habit.completedDates.length / daysSince) * 100);
}

export interface WeekRate {
  week: string;
  pct: number;
  completed: number;
  possible: number;
}

export function getWeeklyRates(habits: Habit[], weeks = 8): WeekRate[] {
  const result: WeekRate[] = [];
  const today = new Date();

  for (let w = weeks - 1; w >= 0; w--) {
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay() - w * 7);
    let completed = 0;
    let possible = 0;

    for (let d = 0; d < 7; d++) {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + d);
      if (day > today) break;
      const key = day.toISOString().slice(0, 10);
      const activeHabits = habits.filter((h) => new Date(h.createdAt) <= day);
      possible += activeHabits.length;
      completed += activeHabits.filter((h) => h.completedDates.includes(key)).length;
    }

    const label = `${weekStart.getDate().toString().padStart(2, "0")}/${(weekStart.getMonth() + 1).toString().padStart(2, "0")}`;
    result.push({
      week: label,
      pct: possible > 0 ? Math.round((completed / possible) * 100) : 0,
      completed,
      possible,
    });
  }

  return result;
}

export interface DayStat {
  day: string;
  pct: number;
  samples: number;
}

export function getDayOfWeekStats(habits: Habit[]): DayStat[] {
  const labels = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const buckets = Array.from({ length: 7 }, () => ({ completed: 0, possible: 0 }));
  const today = new Date();

  // Walk back 90 days to gather enough samples
  for (let i = 89; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const dow = d.getDay();
    const activeHabits = habits.filter((h) => new Date(h.createdAt) <= d);
    buckets[dow].possible += activeHabits.length;
    buckets[dow].completed += activeHabits.filter((h) => h.completedDates.includes(key)).length;
  }

  return labels.map((day, i) => ({
    day,
    pct: buckets[i].possible > 0 ? Math.round((buckets[i].completed / buckets[i].possible) * 100) : 0,
    samples: buckets[i].possible,
  }));
}
