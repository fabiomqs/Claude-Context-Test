export function getTodayString(): string {
  return new Date().toLocaleDateString("en-CA");
}

export function getYesterdayString(today: string): string {
  const d = new Date(today + "T00:00:00");
  d.setDate(d.getDate() - 1);
  return d.toLocaleDateString("en-CA");
}

export function getPastNDates(today: string, n: number): string[] {
  const dates: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today + "T00:00:00");
    d.setDate(d.getDate() - i);
    dates.push(d.toLocaleDateString("en-CA"));
  }
  return dates;
}

export function formatDayLabel(date: string): string {
  const d = new Date(date + "T00:00:00");
  return d.toLocaleDateString("en-US", { weekday: "short" });
}

export function subtractDays(date: string, days: number): string {
  const d = new Date(date + "T00:00:00");
  d.setDate(d.getDate() - days);
  return d.toLocaleDateString("en-CA");
}
