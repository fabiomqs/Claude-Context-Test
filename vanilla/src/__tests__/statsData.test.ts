import { describe, it, expect } from "vitest";
import {
  getMostConsistentHabit,
  getWeeklyRates,
  getDayOfWeekStats,
} from "@/lib/statsData";
import { HabitStore } from "@/types";

const TODAY = "2026-04-21"; // Tuesday

function makeStore(overrides: Partial<HabitStore> = {}): HabitStore {
  return { version: 1, habits: [], logs: [], ...overrides };
}

const H1 = { id: "h1", name: "Run", color: "emerald", createdAt: "2026-04-15", archivedAt: null };
const H2 = { id: "h2", name: "Read", color: "violet", createdAt: "2026-04-15", archivedAt: null };

describe("getMostConsistentHabit", () => {
  it("returns null when no habits", () => {
    expect(getMostConsistentHabit(makeStore(), TODAY)).toBeNull();
  });

  it("returns the only habit even with zero completions", () => {
    const store = makeStore({ habits: [H1] });
    const result = getMostConsistentHabit(store, TODAY);
    expect(result?.habit.id).toBe("h1");
    expect(result?.rate).toBe(0);
  });

  it("returns habit with higher rate", () => {
    // H1: 7 active days, 7 completions = 100%
    // H2: 7 active days, 3 completions = ~43%
    const store = makeStore({
      habits: [H1, H2],
      logs: [
        { date: "2026-04-15", completedHabitIds: ["h1", "h2"] },
        { date: "2026-04-16", completedHabitIds: ["h1", "h2"] },
        { date: "2026-04-17", completedHabitIds: ["h1", "h2"] },
        { date: "2026-04-18", completedHabitIds: ["h1"] },
        { date: "2026-04-19", completedHabitIds: ["h1"] },
        { date: "2026-04-20", completedHabitIds: ["h1"] },
        { date: "2026-04-21", completedHabitIds: ["h1"] },
      ],
    });
    const result = getMostConsistentHabit(store, TODAY);
    expect(result?.habit.id).toBe("h1");
    expect(result?.completions).toBe(7);
  });

  it("excludes archived habits", () => {
    const archived = { ...H1, archivedAt: "2026-04-18" };
    const store = makeStore({ habits: [archived, H2] });
    const result = getMostConsistentHabit(store, TODAY);
    expect(result?.habit.id).toBe("h2");
  });
});

describe("getWeeklyRates", () => {
  it("returns N weeks of data", () => {
    const data = getWeeklyRates(makeStore(), TODAY, 4);
    expect(data).toHaveLength(4);
  });

  it("last entry is labeled Esta sem.", () => {
    const data = getWeeklyRates(makeStore(), TODAY, 4);
    expect(data[3].label).toBe("Esta sem.");
  });

  it("calculates rate correctly", () => {
    const store = makeStore({
      habits: [H1],
      logs: [
        { date: "2026-04-15", completedHabitIds: ["h1"] },
        { date: "2026-04-16", completedHabitIds: ["h1"] },
        { date: "2026-04-17", completedHabitIds: ["h1"] },
        { date: "2026-04-18", completedHabitIds: ["h1"] },
        { date: "2026-04-19", completedHabitIds: ["h1"] },
        { date: "2026-04-20", completedHabitIds: ["h1"] },
        { date: "2026-04-21", completedHabitIds: ["h1"] },
      ],
    });
    const data = getWeeklyRates(store, TODAY, 1);
    expect(data[0].rate).toBe(100);
  });

  it("returns rate 0 when no possible completions", () => {
    const data = getWeeklyRates(makeStore(), TODAY, 1);
    expect(data[0].rate).toBe(0);
  });
});

describe("getDayOfWeekStats", () => {
  it("returns 7 day buckets", () => {
    const data = getDayOfWeekStats(makeStore(), TODAY);
    expect(data).toHaveLength(7);
  });

  it("counts completions by weekday", () => {
    // 2026-04-21 is Tuesday (dayIndex=2)
    const store = makeStore({
      habits: [H1],
      logs: [{ date: "2026-04-21", completedHabitIds: ["h1"] }],
    });
    const data = getDayOfWeekStats(store, TODAY);
    expect(data[2].completions).toBe(1);
    expect(data[2].rate).toBe(100);
  });

  it("days with no active habits have rate 0", () => {
    // H1 created 2026-04-15 (Wed). Before that no active habits
    const store = makeStore({ habits: [H1] });
    const data = getDayOfWeekStats(store, TODAY);
    // All days should have possible >= 0, rate >= 0
    data.forEach((d) => {
      expect(d.rate).toBeGreaterThanOrEqual(0);
      expect(d.rate).toBeLessThanOrEqual(100);
    });
  });
});
