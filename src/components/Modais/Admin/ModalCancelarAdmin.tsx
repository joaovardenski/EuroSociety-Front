import Modal from "../Modal";
import { AlertTriangle, User, CalendarClock } from "lucide-react";

interface ModalCancelarAdminProps {
  isOpen: boolean;
  onClose: () => void;
  dados: {
    cliente: string;
    quadra: string;
    data: string;
    horario: string;
    pagamentoFaltante: number;
    valorTotal: number;
  };
  onConfirmar: () => void;
}

export default function ModalCancelarAdmin({
  isOpen,
  onClose,
  dados,
  onConfirmar,
}: ModalCancelarAdminProps) {
  const valorPago = dados.valorTotal - dados.pagamentoFaltante;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center text-center">
        {/* Ícone de alerta */}
        <div className="bg-red-100 text-red-600 rounded-full p-3 mb-4 shadow-sm">
          <AlertTriangle size={32} />
        </div>

        {/* Título */}
        <h2 className="text-lg font-bold text-red-700 mb-2">
          Cancelar esta reserva?
        </h2>
        <p className="text-sm text-gray-600 mb-5 px-4">
          Ao cancelar este horário, o cliente{" "}
          <span className="font-semibold text-gray-800">{dados.cliente}</span>{" "}
          será notificado imediatamente.
        </p>

        {/* Dados da reserva */}
        <div className="bg-gray-50 border border-gray-200 text-sm rounded-lg px-4 py-3 w-full mb-5 shadow-inner text-left space-y-1">
          <p className="flex items-center gap-2">
            <User size={14} className="text-gray-500" />
            <span className="font-medium">Cliente:</span>{" "}
            <span className="text-azulBase">{dados.cliente}</span>
          </p>
          <p>
            <span className="font-medium">Quadra:</span>{" "}
            <span className="text-azulBase">{dados.quadra}</span>
          </p>
          <p className="flex items-center gap-2">
            <CalendarClock size={14} className="text-gray-500" />
            <span className="font-medium">Data:</span>{" "}
            {`${dados.data}`}
          </p>
          <p>
            <span className="font-medium">Horário:</span> {dados.horario}
          </p>
          <p>
            <span className="font-medium">Valor pago:</span>{" "}
            <span className="text-green-600 font-semibold">
              R$ {valorPago.toFixed(2)}
            </span>
          </p>
        </div>

        {/* Mensagem de alerta extra */}
        <p className="text-xs text-red-500 mb-4 font-medium">
          *Essa ação não pode ser desfeita. Verifique antes de confirmar.
        </p>

        {/* Botões */}
        <div className="flex justify-between gap-4 w-full">
          <button
            onClick={onClose}
            className="w-full py-2 rounded-md bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition"
          >
            Voltar
          </button>
          <button
            onClick={onConfirmar}
            className="w-full py-2 rounded-md bg-red-600 text-white font-semibold hover:bg-red-700 transition"
          >
            Cancelar reserva
          </button>
        </div>
      </div>
    </Modal>
  );
}
