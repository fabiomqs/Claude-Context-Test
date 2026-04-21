"use client";

import { useState, useEffect, useCallback } from "react";
import { Habit, HabitColor, WeeklyDataPoint, WeeklyRatePoint, DayOfWeekPoint, ConsistencyResult } from "@/types/habit";

const STORAGE_KEY = "habits-v1";

function toDateStr(date: Date): string {
  return date.toISOString().split("T")[0];
}

function today(): string {
  return toDateStr(new Date());
}

function uuid(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setHabits(JSON.parse(raw));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
  }, [habits, loaded]);

  const addHabit = useCallback((name: string, color: HabitColor) => {
    setHabits((prev) => [
      ...prev,
      { id: uuid(), name, completedDates: [], createdAt: today(), color },
    ]);
  }, []);

  const removeHabit = useCallback((id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  }, []);

  const toggleToday = useCallback((id: string) => {
    const t = today();
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h;
        const has = h.completedDates.includes(t);
        return {
          ...h,
          completedDates: has
            ? h.completedDates.filter((d) => d !== t)
            : [...h.completedDates, t],
        };
      })
    );
  }, []);

  const getStreak = useCallback((habit: Habit): number => {
    let count = 0;
    const base = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(base);
      d.setDate(d.getDate() - i);
      if (habit.completedDates.includes(toDateStr(d))) {
        count++;
      } else {
        break;
      }
    }
    return count;
  }, []);

  const getWeeklyData = useCallback((): WeeklyDataPoint[] => {
    const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const dateStr = toDateStr(d);
      const completed = habits.filter((h) =>
        h.completedDates.includes(dateStr)
      ).length;
      const pct = habits.length ? Math.round((completed / habits.length) * 100) : 0;
      return { day: days[d.getDay()], date: dateStr, pct };
    });
  }, [habits]);

  const getMostConsistent = useCallback((): ConsistencyResult | null => {
    if (!habits.length) return null;
    const base = new Date();
    let best: ConsistencyResult | null = null;
    for (const habit of habits) {
      const created = new Date(habit.createdAt);
      const daysSince = Math.max(
        1,
        Math.floor((base.getTime() - created.getTime()) / 86400000) + 1
      );
      const rate = Math.round((habit.completedDates.length / daysSince) * 100);
      if (!best || rate > best.rate) best = { habit, rate };
    }
    return best;
  }, [habits]);

  const getWeeklyRates = useCallback((weeks = 8): WeeklyRatePoint[] => {
    return Array.from({ length: weeks }, (_, i) => {
      const weekIndex = weeks - 1 - i;
      const points: string[] = [];
      for (let d = 0; d < 7; d++) {
        const date = new Date();
        date.setDate(date.getDate() - weekIndex * 7 - (6 - d));
        points.push(toDateStr(date));
      }
      const totalSlots = habits.length * 7;
      const completed = habits.reduce(
        (sum, h) => sum + points.filter((p) => h.completedDates.includes(p)).length,
        0
      );
      const pct = totalSlots ? Math.round((completed / totalSlots) * 100) : 0;
      const refDate = new Date();
      refDate.setDate(refDate.getDate() - weekIndex * 7);
      const label = weekIndex === 0 ? "Esta sem." : `${refDate.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}`;
      return { week: label, pct };
    });
  }, [habits]);

  const getDayOfWeekStats = useCallback((): DayOfWeekPoint[] => {
    const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    const counts = Array(7).fill(0);
    const totals = Array(7).fill(0);
    const base = new Date();

    for (let i = 0; i < 90; i++) {
      const d = new Date(base);
      d.setDate(d.getDate() - i);
      const dateStr = toDateStr(d);
      const dow = d.getDay();
      totals[dow] += habits.length;
      counts[dow] += habits.filter((h) => h.completedDates.includes(dateStr)).length;
    }

    return dayNames.map((day, i) => ({
      day,
      pct: totals[i] ? Math.round((counts[i] / totals[i]) * 100) : 0,
    }));
  }, [habits]);

  const isTodayDone = useCallback(
    (habit: Habit) => habit.completedDates.includes(today()),
    []
  );

  const todayProgress = habits.length
    ? Math.round(
        (habits.filter((h) => h.completedDates.includes(today())).length /
          habits.length) *
          100
      )
    : 0;

  return {
    habits,
    loaded,
    addHabit,
    removeHabit,
    toggleToday,
    getStreak,
    getWeeklyData,
    isTodayDone,
    todayProgress,
    getMostConsistent,
    getWeeklyRates,
    getDayOfWeekStats,
  };
}
