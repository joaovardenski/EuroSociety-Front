import { Calendar, Clock, DollarSign, Eye, CircleX } from "lucide-react";
import type { Quadra, Reserva } from "../../types/interfacesFront";
import { formatarDataIso } from "../../utils/DateUtils";
import { capitalizeFirstLetter } from "../../utils/StringUtils";
import ModalReservaDetalhes from "../Modais/Client/ModalReservaDetalhes";
import { useState } from "react";

interface BookingCardProps {
  reserva: Reserva;
  quadras: Quadra[];
  loading: boolean;
  onCancel?: (reserva: Reserva) => void;
}

export default function BookingCard({
  reserva,
  quadras,
  loading,
  onCancel,
}: BookingCardProps) {
  const quadraInfo = quadras.find((q) => q.nome === reserva.quadra?.nome);
  const [modalDetalhesAberto, setModalDetalhesAberto] = useState(false);

  function calcularValorReserva(slot: string): string {
    if (!quadraInfo) return "N/A";

    const [horaInicio] = slot.split(" - ");
    const hora = parseInt(horaInicio.split(":")[0], 10);

    const preco = reserva.mensalidade
      ? hora >= 18
        ? quadraInfo.precoNoturnoMensal
        : quadraInfo.precoNormalMensal
      : hora >= 18
      ? quadraInfo.precoNoturno
      : quadraInfo.precoNormal;

    return `R$ ${preco.toFixed(2)}`;
  }

  function reservaJaPassou(): boolean {
    const [horaInicio] = reserva.slot.split(" - ");
    const [hora, minuto] = horaInicio.split(":").map(Number);

    const [ano, mes, dia] = reserva.data.split("T")[0].split("-").map(Number);
    const dataHoraReserva = new Date(ano, mes - 1, dia, hora, minuto);

    return dataHoraReserva.getTime() < Date.now();
  }

  function cancelamentoDisponivel(): boolean {
    return !(
      reservaJaPassou() ||
      reserva.status.toLowerCase() === "cancelada" ||
      reserva.status.toLowerCase() === "pendente"
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4 bg-white shadow-md rounded-xl">
        Carregando informações da quadra...
      </div>
    );
  }

  return (
    <div className="flex items-start bg-white shadow-md rounded-xl p-4 justify-between flex-col md:flex-row md:items-center">
      {/* Ícone da reserva */}
      <div className="hidden md:flex items-center justify-center w-12 h-12 bg-azulBase text-white rounded-full mb-3 md:mb-0 md:mr-6">
        <Calendar size={24} />
      </div>

      {/* Informações da reserva */}
      <div className="flex-1 text-sm text-gray-800 space-y-1">
        <h2 className="font-semibold text-base text-azulBase">
          {reserva.quadra?.nome ?? "Quadra Desconhecida"}
        </h2>
        <p className="flex items-center gap-2">
          <Calendar size={16} /> Data:{" "}
          <strong>{formatarDataIso(reserva.data)}</strong>
        </p>
        <p className="flex items-center gap-2">
          <Clock size={16} /> Horário: <strong>{reserva.slot}</strong>
        </p>
        <p className="flex items-center gap-2">
          <DollarSign size={16} /> Valor: {calcularValorReserva(reserva.slot)}
        </p>
        <p className="font-semibold">
          Status:{" "}
          <span
            className={`font-semibold ${
              reserva.status === "confirmada"
                ? "text-green-600"
                : reserva.status === "cancelada"
                ? "text-red-600"
                : "text-azulBase"
            }`}
          >
            {capitalizeFirstLetter(reserva.status)}
          </span>
        </p>
      </div>

      {/* Botões de ação */}
      <div className="flex md:flex-col items-stretch gap-2 mt-4 md:mt-0 md:ml-6 w-full md:w-auto">
        <button
          className="flex items-center gap-2 bg-azulBase text-white px-4 py-1 rounded text-sm hover:bg-azulEscuro w-full md:w-[130px]"
          onClick={() => {
            setModalDetalhesAberto(true);
            console.log(reserva);
          }}
        >
          <Eye size={16} /> Detalhes
        </button>
        {cancelamentoDisponivel() && (
          <button
            className="w-full flex items-center gap-2 border border-red-500 text-red-500 px-4 py-1 rounded text-sm md:w-[130px] hover:bg-red-100"
            onClick={() => onCancel?.(reserva)}
          >
            <CircleX size={16} /> Cancelar
          </button>
        )}
      </div>
      <ModalReservaDetalhes
        isOpen={modalDetalhesAberto}
        onClose={() => setModalDetalhesAberto(false)}
        reserva={reserva}
      />
    </div>
  );
}
