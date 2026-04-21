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
import { DayOfWeekDatum } from "@/lib/statsData";

interface DayOfWeekChartProps {
  data: DayOfWeekDatum[];
  bestDayIndex: number | null;
  worstDayIndex: number | null;
}

interface TooltipPayload {
  payload: DayOfWeekDatum;
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayload[] }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs shadow-xl">
      <p className="text-gray-300 font-medium mb-1">{d.day}</p>
      {d.possible > 0 ? (
        <>
          <p className="text-emerald-400">{d.rate}% de conclusão</p>
          <p className="text-gray-500">
            {d.completions} de {d.possible} possíveis
          </p>
        </>
      ) : (
        <p className="text-gray-500">Sem dados</p>
      )}
    </div>
  );
}

function barColor(d: DayOfWeekDatum, bestIndex: number | null, worstIndex: number | null): string {
  if (d.possible === 0) return "#374151";
  if (d.dayIndex === bestIndex) return "#10b981";
  if (d.dayIndex === worstIndex) return "#f43f5e";
  return "#6b7280";
}

export function DayOfWeekChart({ data, bestDayIndex, worstDayIndex }: DayOfWeekChartProps) {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data} barSize={28} margin={{ top: 8, right: 0, left: -20, bottom: 0 }}>
        <XAxis
          dataKey="day"
          tick={{ fill: "#6b7280", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          domain={[0, 100]}
          tickFormatter={(v) => `${v}%`}
          tick={{ fill: "#6b7280", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          ticks={[0, 50, 100]}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
        <Bar dataKey="rate" radius={[6, 6, 0, 0]}>
          {data.map((d) => (
            <Cell key={d.dayIndex} fill={barColor(d, bestDayIndex, worstDayIndex)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
