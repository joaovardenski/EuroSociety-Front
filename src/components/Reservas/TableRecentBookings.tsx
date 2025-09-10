import type { Reserva } from "../../types/interfacesFront";
import { formatarDataIso } from "../../utils/DateUtils";
import { CheckCircle, Clock } from "lucide-react";

interface TableRecentBookingsProps {
  recentBookings: Reserva[];
}

export default function TableRecentBookings({
  recentBookings,
}: TableRecentBookingsProps) {
  return (
    <div className="bg-white shadow-md rounded-xl p-4 mb-1 min-h-60">
      <h2 className="text-lg font-bold text-[#052c64] mb-4">
        Agendamentos recentes
      </h2>

      <div className="overflow-x-auto max-h-60 overflow-y-auto rounded-lg">
        <table className="w-full text-sm text-left text-gray-700 border-collapse">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="p-3">Cliente</th>
              <th className="p-3">Quadra</th>
              <th className="p-3">Data/Hora</th>
              <th className="p-3 text-center">Status pagamento</th>
            </tr>
          </thead>
          <tbody>
            {recentBookings.map((agendamento, index) => {
              const statusPago = agendamento.pagamentoFaltante == 0.0;
              return (
                <tr
                  key={index}
                  className={`border-t hover:bg-gray-50 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="px-3 py-3 font-medium">
                    {agendamento.user?.nome ||
                      agendamento.cliente_nome ||
                      "Anônimo"}
                  </td>
                  <td className="px-3 py-3">{agendamento.quadra?.nome}</td>
                  <td className="px-3 py-3">
                    {`${formatarDataIso(agendamento.data)} às ${
                      agendamento.slot
                    }`}
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span
                      className={`inline-flex items-center gap-1 text-white px-3 py-1 rounded-full text-xs font-semibold ${
                        statusPago ? "bg-green-500" : "bg-yellow-500"
                      }`}
                    >
                      {statusPago ? (
                        <>
                          <CheckCircle size={14} /> Confirmada
                        </>
                      ) : (
                        <>
                          <Clock size={14} /> Parcial
                        </>
                      )}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
