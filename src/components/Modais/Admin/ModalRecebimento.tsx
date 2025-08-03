import Modal from "../Modal";
import { Wallet, Info, CreditCard } from "lucide-react";

interface ModalRecebimentoAdminProps {
  isOpen: boolean;
  onClose: () => void;
  dados: {
    cliente: string;
    quadra: string;
    data: Date;
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
  const valorTotal = 150; // Aqui você pode puxar dinamicamente
  const valorPago = valorTotal - dados.pagamentoFaltante;

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
          O cliente pagou{" "}
          <span className="text-green-600 font-semibold">R${valorPago} </span>
          antecipadamente. Restam{" "}
          <span className="text-red-500 font-semibold">R${dados.pagamentoFaltante} </span>
          a serem pagos no balcão.
        </p>

        {/* Informações da reserva */}
        <div className="bg-gray-50 border border-gray-200 text-sm rounded-lg px-4 py-3 w-full mb-5 shadow-inner text-left">
          <p>
            <span className="font-medium">Cliente:</span>{" "}
            <span className="text-azulBase">{dados.cliente}</span>
          </p>
          <p>
            <span className="font-medium">Quadra:</span>{" "}
            <span className="text-azulBase">{dados.quadra}</span>
          </p>
          <p>
            <span className="font-medium">Data:</span>{" "}
            {`${dados.data}`}
          </p>
          <p>
            <span className="font-medium">Horário:</span> {dados.horario}
          </p>
          <p>
            <span className="font-medium">Valor total:</span>{" "}
            <span className="text-azulBase">R$ {valorTotal.toFixed(2)}</span>
          </p>
        </div>

        {/* Observação */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
          <Info size={14} className="text-green-600" />
          <span>
            Confirme o recebimento para atualizar o status do pagamento no
            sistema.
          </span>
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
            className="w-full py-2 rounded-md bg-green-600 text-white font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
          >
            <CreditCard size={18} />
            Receber R$ {dados.pagamentoFaltante}
          </button>
        </div>
      </div>
    </Modal>
  );
}
