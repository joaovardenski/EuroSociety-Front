import Modal from "../Modal";

import { formatarDataBrasileira } from "../../../utils/DateUtils";

interface ModalRecebimentoAdminProps {
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

export default function ModalRecebimentoAdmin({
  isOpen,
  onClose,
  dados,
  onConfirmar,
}: ModalRecebimentoAdminProps) {

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-center text-xl font-semibold text-azulBase mb-5">
        Confirmar agendamento
      </h2>

      <div className="space-y-2 text-md text-gray-700 mb-6 border-2 border-azulBase rounded-lg p-4 bg-gray-100">
        <p>
          <strong>Cliente:</strong>{" "}
          <span className="text-azulBase">{dados.cliente}</span>
        </p>
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
          <strong>Valor antecipado:</strong>{" "}
          <span className="text-azulBase">R$ {150 - dados.pagamentoFaltante}</span>
        </p>
      </div>

      <p className="mb-5 text-xs text-gray-400 text-center">Você confirma que recebeu os <span className="text-green-500 font-semibold">R${dados.pagamentoFaltante}</span> restantes?</p>

      <div className="flex justify-between gap-4">
        <button
          onClick={onClose}
          className="w-full py-2 rounded-md bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition"
        >
          Cancelar
        </button>
        <button
          onClick={onConfirmar}
          className="w-full py-2 rounded-md bg-azulBase text-white font-semibold hover:bg-azulEscuro transition"
        >
            Confirmar
        </button>
      </div>
    </Modal>
  );
}
