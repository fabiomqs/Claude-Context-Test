"use client";

import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
} from "recharts";
import { Habit } from "@/lib/types";
import { loadHabits } from "@/lib/storage";
import {
  getCompletionRate,
  getWeeklyRates,
  getDayOfWeekStats,
} from "@/lib/utils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-xs">
      <p className="text-gray-300 font-medium mb-0.5">{label}</p>
      <p className="text-indigo-400">{payload[0].value}%</p>
      {payload[0].payload.completed !== undefined && (
        <p className="text-gray-500">{payload[0].payload.completed}/{payload[0].payload.possible ?? payload[0].payload.total} hábitos</p>
      )}
    </div>
  );
}

function StatCard({ label, value, sub, accent = false }: { label: string; value: string; sub?: string; accent?: boolean }) {
  return (
    <div className={`rounded-xl px-5 py-4 ${accent ? "bg-indigo-600/20 border border-indigo-500/30" : "bg-gray-800"}`}>
      <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">{label}</p>
      <p className={`text-xl font-bold ${accent ? "text-indigo-300" : "text-gray-100"}`}>{value}</p>
      {sub && <p className="text-xs text-gray-500 mt-0.5">{sub}</p>}
    </div>
  );
}

export default function StatsPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setHabits(loadHabits());
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (habits.length === 0) {
    return (
      <main className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p className="text-4xl mb-3">📊</p>
          <p className="text-sm">Nenhum hábito ainda. Adicione hábitos para ver as estatísticas.</p>
        </div>
      </main>
    );
  }

  const weeklyRates = getWeeklyRates(habits, 8);
  const dayStats = getDayOfWeekStats(habits);

  const mostConsistent = [...habits].sort(
    (a, b) => getCompletionRate(b) - getCompletionRate(a)
  )[0];

  const bestDay = [...dayStats].sort((a, b) => b.pct - a.pct)[0];
  const worstDay = [...dayStats].filter((d) => d.samples > 0).sort((a, b) => a.pct - b.pct)[0];

  const currentWeekRate = weeklyRates[weeklyRates.length - 1]?.pct ?? 0;

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-100 tracking-tight">Estatísticas</h1>
          <p className="text-gray-500 text-sm mt-1">Visão geral dos seus hábitos</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <StatCard
            label="Hábito mais consistente"
            value={mostConsistent.name}
            sub={`${getCompletionRate(mostConsistent)}% de conclusão`}
            accent
          />
          <StatCard
            label="Taxa semanal atual"
            value={`${currentWeekRate}%`}
            sub="esta semana"
          />
          <StatCard
            label="Melhor dia"
            value={bestDay?.day ?? "—"}
            sub={bestDay ? `${bestDay.pct}% de média` : undefined}
          />
          <StatCard
            label="Pior dia"
            value={worstDay?.day ?? "—"}
            sub={worstDay ? `${worstDay.pct}% de média` : undefined}
          />
        </div>

        {/* Weekly completion rate chart */}
        <div className="bg-gray-800 rounded-xl p-5 mb-6">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
            Taxa de conclusão semanal
          </h2>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={weeklyRates} barSize={22} margin={{ top: 4, right: 0, left: -28, bottom: 0 }}>
              <XAxis dataKey="week" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
              <Bar dataKey="pct" radius={[6, 6, 0, 0]}>
                {weeklyRates.map((entry, i) => (
                  <Cell key={i} fill={i === weeklyRates.length - 1 ? "#6366f1" : "#4338ca"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Day of week radar */}
        <div className="bg-gray-800 rounded-xl p-5 mb-6">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
            Desempenho por dia da semana
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={dayStats} margin={{ top: 8, right: 24, left: 24, bottom: 8 }}>
              <PolarGrid stroke="#374151" />
              <PolarAngleAxis dataKey="day" tick={{ fill: "#9ca3af", fontSize: 12 }} />
              <Radar
                name="Conclusão"
                dataKey="pct"
                stroke="#6366f1"
                fill="#6366f1"
                fillOpacity={0.25}
                strokeWidth={2}
              />
              <Tooltip content={<ChartTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Per-habit breakdown */}
        <div className="bg-gray-800 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
            Ranking de hábitos
          </h2>
          <div className="flex flex-col gap-3">
            {[...habits]
              .sort((a, b) => getCompletionRate(b) - getCompletionRate(a))
              .map((habit) => {
                const rate = getCompletionRate(habit);
                return (
                  <div key={habit.id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300">{habit.name}</span>
                      <span className="text-gray-500">{rate}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                        style={{ width: `${rate}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </main>
  );
}
