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
import { WeeklyRateDatum } from "@/lib/statsData";

interface WeeklyRateChartProps {
  data: WeeklyRateDatum[];
}

interface TooltipPayload {
  payload: WeeklyRateDatum;
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayload[] }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs shadow-xl">
      <p className="text-gray-300 font-medium mb-1">{d.label}</p>
      <p className="text-violet-400">{d.rate}% de conclusão</p>
      <p className="text-gray-500">
        {d.completions} de {d.possible} possíveis
      </p>
    </div>
  );
}

export function WeeklyRateChart({ data }: WeeklyRateChartProps) {
  const maxOpacity = 1;
  const minOpacity = 0.35;
  const n = data.length;

  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data} barSize={36} margin={{ top: 8, right: 0, left: -20, bottom: 0 }}>
        <XAxis
          dataKey="label"
          tick={{ fill: "#6b7280", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          domain={[0, 100]}
          tickFormatter={(v) => `${v}%`}
          tick={{ fill: "#6b7280", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          ticks={[0, 25, 50, 75, 100]}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
        <Bar dataKey="rate" radius={[6, 6, 0, 0]}>
          {data.map((_, i) => {
            const opacity = n <= 1 ? maxOpacity : minOpacity + ((maxOpacity - minOpacity) * i) / (n - 1);
            return <Cell key={i} fill="#8b5cf6" opacity={opacity} />;
          })}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
