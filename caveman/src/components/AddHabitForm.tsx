"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { HabitColor } from "@/types/habit";

const COLORS: { value: HabitColor; bg: string; ring: string }[] = [
  { value: "violet", bg: "bg-violet-500", ring: "ring-violet-500" },
  { value: "emerald", bg: "bg-emerald-500", ring: "ring-emerald-500" },
  { value: "sky", bg: "bg-sky-500", ring: "ring-sky-500" },
  { value: "rose", bg: "bg-rose-500", ring: "ring-rose-500" },
  { value: "amber", bg: "bg-amber-500", ring: "ring-amber-500" },
];

interface Props {
  onAdd: (name: string, color: HabitColor) => void;
}

export default function AddHabitForm({ onAdd }: Props) {
  const [name, setName] = useState("");
  const [color, setColor] = useState<HabitColor>("violet");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onAdd(trimmed, color);
    setName("");
  }

  return (
    <form onSubmit={submit} className="card mt-6">
      <p className="text-xs text-white/40 uppercase tracking-widest mb-3">Novo Hábito</p>
      <div className="flex gap-3 items-center">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome do hábito..."
          maxLength={50}
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/25 outline-none focus:border-white/25 transition-colors"
        />
        <div className="flex gap-2">
          {COLORS.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setColor(c.value)}
              className={`w-6 h-6 rounded-full ${c.bg} transition-all duration-150 ${
                color === c.value ? `ring-2 ring-offset-2 ring-offset-[#12121a] ${c.ring}` : "opacity-50 hover:opacity-80"
              }`}
            />
          ))}
        </div>
        <button
          type="submit"
          disabled={!name.trim()}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-30 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Adicionar
        </button>
      </div>
    </form>
  );
}
