import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddHabitForm from "./AddHabitForm";

function setup() {
  const onAdd = vi.fn();
  render(<AddHabitForm onAdd={onAdd} />);
  return { onAdd };
}

describe("AddHabitForm", () => {
  it("add button disabled when input is empty", () => {
    setup();
    expect(screen.getByRole("button", { name: /adicionar/i })).toBeDisabled();
  });

  it("add button enabled after typing", async () => {
    const user = userEvent.setup();
    setup();
    await user.type(screen.getByPlaceholderText(/nome do hábito/i), "Leitura");
    expect(screen.getByRole("button", { name: /adicionar/i })).toBeEnabled();
  });

  it("calls onAdd with name and default color on submit", async () => {
    const user = userEvent.setup();
    const { onAdd } = setup();
    await user.type(screen.getByPlaceholderText(/nome do hábito/i), "Meditação");
    await user.click(screen.getByRole("button", { name: /adicionar/i }));
    expect(onAdd).toHaveBeenCalledWith("Meditação", "violet");
  });

  it("clears input after submit", async () => {
    const user = userEvent.setup();
    setup();
    const input = screen.getByPlaceholderText(/nome do hábito/i);
    await user.type(input, "Água");
    await user.click(screen.getByRole("button", { name: /adicionar/i }));
    expect(input).toHaveValue("");
  });

  it("trims whitespace before calling onAdd", async () => {
    const user = userEvent.setup();
    const { onAdd } = setup();
    await user.type(screen.getByPlaceholderText(/nome do hábito/i), "  Yoga  ");
    await user.click(screen.getByRole("button", { name: /adicionar/i }));
    expect(onAdd).toHaveBeenCalledWith("Yoga", "violet");
  });

  it("does not submit on empty whitespace", async () => {
    const user = userEvent.setup();
    const { onAdd } = setup();
    await user.type(screen.getByPlaceholderText(/nome do hábito/i), "   ");
    expect(screen.getByRole("button", { name: /adicionar/i })).toBeDisabled();
    expect(onAdd).not.toHaveBeenCalled();
  });
});
