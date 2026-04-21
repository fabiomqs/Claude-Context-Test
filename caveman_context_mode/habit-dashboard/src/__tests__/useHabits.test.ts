import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useHabits } from '@/hooks/useHabits'
import { today } from '@/lib/utils'

beforeEach(() => {
  localStorage.clear()
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2025-06-15T12:00:00Z'))
})

afterEach(() => {
  vi.useRealTimers()
})

describe('useHabits – addHabit', () => {
  it('adds a habit with correct fields', () => {
    const { result } = renderHook(() => useHabits())

    act(() => {
      result.current.addHabit('Meditar', 'violet')
    })

    expect(result.current.habits).toHaveLength(1)
    const habit = result.current.habits[0]
    expect(habit.name).toBe('Meditar')
    expect(habit.color).toBe('violet')
    expect(habit.completedDates).toEqual([])
    expect(habit.id).toBeTruthy()
  })

  it('trims whitespace from name', () => {
    const { result } = renderHook(() => useHabits())

    act(() => {
      result.current.addHabit('  Ler  ', 'emerald')
    })

    expect(result.current.habits[0].name).toBe('Ler')
  })

  it('ignores empty or whitespace-only names', () => {
    const { result } = renderHook(() => useHabits())

    act(() => {
      result.current.addHabit('   ', 'rose')
    })

    expect(result.current.habits).toHaveLength(0)
  })

  it('adds multiple independent habits', () => {
    const { result } = renderHook(() => useHabits())

    act(() => {
      result.current.addHabit('Meditar', 'violet')
      result.current.addHabit('Exercitar', 'emerald')
    })

    expect(result.current.habits).toHaveLength(2)
    expect(result.current.habits[0].name).toBe('Meditar')
    expect(result.current.habits[1].name).toBe('Exercitar')
  })

  it('persists habits to localStorage after mount', async () => {
    const { result } = renderHook(() => useHabits())

    // wait for mount effect
    await act(async () => {})

    act(() => {
      result.current.addHabit('Meditar', 'violet')
    })

    await act(async () => {})

    const stored = JSON.parse(localStorage.getItem('habit-dashboard-v1') ?? '[]')
    expect(stored).toHaveLength(1)
    expect(stored[0].name).toBe('Meditar')
  })
})

describe('useHabits – removeHabit', () => {
  it('removes habit by id', () => {
    const { result } = renderHook(() => useHabits())

    act(() => {
      result.current.addHabit('Meditar', 'violet')
    })

    const id = result.current.habits[0].id

    act(() => {
      result.current.removeHabit(id)
    })

    expect(result.current.habits).toHaveLength(0)
  })

  it('only removes the targeted habit', () => {
    const { result } = renderHook(() => useHabits())

    act(() => {
      result.current.addHabit('Meditar', 'violet')
      result.current.addHabit('Ler', 'emerald')
    })

    const firstId = result.current.habits[0].id

    act(() => {
      result.current.removeHabit(firstId)
    })

    expect(result.current.habits).toHaveLength(1)
    expect(result.current.habits[0].name).toBe('Ler')
  })

  it('is a no-op for unknown id', () => {
    const { result } = renderHook(() => useHabits())

    act(() => {
      result.current.addHabit('Meditar', 'violet')
    })

    act(() => {
      result.current.removeHabit('non-existent-id')
    })

    expect(result.current.habits).toHaveLength(1)
  })
})

describe('useHabits – toggleToday', () => {
  it('marks habit as completed today', () => {
    const { result } = renderHook(() => useHabits())

    act(() => {
      result.current.addHabit('Meditar', 'violet')
    })

    const id = result.current.habits[0].id

    act(() => {
      result.current.toggleToday(id)
    })

    expect(result.current.habits[0].completedDates).toContain(today())
  })

  it('unmarks habit if already completed today', () => {
    const { result } = renderHook(() => useHabits())

    act(() => {
      result.current.addHabit('Meditar', 'violet')
    })

    const id = result.current.habits[0].id

    act(() => { result.current.toggleToday(id) })
    act(() => { result.current.toggleToday(id) })

    expect(result.current.habits[0].completedDates).not.toContain(today())
  })

  it('only toggles the targeted habit', () => {
    const { result } = renderHook(() => useHabits())

    act(() => {
      result.current.addHabit('Meditar', 'violet')
      result.current.addHabit('Ler', 'emerald')
    })

    const firstId = result.current.habits[0].id

    act(() => {
      result.current.toggleToday(firstId)
    })

    expect(result.current.habits[0].completedDates).toContain(today())
    expect(result.current.habits[1].completedDates).toHaveLength(0)
  })
})

describe('useHabits – localStorage persistence', () => {
  it('loads habits saved in a previous session', async () => {
    const saved = [
      {
        id: 'abc',
        name: 'Persistido',
        color: 'sky',
        completedDates: ['2025-06-14'],
        createdAt: new Date().toISOString(),
      },
    ]
    localStorage.setItem('habit-dashboard-v1', JSON.stringify(saved))

    const { result } = renderHook(() => useHabits())
    await act(async () => {})

    expect(result.current.habits).toHaveLength(1)
    expect(result.current.habits[0].name).toBe('Persistido')
  })
})
