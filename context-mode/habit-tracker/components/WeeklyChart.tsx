"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Habit } from "@/lib/types";
import { getWeekData } from "@/lib/utils";

interface Props {
  habits: Habit[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const { completed, total } = payload[0].payload;
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-xs">
      <p className="text-gray-300 font-medium">{label}</p>
      <p className="text-indigo-400">{completed}/{total} hábitos</p>
    </div>
  );
}

export default function WeeklyChart({ habits }: Props) {
  const data = getWeekData(habits);

  return (
    <div className="bg-gray-800 rounded-xl p-5">
      <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
        Progresso semanal
      </h2>
      {habits.length === 0 ? (
        <div className="h-28 flex items-center justify-center text-gray-600 text-sm">
          Adicione hábitos para ver o progresso
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={120}>
          <BarChart data={data} barSize={28} margin={{ top: 4, right: 0, left: -28, bottom: 0 }}>
            <XAxis dataKey="day" tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
            <Bar dataKey="pct" radius={[6, 6, 0, 0]}>
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.pct === 100 ? "#6366f1" : entry.pct > 0 ? "#4f46e5" : "#1f2937"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
