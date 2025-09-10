import { useState } from "react";
import type { Reserva } from "../../../types/interfaces";
import { formatarDataIso } from "../../../utils/DateUtils";
import Modal from "../Modal";
import { AlertTriangle, ArrowLeftIcon, CircleX } from "lucide-react";

interface ModalCancelarAdminProps {
  isOpen: boolean;
  onClose: () => void;
  dados: Reserva;
  onConfirmar: () => Promise<void>; // Alterado para async
}

export default function ModalCancelarAdmin({
  isOpen,
  onClose,
  dados,
  onConfirmar,
}: ModalCancelarAdminProps) {
  const [loading, setLoading] = useState(false); // Estado de loading
  const nomeCliente = dados.cliente_nome ?? dados.user?.nome ?? "Cliente não informado";

  const handleConfirmar = async () => {
    setLoading(true);
    try {
      await onConfirmar();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center text-center">
        {/* Ícone de alerta */}
        <div className="bg-red-100 text-red-600 rounded-full p-3 mb-4 shadow-sm">
          <AlertTriangle size={32} />
        </div>

        {/* Título */}
        <h2 className="text-lg font-bold text-red-700 mb-2">
          Cancelar esta reserva?
        </h2>
        <p className="text-sm text-gray-600 mb-5 px-4">
          Ao cancelar este horário, o cliente{" "}
          <span className="font-semibold text-gray-800">
            {nomeCliente}
          </span>{" "}
          será notificado imediatamente.
        </p>

        {/* Dados da reserva */}
        <div className="bg-gray-50 border border-gray-200 text-sm rounded-lg px-4 py-3 w-full mb-5 shadow-inner text-left space-y-1">
          <p>
            <span className="font-medium">Cliente:</span>{" "}
            <span className="text-azulBase">{nomeCliente}</span>
          </p>
          <p>
            <span className="font-medium">Quadra:</span>{" "}
            <span className="text-azulBase">{dados.quadra?.nome}</span>
          </p>
          <p>
            <span className="font-medium">Data:</span>{" "}
            {`${formatarDataIso(dados.data)}`}
          </p>
          <p>
            <span className="font-medium">Horário:</span> {dados.slot}
          </p>
        </div>

        {/* Mensagem de alerta extra */}
        <p className="text-xs text-red-500 mb-4 font-medium">
          *Essa ação não pode ser desfeita. Verifique antes de confirmar.
        </p>

        {/* Botões */}
        <div className="flex justify-between gap-4 w-full">
          <button
            onClick={onClose}
            className="w-full py-2 rounded-md bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition flex items-center justify-center gap-2"
            disabled={loading} // Desabilita enquanto carrega
          >
            <ArrowLeftIcon size={18} /> Voltar
          </button>
          <button
            onClick={handleConfirmar}
            className={`w-full py-2 rounded-md bg-red-600 text-white font-semibold transition flex items-center justify-center gap-2 ${
              loading ? "opacity-70 cursor-not-allowed" : "hover:bg-red-700"
            }`}
            disabled={loading} // Desabilita enquanto carrega
          >
            {loading ? (
              <span>Processando...</span>
            ) : (
              <>
                <CircleX size={18} /> Confirmar
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
