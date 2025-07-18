import { useState } from "react";
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
      <h2 className="text-center text-xl font-semibold text-azulBase mb-5">
        Confirmar agendamento
      </h2>

      <div className="space-y-2 text-md text-gray-700 mb-6 border-2 border-azulBase rounded-lg p-4 bg-gray-100">
        <p>
          <strong>Quadra:</strong>{" "}
          <span className="text-azulBase">{dados.quadra}</span>
        </p>
        <p>
          <strong>Data:</strong>{" "}
          <span className="text-azulBase ">{formatarDataBrasileira(dados.data)}</span>
        </p>
        <p>
          <strong>Horário:</strong>{" "}
          <span className="text-azulBase">{dados.horario}</span>
        </p>
        <p>
          <strong>Valor:</strong>{" "}
          <span className="text-azulBase">R$ {dados.valor.toFixed(2)}</span>
        </p>
      </div>

      <div className="flex gap-4 p-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
        <input type="checkbox" name="cancel" id="icancel" checked={onlyCancel} onChange={() => setOnlyCancel(!onlyCancel) }/>
        <p>Desejo apenas bloquear esse horário</p>
      </div>

      <p className="mb-5 text-xs text-gray-400 text-center">*Caso o horário esteja ocupado, o cliente será notificado do cancelamento da reserva!</p>

      <div className="flex justify-between gap-4">
        <button
          onClick={onClose}
          className="w-full py-2 rounded-md bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition"
        >
          Cancelar
        </button>
        <button
          onClick={onlyCancel?  onBloquear: onConfirmar}
          className="w-full py-2 rounded-md bg-azulBase text-white font-semibold hover:bg-azulEscuro transition"
        >
            {onlyCancel ? "Bloquear" : "Confirmar"}
        </button>
      </div>
    </Modal>
  );
}
