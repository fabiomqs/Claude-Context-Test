import { HabitStore } from "@/types";

const STORAGE_KEY = "habit-tracker-v1";

export function getDefaultStore(): HabitStore {
  return { version: 1, habits: [], logs: [] };
}

export function loadStore(): HabitStore {
  if (typeof window === "undefined") return getDefaultStore();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultStore();
    const parsed = JSON.parse(raw) as HabitStore;
    if (!parsed.habits || !parsed.logs) return getDefaultStore();
    return parsed;
  } catch {
    return getDefaultStore();
  }
}

export function saveStore(store: HabitStore): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // quota exceeded or private browsing — silently fail
  }
}
