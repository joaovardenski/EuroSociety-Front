import type { Reserva } from "../../../types/interfaces";
import { formatarDataIso } from "../../../utils/DateUtils";
import Modal from "../Modal";
import { Wallet, Info, ArrowLeftIcon, DollarSignIcon } from "lucide-react";

interface ModalRecebimentoAdminProps {
  isOpen: boolean;
  onClose: () => void;
  dados: Reserva;
  onConfirmar: () => void;
}

export default function ModalRecebimentoAdmin({
  isOpen,
  onClose,
  dados,
  onConfirmar,
}: ModalRecebimentoAdminProps) {
  // Garantindo valores válidos
  const clienteNome = dados.clienteNome ?? dados.user?.nome ?? "Cliente não informado";
  const quadraNome = dados.quadra?.nome ?? "Quadra não informada";
  const slot = dados.slot ?? "-";
  const dataFormatada = dados.data ? formatarDataIso(dados.data) : "-";

  const restante = dados.pagamentoFaltante ?? 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center text-center">
        {/* Ícone */}
        <div className="bg-green-100 text-green-600 rounded-full p-3 mb-4 shadow-sm">
          <Wallet size={32} />
        </div>

        {/* Título */}
        <h2 className="text-xl font-semibold text-green-700 mb-2">
          Receber pagamento restante
        </h2>
        <p className="text-sm text-gray-700 mb-4 px-4">
          O cliente pagou antecipadamente. Restam{" "}
          <span className="text-red-500 font-semibold">R$ {restante} </span>
          a serem pagos no balcão.
        </p>

        {/* Informações da reserva */}
        <div className="bg-gray-50 border border-gray-200 text-sm rounded-lg px-4 py-3 w-full mb-5 shadow-inner text-left">
          <p>
            <span className="font-medium">Cliente:</span>{" "}
            <span className="text-azulBase">{clienteNome}</span>
          </p>
          <p>
            <span className="font-medium">Quadra:</span>{" "}
            <span className="text-azulBase">{quadraNome}</span>
          </p>
          <p>
            <span className="font-medium">Data:</span> {dataFormatada}
          </p>
          <p>
            <span className="font-medium">Horário:</span> {slot}
          </p>
        </div>

        {/* Observação */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
          <Info size={14} className="text-green-600" />
          <span>
            Confirme o recebimento para atualizar o status do pagamento no sistema.
          </span>
        </div>

        {/* Botões */}
        <div className="flex justify-between gap-4 w-full">
          <button
            onClick={onClose}
            className="w-full py-2 rounded-md bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition flex items-center justify-center gap-2"
          >
            <ArrowLeftIcon size={18} /> Voltar
          </button>
          <button
            onClick={onConfirmar}
            className="w-full py-2 rounded-md bg-green-600 text-white font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
          >
            <DollarSignIcon size={18}/>
            Receber R$ {restante}
          </button>
        </div>
      </div>
    </Modal>
  );
}
