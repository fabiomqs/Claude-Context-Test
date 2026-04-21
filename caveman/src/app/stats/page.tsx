"use client";

import { useHabits } from "@/hooks/useHabits";
import ConsistencyCard from "@/components/stats/ConsistencyCard";
import WeeklyRateChart from "@/components/stats/WeeklyRateChart";
import DayOfWeekChart from "@/components/stats/DayOfWeekChart";

export default function StatsPage() {
  const { habits, loaded, getMostConsistent, getWeeklyRates, getDayOfWeekStats, getStreak } =
    useHabits();

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  const weeklyRates = getWeeklyRates(8);
  const dayStats = getDayOfWeekStats();
  const mostConsistent = getMostConsistent();

  if (!habits.length) {
    return (
      <main className="min-h-screen py-12 px-4">
        <div className="max-w-xl mx-auto">
          <div className="card text-center py-16">
            <p className="text-white/30 text-sm">Adicione hábitos para ver estatísticas.</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Estatísticas</h1>
        </div>

        {/* All habits overview */}
        <div className="card mb-6">
          <p className="text-xs text-white/40 uppercase tracking-widest mb-4">Todos os Hábitos</p>
          <div className="flex flex-col gap-3">
            {habits.map((habit) => {
              const streak = getStreak(habit);
              const total = habit.completedDates.length;
              const created = new Date(habit.createdAt);
              const daysSince = Math.max(
                1,
                Math.floor((Date.now() - created.getTime()) / 86400000) + 1
              );
              const rate = Math.round((total / daysSince) * 100);
              return (
                <div key={habit.id} className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${colorDot(habit.color)}`} />
                  <span className="text-sm text-white/80 flex-1">{habit.name}</span>
                  <span className="text-xs text-white/30">{total} dias</span>
                  <span className="text-xs text-white/50 w-10 text-right">{rate}%</span>
                  {streak > 0 && (
                    <span className="text-xs text-orange-400 w-12 text-right">🔥 {streak}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <ConsistencyCard result={mostConsistent} />

        <div className="mt-6">
          <WeeklyRateChart data={weeklyRates} />
        </div>

        <div className="mt-6">
          <DayOfWeekChart data={dayStats} />
        </div>
      </div>
    </main>
  );
}

function colorDot(color: string): string {
  const map: Record<string, string> = {
    violet: "bg-violet-500",
    emerald: "bg-emerald-500",
    sky: "bg-sky-500",
    rose: "bg-rose-500",
    amber: "bg-amber-500",
  };
  return map[color] ?? "bg-violet-500";
}
