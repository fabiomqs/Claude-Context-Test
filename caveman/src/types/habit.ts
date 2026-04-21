export type HabitColor = "violet" | "emerald" | "sky" | "rose" | "amber";

export interface Habit {
  id: string;
  name: string;
  completedDates: string[];
  createdAt: string;
  color: HabitColor;
}

export interface WeeklyDataPoint {
  day: string;
  pct: number;
  date: string;
}

export interface WeeklyRatePoint {
  week: string;
  pct: number;
}

export interface DayOfWeekPoint {
  day: string;
  pct: number;
}

export interface ConsistencyResult {
  habit: Habit;
  rate: number;
}
