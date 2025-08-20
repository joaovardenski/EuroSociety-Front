import { useState } from "react";
import { Calendar, UserPlus, ShieldBan, ArrowLeftIcon } from "lucide-react";
import Modal from "../Modal";
import { formatarDataBrasileira } from "../../../utils/DateUtils";

interface ModalConfirmarAdminProps {
  isOpen: boolean;
  onClose: () => void;
  dados: {
    quadra: string;
    data: string;
    horario: string;
    valor: number;
  };
  onBloquear: () => void;
  onConfirmar: () => void;
}

export default function ModalConfirmarAdmin({
  isOpen,
  onClose,
  dados,
  onBloquear,
  onConfirmar,
}: ModalConfirmarAdminProps) {
  const [onlyCancel, setOnlyCancel] = useState(false);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {/* Header com ícone */}
      <div className="flex flex-col items-center text-center mb-4">
        <div className="bg-blue-100 text-blue-600 rounded-full p-3 mb-3">
          <Calendar size={32} />
        </div>
        <h2 className="text-xl font-bold text-azulBase">
          {onlyCancel ? "Bloquear Horário" : "Confirmar Agendamento"}
        </h2>
        <p className="text-gray-600 text-sm mt-1">
          {onlyCancel
            ? "Este horário será bloqueado para todos os clientes."
            : "Você pode agendar para você ou outro cliente."}
        </p>
      </div>

      {/* Dados da reserva */}
      <div className="space-y-1 text-md text-gray-700 mb-6 border-2 border-blue-300 rounded-lg p-4 bg-blue-50 shadow-inner">
        <p>
          <strong>Quadra:</strong>{" "}
          <span className="text-azulBase">{dados.quadra}</span>
        </p>
        <p>
          <strong>Data:</strong>{" "}
          <span className="text-azulBase">
            {formatarDataBrasileira(dados.data)}
          </span>
        </p>
        <p>
          <strong>Horário:</strong>{" "}
          <span className="text-azulBase">{dados.horario}</span>
        </p>
        {!onlyCancel && (
          <p className="flex gap-1">
            <strong>Valor:</strong>{" "}
            <span className="text-green-600 flex items-center gap-1 font-bold">
              R$ {dados.valor.toFixed(2)}
            </span>
          </p>
        )}
      </div>

      {/* Switch para bloqueio */}
      <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg mb-5">
        <input
          type="checkbox"
          id="icancel"
          checked={onlyCancel}
          onChange={() => setOnlyCancel(!onlyCancel)}
          className="accent-red-600 w-4 h-4"
        />
        <label htmlFor="icancel" className="text-sm text-gray-700 cursor-pointer">
          Desejo bloquear este horário
        </label>
      </div>

      <p className="mb-5 text-xs text-gray-500 text-center">
        {onlyCancel
          ? "*Clientes não poderão agendar este horário após o bloqueio."
          : "*Se houver conflito com uma reserva existente, o cliente será notificado."}
      </p>

      {/* Botões */}
      <div className="flex justify-between gap-4">
        <button
          onClick={onClose}
          className="w-full py-2 rounded-md bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition flex items-center justify-center gap-2"
        >
          <ArrowLeftIcon size={18}/> Voltar
        </button>
        <button
          onClick={onlyCancel ? onBloquear : onConfirmar}
          className={`w-full py-2 rounded-md font-semibold transition flex items-center justify-center gap-2 ${
            onlyCancel
              ? "bg-red-600 text-white hover:bg-red-700"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {onlyCancel ? <ShieldBan size={18} /> : <UserPlus size={18} />}
          {onlyCancel ? "Bloquear" : "Agendar"}
        </button>
      </div>
    </Modal>
  );
}
