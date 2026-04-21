import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useHabits } from "@/hooks/useHabits";

// Fix getTodayString so streak assertions are deterministic
vi.mock("@/lib/dateUtils", async (importOriginal) => {
  const original = await importOriginal<typeof import("@/lib/dateUtils")>();
  return { ...original, getTodayString: () => "2026-04-21" };
});

beforeEach(() => localStorage.clear());

describe("useHabits — estado inicial", () => {
  it("começa com lista de hábitos vazia", () => {
    const { result } = renderHook(() => useHabits());
    expect(result.current.habits).toHaveLength(0);
  });

  it("todayCompletionCount e totalActiveHabits começam em 0", () => {
    const { result } = renderHook(() => useHabits());
    expect(result.current.todayCompletionCount).toBe(0);
    expect(result.current.totalActiveHabits).toBe(0);
  });
});

describe("useHabits — addHabit", () => {
  it("adiciona um hábito à lista", () => {
    const { result } = renderHook(() => useHabits());
    act(() => { result.current.addHabit("Correr", "emerald"); });
    expect(result.current.habits).toHaveLength(1);
    expect(result.current.habits[0].name).toBe("Correr");
    expect(result.current.habits[0].color).toBe("emerald");
  });

  it("trimeia o nome do hábito", () => {
    const { result } = renderHook(() => useHabits());
    act(() => { result.current.addHabit("  Meditar  ", "violet"); });
    expect(result.current.habits[0].name).toBe("Meditar");
  });

  it("adicionar dois hábitos resulta em totalActiveHabits = 2", () => {
    const { result } = renderHook(() => useHabits());
    act(() => {
      result.current.addHabit("Correr", "emerald");
      result.current.addHabit("Ler", "amber");
    });
    expect(result.current.totalActiveHabits).toBe(2);
  });

  it("hábito criado recebe id único", () => {
    const { result } = renderHook(() => useHabits());
    act(() => {
      result.current.addHabit("Correr", "emerald");
      result.current.addHabit("Ler", "amber");
    });
    const [h1, h2] = result.current.habits;
    expect(h1.id).not.toBe(h2.id);
  });
});

describe("useHabits — deleteHabit", () => {
  it("remove hábito da lista ativa (soft-delete)", () => {
    const { result } = renderHook(() => useHabits());
    act(() => { result.current.addHabit("Correr", "emerald"); });
    const id = result.current.habits[0].id;
    act(() => { result.current.deleteHabit(id); });
    expect(result.current.habits).toHaveLength(0);
    expect(result.current.totalActiveHabits).toBe(0);
  });

  it("sets archivedAt no localStorage ao deletar", () => {
    const { result } = renderHook(() => useHabits());
    act(() => { result.current.addHabit("Yoga", "rose"); });
    const id = result.current.habits[0].id;
    act(() => { result.current.deleteHabit(id); });

    const stored = JSON.parse(localStorage.getItem("habit-tracker-v1")!);
    const habit = stored.habits.find((h: { id: string }) => h.id === id);
    expect(habit.archivedAt).toBe("2026-04-21");
  });

  it("deletar um de dois hábitos deixa o outro intacto", () => {
    const { result } = renderHook(() => useHabits());
    act(() => {
      result.current.addHabit("Correr", "emerald");
      result.current.addHabit("Ler", "amber");
    });
    const idCorrer = result.current.habits[0].id;
    act(() => { result.current.deleteHabit(idCorrer); });
    expect(result.current.habits).toHaveLength(1);
    expect(result.current.habits[0].name).toBe("Ler");
  });
});

describe("useHabits — toggleHabit", () => {
  it("marca hábito como feito (completedToday = true)", () => {
    const { result } = renderHook(() => useHabits());
    act(() => { result.current.addHabit("Correr", "emerald"); });
    const id = result.current.habits[0].id;
    act(() => { result.current.toggleHabit(id); });
    expect(result.current.habits[0].completedToday).toBe(true);
  });

  it("incrementa todayCompletionCount ao marcar", () => {
    const { result } = renderHook(() => useHabits());
    act(() => { result.current.addHabit("Correr", "emerald"); });
    const id = result.current.habits[0].id;
    act(() => { result.current.toggleHabit(id); });
    expect(result.current.todayCompletionCount).toBe(1);
  });

  it("desmarca hábito ao chamar toggle duas vezes", () => {
    const { result } = renderHook(() => useHabits());
    act(() => { result.current.addHabit("Correr", "emerald"); });
    const id = result.current.habits[0].id;
    act(() => { result.current.toggleHabit(id); });
    act(() => { result.current.toggleHabit(id); });
    expect(result.current.habits[0].completedToday).toBe(false);
    expect(result.current.todayCompletionCount).toBe(0);
  });

  it("currentStreak = 1 após marcar hábito hoje", () => {
    const { result } = renderHook(() => useHabits());
    act(() => { result.current.addHabit("Correr", "emerald"); });
    const id = result.current.habits[0].id;
    act(() => { result.current.toggleHabit(id); });
    expect(result.current.habits[0].currentStreak).toBe(1);
  });

  it("currentStreak = 0 após desmarcar", () => {
    const { result } = renderHook(() => useHabits());
    act(() => { result.current.addHabit("Correr", "emerald"); });
    const id = result.current.habits[0].id;
    act(() => { result.current.toggleHabit(id); });
    act(() => { result.current.toggleHabit(id); });
    expect(result.current.habits[0].currentStreak).toBe(0);
  });
});

describe("useHabits — persistência", () => {
  it("persiste hábito no localStorage após addHabit", () => {
    const { result } = renderHook(() => useHabits());
    act(() => { result.current.addHabit("Correr", "emerald"); });
    const stored = JSON.parse(localStorage.getItem("habit-tracker-v1")!);
    expect(stored.habits).toHaveLength(1);
    expect(stored.habits[0].name).toBe("Correr");
  });

  it("persiste toggle no localStorage", () => {
    const { result } = renderHook(() => useHabits());
    act(() => { result.current.addHabit("Correr", "emerald"); });
    const id = result.current.habits[0].id;
    act(() => { result.current.toggleHabit(id); });
    const stored = JSON.parse(localStorage.getItem("habit-tracker-v1")!);
    expect(stored.logs[0].completedHabitIds).toContain(id);
  });
});
