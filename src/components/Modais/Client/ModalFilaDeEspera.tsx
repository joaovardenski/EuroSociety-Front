import Modal from "../Modal";
import { formatarDataBrasileira } from "../../../utils/DateUtils";
import { Hourglass, BellRing } from "lucide-react";

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
        {/* Ícone central */}
        <div className="bg-yellow-100 text-yellow-600 rounded-full p-4 mb-4 shadow-md animate-pulse">
          <Hourglass size={34} />
        </div>

        {/* Título */}
        <h2 className="text-lg font-bold text-azulBase mb-2">
          Horário já reservado!
        </h2>
        <p className="text-sm text-gray-700 mb-4 max-w-sm">
          Mas não desanime! Entre na fila de espera e será avisado assim que{" "}
          <span className="font-semibold text-azulBase">este horário</span> ficar
          disponível.
        </p>

        {/* Dados da reserva */}
        <div className="bg-blue-50 border border-blue-200 text-sm rounded-lg px-4 py-3 w-full mb-5 text-left shadow-inner">
          <p>
            <span className="font-medium">Quadra:</span>{" "}
            <span className="text-azulBase">{dados.quadra}</span>
          </p>
          <p>
            <span className="font-medium">Data:</span>{" "}
            {formatarDataBrasileira(dados.data)}
          </p>
          <p>
            <span className="font-medium">Horário:</span> {dados.horario}
          </p>
          <p>
            <span className="font-medium">Valor:</span> R${" "}
            {dados.valor.toFixed(2)}
          </p>
        </div>

        {/* Aviso */}
        <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 text-yellow-700 text-xs px-3 py-2 rounded-md mb-4">
          <BellRing size={16} />
          <span>
            Chamaremos em ordem de inscrição. Mantenha as notificações ativas.
          </span>
        </div>

        {/* Botões */}
        <div className="flex justify-between gap-4 w-full">
          <button
            onClick={onClose}
            className="w-full py-2 rounded-md bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition"
          >
            Voltar
          </button>
          <button
            onClick={onEntrarFila}
            className="w-full py-2 rounded-md bg-yellow-500 text-white font-semibold hover:bg-yellow-600 transition transform hover:scale-[1.02]"
          >
            Entrar na fila de espera
          </button>
        </div>
      </div>
    </Modal>
  );
}
