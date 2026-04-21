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
import { Sun, Moon } from 'lucide-react'
import type { DayOfWeekPoint } from '@/lib/utils'

interface Props {
  data: DayOfWeekPoint[]
}

interface TooltipPayload {
  value: number
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: TooltipPayload[]; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#1a1a2e] border border-white/10 rounded-lg px-3 py-2 text-xs shadow-xl">
      <p className="text-white/50 mb-1">{label}</p>
      <p className="text-white font-semibold">{payload[0].value}% de conclusão</p>
    </div>
  )
}

function cellColor(entry: DayOfWeekPoint) {
  if (entry.isBest) return '#10b981'
  if (entry.isWorst) return '#f43f5e'
  return 'rgba(255,255,255,0.10)'
}

export default function DayOfWeekChart({ data }: Props) {
  const best = data.find((d) => d.isBest)
  const worst = data.find((d) => d.isWorst)

  return (
    <div className="bg-[#1a1a2e] border border-white/[0.06] rounded-2xl p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider">Melhor e Pior Dia</h2>
      </div>

      <div className="flex gap-4">
        <Chip icon={<Sun size={13} />} label="Melhor" value={best?.day ?? '—'} color="text-emerald-400" bg="bg-emerald-500/10 border-emerald-500/20" />
        <Chip icon={<Moon size={13} />} label="Pior" value={worst?.day ?? '—'} color="text-rose-400" bg="bg-rose-500/10 border-rose-500/20" />
      </div>

      {data.every((d) => d.rate === 0) ? (
        <div className="flex items-center justify-center h-36 text-white/20 text-sm">Sem dados suficientes</div>
      ) : (
        <ResponsiveContainer width="100%" height={150}>
          <BarChart data={data} barCategoryGap="25%">
            <XAxis
              dataKey="day"
              tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
              tick={{ fill: 'rgba(255,255,255,0.20)', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              width={36}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
            <Bar dataKey="rate" radius={[5, 5, 0, 0]}>
              {data.map((entry, i) => (
                <Cell key={i} fill={cellColor(entry)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

function Chip({ icon, label, value, color, bg }: { icon: React.ReactNode; label: string; value: string; color: string; bg: string }) {
  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs ${bg}`}>
      <span className={color}>{icon}</span>
      <span className="text-white/40">{label}:</span>
      <span className={`font-semibold ${color}`}>{value}</span>
    </div>
  )
}
