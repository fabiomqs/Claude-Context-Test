'use client'

import { today } from '@/lib/utils'
import HabitItem from './HabitItem'
import type { Habit } from '@/types/habit'

interface Props {
  habits: Habit[]
  onToggle: (id: string) => void
  onRemove: (id: string) => void
}

export default function HabitList({ habits, onToggle, onRemove }: Props) {
  const todayStr = today()

  if (habits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="text-4xl mb-3">🌱</div>
        <p className="text-white/40 text-sm">Nenhum hábito ainda. Adicione um abaixo!</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {habits.map((habit) => (
        <HabitItem
          key={habit.id}
          habit={habit}
          isCompleted={habit.completedDates.includes(todayStr)}
          onToggle={() => onToggle(habit.id)}
          onRemove={() => onRemove(habit.id)}
        />
      ))}
    </div>
  )
}
