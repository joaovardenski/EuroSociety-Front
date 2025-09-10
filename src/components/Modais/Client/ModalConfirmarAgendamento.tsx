import Modal from "../Modal";
import {
  Calendar,
  Clock,
  DollarSign,
  MapPin,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import { formatarDataBrasileira } from "../../../utils/DateUtils";
import type { Quadra } from "../../../types/interfacesFront";

interface ModalConfirmarAgendamentoProps {
  isOpen: boolean;
  onClose: () => void;
  dados: {
    quadra: Quadra | null;
    data: string;
    horario: string;
    valor: number;
  };
  onConfirmar: () => void;
}

export default function ModalConfirmarAgendamento({
  isOpen,
  onClose,
  dados,
  onConfirmar,
}: ModalConfirmarAgendamentoProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {/* Cabeçalho */}
      <div className="text-center space-y-2 mb-5">
        <CheckCircle className="mx-auto text-green-600" size={50} />
        <h2 className="text-2xl font-bold text-azulBase">Quase lá!</h2>
        <p className="text-gray-600 text-sm">
          Revise as informações da sua reserva antes de prosseguir para o
          pagamento.
        </p>
      </div>

      {/* Detalhes do agendamento */}
      <div className="space-y-3 text-md text-gray-700 mb-6 border border-blue-200 rounded-lg p-5 bg-blue-50 shadow-inner">
        <p className="flex items-center gap-2">
          <MapPin size={18} className="text-blue-600" />
          <strong className="text-gray-800">Quadra:</strong>
          <span className="text-azulBase font-medium">
            {dados.quadra?.nome}
          </span>
        </p>
        <p className="flex items-center gap-2">
          <Calendar size={18} className="text-blue-600" />
          <strong className="text-gray-800">Data:</strong>
          <span className="text-azulBase font-medium">
            {formatarDataBrasileira(dados.data)}
          </span>
        </p>
        <p className="flex items-center gap-2">
          <Clock size={18} className="text-blue-600" />
          <strong className="text-gray-800">Horário:</strong>
          <span className="text-azulBase font-medium">{dados.horario}</span>
        </p>
        <p className="flex items-center gap-2 text-lg">
          <DollarSign size={20} className="text-green-600" />
          <strong className="text-gray-800">Valor:</strong>
          <span className="text-green-700 font-bold text-md">
            R$ {dados.valor}
          </span>
        </p>
      </div>

      {/* Botões de ação */}
      <div className="flex justify-between gap-4">
        <button
          onClick={onClose}
          className="w-full py-2 rounded-md bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition flex items-center justify-center gap-1"
        >
          <ArrowLeft size={18} /> Voltar
        </button>
        <button
          onClick={onConfirmar}
          className="w-full py-2 rounded-md bg-green-600 text-white font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
        >
          <CheckCircle size={18} /> Confirmar & Pagar
        </button>
      </div>
    </Modal>
  );
}
