"use client";

import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  PolarAngleAxis,
} from "recharts";
import { HabitCompletionRate } from "@/lib/statsData";
import { COLOR_MAP } from "@/types";
import { Card } from "@/components/ui/Card";

interface MostConsistentHabitProps {
  data: HabitCompletionRate | null;
}

export function MostConsistentHabit({ data }: MostConsistentHabitProps) {
  if (!data) {
    return (
      <Card>
        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">
          Hábito mais consistente
        </p>
        <p className="text-gray-600 text-sm">Nenhum hábito ativo ainda.</p>
      </Card>
    );
  }

  const hex = COLOR_MAP[data.habit.color] ?? COLOR_MAP.emerald;
  const pct = Math.round(data.rate * 100);
  const chartData = [{ value: pct, fill: hex }];

  return (
    <Card className="flex items-center gap-6">
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">
          Hábito mais consistente
        </p>
        <div className="flex items-center gap-2 mb-1">
          <span
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: hex }}
          />
          <span className="text-lg font-bold text-white truncate">{data.habit.name}</span>
        </div>
        <p className="text-gray-400 text-sm">
          {data.completions} de {data.activeDays} dias completos
        </p>
      </div>

      <div className="relative w-24 h-24 flex-shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            innerRadius="70%"
            outerRadius="100%"
            data={chartData}
            startAngle={90}
            endAngle={-270}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
            <RadialBar background={{ fill: "#1f2937" }} dataKey="value" cornerRadius={8} />
          </RadialBarChart>
        </ResponsiveContainer>
        <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">
          {pct}%
        </span>
      </div>
    </Card>
  );
}
