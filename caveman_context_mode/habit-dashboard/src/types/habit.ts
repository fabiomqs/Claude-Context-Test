export interface Habit {
  id: string
  name: string
  color: string
  completedDates: string[]
  createdAt: string
}

export type HabitColor = 'violet' | 'emerald' | 'rose' | 'amber' | 'sky' | 'orange'

export const COLOR_MAP: Record<HabitColor, { bg: string; ring: string; text: string; chart: string }> = {
  violet: { bg: 'bg-violet-500', ring: 'ring-violet-500', text: 'text-violet-400', chart: '#8b5cf6' },
  emerald: { bg: 'bg-emerald-500', ring: 'ring-emerald-500', text: 'text-emerald-400', chart: '#10b981' },
  rose: { bg: 'bg-rose-500', ring: 'ring-rose-500', text: 'text-rose-400', chart: '#f43f5e' },
  amber: { bg: 'bg-amber-500', ring: 'ring-amber-500', text: 'text-amber-400', chart: '#f59e0b' },
  sky: { bg: 'bg-sky-500', ring: 'ring-sky-500', text: 'text-sky-400', chart: '#0ea5e9' },
  orange: { bg: 'bg-orange-500', ring: 'ring-orange-500', text: 'text-orange-400', chart: '#f97316' },
}
