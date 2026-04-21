"use client";

import { Habit } from "@/lib/types";
import HabitItem from "./HabitItem";

interface Props {
  habits: Habit[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function HabitList({ habits, onToggle, onDelete }: Props) {
  if (habits.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-4xl mb-3">🌱</p>
        <p className="text-sm">Nenhum hábito ainda. Adicione o primeiro!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {habits.map((habit) => (
        <HabitItem key={habit.id} habit={habit} onToggle={onToggle} onDelete={onDelete} />
      ))}
    </div>
  );
}
