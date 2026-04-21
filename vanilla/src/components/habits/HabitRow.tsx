"use client";

import { HabitWithStats, COLOR_MAP } from "@/types";
import { Checkbox } from "@/components/ui/Checkbox";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface HabitRowProps {
  habit: HabitWithStats;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function HabitRow({ habit, onToggle, onDelete }: HabitRowProps) {
  const hex = COLOR_MAP[habit.color] ?? COLOR_MAP.emerald;

  return (
    <div className="group flex items-center gap-3 py-3 px-4 rounded-xl hover:bg-gray-800/50 transition-colors duration-150">
      <Checkbox
        checked={habit.completedToday}
        onChange={() => onToggle(habit.id)}
        color={habit.color}
        label={`Marcar ${habit.name} como feito`}
      />

      <div
        className="w-2 h-2 rounded-full flex-shrink-0"
        style={{ backgroundColor: hex }}
      />

      <span
        className={`flex-1 text-sm font-medium transition-all duration-200 ${
          habit.completedToday
            ? "line-through text-gray-500"
            : "text-gray-100"
        }`}
      >
        {habit.name}
      </span>

      <Badge count={habit.currentStreak} />

      <Button
        variant="danger"
        onClick={() => onDelete(habit.id)}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-xs"
        aria-label={`Remover ${habit.name}`}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </Button>
    </div>
  );
}
