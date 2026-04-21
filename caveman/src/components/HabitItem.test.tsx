import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HabitItem from "./HabitItem";
import { Habit } from "@/types/habit";

const baseHabit: Habit = {
  id: "1",
  name: "Exercício",
  completedDates: [],
  createdAt: "2026-01-01",
  color: "violet",
};

function setup(props: Partial<Parameters<typeof HabitItem>[0]> = {}) {
  const onToggle = vi.fn();
  const onRemove = vi.fn();
  render(
    <HabitItem
      habit={baseHabit}
      done={false}
      streak={0}
      onToggle={onToggle}
      onRemove={onRemove}
      {...props}
    />
  );
  return { onToggle, onRemove };
}

describe("HabitItem", () => {
  it("renders habit name", () => {
    setup();
    expect(screen.getByText("Exercício")).toBeInTheDocument();
  });

  it("calls onToggle when checkbox clicked", async () => {
    const user = userEvent.setup();
    const { onToggle } = setup();
    const buttons = screen.getAllByRole("button");
    await user.click(buttons[0]); // first button = checkbox
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it("calls onRemove when delete button clicked", async () => {
    const user = userEvent.setup();
    const { onRemove } = setup();
    const buttons = screen.getAllByRole("button");
    await user.click(buttons[buttons.length - 1]); // last button = delete
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it("shows streak badge when streak > 0", () => {
    setup({ streak: 5 });
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("hides streak badge when streak is 0", () => {
    setup({ streak: 0 });
    expect(screen.queryByText("0")).not.toBeInTheDocument();
  });

  it("applies line-through style when done", () => {
    setup({ done: true });
    const name = screen.getByText("Exercício");
    expect(name).toHaveClass("line-through");
  });

  it("no line-through when not done", () => {
    setup({ done: false });
    const name = screen.getByText("Exercício");
    expect(name).not.toHaveClass("line-through");
  });
});
