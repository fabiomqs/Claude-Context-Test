import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HabitRow } from "@/components/habits/HabitRow";
import { HabitWithStats } from "@/types";

function makeHabit(overrides: Partial<HabitWithStats> = {}): HabitWithStats {
  return {
    id: "h1",
    name: "Correr",
    color: "emerald",
    createdAt: "2026-04-21",
    archivedAt: null,
    completedToday: false,
    currentStreak: 0,
    longestStreak: 0,
    completionsThisWeek: 0,
    ...overrides,
  };
}

function setup(habit: HabitWithStats, onToggle = vi.fn(), onDelete = vi.fn()) {
  const user = userEvent.setup();
  render(<HabitRow habit={habit} onToggle={onToggle} onDelete={onDelete} />);
  return { user, onToggle, onDelete };
}

describe("HabitRow", () => {
  beforeEach(() => vi.clearAllMocks());

  it("renderiza o nome do hábito", () => {
    setup(makeHabit());
    expect(screen.getByText("Correr")).toBeInTheDocument();
  });

  it("checkbox aria-checked false quando não completado", () => {
    setup(makeHabit({ completedToday: false }));
    expect(screen.getByRole("checkbox")).toHaveAttribute("aria-checked", "false");
  });

  it("checkbox aria-checked true quando completado", () => {
    setup(makeHabit({ completedToday: true }));
    expect(screen.getByRole("checkbox")).toHaveAttribute("aria-checked", "true");
  });

  it("clicar no checkbox chama onToggle com o id correto", async () => {
    const { user, onToggle } = setup(makeHabit({ id: "h42" }));
    await user.click(screen.getByRole("checkbox"));
    expect(onToggle).toHaveBeenCalledOnce();
    expect(onToggle).toHaveBeenCalledWith("h42");
  });

  it("nome com line-through quando completedToday = true", () => {
    setup(makeHabit({ completedToday: true }));
    expect(screen.getByText("Correr")).toHaveClass("line-through");
  });

  it("nome sem line-through quando completedToday = false", () => {
    setup(makeHabit({ completedToday: false }));
    expect(screen.getByText("Correr")).not.toHaveClass("line-through");
  });

  it("badge exibe o streak count correto", () => {
    setup(makeHabit({ currentStreak: 7 }));
    expect(screen.getByText("7")).toBeInTheDocument();
  });

  it("badge exibe 0 quando sem streak", () => {
    setup(makeHabit({ currentStreak: 0 }));
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("clicar no botão deletar chama onDelete com o id correto", async () => {
    const { user, onDelete } = setup(makeHabit({ id: "h99" }));
    await user.click(screen.getByLabelText("Remover Correr"));
    expect(onDelete).toHaveBeenCalledOnce();
    expect(onDelete).toHaveBeenCalledWith("h99");
  });
});
