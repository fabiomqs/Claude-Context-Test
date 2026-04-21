import { describe, it, expect } from "vitest";
import { deriveWeeklyData } from "@/lib/chartData";
import { HabitStore } from "@/types";

const TODAY = "2026-04-21";

function makeStore(overrides: Partial<HabitStore> = {}): HabitStore {
  return { version: 1, habits: [], logs: [], ...overrides };
}

describe("deriveWeeklyData", () => {
  it("returns 7 entries", () => {
    const data = deriveWeeklyData(makeStore(), TODAY);
    expect(data).toHaveLength(7);
  });

  it("last entry is today", () => {
    const data = deriveWeeklyData(makeStore(), TODAY);
    expect(data[6].date).toBe(TODAY);
  });

  it("first entry is 6 days ago", () => {
    const data = deriveWeeklyData(makeStore(), TODAY);
    expect(data[0].date).toBe("2026-04-15");
  });

  it("counts completions for active habits only", () => {
    const store = makeStore({
      habits: [
        { id: "h1", name: "Run", color: "emerald", createdAt: "2026-04-01", archivedAt: null },
        { id: "h2", name: "Read", color: "violet", createdAt: "2026-04-01", archivedAt: null },
      ],
      logs: [{ date: TODAY, completedHabitIds: ["h1", "h2"] }],
    });
    const data = deriveWeeklyData(store, TODAY);
    expect(data[6].completions).toBe(2);
    expect(data[6].total).toBe(2);
  });

  it("excludes habits not yet created on a given date", () => {
    const store = makeStore({
      habits: [
        { id: "h1", name: "Run", color: "emerald", createdAt: TODAY, archivedAt: null },
      ],
      logs: [{ date: "2026-04-15", completedHabitIds: ["h1"] }],
    });
    const data = deriveWeeklyData(store, TODAY);
    // habit created today, so on 2026-04-15 it doesn't exist
    expect(data[0].total).toBe(0);
    expect(data[0].completions).toBe(0);
    expect(data[6].total).toBe(1);
  });

  it("excludes archived habits on dates after archival", () => {
    const store = makeStore({
      habits: [
        { id: "h1", name: "Run", color: "emerald", createdAt: "2026-04-01", archivedAt: "2026-04-19" },
      ],
      logs: [{ date: TODAY, completedHabitIds: ["h1"] }],
    });
    const data = deriveWeeklyData(store, TODAY);
    // archived before today, should not count
    expect(data[6].total).toBe(0);
    expect(data[6].completions).toBe(0);
  });
});
