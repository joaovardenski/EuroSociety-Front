// src/components/Tabelas/TabelaAgendamentos.tsx
import type { Reserva } from "../../types/interfaces";
import { formatarDataIso } from "../../utils/DateUtils";
import { getNomeCondensado } from "../../utils/NameUtils";

interface Props {
  reservas: Reserva[];
  onReceberClick: (reserva: Reserva) => void;
  onCancelarClick: (reserva: Reserva) => void;
}

export default function TableActiveBookings({
  reservas,
  onReceberClick,
  onCancelarClick,
}: Props) {
  return (
    <div className="overflow-x-auto max-h-[400px] border border-gray-200 rounded-xl shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50 sticky top-0 z-10">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Cliente</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Quadra</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Data/Hora</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status pag.</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Ações</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {reservas.map((r, index) => (
            <tr
              key={r.id}
              className={`transition-colors duration-200 ${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              } hover:bg-blue-50`}
            >
              <td className="px-6 py-3 text-sm text-gray-800">
                {r.user ? getNomeCondensado(r.user.nome) : getNomeCondensado(r.cliente_nome)}
              </td>
              <td className="px-6 py-3 text-sm text-gray-800">{r.quadra?.nome}</td>
              <td className="px-6 py-3 text-sm text-gray-800">{`${formatarDataIso(r.data)} às ${r.slot}`}</td>
              <td className="px-6 py-3">
                <span
                  className={`inline-block text-sm font-medium px-3 py-1 rounded-full ${
                    r.pagamentoFaltante === 0
                      ? "bg-green-500 text-white"
                      : "bg-yellow-400 text-white"
                  }`}
                >
                  {r.pagamentoFaltante === 0 ? "Completo" : "Parcial"}
                </span>
              </td>
              <td className="px-6 py-3 flex gap-2">
                <button
                  onClick={() => onReceberClick(r)}
                  disabled={r.pagamentoFaltante === 0}
                  className={`px-3 py-1 rounded-lg font-medium transition-colors duration-200 ${
                    r.pagamentoFaltante === 0
                      ? "bg-green-200 text-green-800 opacity-50 cursor-not-allowed"
                      : "bg-green-200 text-green-800 hover:bg-green-300"
                  }`}
                >
                  Receber
                </button>
                <button
                  onClick={() => onCancelarClick(r)}
                  className="px-3 py-1 rounded-lg bg-red-500 text-white font-medium hover:bg-red-700 transition-colors duration-200"
                >
                  Cancelar
                </button>
              </td>
            </tr>
          ))}
          {reservas.length === 0 && (
            <tr>
              <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                Nenhum agendamento encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
