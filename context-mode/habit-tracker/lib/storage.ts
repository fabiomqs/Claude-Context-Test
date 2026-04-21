import { Habit } from "./types";

const KEY = "habits";

export function loadHabits(): Habit[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveHabits(habits: Habit[]): void {
  localStorage.setItem(KEY, JSON.stringify(habits));
}
