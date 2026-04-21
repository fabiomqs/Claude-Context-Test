import { today } from '@/lib/utils'
import type { Habit } from '@/types/habit'

interface Props {
  habits: Habit[]
}

export default function Header({ habits }: Props) {
  const todayStr = today()
  const completedToday = habits.filter((h) => h.completedDates.includes(todayStr)).length
  const total = habits.length

  const dateLabel = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  return (
    <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Habit Dashboard</h1>
        <p className="text-sm text-white/40 mt-0.5 capitalize">{dateLabel}</p>
      </div>

      {total > 0 && (
        <div className="flex items-center gap-6">
          <Stat label="Hoje" value={`${completedToday}/${total}`} />
          <Stat
            label="Taxa"
            value={total > 0 ? `${Math.round((completedToday / total) * 100)}%` : '—'}
            highlight={completedToday === total && total > 0}
          />
        </div>
      )}
    </header>
  )
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="text-right">
      <p className={`text-xl font-bold ${highlight ? 'text-emerald-400' : 'text-white'}`}>{value}</p>
      <p className="text-xs text-white/35 uppercase tracking-wider">{label}</p>
    </div>
  )
}
