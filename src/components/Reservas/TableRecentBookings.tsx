import type { Reserva } from "../../types/interfaces";
import { formatarDataBrasileira } from "../../utils/DateUtils";

interface TableRecentBookingsProps {
  recentBookings: Reserva[];
}

export default function TableRecentBookings({ recentBookings }: TableRecentBookingsProps) {
  return (
    <div className="bg-white shadow-md rounded-xl p-4 mb-1">
      <h2 className="text-lg font-bold text-[#052c64] mb-4">
        Agendamentos recentes
      </h2>
      <div className="overflow-x-auto max-h-41 overflow-y-auto">

        <table className="w-full text-sm text-left text-gray-700">
          <thead>
            <tr className="border-b text-gray-600">
              <th className="p-2">Cliente</th>
              <th className="p-2">Quadra</th>
              <th className="p-2">Data/Hora</th>
              <th className="p-2">Valor</th>
              <th className="p-2">Status pag.</th>
            </tr>
          </thead>
          <tbody>
            {recentBookings.map((agendamento, index) => (
              <tr key={index} className="border-t">
                <td className="px-2 py-4 font-medium">
                  {agendamento.usuario.nome}
                </td>
                <td className="px-2 py-4">{agendamento.quadra.nome}</td>
                <td className="px-2 py-4">{`${formatarDataBrasileira(agendamento.data)} às ${agendamento.slot}`}</td>
                <td className="px-2 py-4">R${agendamento.pagamento.valor}</td>
                <td className="px-2 py-4">
                  <span
                    className={`text-white px-3 py-1 rounded-full ${
                      agendamento.statusPagamento === "Completo"
                        ? "bg-green-500"
                        : "bg-yellow-500"
                    }`}
                  >
                    {agendamento.statusPagamento}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
