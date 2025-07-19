import Modal from "../Modal";

import { formatarDataBrasileira } from "../../../utils/DateUtils";

import { Hourglass } from "lucide-react";

interface ModalCancelarAdminProps {
  isOpen: boolean;
  onClose: () => void;
  dados: {
    cliente: string;
    quadra: string;
    data: string;
    horario: string;
    pagamentoFaltante: number;
  };
  onConfirmar: () => void;
}

export default function ModalCancelarAdmin({
  isOpen,
  onClose,
  dados,
  onConfirmar,
}: ModalCancelarAdminProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center text-center">
        <div className="bg-yellow-100 text-yellow-600 rounded-full p-3 mb-4">
          <Hourglass size={32} />
        </div>

        <h2 className="text-lg font-bold text-azulBase mb-3">
          Este horário está ocupado
        </h2>

        <p className="text-sm text-gray-700 mb-6">
          Caso você deseja cancelar mesmo assim, o cliente será notificado do cancelamento da reserva.
        </p>

        {/* Dados da reserva */}
        <div className="bg-blue-100/60 text-sm rounded-lg px-4 py-3 w-full mb-6 text-left">
        <p>
            <span className="font-medium">Cliente:</span>{" "}
            <span className="text-azulBase">{dados.cliente}</span>
          </p>
          <p>
            <span className="font-medium">Quadra:</span>{" "}
            <span className="text-azulBase">{dados.quadra}</span>
          </p>
          <p>
            <span className="font-medium">Data:</span> {formatarDataBrasileira(dados.data)}
          </p>
          <p>
            <span className="font-medium">Horário:</span> {dados.horario}
          </p>
          <p>
            <span className="font-medium">Valor pago:</span> R${" "}
            {150 - dados.pagamentoFaltante}
          </p>
        </div>

        {/* Botões */}
        <div className="flex justify-between gap-4 w-full">
          <button
            onClick={onClose}
            className="w-full py-2 rounded-md bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirmar}
            className="w-full py-2 rounded-md bg-yellow-500 text-white font-semibold hover:bg-yellow-600 transition"
          >
            Cancelar
          </button>
        </div>
      </div>
    </Modal>
  );
}
