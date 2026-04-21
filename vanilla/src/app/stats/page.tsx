"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { getDefaultStore, loadStore } from "@/lib/storage";
import { HabitStore } from "@/types";
import { getTodayString } from "@/lib/dateUtils";
import {
  getMostConsistentHabit,
  getWeeklyRates,
  getDayOfWeekStats,
} from "@/lib/statsData";
import { StatCard } from "@/components/stats/StatCard";
import { Card } from "@/components/ui/Card";

const MostConsistentHabit = dynamic(
  () => import("@/components/stats/MostConsistentHabit").then((m) => m.MostConsistentHabit),
  { ssr: false }
);

const WeeklyRateChart = dynamic(
  () => import("@/components/stats/WeeklyRateChart").then((m) => m.WeeklyRateChart),
  { ssr: false }
);

const DayOfWeekChart = dynamic(
  () => import("@/components/stats/DayOfWeekChart").then((m) => m.DayOfWeekChart),
  { ssr: false }
);

export default function StatsPage() {
  const [store] = useLocalStorage<HabitStore>("habit-tracker-v1", getDefaultStore());
  const today = getTodayString();

  const mostConsistent = useMemo(
    () => getMostConsistentHabit(store, today),
    [store, today]
  );

  const weeklyRates = useMemo(
    () => getWeeklyRates(store, today, 4),
    [store, today]
  );

  const dayOfWeekStats = useMemo(
    () => getDayOfWeekStats(store, today),
    [store, today]
  );

  const daysWithData = dayOfWeekStats.filter((d) => d.possible > 0);
  const bestDay = daysWithData.length > 0
    ? daysWithData.reduce((a, b) => (b.rate > a.rate ? b : a))
    : null;
  const worstDay = daysWithData.length > 0
    ? daysWithData.reduce((a, b) => (b.rate < a.rate ? b : a))
    : null;

  const totalCompletions = store.logs.reduce(
    (sum, l) => sum + l.completedHabitIds.length,
    0
  );
  const activeHabits = store.habits.filter((h) => h.archivedAt === null).length;

  const isEmpty = store.habits.length === 0;

  return (
    <main className="max-w-2xl mx-auto px-4 py-10 flex flex-col gap-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Estatísticas</h1>
        <p className="text-gray-500 text-sm mt-1">Visão geral do seu progresso</p>
      </div>

      {isEmpty ? (
        <Card className="flex flex-col items-center py-16 text-center">
          <div className="text-5xl mb-4">📊</div>
          <h3 className="text-lg font-semibold text-gray-300 mb-2">Sem dados ainda</h3>
          <p className="text-gray-500 text-sm max-w-xs">
            Adicione hábitos no Dashboard e comece a marcá-los para ver suas estatísticas aqui.
          </p>
        </Card>
      ) : (
        <>
          {/* Top summary stats */}
          <div className="grid grid-cols-2 gap-4">
            <StatCard
              label="Conclusões totais"
              value={totalCompletions}
              sub={`${activeHabits} hábito${activeHabits !== 1 ? "s" : ""} ativo${activeHabits !== 1 ? "s" : ""}`}
              accent="#8b5cf6"
            />
            <StatCard
              label="Taxa geral (4 sem.)"
              value={
                weeklyRates.reduce((s, w) => s + w.possible, 0) > 0
                  ? `${Math.round(
                      (weeklyRates.reduce((s, w) => s + w.completions, 0) /
                        weeklyRates.reduce((s, w) => s + w.possible, 0)) *
                        100
                    )}%`
                  : "—"
              }
              sub="últimas 4 semanas"
              accent="#10b981"
            />
          </div>

          {/* Best / worst day */}
          <div className="grid grid-cols-2 gap-4">
            <StatCard
              label="Melhor dia"
              value={bestDay ? bestDay.day : "—"}
              sub={bestDay ? `${bestDay.rate}% de conclusão` : "dados insuficientes"}
              accent="#10b981"
            />
            <StatCard
              label="Pior dia"
              value={worstDay && worstDay !== bestDay ? worstDay.day : "—"}
              sub={
                worstDay && worstDay !== bestDay
                  ? `${worstDay.rate}% de conclusão`
                  : "dados insuficientes"
              }
              accent="#f43f5e"
            />
          </div>

          {/* Most consistent habit */}
          <MostConsistentHabit data={mostConsistent} />

          {/* Weekly rate chart */}
          <Card>
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Taxa de conclusão semanal
            </h2>
            <WeeklyRateChart data={weeklyRates} />
          </Card>

          {/* Day of week chart */}
          <Card>
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">
              Por dia da semana
            </h2>
            <p className="text-xs text-gray-600 mb-4">
              <span className="text-emerald-500">■</span> melhor dia &nbsp;
              <span className="text-rose-500">■</span> pior dia
            </p>
            <DayOfWeekChart
              data={dayOfWeekStats}
              bestDayIndex={bestDay?.dayIndex ?? null}
              worstDayIndex={worstDay && worstDay !== bestDay ? worstDay.dayIndex : null}
            />
          </Card>
        </>
      )}
    </main>
  );
}
