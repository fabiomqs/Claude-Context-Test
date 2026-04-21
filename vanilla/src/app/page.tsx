"use client";

import dynamic from "next/dynamic";
import { useHabits } from "@/hooks/useHabits";
import { Card } from "@/components/ui/Card";
import { AddHabitForm } from "@/components/habits/AddHabitForm";
import { HabitList } from "@/components/habits/HabitList";
import { getTodayString } from "@/lib/dateUtils";

const WeeklyChart = dynamic(
  () => import("@/components/chart/WeeklyChart").then((m) => m.WeeklyChart),
  { ssr: false }
);

function formatDate(dateStr: string): string {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function Home() {
  const {
    habits,
    weeklyData,
    todayCompletionCount,
    totalActiveHabits,
    addHabit,
    toggleHabit,
    deleteHabit,
  } = useHabits();

  const today = getTodayString();
  const completionPct =
    totalActiveHabits > 0
      ? Math.round((todayCompletionCount / totalActiveHabits) * 100)
      : 0;

  return (
    <main className="max-w-2xl mx-auto px-4 py-10 flex flex-col gap-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Habit Tracker</h1>
        <p className="text-gray-500 text-sm mt-1 capitalize">{formatDate(today)}</p>
      </div>

      {/* Today's progress summary */}
      <Card className="flex items-center gap-4">
        <div className="flex-1">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">
            Progresso hoje
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-white">{todayCompletionCount}</span>
            <span className="text-gray-500 text-lg">/ {totalActiveHabits}</span>
          </div>
          <p className="text-gray-400 text-sm mt-0.5">
            {totalActiveHabits === 0
              ? "Adicione hábitos para começar"
              : todayCompletionCount === totalActiveHabits && totalActiveHabits > 0
              ? "Todos os hábitos concluídos! 🎉"
              : `${completionPct}% concluído`}
          </p>
        </div>

        {/* Circular progress */}
        <div className="relative w-20 h-20 flex-shrink-0">
          <svg viewBox="0 0 36 36" className="w-20 h-20 -rotate-90">
            <circle
              cx="18"
              cy="18"
              r="15.9"
              fill="none"
              stroke="#1f2937"
              strokeWidth="3"
            />
            <circle
              cx="18"
              cy="18"
              r="15.9"
              fill="none"
              stroke="#8b5cf6"
              strokeWidth="3"
              strokeDasharray={`${completionPct} ${100 - completionPct}`}
              strokeDashoffset="0"
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">
            {completionPct}%
          </span>
        </div>
      </Card>

      {/* Add Habit */}
      <Card>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
          Adicionar hábito
        </h2>
        <AddHabitForm onAdd={addHabit} />
      </Card>

      {/* Habit List */}
      <Card>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
          Hábitos de hoje
        </h2>
        <HabitList
          habits={habits}
          onToggle={toggleHabit}
          onDelete={deleteHabit}
        />
      </Card>

      {/* Weekly Chart */}
      <Card>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
          Progresso semanal
        </h2>
        <WeeklyChart data={weeklyData} />
        <div className="flex justify-between mt-3">
          {weeklyData.map((d) => (
            <div key={d.date} className="text-center">
              <p className="text-xs text-gray-600">{d.completions}/{d.total}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Footer */}
      <p className="text-center text-gray-700 text-xs pb-4">
        Dados salvos localmente no seu dispositivo
      </p>
    </main>
  );
}
