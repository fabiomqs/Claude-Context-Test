"use client";

import { COLOR_MAP } from "@/types";

interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
  color: string;
  label: string;
}

export function Checkbox({ checked, onChange, color, label }: CheckboxProps) {
  const hex = COLOR_MAP[color] ?? COLOR_MAP.emerald;

  return (
    <button
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className="w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900"
      style={{
        borderColor: checked ? hex : "#374151",
        backgroundColor: checked ? hex : "transparent",
        boxShadow: checked ? `0 0 8px ${hex}40` : "none",
      }}
    >
      {checked && (
        <svg
          className="w-3.5 h-3.5 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      )}
    </button>
  );
}
