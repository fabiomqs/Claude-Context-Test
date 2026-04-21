"use client";

import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Habit } from "@/lib/types";
import { loadHabits, saveHabits } from "@/lib/storage";
import { getTodayKey } from "@/lib/utils";
import AddHabitForm from "@/components/AddHabitForm";
import HabitList from "@/components/HabitList";
import WeeklyChart from "@/components/WeeklyChart";

export default function Home() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setHabits(loadHabits());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) saveHabits(habits);
  }, [habits, mounted]);

  function addHabit(name: string) {
    setHabits((prev) => [
      ...prev,
      { id: uuidv4(), name, createdAt: new Date().toISOString(), completedDates: [] },
    ]);
  }

  function toggleHabit(id: string) {
    const today = getTodayKey();
    setHabits((prev) =>
      prev.map((h) =>
        h.id !== id
          ? h
          : {
              ...h,
              completedDates: h.completedDates.includes(today)
                ? h.completedDates.filter((d) => d !== today)
                : [...h.completedDates, today],
            }
      )
    );
  }

  function deleteHabit(id: string) {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  }

  const today = getTodayKey();
  const completedToday = habits.filter((h) => h.completedDates.includes(today)).length;
  const total = habits.length;
  const allDone = total > 0 && completedToday === total;

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-100 tracking-tight">
            Habit Tracker {allDone && <span className="ml-1">🎉</span>}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
          </p>
        </div>

        {total > 0 && (
          <div className="bg-gray-800 rounded-xl px-5 py-4 mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Hoje</p>
              <p className="text-2xl font-bold mt-0.5">
                {completedToday}
                <span className="text-gray-500 font-normal text-lg">/{total}</span>
              </p>
            </div>
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="26" fill="none" stroke="#1f2937" strokeWidth="8" />
                <circle
                  cx="32" cy="32" r="26"
                  fill="none"
                  stroke={allDone ? "#6366f1" : "#4f46e5"}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${(completedToday / total) * 163.4} 163.4`}
                  className="transition-all duration-500"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-300">
                {total > 0 ? Math.round((completedToday / total) * 100) : 0}%
              </span>
            </div>
          </div>
        )}

        <div className="mb-6">
          <WeeklyChart habits={habits} />
        </div>

        <div className="mb-4">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Hábitos
          </h2>
          <HabitList habits={habits} onToggle={toggleHabit} onDelete={deleteHabit} />
        </div>

        <div className="mt-6">
          <AddHabitForm onAdd={addHabit} />
        </div>
      </div>
    </main>
  );
}
