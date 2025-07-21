import { Calendar, Clock, DollarSign, Eye, CircleX } from "lucide-react";

import { Quadras } from "../../data/Variaveis";

import { formatarDataBrasileira } from "../../utils/DateUtils";

export interface Reserva {
  id: number;
  usuario: string;
  quadra: string;
  data: string;
  slot: string;
  status: string;
  statusPagamento: string;
}

interface BookingCardProps {
  reserva: Reserva;
  onCancel?: (reserva: Reserva) => void;
}

export default function BookingCard({ reserva, onCancel }: BookingCardProps) {
  const quadraInfo = Object.values(Quadras).find(
    (q) => q.nome === reserva.quadra
  );

  return (
    <div className="flex items-start bg-white shadow-md rounded-xl p-4 justify-between flex-col md:flex-row md:items-center">
      {/* Ícone */}
      <div className="hidden md:flex items-center justify-center w-12 h-12 bg-azulBase text-white rounded-full mb-3 md:mb-0 md:mr-6">
        <Calendar size={24} />
      </div>

      {/* Informações da reserva */}
      <div className="flex-1 text-sm text-gray-800 space-y-1">
        <h2 className="font-semibold text-base text-azulBase">
          {reserva.quadra}
        </h2>
        <p className="flex items-center gap-2">
          <Calendar size={16} /> Data:{" "}
          <strong>{formatarDataBrasileira(reserva.data)}</strong>
        </p>
        <p className="flex items-center gap-2">
          <Clock size={16} /> Horário: <strong>{reserva.slot}</strong>
        </p>
        <p className="flex items-center gap-2">
          <DollarSign size={16} /> Valor:{" "}
          {quadraInfo ? `R$ ${quadraInfo.preco.toFixed(2)}` : "N/A"}
        </p>
        <p className="font-semibold">
          Status:{" "}
          <span
            className={`font-semibold ${
              reserva.status === "CONFIRMADO"
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {reserva.status}
          </span>
        </p>
      </div>

      {/* Botões de ações */}
      <div className="flex md:flex-col items-stretch gap-2 mt-4 md:mt-0 md:ml-6 w-full md:w-auto">
        <button className="flex items-center gap-2 bg-azulBase text-white px-4 py-1 rounded text-sm hover:bg-azulEscuro w-full md:w-[130px]">
          <Eye size={16} /> Detalhes
        </button>
        {reserva.status !== "CANCELADO" && (
          <button
            className="w-full flex items-center gap-2 border border-red-500 text-red-500 px-4 py-1 rounded text-sm md:w-[130px] hover:bg-red-100 "
            onClick={() => onCancel?.(reserva)}
            disabled={reserva.status === "CANCELADO"}
          >
            <CircleX size={16} /> Cancelar
          </button>
        )}
      </div>
    </div>
  );
}
