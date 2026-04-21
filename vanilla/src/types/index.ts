export interface Habit {
  id: string;
  name: string;
  color: string;
  createdAt: string;
  archivedAt: string | null;
}

export interface DailyLog {
  date: string;
  completedHabitIds: string[];
}

export interface HabitStore {
  habits: Habit[];
  logs: DailyLog[];
  version: number;
}

export interface HabitWithStats extends Habit {
  completedToday: boolean;
  currentStreak: number;
  longestStreak: number;
  completionsThisWeek: number;
}

export interface WeeklyChartDatum {
  day: string;
  date: string;
  completions: number;
  total: number;
}

export const COLOR_MAP: Record<string, string> = {
  emerald: "#10b981",
  violet: "#8b5cf6",
  amber: "#f59e0b",
  rose: "#f43f5e",
  sky: "#0ea5e9",
  orange: "#f97316",
  lime: "#84cc16",
  pink: "#ec4899",
};

export const COLOR_NAMES = Object.keys(COLOR_MAP);
