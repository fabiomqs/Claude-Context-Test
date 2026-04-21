'use client'

import { Trash2 } from 'lucide-react'
import { calcStreak } from '@/lib/utils'
import { COLOR_MAP, type HabitColor } from '@/types/habit'
import StreakBadge from './StreakBadge'
import type { Habit } from '@/types/habit'

interface Props {
  habit: Habit
  isCompleted: boolean
  onToggle: () => void
  onRemove: () => void
}

export default function HabitItem({ habit, isCompleted, onToggle, onRemove }: Props) {
  const streak = calcStreak(habit.completedDates)
  const colors = COLOR_MAP[habit.color as HabitColor] ?? COLOR_MAP.violet

  return (
    <div
      className={`
        group flex items-center gap-3 p-4 rounded-xl border transition-all duration-200
        ${isCompleted
          ? 'bg-white/[0.03] border-white/[0.06]'
          : 'bg-white/[0.05] border-white/[0.08] hover:bg-white/[0.07]'
        }
      `}
    >
      <button
        onClick={onToggle}
        className={`
          flex-shrink-0 w-5 h-5 rounded-md border-2 transition-all duration-150 flex items-center justify-center
          ${isCompleted
            ? `${colors.bg} border-transparent`
            : `border-white/30 hover:border-white/60`
          }
        `}
        aria-label={isCompleted ? 'Desmarcar hábito' : 'Marcar hábito como feito'}
      >
        {isCompleted && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0">
        <span
          className={`text-sm font-medium transition-all duration-150 ${
            isCompleted ? 'line-through text-white/30' : 'text-white/90'
          }`}
        >
          {habit.name}
        </span>
      </div>

      <StreakBadge streak={streak} />

      <button
        onClick={onRemove}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg text-white/30 hover:text-rose-400 hover:bg-rose-500/10"
        aria-label="Remover hábito"
      >
        <Trash2 size={14} />
      </button>
    </div>
  )
}
