import Modal from "../Modal";
import { formatarDataBrasileira } from "../../../utils/DateUtils";
import { AlertTriangle, ArrowLeftIcon, CalendarCheck } from "lucide-react";

interface ModalAgendarOcupadoAdminProps {
  isOpen: boolean;
  onClose: () => void;
  dados: {
    quadra: string;
    data: string;
    horario: string;
    valor: number;
  };
  onConfirmar: () => void;
}

export default function ModalAgendarOcupadoAdmin({
  isOpen,
  onClose,
  dados,
  onConfirmar,
}: ModalAgendarOcupadoAdminProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center text-center">
        {/* Ícone de alerta */}
        <div className="bg-red-100 text-red-600 rounded-full p-3 mb-3">
          <AlertTriangle size={34} />
        </div>

        <h2 className="text-lg font-bold text-red-600 mb-2">
          Este horário já está reservado!
        </h2>

        <p className="text-sm text-gray-700 mb-4 px-2">
          Se você confirmar, a reserva atual será{" "}
          <span className="font-bold text-red-500">cancelada </span>e o cliente
          será notificado. Em seguida, este horário ficará disponível para agendamentos.
        </p>

        {/* Dados da reserva ocupada */}
        <div className="bg-red-50 border border-red-200 text-sm rounded-lg px-4 py-3 w-full mb-5 shadow-inner text-left">
          <p>
            <span className="font-medium">Quadra:</span>{" "}
            <span className="text-red-700">{dados.quadra}</span>
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

        {/* Texto informativo */}
        <p className="text-xs text-gray-500 mb-4">
          *Essa ação não pode ser desfeita após a confirmação.
        </p>

        {/* Botões de ação */}
        <div className="flex justify-between gap-4 w-full">
          <button
            onClick={onClose}
            className="w-full py-2 rounded-md bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition flex items-center justify-center gap-2"
          >
            <ArrowLeftIcon size={18} /> Voltar
          </button>
          <button
            onClick={onConfirmar}
            className="w-full py-2 rounded-md bg-red-600 text-white font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2"
          >
            <CalendarCheck size={18} /> Confirmar
          </button>
        </div>
      </div>
    </Modal>
  );
}
