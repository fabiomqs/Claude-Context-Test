"use client";

import { useMemo } from "react";
import { HabitStore, HabitWithStats, WeeklyChartDatum } from "@/types";
import { getDefaultStore } from "@/lib/storage";
import { calculateStreak, calculateLongestStreak } from "@/lib/streaks";
import { deriveWeeklyData } from "@/lib/chartData";
import { getTodayString } from "@/lib/dateUtils";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export function useHabits() {
  const [store, setStore] = useLocalStorage<HabitStore>(
    "habit-tracker-v1",
    getDefaultStore()
  );

  const today = getTodayString();

  const habits: HabitWithStats[] = useMemo(() => {
    const todayLog = store.logs.find((l) => l.date === today);
    return store.habits
      .filter((h) => h.archivedAt === null)
      .map((h) => ({
        ...h,
        completedToday: todayLog?.completedHabitIds.includes(h.id) ?? false,
        currentStreak: calculateStreak(h.id, store.logs, today),
        longestStreak: calculateLongestStreak(h.id, store.logs),
        completionsThisWeek: store.logs
          .filter((l) => l.date >= subtractDays(today, 6) && l.date <= today)
          .filter((l) => l.completedHabitIds.includes(h.id)).length,
      }));
  }, [store, today]);

  const weeklyData: WeeklyChartDatum[] = useMemo(
    () => deriveWeeklyData(store, today),
    [store, today]
  );

  const todayCompletionCount = habits.filter((h) => h.completedToday).length;
  const totalActiveHabits = habits.length;

  function addHabit(name: string, color: string) {
    const newHabit = {
      id: crypto.randomUUID(),
      name: name.trim(),
      color,
      createdAt: today,
      archivedAt: null,
    };
    setStore((prev) => ({ ...prev, habits: [...prev.habits, newHabit] }));
  }

  function toggleHabit(habitId: string) {
    setStore((prev) => {
      const logIndex = prev.logs.findIndex((l) => l.date === today);
      let newLogs = [...prev.logs];

      if (logIndex === -1) {
        newLogs.push({ date: today, completedHabitIds: [habitId] });
      } else {
        const log = newLogs[logIndex];
        const has = log.completedHabitIds.includes(habitId);
        newLogs[logIndex] = {
          ...log,
          completedHabitIds: has
            ? log.completedHabitIds.filter((id) => id !== habitId)
            : [...log.completedHabitIds, habitId],
        };
      }

      return { ...prev, logs: newLogs };
    });
  }

  function deleteHabit(habitId: string) {
    setStore((prev) => ({
      ...prev,
      habits: prev.habits.map((h) =>
        h.id === habitId ? { ...h, archivedAt: today } : h
      ),
    }));
  }

  return {
    habits,
    weeklyData,
    todayCompletionCount,
    totalActiveHabits,
    addHabit,
    toggleHabit,
    deleteHabit,
  };
}

function subtractDays(date: string, days: number): string {
  const d = new Date(date + "T00:00:00");
  d.setDate(d.getDate() - days);
  return d.toLocaleDateString("en-CA");
}
