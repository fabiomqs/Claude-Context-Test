import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useHabits } from "./useHabits";

const BASE_DATE = "2026-01-15T12:00:00Z";

function setDay(isoDate: string) {
  vi.setSystemTime(new Date(isoDate));
}

beforeEach(() => {
  localStorage.clear();
  vi.useFakeTimers();
  setDay(BASE_DATE);
});

afterEach(() => {
  vi.useRealTimers();
});

// ─── addHabit ────────────────────────────────────────────────────────────────

describe("addHabit", () => {
  it("adds habit with correct name and color", () => {
    const { result } = renderHook(() => useHabits());
    act(() => result.current.addHabit("Exercício", "violet"));

    expect(result.current.habits).toHaveLength(1);
    expect(result.current.habits[0].name).toBe("Exercício");
    expect(result.current.habits[0].color).toBe("violet");
    expect(result.current.habits[0].completedDates).toEqual([]);
  });

  it("persists to localStorage", () => {
    const { result } = renderHook(() => useHabits());
    act(() => result.current.addHabit("Leitura", "emerald"));

    const stored = JSON.parse(localStorage.getItem("habits-v1")!);
    expect(stored).toHaveLength(1);
    expect(stored[0].name).toBe("Leitura");
  });

  it("multiple habits are independent", () => {
    const { result } = renderHook(() => useHabits());
    act(() => {
      result.current.addHabit("A", "violet");
      result.current.addHabit("B", "rose");
    });
    expect(result.current.habits).toHaveLength(2);
    expect(result.current.habits[0].id).not.toBe(result.current.habits[1].id);
  });
});

// ─── removeHabit ─────────────────────────────────────────────────────────────

describe("removeHabit", () => {
  it("removes correct habit by id", () => {
    const { result } = renderHook(() => useHabits());
    act(() => {
      result.current.addHabit("Meditação", "sky");
      result.current.addHabit("Água", "rose");
    });
    const idToRemove = result.current.habits[0].id;
    act(() => result.current.removeHabit(idToRemove));

    expect(result.current.habits).toHaveLength(1);
    expect(result.current.habits[0].name).toBe("Água");
  });

  it("removing non-existent id changes nothing", () => {
    const { result } = renderHook(() => useHabits());
    act(() => result.current.addHabit("A", "violet"));
    act(() => result.current.removeHabit("nonexistent"));

    expect(result.current.habits).toHaveLength(1);
  });
});

// ─── toggleToday ─────────────────────────────────────────────────────────────

describe("toggleToday", () => {
  it("marks habit as done today", () => {
    const { result } = renderHook(() => useHabits());
    act(() => result.current.addHabit("Exercício", "violet"));
    const id = result.current.habits[0].id;

    act(() => result.current.toggleToday(id));

    expect(result.current.habits[0].completedDates).toContain("2026-01-15");
    expect(result.current.isTodayDone(result.current.habits[0])).toBe(true);
  });

  it("unmarks if already done (toggle off)", () => {
    const { result } = renderHook(() => useHabits());
    act(() => result.current.addHabit("Exercício", "violet"));
    const id = result.current.habits[0].id;

    act(() => result.current.toggleToday(id));
    act(() => result.current.toggleToday(id));

    expect(result.current.habits[0].completedDates).not.toContain("2026-01-15");
    expect(result.current.isTodayDone(result.current.habits[0])).toBe(false);
  });

  it("only affects targeted habit", () => {
    const { result } = renderHook(() => useHabits());
    act(() => {
      result.current.addHabit("A", "violet");
      result.current.addHabit("B", "emerald");
    });
    const idA = result.current.habits[0].id;

    act(() => result.current.toggleToday(idA));

    expect(result.current.isTodayDone(result.current.habits[0])).toBe(true);
    expect(result.current.isTodayDone(result.current.habits[1])).toBe(false);
  });
});

// ─── getStreak ────────────────────────────────────────────────────────────────

describe("getStreak", () => {
  it("returns 0 with no completions", () => {
    const { result } = renderHook(() => useHabits());
    act(() => result.current.addHabit("A", "violet"));

    expect(result.current.getStreak(result.current.habits[0])).toBe(0);
  });

  it("returns 1 for only today", () => {
    const { result } = renderHook(() => useHabits());
    act(() => result.current.addHabit("A", "violet"));
    act(() => result.current.toggleToday(result.current.habits[0].id));

    expect(result.current.getStreak(result.current.habits[0])).toBe(1);
  });

  it("returns 0 when only yesterday completed (not today)", () => {
    const { result } = renderHook(() => useHabits());
    act(() => result.current.addHabit("A", "violet"));

    setDay("2026-01-14T12:00:00Z");
    act(() => result.current.toggleToday(result.current.habits[0].id));

    setDay("2026-01-15T12:00:00Z");
    expect(result.current.getStreak(result.current.habits[0])).toBe(0);
  });

  it("counts 3 consecutive days", () => {
    const { result } = renderHook(() => useHabits());
    act(() => result.current.addHabit("A", "violet"));
    const id = result.current.habits[0].id;

    setDay("2026-01-13T12:00:00Z");
    act(() => result.current.toggleToday(id));

    setDay("2026-01-14T12:00:00Z");
    act(() => result.current.toggleToday(id));

    setDay("2026-01-15T12:00:00Z");
    act(() => result.current.toggleToday(id));

    expect(result.current.getStreak(result.current.habits[0])).toBe(3);
  });

  it("breaks streak on gap", () => {
    const { result } = renderHook(() => useHabits());
    act(() => result.current.addHabit("A", "violet"));
    const id = result.current.habits[0].id;

    // Jan 13 done, Jan 14 skipped, Jan 15 done → streak = 1
    setDay("2026-01-13T12:00:00Z");
    act(() => result.current.toggleToday(id));

    setDay("2026-01-15T12:00:00Z");
    act(() => result.current.toggleToday(id));

    expect(result.current.getStreak(result.current.habits[0])).toBe(1);
  });

  it("long streak of 7 days", () => {
    const { result } = renderHook(() => useHabits());
    act(() => result.current.addHabit("A", "violet"));
    const id = result.current.habits[0].id;

    for (let i = 6; i >= 0; i--) {
      setDay(`2026-01-${String(15 - i).padStart(2, "0")}T12:00:00Z`);
      act(() => result.current.toggleToday(id));
    }

    setDay("2026-01-15T12:00:00Z");
    expect(result.current.getStreak(result.current.habits[0])).toBe(7);
  });
});

// ─── todayProgress ────────────────────────────────────────────────────────────

describe("todayProgress", () => {
  it("returns 0 with no habits", () => {
    const { result } = renderHook(() => useHabits());
    expect(result.current.todayProgress).toBe(0);
  });

  it("returns 50 when half done", () => {
    const { result } = renderHook(() => useHabits());
    act(() => {
      result.current.addHabit("A", "violet");
      result.current.addHabit("B", "emerald");
    });
    act(() => result.current.toggleToday(result.current.habits[0].id));

    expect(result.current.todayProgress).toBe(50);
  });

  it("returns 100 when all done", () => {
    const { result } = renderHook(() => useHabits());
    act(() => {
      result.current.addHabit("A", "violet");
      result.current.addHabit("B", "emerald");
    });
    act(() => {
      result.current.toggleToday(result.current.habits[0].id);
      result.current.toggleToday(result.current.habits[1].id);
    });

    expect(result.current.todayProgress).toBe(100);
  });
});
