// src/components/Tabelas/TabelaAgendamentos.tsx
import { formatarDataBrasileira } from "../utils/DateUtils";

interface Agendamento {
  id: number;
  usuario: string;
  quadra: string;
  data: string;
  slot: string;
  statusPagamento: string;
  pagamentoFaltante: number;
}

interface Props {
  agendamentos: Agendamento[];
}

export default function TableActiveBookings({ agendamentos }: Props) {
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
          {agendamentos.map((ag, index) => (
            <tr key={index} className="border-t border-gray-200">
              <td className="px-4 py-2">{ag.usuario}</td>
              <td className="px-4 py-2">{ag.quadra}</td>
              <td className="px-4 py-2">{`${formatarDataBrasileira(ag.data)} às ${ag.slot}`}</td>
              <td className="px-4 py-2">
                <span
                  className={`text-sm font-medium px-3 py-1 rounded-full
                    ${
                      ag.statusPagamento === "Completo"
                        ? "bg-green-500 text-white"
                        : ag.statusPagamento === "Parcial"
                        ? "bg-yellow-400 text-white"
                        : "bg-gray-300 text-black"
                    }`}
                >
                  {ag.statusPagamento}
                </span>
              </td>
              <td className="px-4 py-2 space-x-3">
                <button className={`bg-green-200 text-green-800 font-medium px-3 py-1 rounded-lg ${!ag.pagamentoFaltante ? "opacity-50 cursor-not-allowed" : "hover:bg-green-300"}`}>
                  Receber
                </button>
                <button className="bg-red-500 text-white font-medium px-3 py-1 rounded-lg hover:bg-red-700">
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
