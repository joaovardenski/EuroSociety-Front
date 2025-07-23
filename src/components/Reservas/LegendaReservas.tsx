// src/components/Reservas/LegendaStatus.tsx
export default function LegendaReservas() {
  return (
    <div className="flex items-center flex-wrap gap-4 text-sm my-8">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 bg-white border border-azulBase rounded"></div>
        <span className="text-gray-700">Disponível</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 bg-yellow-200 rounded"></div>
        <span className="text-gray-700">Indisponível (Fila de Espera)</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 bg-gray-300 line-through rounded"></div>
        <span className="text-gray-700">Bloqueado</span>
      </div>
    </div>
  );
}
