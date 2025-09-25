import { useState, useMemo } from "react";
import Modal from "../Modal";
import { formatarDataBrasileira } from "../../../utils/DateUtils";
import { Unlock, Info, ArrowLeftIcon, LockOpenIcon, Loader2 } from "lucide-react";

interface ModalDesbloquearAdminProps {
  isOpen: boolean;
  onClose: () => void;
  dados: {
    quadra: string;
    data: string; // esperado: "YYYY-MM-DD" ou "YYYY-MM-DDTHH:MM:SS"
    horario: string; // esperado: "HH:MM - HH:MM"
    valor: number;
  };
  onConfirmar: () => Promise<void> | void;
}

// --- Helpers ---
// Parse "YYYY-MM-DD" (ou "YYYY-MM-DDTHH:MM:SS") -> { y, m, d } ou null
function parseDateYMD(dateStr: string | undefined) {
  if (!dateStr) return null;
  const datePart = dateStr.split("T")[0].split(" ")[0].trim();
  const parts = datePart.split("-").map((p) => Number(p));
  if (parts.length < 3 || parts.some((n) => Number.isNaN(n))) return null;
  const [y, m, d] = parts;
  return { y, m, d };
}

// Parse início do horário "HH:MM - HH:MM" -> { h, minute } ou null
function parseStartTime(horario: string | undefined) {
  if (!horario) return null;
  const inicio = horario.split("-")[0].trim();
  const parts = inicio.split(":").map((p) => Number(p));
  if (parts.length < 2 || parts.some((n) => Number.isNaN(n))) return null;
  const [h, minute] = parts;
  return { h, minute };
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

  // decide se deve exibir o botão "Desbloquear"
  const podeDesbloquear = useMemo(() => {
    const dateParts = parseDateYMD(dados?.data);
    const timeParts = parseStartTime(dados?.horario);

    // se não conseguir parsear, retorna true (mantém comportamento atual pra não bloquear por engano)
    if (!dateParts || !timeParts) return true;

    const agora = new Date();
    const { y, m, d } = dateParts;

    // compara por partes (local)
    const isHoje =
      agora.getFullYear() === y &&
      agora.getMonth() + 1 === m &&
      agora.getDate() === d;

    if (!isHoje) return true; // se não for hoje, deixa desbloquear normalmente

    // cria um Date local do início do horário (evita problemas de timezone)
    const horarioReserva = new Date(y, m - 1, d, timeParts.h, timeParts.minute, 0, 0);

    // só permite desbloquear se AGORA for estritamente menor que o início do horário
    return agora.getTime() < horarioReserva.getTime();
  }, [dados.data, dados.horario]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center text-center">
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

        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
          <Info size={14} className="text-green-600" />
          <span>
            Clientes podem visualizar este horário imediatamente após o desbloqueio.
          </span>
        </div>

        <div className="flex justify-between gap-4 w-full">
          <button
            onClick={onClose}
            disabled={loading}
            className="w-full py-2 rounded-md bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <ArrowLeftIcon size={18} /> Voltar
          </button>

          {podeDesbloquear ? (
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
          ) : (
            // opcional: mostrar um botão desabilitado/label informando que já passou
            <button
              disabled
              className="w-full py-2 rounded-md bg-gray-100 text-gray-500 font-semibold cursor-not-allowed flex items-center justify-center gap-2"
            >
              Horário já passou
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}
