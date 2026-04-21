'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import type { WeeklyRatePoint } from '@/lib/utils'

interface Props {
  data: WeeklyRatePoint[]
}

interface TooltipPayload {
  value: number
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: TooltipPayload[]; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#1a1a2e] border border-white/10 rounded-lg px-3 py-2 text-xs shadow-xl">
      <p className="text-white/50 mb-1">Semana de {label}</p>
      <p className="text-violet-400 font-semibold">{payload[0].value}% concluído</p>
    </div>
  )
}

export default function WeeklyRateChart({ data }: Props) {
  return (
    <div className="bg-[#1a1a2e] border border-white/[0.06] rounded-2xl p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider">Taxa de Conclusão Semanal</h2>
        <span className="text-xs text-white/30">últimas 8 semanas</span>
      </div>

      {data.length === 0 ? (
        <div className="flex items-center justify-center h-40 text-white/20 text-sm">Sem dados suficientes</div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis
              dataKey="week"
              tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
              tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              width={36}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="rate"
              stroke="#8b5cf6"
              strokeWidth={2}
              dot={{ fill: '#8b5cf6', r: 3, strokeWidth: 0 }}
              activeDot={{ r: 5, fill: '#a78bfa' }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
