import { useState } from "react";
import Modal from "../Modal";
import { formatarDataBrasileira } from "../../../utils/DateUtils";
import { Unlock, Info, ArrowLeftIcon, LockOpenIcon, Loader2 } from "lucide-react";

interface ModalDesbloquearAdminProps {
  isOpen: boolean;
  onClose: () => void;
  dados: {
    quadra: string;
    data: string;
    horario: string;
    valor: number;
  };
  onConfirmar: () => Promise<void> | void; // permite async
}

export default function ModalDesbloquearAdmin({
  isOpen,
  onClose,
  dados,
  onConfirmar,
}: ModalDesbloquearAdminProps) {
  const [loading, setLoading] = useState(false);

  const handleConfirmar = async () => {
    try {
      setLoading(true);
      await onConfirmar();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center text-center">
        {/* Ícone central */}
        <div className="bg-green-100 text-green-600 rounded-full p-3 mb-4 shadow-sm">
          <Unlock size={32} />
        </div>

        <h2 className="text-xl font-semibold text-green-700 mb-2">
          Desbloquear horário
        </h2>
        <p className="text-sm text-gray-700 mb-4 px-4">
          Ao desbloquear este horário, ele voltará a aparecer para os clientes
          no sistema de reservas.
        </p>

        {/* Informações da reserva */}
        <div className="bg-green-50 border border-green-200 text-sm rounded-lg px-4 py-3 w-full mb-5 shadow-inner text-left">
          <p>
            <span className="font-medium">Quadra:</span>{" "}
            <span className="text-green-700">{dados.quadra}</span>
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
            {dados.valor}
          </p>
        </div>

        {/* Dica informativa */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
          <Info size={14} className="text-green-600" />
          <span>
            Clientes podem visualizar este horário imediatamente após o desbloqueio.
          </span>
        </div>

        {/* Botões */}
        <div className="flex justify-between gap-4 w-full">
          <button
            onClick={onClose}
            disabled={loading}
            className="w-full py-2 rounded-md bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <ArrowLeftIcon size={18} /> Voltar
          </button>
          <button
            onClick={handleConfirmar}
            disabled={loading}
            className="w-full py-2 rounded-md bg-green-600 text-white font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Desbloqueando...
              </>
            ) : (
              <>
                <LockOpenIcon size={18} /> Desbloquear
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
