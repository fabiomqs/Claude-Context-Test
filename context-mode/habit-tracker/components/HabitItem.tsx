"use client";

import { Habit } from "@/lib/types";
import { calcStreak, getTodayKey } from "@/lib/utils";

interface Props {
  habit: Habit;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function HabitItem({ habit, onToggle, onDelete }: Props) {
  const today = getTodayKey();
  const done = habit.completedDates.includes(today);
  const streak = calcStreak(habit);

  return (
    <div className="flex items-center gap-4 bg-gray-800 rounded-xl px-4 py-3.5 group hover:bg-gray-750 transition-colors">
      <button
        onClick={() => onToggle(habit.id)}
        className={`w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
          done
            ? "bg-indigo-600 border-indigo-600"
            : "border-gray-600 hover:border-indigo-500"
        }`}
      >
        {done && (
          <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      <span className={`flex-1 text-base ${done ? "text-gray-400 line-through" : "text-gray-100"}`}>
        {habit.name}
      </span>

      {streak > 0 && (
        <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-600 to-orange-500 text-white">
          🔥 {streak}d
        </span>
      )}

      <button
        onClick={() => onDelete(habit.id)}
        className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 transition-all"
        aria-label="Remover hábito"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
