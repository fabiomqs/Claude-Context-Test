import type { Habit } from '@/types/habit'

export function today(): string {
  return new Date().toISOString().split('T')[0]
}

export function last7Days(): string[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return d.toISOString().split('T')[0]
  })
}

export function formatDayLabel(isoDate: string): string {
  const d = new Date(isoDate + 'T00:00:00')
  return d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')
}

export function calcStreak(completedDates: string[]): number {
  if (completedDates.length === 0) return 0

  const sorted = [...completedDates].sort().reverse()
  const todayStr = today()
  const yesterdayStr = (() => {
    const d = new Date()
    d.setDate(d.getDate() - 1)
    return d.toISOString().split('T')[0]
  })()

  // Streak must start from today or yesterday
  if (sorted[0] !== todayStr && sorted[0] !== yesterdayStr) return 0

  let streak = 0
  let current = new Date(sorted[0] + 'T00:00:00')

  for (const date of sorted) {
    const d = new Date(date + 'T00:00:00')
    const diff = Math.round((current.getTime() - d.getTime()) / 86400000)
    if (diff > 1) break
    streak++
    current = d
  }

  return streak
}

export interface WeeklyDataPoint {
  day: string
  completed: number
  total: number
  isToday: boolean
}

export function getWeeklyData(habits: Habit[]): WeeklyDataPoint[] {
  const days = last7Days()
  const todayStr = today()

  return days.map((date) => ({
    day: formatDayLabel(date),
    completed: habits.filter((h) => h.completedDates.includes(date)).length,
    total: habits.length,
    isToday: date === todayStr,
  }))
}

// --- Stats page utilities ---

export interface WeeklyRatePoint {
  week: string
  rate: number
}

export function getWeeklyRates(habits: Habit[], weeksBack = 8): WeeklyRatePoint[] {
  if (habits.length === 0) return []
  const results: WeeklyRatePoint[] = []

  for (let w = weeksBack - 1; w >= 0; w--) {
    const days: string[] = Array.from({ length: 7 }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - w * 7 - (6 - i))
      return d.toISOString().split('T')[0]
    })

    const totalSlots = habits.length * 7
    const completed = habits.reduce(
      (acc, h) => acc + days.filter((d) => h.completedDates.includes(d)).length,
      0
    )

    const weekStart = new Date(days[0] + 'T00:00:00')
    const label = weekStart.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })

    results.push({ week: label, rate: totalSlots > 0 ? Math.round((completed / totalSlots) * 100) : 0 })
  }

  return results
}

const DOW_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

export interface DayOfWeekPoint {
  day: string
  rate: number
  isBest: boolean
  isWorst: boolean
}

export function getDayOfWeekStats(habits: Habit[]): DayOfWeekPoint[] {
  const counts = Array(7).fill(0)
  const totals = Array(7).fill(0)

  // Collect all unique dates across all habits
  const allDates = new Set(habits.flatMap((h) => h.completedDates))
  const createdAt = habits.length > 0
    ? habits.map((h) => h.createdAt).sort()[0]
    : new Date().toISOString()
  const start = new Date(createdAt)
  const end = new Date()

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dow = d.getDay()
    const dateStr = d.toISOString().split('T')[0]
    totals[dow] += habits.length
    counts[dow] += habits.filter((h) => h.completedDates.includes(dateStr)).length
  }

  void allDates

  const rates = counts.map((c, i) => (totals[i] > 0 ? Math.round((c / totals[i]) * 100) : 0))
  const nonZeroRates = rates.filter((r) => r > 0)
  const best = nonZeroRates.length > 0 ? Math.max(...nonZeroRates) : -1
  const worst = nonZeroRates.length > 0 ? Math.min(...nonZeroRates) : -1

  return DOW_LABELS.map((day, i) => ({
    day,
    rate: rates[i],
    isBest: rates[i] === best && best > 0,
    isWorst: rates[i] === worst && worst >= 0 && best !== worst,
  }))
}

export interface ConsistencyResult {
  habit: Habit
  rate: number
  completedDays: number
  totalDays: number
}

export function getMostConsistentHabit(habits: Habit[]): ConsistencyResult | null {
  if (habits.length === 0) return null

  const todayStr = today()

  const results = habits.map((h) => {
    const start = new Date(h.createdAt)
    const end = new Date(todayStr + 'T00:00:00')
    const totalDays = Math.max(1, Math.round((end.getTime() - start.getTime()) / 86400000) + 1)
    const completedDays = h.completedDates.length
    return { habit: h, rate: Math.round((completedDays / totalDays) * 100), completedDays, totalDays }
  })

  return results.reduce((best, cur) => (cur.rate > best.rate ? cur : best))
}
