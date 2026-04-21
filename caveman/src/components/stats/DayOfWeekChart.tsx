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
import { DayOfWeekPoint } from "@/types/habit";

interface Props {
  data: DayOfWeekPoint[];
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1a1a28] border border-white/10 rounded-lg px-3 py-2 text-xs text-white/80 shadow-xl">
      <p className="font-semibold mb-0.5">{label}</p>
      <p>{payload[0].value}% conclusão</p>
    </div>
  );
}

export default function DayOfWeekChart({ data }: Props) {
  if (!data.length) return null;

  const maxPct = Math.max(...data.map((d) => d.pct));
  const minPct = Math.min(...data.filter((d) => d.pct > 0).map((d) => d.pct));
  const best = data.find((d) => d.pct === maxPct);
  const worst = data.find((d) => d.pct === minPct && d !== best);

  function cellColor(d: DayOfWeekPoint) {
    if (d.pct === maxPct && maxPct > 0) return "rgba(52,211,153,0.85)";
    if (worst && d.pct === minPct && d.day === worst.day) return "rgba(251,113,133,0.7)";
    return "rgba(255,255,255,0.1)";
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs text-white/40 uppercase tracking-widest">Melhor e Pior Dia da Semana</p>
      </div>
      <div className="flex gap-4 mb-4 text-xs">
        {best && best.pct > 0 && (
          <span className="text-emerald-400">
            Melhor: <span className="font-semibold">{best.day}</span> ({best.pct}%)
          </span>
        )}
        {worst && (
          <span className="text-rose-400">
            Pior: <span className="font-semibold">{worst.day}</span> ({worst.pct}%)
          </span>
        )}
      </div>
      <ResponsiveContainer width="100%" height={150}>
        <BarChart data={data} barSize={32} margin={{ top: 0, right: 0, left: -28, bottom: 0 }}>
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
              <Cell key={entry.day} fill={cellColor(entry)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
