"use client";

import { Trophy } from "lucide-react";
import { ConsistencyResult } from "@/types/habit";

const colorMap: Record<string, { bar: string; text: string }> = {
  violet: { bar: "bg-violet-500", text: "text-violet-400" },
  emerald: { bar: "bg-emerald-500", text: "text-emerald-400" },
  sky: { bar: "bg-sky-500", text: "text-sky-400" },
  rose: { bar: "bg-rose-500", text: "text-rose-400" },
  amber: { bar: "bg-amber-500", text: "text-amber-400" },
};

interface Props {
  result: ConsistencyResult | null;
}

export default function ConsistencyCard({ result }: Props) {
  const c = result ? (colorMap[result.habit.color] ?? colorMap.violet) : null;

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-4 h-4 text-amber-400" />
        <p className="text-xs text-white/40 uppercase tracking-widest">Hábito Mais Consistente</p>
      </div>

      {!result ? (
        <p className="text-sm text-white/30">Sem dados ainda.</p>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-white font-semibold">{result.habit.name}</span>
            <span className={`text-2xl font-bold ${c!.text}`}>{result.rate}%</span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${c!.bar}`}
              style={{ width: `${result.rate}%` }}
            />
          </div>
          <p className="text-xs text-white/30">
            Taxa de conclusão desde o início
          </p>
        </div>
      )}
    </div>
  );
}
