'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { getWeeklyData } from '@/lib/utils'
import type { Habit } from '@/types/habit'

interface Props {
  habits: Habit[]
}

interface TooltipPayload {
  value: number
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: TooltipPayload[]; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#1a1a2e] border border-white/10 rounded-lg px-3 py-2 text-xs shadow-xl">
      <p className="text-white/60 mb-1">{label}</p>
      <p className="text-white font-semibold">{payload[0].value} hábito{payload[0].value !== 1 ? 's' : ''}</p>
    </div>
  )
}

export default function WeeklyChart({ habits }: Props) {
  const data = getWeeklyData(habits)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider">Progresso Semanal</h2>
        <span className="text-xs text-white/30">últimos 7 dias</span>
      </div>

      {habits.length === 0 ? (
        <div className="flex items-center justify-center h-40 text-white/20 text-sm">
          Adicione hábitos para ver o progresso
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={data} barCategoryGap="30%">
            <XAxis
              dataKey="day"
              tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              width={20}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
            <Bar dataKey="completed" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.isToday ? '#8b5cf6' : entry.completed === entry.total && entry.total > 0 ? '#10b981' : 'rgba(255,255,255,0.10)'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}

      <div className="flex items-center gap-4 text-xs text-white/30">
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-violet-500 inline-block" /> Hoje</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" /> 100%</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-white/10 inline-block" /> Parcial</span>
      </div>
    </div>
  )
}
