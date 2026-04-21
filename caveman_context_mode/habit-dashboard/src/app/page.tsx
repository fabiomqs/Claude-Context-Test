'use client'

import { useHabits } from '@/hooks/useHabits'
import Header from '@/components/Header'
import HabitList from '@/components/HabitList'
import AddHabitForm from '@/components/AddHabitForm'
import WeeklyChart from '@/components/WeeklyChart'

export default function HomePage() {
  const { habits, addHabit, removeHabit, toggleToday, mounted } = useHabits()

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        <div className="pb-6 border-b border-white/[0.06]">
          <Header habits={habits} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 flex flex-col gap-4 bg-[#1a1a2e] border border-white/[0.06] rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider">Hábitos</h2>
              <span className="text-xs text-white/25">{habits.length} total</span>
            </div>

            <AddHabitForm onAdd={addHabit} />
            <HabitList habits={habits} onToggle={toggleToday} onRemove={removeHabit} />
          </div>

          <div className="lg:col-span-2 bg-[#1a1a2e] border border-white/[0.06] rounded-2xl p-5">
            <WeeklyChart habits={habits} />
          </div>
        </div>
      </div>
    </main>
  )
}
