import { describe, it, expect } from "vitest";
import { calculateStreak, calculateLongestStreak } from "@/lib/streaks";
import { DailyLog } from "@/types";

const TODAY = "2026-04-21";
const YESTERDAY = "2026-04-20";

function makeLog(date: string, ids: string[]): DailyLog {
  return { date, completedHabitIds: ids };
}

describe("calculateStreak", () => {
  it("returns 0 when no logs", () => {
    expect(calculateStreak("h1", [], TODAY)).toBe(0);
  });

  it("returns 0 when neither today nor yesterday completed", () => {
    const logs = [makeLog("2026-04-18", ["h1"])];
    expect(calculateStreak("h1", logs, TODAY)).toBe(0);
  });

  it("returns 1 when only today completed", () => {
    const logs = [makeLog(TODAY, ["h1"])];
    expect(calculateStreak("h1", logs, TODAY)).toBe(1);
  });

  it("returns 1 when only yesterday completed (grace period)", () => {
    const logs = [makeLog(YESTERDAY, ["h1"])];
    expect(calculateStreak("h1", logs, TODAY)).toBe(1);
  });

  it("returns consecutive count including today", () => {
    const logs = [
      makeLog(TODAY, ["h1"]),
      makeLog(YESTERDAY, ["h1"]),
      makeLog("2026-04-19", ["h1"]),
    ];
    expect(calculateStreak("h1", logs, TODAY)).toBe(3);
  });

  it("stops at a gap", () => {
    const logs = [
      makeLog(TODAY, ["h1"]),
      makeLog(YESTERDAY, ["h1"]),
      // gap on 2026-04-19
      makeLog("2026-04-18", ["h1"]),
    ];
    expect(calculateStreak("h1", logs, TODAY)).toBe(2);
  });

  it("does not count other habits", () => {
    const logs = [makeLog(TODAY, ["h2"])];
    expect(calculateStreak("h1", logs, TODAY)).toBe(0);
  });
});

describe("calculateLongestStreak", () => {
  it("returns 0 when no completions", () => {
    expect(calculateLongestStreak("h1", [])).toBe(0);
  });

  it("returns 1 for a single completion", () => {
    expect(calculateLongestStreak("h1", [makeLog(TODAY, ["h1"])])).toBe(1);
  });

  it("returns correct longest streak across a gap", () => {
    const logs = [
      makeLog("2026-04-15", ["h1"]),
      makeLog("2026-04-16", ["h1"]),
      makeLog("2026-04-17", ["h1"]),
      // gap
      makeLog("2026-04-20", ["h1"]),
      makeLog("2026-04-21", ["h1"]),
    ];
    expect(calculateLongestStreak("h1", logs)).toBe(3);
  });

  it("returns the longer of two separated blocks", () => {
    const logs = [
      // bloco de 2
      makeLog("2026-04-01", ["h1"]),
      makeLog("2026-04-02", ["h1"]),
      // gap
      // bloco de 5
      makeLog("2026-04-10", ["h1"]),
      makeLog("2026-04-11", ["h1"]),
      makeLog("2026-04-12", ["h1"]),
      makeLog("2026-04-13", ["h1"]),
      makeLog("2026-04-14", ["h1"]),
    ];
    expect(calculateLongestStreak("h1", logs)).toBe(5);
  });
});

describe("calculateStreak — casos adicionais", () => {
  it("streak de 30 dias consecutivos retorna 30", () => {
    const logs: DailyLog[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date("2026-04-21T00:00:00");
      d.setDate(d.getDate() - i);
      logs.push(makeLog(d.toLocaleDateString("en-CA"), ["h1"]));
    }
    expect(calculateStreak("h1", logs, TODAY)).toBe(30);
  });

  it("múltiplos hábitos no mesmo log — streak de h1 não é afetado por h2", () => {
    const logs = [
      makeLog(TODAY, ["h1", "h2"]),
      makeLog(YESTERDAY, ["h2"]), // só h2 ontem
    ];
    // h1: apenas hoje → streak = 1
    expect(calculateStreak("h1", logs, TODAY)).toBe(1);
    // h2: hoje e ontem → streak = 2
    expect(calculateStreak("h2", logs, TODAY)).toBe(2);
  });

  it("completado hoje E ontem — streak conta ambos sem duplicar", () => {
    const logs = [
      makeLog(TODAY, ["h1"]),
      makeLog(YESTERDAY, ["h1"]),
    ];
    expect(calculateStreak("h1", logs, TODAY)).toBe(2);
  });

  it("streak = 0 quando último completado há 2 dias (sem grace de hoje/ontem)", () => {
    const logs = [makeLog("2026-04-19", ["h1"])];
    expect(calculateStreak("h1", logs, TODAY)).toBe(0);
  });
});
