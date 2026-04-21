interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  accent?: string;
}

export function StatCard({ label, value, sub, accent = "#8b5cf6" }: StatCardProps) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex flex-col gap-1">
      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">{label}</p>
      <p className="text-3xl font-bold" style={{ color: accent }}>
        {value}
      </p>
      {sub && <p className="text-sm text-gray-500">{sub}</p>}
    </div>
  );
}
