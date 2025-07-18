// src/components/ModalCancelarReserva.tsx
import { AlertTriangle, X } from "lucide-react";

import { formatarDataBrasileira } from "../../../utils/DateUtils";

interface ModalCancelarReservaProps {
  quadra: string;
  data: string;
  horario: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ModalCancelarReserva({
  quadra,
  data,
  horario,
  onClose,
  onConfirm,
}: ModalCancelarReservaProps) {
  const cancelamentoPermitido = true; 
  return (
    <div className="text-center space-y-4">
      <div className="flex justify-center text-yellow-500 text-4xl">
        <AlertTriangle size={40} />
      </div>
      <h2 className="text-xl font-semibold text-azulBase">
        Confirmar cancelamento
      </h2>
      <p>
        Você tem certeza que deseja cancelar a reserva para:
      </p>
      <p>
        <strong>
          {quadra} - {formatarDataBrasileira(data)} às {horario}
        </strong>
      </p>
      {cancelamentoPermitido ? (
        <p className="text-green-600 font-semibold text-sm">
          Cancelamento com reembolso permitido
        </p>
      ) : (
        <p className="text-red-600 font-semibold text-sm">
          Cancelamento sem reembolso
        </p>
      )}
      <div className="flex justify-center gap-3 mt-4">
        <button
          className="text-[14px]  min-w-[140px] bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 font-medium md:text-md"
          onClick={onClose}
        >
          Manter Reserva
        </button>
        <button
          className="text-[14px]  min-w-[140px] bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center justify-center gap-2 font-medium md:text-md"
          onClick={onConfirm}
        >
          <X size={18} />
          Cancelar
        </button>
      </div>
    </div>
  );
}
