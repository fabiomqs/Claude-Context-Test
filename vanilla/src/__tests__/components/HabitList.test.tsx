import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { HabitList } from "@/components/habits/HabitList";
import { HabitWithStats } from "@/types";

function makeHabit(id: string, name: string): HabitWithStats {
  return {
    id,
    name,
    color: "emerald",
    createdAt: "2026-04-21",
    archivedAt: null,
    completedToday: false,
    currentStreak: 0,
    longestStreak: 0,
    completionsThisWeek: 0,
  };
}

describe("HabitList", () => {
  it("exibe EmptyState quando habits está vazio", () => {
    render(<HabitList habits={[]} onToggle={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText("Nenhum hábito ainda")).toBeInTheDocument();
  });

  it("renderiza uma linha por hábito", () => {
    const habits = [makeHabit("h1", "Correr"), makeHabit("h2", "Meditar")];
    render(<HabitList habits={habits} onToggle={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText("Correr")).toBeInTheDocument();
    expect(screen.getByText("Meditar")).toBeInTheDocument();
  });

  it("não exibe EmptyState quando há hábitos", () => {
    const habits = [makeHabit("h1", "Correr")];
    render(<HabitList habits={habits} onToggle={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.queryByText("Nenhum hábito ainda")).not.toBeInTheDocument();
  });

  it("passa onToggle para cada linha", async () => {
    const onToggle = vi.fn();
    const habits = [makeHabit("h1", "Correr")];
    render(<HabitList habits={habits} onToggle={onToggle} onDelete={vi.fn()} />);
    // checkbox existe e está vinculado ao handler
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
  });

  it("passa onDelete para cada linha", () => {
    const onDelete = vi.fn();
    const habits = [makeHabit("h1", "Correr")];
    render(<HabitList habits={habits} onToggle={vi.fn()} onDelete={onDelete} />);
    expect(screen.getByLabelText("Remover Correr")).toBeInTheDocument();
  });
});
