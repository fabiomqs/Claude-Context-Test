"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import { WeeklyRatePoint } from "@/types/habit";

interface Props {
  data: WeeklyRatePoint[];
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1a1a28] border border-white/10 rounded-lg px-3 py-2 text-xs text-white/80 shadow-xl">
      <p className="font-semibold mb-0.5">{label}</p>
      <p className="text-violet-400">{payload[0].value}% conclusão</p>
    </div>
  );
}

export default function WeeklyRateChart({ data }: Props) {
  const avg = data.length
    ? Math.round(data.reduce((s, d) => s + d.pct, 0) / data.length)
    : 0;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-white/40 uppercase tracking-widest">Taxa de Conclusão Semanal</p>
        <span className="text-xs text-white/30">Média: <span className="text-violet-400 font-semibold">{avg}%</span></span>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data} margin={{ top: 8, right: 8, left: -28, bottom: 0 }}>
          <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
          <XAxis
            dataKey="week"
            tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine
            y={avg}
            stroke="rgba(139,92,246,0.3)"
            strokeDasharray="4 4"
          />
          <Line
            type="monotone"
            dataKey="pct"
            stroke="#8b5cf6"
            strokeWidth={2.5}
            dot={{ fill: "#8b5cf6", r: 4, strokeWidth: 0 }}
            activeDot={{ r: 6, fill: "#a78bfa", strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
