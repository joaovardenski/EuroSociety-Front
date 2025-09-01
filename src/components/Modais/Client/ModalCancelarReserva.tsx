import { Calendar, Clock, XCircle, ArrowLeft, Loader2 } from "lucide-react";
import { formatarDataIso } from "../../../utils/DateUtils";
import { useState } from "react";

interface ModalCancelarReservaProps {
  quadra: string | undefined;
  data: string;
  horario: string;
  podeReembolso: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>; // agora espera Promise
}

export default function ModalCancelarReserva({
  quadra,
  data,
  horario,
  podeReembolso,
  onClose,
  onConfirm,
}: ModalCancelarReservaProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
    } catch (error) {
      console.error("Erro ao cancelar a reserva:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="text-center space-y-5 p-4">
      {/* Ícone de destaque */}
      <div className="flex justify-center text-red-600 text-5xl mb-2">
        <XCircle size={55} />
      </div>

      {/* Título */}
      <h2 className="text-2xl font-bold text-red-700">
        Cancelar esta reserva?
      </h2>

      {/* Mensagem */}
      <p className="text-gray-700 text-base">
        A reserva abaixo será liberada no calendário:
      </p>

      {/* Detalhes da reserva */}
      <div className="bg-gray-100 rounded-lg p-4 shadow-inner flex flex-col gap-2 text-gray-800 text-sm">
        <p className="flex items-center justify-center gap-2">
          <Calendar size={18} className="text-blue-600" />{" "}
          <strong>{`${formatarDataIso(data)}`}</strong>
        </p>
        <p className="flex items-center justify-center gap-2">
          <Clock size={18} className="text-blue-600" /> <strong>{horario}</strong>
        </p>
        <p className="font-semibold text-azulBase">{quadra}</p>
      </div>

      {/* Aviso de reembolso */}
      {podeReembolso ? (
        <p className="text-green-700 font-semibold text-sm mt-3">
          Cancelamento com reembolso disponível (até 7h antes).
        </p>
      ) : (
        <p className="text-red-600 font-semibold text-sm mt-3">
          Cancelamento sem reembolso (prazo expirado).
        </p>
      )}

      {/* Botões */}
      <div className="flex justify-center gap-4 mt-5">
        <button
          className="text-sm min-w-[175px] bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 flex items-center justify-center gap-2 font-medium shadow-md transition"
          onClick={onClose}
          disabled={isLoading}
        >
          <ArrowLeft size={18} /> Voltar
        </button>
        <button
          className={`text-sm min-w-[175px] px-4 py-2 rounded-lg flex items-center justify-center gap-2 font-medium shadow-md transition ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed text-white"
              : "bg-red-600 hover:bg-red-700 text-white"
          }`}
          onClick={handleConfirm}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 size={18} className="animate-spin" /> Cancelando...
            </>
          ) : (
            <>
              <XCircle size={18} /> Confirmar
            </>
          )}
        </button>
      </div>
    </div>
  );
}
