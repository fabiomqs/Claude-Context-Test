import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { calcStreak, today, last7Days, getWeeklyData } from '@/lib/utils'
import type { Habit } from '@/types/habit'

function makeHabit(overrides: Partial<Habit> = {}): Habit {
  return {
    id: '1',
    name: 'Test',
    color: 'violet',
    completedDates: [],
    createdAt: new Date().toISOString(),
    ...overrides,
  }
}

function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().split('T')[0]
}

describe('today()', () => {
  it('returns current date as YYYY-MM-DD', () => {
    const result = today()
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    expect(result).toBe(new Date().toISOString().split('T')[0])
  })
})

describe('last7Days()', () => {
  it('returns 7 entries', () => {
    expect(last7Days()).toHaveLength(7)
  })

  it('last entry is today', () => {
    const days = last7Days()
    expect(days[6]).toBe(today())
  })

  it('entries are in ascending order', () => {
    const days = last7Days()
    for (let i = 1; i < days.length; i++) {
      expect(days[i] > days[i - 1]).toBe(true)
    }
  })
})

describe('calcStreak()', () => {
  it('returns 0 for empty completedDates', () => {
    expect(calcStreak([])).toBe(0)
  })

  it('returns 1 when only today is completed', () => {
    expect(calcStreak([today()])).toBe(1)
  })

  it('returns 1 when only yesterday is completed', () => {
    expect(calcStreak([daysAgo(1)])).toBe(1)
  })

  it('counts consecutive days ending today', () => {
    const dates = [today(), daysAgo(1), daysAgo(2), daysAgo(3)]
    expect(calcStreak(dates)).toBe(4)
  })

  it('counts consecutive days ending yesterday', () => {
    const dates = [daysAgo(1), daysAgo(2), daysAgo(3)]
    expect(calcStreak(dates)).toBe(3)
  })

  it('breaks on gap', () => {
    // today + 3 days ago (gap on days 1 and 2)
    const dates = [today(), daysAgo(3), daysAgo(4)]
    expect(calcStreak(dates)).toBe(1)
  })

  it('returns 0 when last completion was 2+ days ago', () => {
    const dates = [daysAgo(2), daysAgo(3), daysAgo(4)]
    expect(calcStreak(dates)).toBe(0)
  })

  it('handles unsorted dates correctly', () => {
    const dates = [daysAgo(2), today(), daysAgo(1)]
    expect(calcStreak(dates)).toBe(3)
  })
})

describe('getWeeklyData()', () => {
  it('returns 7 data points', () => {
    expect(getWeeklyData([])).toHaveLength(7)
  })

  it('last point is marked as today', () => {
    const data = getWeeklyData([])
    expect(data[6].isToday).toBe(true)
    expect(data.slice(0, 6).every((d) => !d.isToday)).toBe(true)
  })

  it('counts completions per day correctly', () => {
    const todayStr = today()
    const habits = [
      makeHabit({ id: '1', completedDates: [todayStr] }),
      makeHabit({ id: '2', completedDates: [todayStr] }),
      makeHabit({ id: '3', completedDates: [] }),
    ]
    const data = getWeeklyData(habits)
    const todayPoint = data.find((d) => d.isToday)!
    expect(todayPoint.completed).toBe(2)
    expect(todayPoint.total).toBe(3)
  })

  it('returns 0 completed when no habits', () => {
    const data = getWeeklyData([])
    data.forEach((d) => {
      expect(d.completed).toBe(0)
      expect(d.total).toBe(0)
    })
  })
})
