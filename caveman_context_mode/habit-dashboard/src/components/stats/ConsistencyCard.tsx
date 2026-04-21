import { Trophy } from 'lucide-react'
import { COLOR_MAP, type HabitColor } from '@/types/habit'
import type { ConsistencyResult } from '@/lib/utils'

interface Props {
  result: ConsistencyResult | null
}

export default function ConsistencyCard({ result }: Props) {
  const colors = result ? (COLOR_MAP[result.habit.color as HabitColor] ?? COLOR_MAP.violet) : null

  return (
    <div className="bg-[#1a1a2e] border border-white/[0.06] rounded-2xl p-5 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Trophy size={15} className="text-amber-400" />
        <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider">Hábito Mais Consistente</h2>
      </div>

      {!result ? (
        <p className="text-white/25 text-sm">Sem dados ainda</p>
      ) : (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className={`w-3 h-3 rounded-full flex-shrink-0 ${colors!.bg}`} />
            <span className="text-white font-semibold text-lg">{result.habit.name}</span>
          </div>
          <div className="text-right">
            <p className={`text-2xl font-bold ${colors!.text}`}>{result.rate}%</p>
            <p className="text-xs text-white/30">{result.completedDays}/{result.totalDays} dias</p>
          </div>
        </div>
      )}
    </div>
  )
}
