'use client'

import { useHabits } from '@/hooks/useHabits'
import ConsistencyCard from '@/components/stats/ConsistencyCard'
import WeeklyRateChart from '@/components/stats/WeeklyRateChart'
import DayOfWeekChart from '@/components/stats/DayOfWeekChart'
import { getMostConsistentHabit, getWeeklyRates, getDayOfWeekStats } from '@/lib/utils'

export default function StatsPage() {
  const { habits, mounted } = useHabits()

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
      </div>
    )
  }

  const mostConsistent = getMostConsistentHabit(habits)
  const weeklyRates = getWeeklyRates(habits)
  const dowStats = getDayOfWeekStats(habits)

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        <header className="pb-6 border-b border-white/[0.06]">
          <h1 className="text-2xl font-bold text-white tracking-tight">Estatísticas</h1>
          <p className="text-sm text-white/40 mt-0.5">
            {habits.length} hábito{habits.length !== 1 ? 's' : ''} registrado{habits.length !== 1 ? 's' : ''}
          </p>
        </header>

        <ConsistencyCard result={mostConsistent} />
        <WeeklyRateChart data={weeklyRates} />
        <DayOfWeekChart data={dowStats} />
      </div>
    </main>
  )
}
