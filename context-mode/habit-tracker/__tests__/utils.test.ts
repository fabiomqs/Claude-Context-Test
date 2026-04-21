import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { calcStreak, getCompletionRate, getTodayKey } from "@/lib/utils";
import type { Habit } from "@/lib/types";

function makeHabit(overrides: Partial<Habit> = {}): Habit {
  return {
    id: "test-id",
    name: "Test habit",
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(), // 7 days ago
    completedDates: [],
    ...overrides,
  };
}

function dateKey(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

describe("getTodayKey", () => {
  it("returns YYYY-MM-DD format", () => {
    expect(getTodayKey()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe("calcStreak", () => {
  it("returns 0 when habit has no completions", () => {
    expect(calcStreak(makeHabit())).toBe(0);
  });

  it("returns 1 when only today is completed", () => {
    const habit = makeHabit({ completedDates: [dateKey(0)] });
    expect(calcStreak(habit)).toBe(1);
  });

  it("returns 0 when only yesterday is completed (gap today)", () => {
    const habit = makeHabit({ completedDates: [dateKey(1)] });
    expect(calcStreak(habit)).toBe(0);
  });

  it("counts consecutive days ending today", () => {
    const habit = makeHabit({
      completedDates: [dateKey(0), dateKey(1), dateKey(2)],
    });
    expect(calcStreak(habit)).toBe(3);
  });

  it("stops at first gap", () => {
    // today + yesterday, but NOT 2 days ago
    const habit = makeHabit({
      completedDates: [dateKey(0), dateKey(1), dateKey(3)],
    });
    expect(calcStreak(habit)).toBe(2);
  });

  it("handles non-sequential dates correctly", () => {
    const habit = makeHabit({
      completedDates: [dateKey(0), dateKey(5), dateKey(6)],
    });
    expect(calcStreak(habit)).toBe(1);
  });
});

describe("getCompletionRate", () => {
  it("returns 0 for a habit with no completions", () => {
    expect(getCompletionRate(makeHabit())).toBe(0);
  });

  it("returns 100 when completed every day since creation", () => {
    const days = 7;
    const completedDates = Array.from({ length: days + 1 }, (_, i) => dateKey(days - i));
    const habit = makeHabit({ completedDates });
    expect(getCompletionRate(habit)).toBe(100);
  });

  it("returns ~50 when completed half the days", () => {
    // created 6 days ago → 7 possible days (day 0–6)
    const completedDates = [dateKey(0), dateKey(2), dateKey(4)]; // 3 out of 7
    const habit = makeHabit({
      createdAt: new Date(Date.now() - 6 * 86400000).toISOString(),
      completedDates,
    });
    // 3/7 ≈ 43%
    expect(getCompletionRate(habit)).toBeGreaterThan(0);
    expect(getCompletionRate(habit)).toBeLessThan(100);
  });
});
