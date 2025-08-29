import { useState } from "react";
import { User, DollarSign, CalendarCheck, ArrowLeftIcon, Loader2 } from "lucide-react";
import Modal from "../Modal";
import InputFieldAuth from "../../Auth/InputFieldAuth";
import { formatarDataBrasileira } from "../../../utils/DateUtils";

interface ModalConfirmarAdminProps {
  isOpen: boolean;
  onClose: () => void;
  dados: {
    quadra: string;
    data: string;
    horario: string;
    valor: number;
  };
  onConfirmar: (info: { nome: string; valor: number }) => Promise<void>;
}

export default function ModalAgendarAdmin({
  isOpen,
  onClose,
  dados,
  onConfirmar,
}: ModalConfirmarAdminProps) {
  const [nome, setNome] = useState("");
  const [valor, setValor] = useState(dados.valor);
  const [isLoading, setIsLoading] = useState(false);

  async function handleConfirm() {
    setIsLoading(true);
    try {
      await onConfirmar({ nome, valor });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {/* Header com ícone */}
      <div className="flex flex-col items-center text-center mb-5">
        <div className="bg-blue-100 text-blue-600 rounded-full p-3 mb-3">
          <CalendarCheck size={32} />
        </div>
        <h2 className="text-xl font-bold text-azulBase">
          Agendar horário
        </h2>
        <p className="text-gray-600 text-sm mt-1">
          Preencha os dados do cliente.
        </p>
      </div>

      {/* Dados da reserva */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm mb-6 shadow-inner">
        <p><strong>Quadra:</strong> {dados.quadra}</p>
        <p><strong>Data:</strong> {formatarDataBrasileira(dados.data)}</p>
        <p><strong>Horário:</strong> {dados.horario}</p>
        <p><strong>Valor base:</strong> R$ {dados.valor.toFixed(2)}</p>
      </div>

      {/* Campos de input */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <User className="text-blue-600" size={18} />
          <InputFieldAuth
            id="inome"
            label="Nome do cliente:"
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <DollarSign className="text-green-600" size={18} />
          <InputFieldAuth
            id="ivalor"
            label="Valor pago:"
            type="number"
            placeholder="R$0"
            value={valor}
            onChange={(e) => setValor(Number(e.target.value))}
          />
        </div>
      </div>

      {/* Botões */}
      <div className="flex justify-between gap-4 mt-8">
        <button
          onClick={onClose}
          disabled={isLoading}
          className={`w-full py-2 rounded-md bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition flex items-center justify-center gap-2 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <ArrowLeftIcon size={18} /> Voltar
        </button>
        <button
          onClick={handleConfirm}
          disabled={isLoading}
          className={`w-full py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? <Loader2 className="animate-spin" size={18} /> : <CalendarCheck size={18} />}
          {isLoading ? "Agendando..." : "Agendar"}
        </button>
      </div>
    </Modal>
  );
}
