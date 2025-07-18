import Modal from "../Modal";

import { formatarDataBrasileira } from "../../../utils/DateUtils";

import { Hourglass } from "lucide-react";

interface ModalFilaDeEsperaProps {
  isOpen: boolean;
  onClose: () => void;
  dados: {
    quadra: string;
    data: string;
    horario: string;
    valor: number;
  };
  onEntrarFila: () => void;
}

export default function ModalFilaDeEspera({
  isOpen,
  onClose,
  dados,
  onEntrarFila,
}: ModalFilaDeEsperaProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center text-center">
        <div className="bg-yellow-100 text-yellow-600 rounded-full p-3 mb-4">
          <Hourglass size={32} />
        </div>

        <h2 className="text-lg font-bold text-azulBase mb-3">
          Horário indisponível no momento
        </h2>

        <p className="text-sm text-gray-700 mb-6">
          Você pode entrar na fila de espera. Caso o horário fique disponível,
          entraremos em contato.
        </p>

        {/* Dados da reserva */}
        <div className="bg-blue-100/60 text-sm rounded-lg px-4 py-3 w-full mb-6 text-left">
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
            <span className="font-medium">Valor:</span> R${" "}
            {dados.valor.toFixed(2)}
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
            onClick={onEntrarFila}
            className="w-full py-2 rounded-md bg-yellow-500 text-white font-semibold hover:bg-yellow-600 transition"
          >
            Entrar na fila
          </button>
        </div>
      </div>
    </Modal>
  );
}
