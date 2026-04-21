"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { WeeklyDataPoint } from "@/types/habit";

interface Props {
  data: WeeklyDataPoint[];
}

const todayDate = new Date().toISOString().split("T")[0];

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1a1a28] border border-white/10 rounded-lg px-3 py-2 text-xs text-white/80 shadow-xl">
      <p className="font-semibold">{label}</p>
      <p className="text-white/50">{payload[0].value}% completo</p>
    </div>
  );
}

export default function WeeklyChart({ data }: Props) {
  return (
    <div className="card mt-6 mb-8">
      <p className="text-xs text-white/40 uppercase tracking-widest mb-4">Progresso Semanal</p>
      <ResponsiveContainer width="100%" height={140}>
        <BarChart data={data} barSize={28} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
          <XAxis
            dataKey="day"
            tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }}
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
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
          <Bar dataKey="pct" radius={[6, 6, 0, 0]}>
            {data.map((entry) => (
              <Cell
                key={entry.date}
                fill={
                  entry.date === todayDate
                    ? "rgba(139,92,246,0.9)"
                    : entry.pct === 100
                    ? "rgba(52,211,153,0.7)"
                    : "rgba(255,255,255,0.1)"
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="flex gap-4 mt-3 text-xs text-white/30">
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-violet-500 inline-block" /> Hoje</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-emerald-400/70 inline-block" /> 100%</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-white/10 inline-block" /> Parcial</span>
      </div>
    </div>
  );
}
