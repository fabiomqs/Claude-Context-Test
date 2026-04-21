"use client";

import { useHabits } from "@/hooks/useHabits";
import StatsHeader from "@/components/StatsHeader";
import HabitList from "@/components/HabitList";
import AddHabitForm from "@/components/AddHabitForm";
import WeeklyChart from "@/components/WeeklyChart";

export default function Home() {
  const {
    habits,
    loaded,
    addHabit,
    removeHabit,
    toggleToday,
    getStreak,
    getWeeklyData,
    isTodayDone,
    todayProgress,
  } = useHabits();

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Hábitos</h1>
          <p className="text-sm text-white/30 mt-1">
            {new Date().toLocaleDateString("pt-BR", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </p>
        </div>

        <StatsHeader
          habits={habits}
          todayProgress={todayProgress}
          getStreak={getStreak}
        />

        <AddHabitForm onAdd={addHabit} />

        <div className="card mt-6">
          <p className="text-xs text-white/40 uppercase tracking-widest mb-4">Hoje</p>
          <HabitList
            habits={habits}
            isTodayDone={isTodayDone}
            getStreak={getStreak}
            onToggle={toggleToday}
            onRemove={removeHabit}
          />
        </div>

        <WeeklyChart data={getWeeklyData()} />
      </div>
    </main>
  );
}
