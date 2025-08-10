// src/components/Tabelas/TabelaAgendamentos.tsx
import type { Reserva } from "../../types/interfaces";
import { formatarDataBrasileira } from "../../utils/DateUtils";

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
    <div className="overflow-x-auto overflow-y-auto max-h-[270px]">
      <table className="min-w-full bg-white border-2 border-gray-500 rounded-xl">
        <thead>
          <tr className="bg-gray-100 text-gray-700 text-left">
            <th className="px-4 py-2">Cliente</th>
            <th className="px-4 py-2">Quadra</th>
            <th className="px-4 py-2">Data/Hora</th>
            <th className="px-4 py-2">Status pag.</th>
            <th className="px-4 py-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          {reservas.map((r, index) => (
            <tr key={index} className="border-t border-gray-200">
              <td className="px-4 py-2">{r.usuario.nome}</td>
              <td className="px-4 py-2">{r.quadra.nome}</td>
              <td className="px-4 py-2">{`${formatarDataBrasileira(r.data)} às ${r.slot}`}</td>
              <td className="px-4 py-2">
                <span
                  className={`text-sm font-medium px-3 py-1 rounded-full
                    ${
                      r.statusPagamento === "Completo"
                        ? "bg-green-500 text-white"
                        : r.statusPagamento === "Parcial"
                        ? "bg-yellow-400 text-white"
                        : "bg-gray-300 text-black"
                    }`}
                >
                  {r.statusPagamento}
                </span>
              </td>
              <td className="px-4 py-2 space-x-3">
                <button
                  onClick={() => r.pagamentoFaltante && onReceberClick(r)}
                  className={`bg-green-200 text-green-800 font-medium px-3 py-1 rounded-lg ${
                    !r.pagamentoFaltante
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-green-300"
                  }`}
                >
                  Receber
                </button>

                <button
                  onClick={() => onCancelarClick(r)}
                  className="bg-red-500 text-white font-medium px-3 py-1 rounded-lg hover:bg-red-700"
                >
                  Cancelar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
