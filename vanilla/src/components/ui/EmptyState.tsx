export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-5xl mb-4">📋</div>
      <h3 className="text-lg font-semibold text-gray-300 mb-2">Nenhum hábito ainda</h3>
      <p className="text-gray-500 text-sm max-w-xs">
        Adicione seu primeiro hábito acima para começar a acompanhar seu progresso.
      </p>
    </div>
  );
}
