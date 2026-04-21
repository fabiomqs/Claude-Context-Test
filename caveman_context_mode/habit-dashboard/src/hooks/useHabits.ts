'use client'

import { useState, useEffect, useCallback } from 'react'
import { loadHabits, saveHabits } from '@/lib/storage'
import { today } from '@/lib/utils'
import type { Habit } from '@/types/habit'

let idCounter = 0
function genId(): string {
  return `${Date.now()}-${++idCounter}-${Math.random().toString(36).slice(2, 7)}`
}

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setHabits(loadHabits())
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) saveHabits(habits)
  }, [habits, mounted])

  const addHabit = useCallback((name: string, color: string) => {
    const trimmed = name.trim()
    if (!trimmed) return
    setHabits((prev) => [
      ...prev,
      {
        id: genId(),
        name: trimmed,
        color,
        completedDates: [],
        createdAt: new Date().toISOString(),
      },
    ])
  }, [])

  const removeHabit = useCallback((id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id))
  }, [])

  const toggleToday = useCallback((id: string) => {
    const t = today()
    setHabits((prev) =>
      prev.map((h) =>
        h.id !== id
          ? h
          : {
              ...h,
              completedDates: h.completedDates.includes(t)
                ? h.completedDates.filter((d) => d !== t)
                : [...h.completedDates, t],
            }
      )
    )
  }, [])

  return { habits, addHabit, removeHabit, toggleToday, mounted }
}
