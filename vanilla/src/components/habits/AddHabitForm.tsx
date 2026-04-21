"use client";

import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { COLOR_MAP, COLOR_NAMES } from "@/types";

interface AddHabitFormProps {
  onAdd: (name: string, color: string) => void;
}

export function AddHabitForm({ onAdd }: AddHabitFormProps) {
  const [name, setName] = useState("");
  const [color, setColor] = useState("emerald");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd(name.trim(), color);
    setName("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Novo hábito..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
          maxLength={60}
        />
        <Button type="submit" disabled={!name.trim()}>
          Adicionar
        </Button>
      </div>
      <div className="flex gap-2 flex-wrap">
        {COLOR_NAMES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setColor(c)}
            aria-label={c}
            className="w-7 h-7 rounded-full transition-all duration-150 focus:outline-none"
            style={{
              backgroundColor: COLOR_MAP[c],
              transform: color === c ? "scale(1.25)" : "scale(1)",
              outline: color === c ? `2px solid ${COLOR_MAP[c]}` : "none",
              outlineOffset: "2px",
            }}
          />
        ))}
      </div>
    </form>
  );
}
