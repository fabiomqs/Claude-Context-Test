"use client";

import { Habit } from "@/types/habit";

interface Props {
  habits: Habit[];
  todayProgress: number;
  getStreak: (h: Habit) => number;
}

export default function StatsHeader({ habits, todayProgress, getStreak }: Props) {
  const bestStreak = habits.length
    ? Math.max(...habits.map(getStreak))
    : 0;

  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      <div className="card text-center">
        <p className="text-3xl font-bold text-white">{habits.length}</p>
        <p className="text-xs text-white/40 mt-1 uppercase tracking-widest">Hábitos</p>
      </div>
      <div className="card text-center">
        <p className="text-3xl font-bold text-white">{todayProgress}%</p>
        <p className="text-xs text-white/40 mt-1 uppercase tracking-widest">Hoje</p>
      </div>
      <div className="card text-center">
        <p className="text-3xl font-bold text-white">{bestStreak}</p>
        <p className="text-xs text-white/40 mt-1 uppercase tracking-widest">Melhor Streak</p>
      </div>
    </div>
  );
}
