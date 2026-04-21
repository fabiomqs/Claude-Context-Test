"use client";

import { Trash2, Flame } from "lucide-react";
import { Habit } from "@/types/habit";

const colorMap: Record<string, { check: string; streak: string; border: string }> = {
  violet: { check: "bg-violet-500", streak: "bg-violet-500/20 text-violet-400", border: "border-violet-500/40" },
  emerald: { check: "bg-emerald-500", streak: "bg-emerald-500/20 text-emerald-400", border: "border-emerald-500/40" },
  sky: { check: "bg-sky-500", streak: "bg-sky-500/20 text-sky-400", border: "border-sky-500/40" },
  rose: { check: "bg-rose-500", streak: "bg-rose-500/20 text-rose-400", border: "border-rose-500/40" },
  amber: { check: "bg-amber-500", streak: "bg-amber-500/20 text-amber-400", border: "border-amber-500/40" },
};

interface Props {
  habit: Habit;
  done: boolean;
  streak: number;
  onToggle: () => void;
  onRemove: () => void;
}

export default function HabitItem({ habit, done, streak, onToggle, onRemove }: Props) {
  const c = colorMap[habit.color] ?? colorMap.violet;

  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-xl border bg-white/[0.03] transition-all duration-200 ${
        done ? `${c.border} bg-white/[0.05]` : "border-white/5"
      }`}
    >
      <button
        onClick={onToggle}
        className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all duration-200 ${
          done
            ? `${c.check} border-transparent`
            : "border-white/20 hover:border-white/40"
        }`}
      >
        {done && (
          <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      <span className={`flex-1 text-sm font-medium transition-colors duration-200 ${done ? "text-white/50 line-through" : "text-white/90"}`}>
        {habit.name}
      </span>

      {streak > 0 && (
        <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${c.streak}`}>
          <Flame className="w-3 h-3" />
          {streak}
        </span>
      )}

      <button
        onClick={onRemove}
        className="text-white/20 hover:text-rose-400 transition-colors duration-150 ml-1"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
