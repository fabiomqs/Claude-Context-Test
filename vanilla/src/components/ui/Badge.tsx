interface BadgeProps {
  count: number;
  label?: string;
}

export function Badge({ count, label = "day streak" }: BadgeProps) {
  if (count === 0) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-800 text-gray-500">
        <span>0</span>
        <span>{label}</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/20 text-amber-400 border border-amber-500/30">
      <span>🔥</span>
      <span>{count}</span>
      <span>{label}</span>
    </span>
  );
}
