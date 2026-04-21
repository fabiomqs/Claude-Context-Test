import type { Habit } from '@/types/habit'

const KEY = 'habit-dashboard-v1'

export function loadHabits(): Habit[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Habit[]) : []
  } catch {
    return []
  }
}

export function saveHabits(habits: Habit[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(KEY, JSON.stringify(habits))
}
