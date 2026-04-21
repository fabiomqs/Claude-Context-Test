'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { COLOR_MAP, type HabitColor } from '@/types/habit'

const COLORS: HabitColor[] = ['violet', 'emerald', 'rose', 'amber', 'sky', 'orange']

interface Props {
  onAdd: (name: string, color: string) => void
}

export default function AddHabitForm({ onAdd }: Props) {
  const [name, setName] = useState('')
  const [color, setColor] = useState<HabitColor>('violet')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    onAdd(name, color)
    setName('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 pb-4 border-b border-white/[0.06]">
      <div className="flex gap-2">
        {COLORS.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setColor(c)}
            className={`w-6 h-6 rounded-full transition-all ${COLOR_MAP[c].bg} ${
              color === c ? 'ring-2 ring-offset-2 ring-offset-[#0f0f17] ring-white/60 scale-110' : 'opacity-50 hover:opacity-80'
            }`}
            aria-label={`Cor ${c}`}
          />
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome do hábito..."
          maxLength={60}
          className="flex-1 bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white/90 placeholder-white/25 outline-none focus:border-white/20 focus:bg-white/[0.07] transition-all"
        />
        <button
          type="submit"
          disabled={!name.trim()}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-30 disabled:cursor-not-allowed text-white text-sm font-medium transition-all"
        >
          <Plus size={16} />
          Adicionar
        </button>
      </div>
    </form>
  )
}
