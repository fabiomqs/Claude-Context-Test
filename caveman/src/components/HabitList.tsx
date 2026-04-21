"use client";

import { Habit } from "@/types/habit";
import HabitItem from "./HabitItem";
import { ListChecks } from "lucide-react";

interface Props {
  habits: Habit[];
  isTodayDone: (h: Habit) => boolean;
  getStreak: (h: Habit) => number;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}

export default function HabitList({ habits, isTodayDone, getStreak, onToggle, onRemove }: Props) {
  if (habits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-white/20">
        <ListChecks className="w-12 h-12 mb-3" />
        <p className="text-sm">Nenhum hábito ainda. Adicione um abaixo.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {habits.map((habit) => (
        <HabitItem
          key={habit.id}
          habit={habit}
          done={isTodayDone(habit)}
          streak={getStreak(habit)}
          onToggle={() => onToggle(habit.id)}
          onRemove={() => onRemove(habit.id)}
        />
      ))}
    </div>
  );
}
