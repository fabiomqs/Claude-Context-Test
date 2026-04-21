interface Props {
  streak: number
}

export default function StreakBadge({ streak }: Props) {
  if (streak === 0) return null
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-500/15 text-orange-400 border border-orange-500/20">
      🔥 {streak}
    </span>
  )
}
