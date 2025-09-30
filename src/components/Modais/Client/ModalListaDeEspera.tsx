import { useState } from "react";
import Modal from "../Modal";
import { formatarDataBrasileira } from "../../../utils/DateUtils";
import {
  Hourglass,
  BellRing,
  ArrowLeft,
  AlarmClockCheckIcon,
  Loader2,
} from "lucide-react";
import type { Quadra } from "../../../types/interfacesFront";

interface ModalListaDeEsperaProps {
  isOpen: boolean;
  onClose: () => void;
  dados: {
    quadra: Quadra | null;
    data: string;
    horario: string;
    valor: number;
  };
  jaNaFila: boolean | undefined;
  jaTemReserva: boolean | undefined;
  onEntrarLista: () => Promise<void> | void;
}

export default function ModalListaDeEspera({
  isOpen,
  onClose,
  dados,
  jaNaFila,
  jaTemReserva,
  onEntrarLista,
}: ModalListaDeEsperaProps) {
  const [loading, setLoading] = useState(false);

  const handleEntrarLista = async () => {
    try {
      setLoading(true);
      await onEntrarLista();
    } finally {
      setLoading(false);
    }
  };

  // Determina o estado do aviso
  let avisoTexto = "";
  let avisoEstilo = "";
  if (jaTemReserva) {
    avisoTexto = "Este horário já está reservado para você!";
    avisoEstilo = "bg-green-50 border-green-200 text-green-700";
  } else if (jaNaFila) {
    avisoTexto = "Você já está na lista de espera para este horário.";
    avisoEstilo = "bg-yellow-50 border-yellow-200 text-yellow-700";
  } else {
    avisoTexto =
      "Mas não desanime! Entre na lista de espera e será avisado assim que este horário ficar disponível.";
    avisoEstilo = "bg-yellow-50 border-yellow-200 text-yellow-700";
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center text-center">
        {/* Ícone central */}
        <div className="bg-yellow-100 text-yellow-600 rounded-full p-4 mb-4 shadow-md">
          <Hourglass size={34} />
        </div>

        {/* Título */}
        <h2 className="text-lg font-bold text-azulBase mb-2">
          Horário já reservado!
        </h2>

        {/* Aviso principal */}
        <p
          className={`text-sm font-semibold mb-4 max-w-sm p-4 rounded border ${avisoEstilo}`}
        >
          {avisoTexto}
        </p>

        {/* Dados da reserva */}
        <div className="bg-blue-50 border border-blue-200 text-sm rounded-lg px-4 py-3 w-full mb-5 text-left shadow-inner">
          <p>
            <span className="font-medium">Quadra:</span>{" "}
            <span className="text-azulBase">{dados.quadra?.nome}</span>
          </p>
          <p>
            <span className="font-medium">Data:</span>{" "}
            {formatarDataBrasileira(dados.data)}
          </p>
          <p>
            <span className="font-medium">Horário:</span>{" "}
            {dados.horario.split(" - ")[0]}
          </p>
          <p>
            <span className="font-medium">Valor:</span> R$ {dados.valor}
          </p>
        </div>

        {/* Dica sobre notificações */}
          {!jaTemReserva && (
            <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 text-yellow-700 text-xs px-3 py-2 rounded-md mb-4">
              <BellRing size={16} />
              <span>
                Chamaremos assim que o horário estiver disponível. Mantenha as
                notificações ativas.
              </span>
            </div>
          )}

        {/* Botões */}
        <div className="flex justify-between gap-4 w-full">
          <button
            onClick={onClose}
            disabled={loading}
            className="w-full py-2 rounded-md bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition flex items-center justify-center gap-1 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <ArrowLeft size={18} /> Voltar
          </button>

          {/* Botão só aparece se não tem reserva e não está na fila */}
          {!jaNaFila && !jaTemReserva && (
            <button
              onClick={handleEntrarLista}
              disabled={loading}
              className="w-full py-2 rounded-md bg-yellow-500 text-white font-semibold hover:bg-yellow-600 transition transform hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Entrando...
                </>
              ) : (
                <>
                  <AlarmClockCheckIcon size={18} /> Entrar na lista
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}
