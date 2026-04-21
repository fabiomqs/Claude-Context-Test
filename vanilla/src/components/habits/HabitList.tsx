import { HabitWithStats } from "@/types";
import { HabitRow } from "@/components/habits/HabitRow";
import { EmptyState } from "@/components/ui/EmptyState";

interface HabitListProps {
  habits: HabitWithStats[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function HabitList({ habits, onToggle, onDelete }: HabitListProps) {
  if (habits.length === 0) return <EmptyState />;

  return (
    <div className="flex flex-col divide-y divide-gray-800/50">
      {habits.map((habit) => (
        <HabitRow
          key={habit.id}
          habit={habit}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
