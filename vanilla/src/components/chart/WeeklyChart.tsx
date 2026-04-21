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
import { WeeklyChartDatum } from "@/types";

interface WeeklyChartProps {
  data: WeeklyChartDatum[];
}

interface TooltipPayload {
  payload: WeeklyChartDatum;
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayload[] }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs shadow-xl">
      <p className="text-gray-300 font-medium">{d.day}</p>
      <p className="text-violet-400">
        {d.completions} / {d.total} hábitos
      </p>
    </div>
  );
}

export function WeeklyChart({ data }: WeeklyChartProps) {
  const today = data[data.length - 1]?.date;

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
          tick={{ fill: "#6b7280", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
        <Bar dataKey="completions" radius={[6, 6, 0, 0]}>
          {data.map((entry) => (
            <Cell
              key={entry.date}
              fill={entry.date === today ? "#8b5cf6" : "#4c1d95"}
              opacity={entry.date === today ? 1 : 0.7}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
