import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Home from "@/app/page";

// Next.js stubs
vi.mock("next/navigation", () => ({ usePathname: () => "/" }));
vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

// Stable UUID so snapshots don't drift
let uuidCounter = 0;
vi.mock("uuid", () => ({ v4: () => `uuid-${++uuidCounter}` }));

beforeEach(() => {
  uuidCounter = 0;
  localStorage.clear();
});

describe("Habit list — add", () => {
  it("renders empty state initially", () => {
    render(<Home />);
    expect(screen.getByText(/Nenhum hábito ainda/i)).toBeInTheDocument();
  });

  it("adds a habit when form is submitted", async () => {
    const user = userEvent.setup();
    render(<Home />);

    await user.type(screen.getByPlaceholderText(/Novo hábito/i), "Beber água");
    await user.click(screen.getByRole("button", { name: /Adicionar/i }));

    expect(screen.getByText("Beber água")).toBeInTheDocument();
  });

  it("clears the input after adding", async () => {
    const user = userEvent.setup();
    render(<Home />);

    const input = screen.getByPlaceholderText(/Novo hábito/i);
    await user.type(input, "Meditar");
    await user.click(screen.getByRole("button", { name: /Adicionar/i }));

    expect(input).toHaveValue("");
  });

  it("does not add a blank habit", async () => {
    const user = userEvent.setup();
    render(<Home />);

    await user.type(screen.getByPlaceholderText(/Novo hábito/i), "   ");
    await user.click(screen.getByRole("button", { name: /Adicionar/i }));

    expect(screen.getByText(/Nenhum hábito ainda/i)).toBeInTheDocument();
  });

  it("persists habits to localStorage", async () => {
    const user = userEvent.setup();
    render(<Home />);

    await user.type(screen.getByPlaceholderText(/Novo hábito/i), "Correr");
    await user.click(screen.getByRole("button", { name: /Adicionar/i }));

    const stored = JSON.parse(localStorage.getItem("habits") ?? "[]");
    expect(stored).toHaveLength(1);
    expect(stored[0].name).toBe("Correr");
  });
});

describe("Habit list — remove", () => {
  it("removes a habit when delete button is clicked", async () => {
    const user = userEvent.setup();
    render(<Home />);

    await user.type(screen.getByPlaceholderText(/Novo hábito/i), "Ler");
    await user.click(screen.getByRole("button", { name: /Adicionar/i }));

    expect(screen.getByText("Ler")).toBeInTheDocument();

    const deleteBtn = screen.getByRole("button", { name: /Remover hábito/i });
    await user.click(deleteBtn);

    expect(screen.queryByText("Ler")).not.toBeInTheDocument();
  });
});

describe("Habit list — toggle done", () => {
  it("marks a habit as done for today", async () => {
    const user = userEvent.setup();
    render(<Home />);

    await user.type(screen.getByPlaceholderText(/Novo hábito/i), "Meditar");
    await user.click(screen.getByRole("button", { name: /Adicionar/i }));

    // Checkbox button is the toggle (no label, identified by position)
    const checkboxes = screen.getAllByRole("button").filter(
      (b) => !b.textContent?.includes("Adicionar") && !b.getAttribute("aria-label")
    );
    await user.click(checkboxes[0]);

    // The habit name should be struck through (line-through class)
    const habitName = screen.getByText("Meditar");
    expect(habitName.className).toContain("line-through");
  });

  it("unmarks a habit when toggled twice", async () => {
    const user = userEvent.setup();
    render(<Home />);

    await user.type(screen.getByPlaceholderText(/Novo hábito/i), "Yoga");
    await user.click(screen.getByRole("button", { name: /Adicionar/i }));

    const checkboxes = screen.getAllByRole("button").filter(
      (b) => !b.textContent?.includes("Adicionar") && !b.getAttribute("aria-label")
    );
    await user.click(checkboxes[0]);
    await user.click(checkboxes[0]);

    const habitName = screen.getByText("Yoga");
    expect(habitName.className).not.toContain("line-through");
  });

  it("saves completed date to localStorage when toggled", async () => {
    const user = userEvent.setup();
    render(<Home />);

    await user.type(screen.getByPlaceholderText(/Novo hábito/i), "Exercitar");
    await user.click(screen.getByRole("button", { name: /Adicionar/i }));

    const checkboxes = screen.getAllByRole("button").filter(
      (b) => !b.textContent?.includes("Adicionar") && !b.getAttribute("aria-label")
    );
    await user.click(checkboxes[0]);

    const stored = JSON.parse(localStorage.getItem("habits") ?? "[]");
    const today = new Date().toISOString().slice(0, 10);
    expect(stored[0].completedDates).toContain(today);
  });
});
