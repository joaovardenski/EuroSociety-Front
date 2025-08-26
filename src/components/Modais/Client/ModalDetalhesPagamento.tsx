import { useState, useEffect } from "react";
import {
  DollarSign,
  CalendarCheck2,
  ShieldCheck,
  DollarSignIcon,
} from "lucide-react";
import Modal from "../Modal";
import { formatarDataBrasileira } from "../../../utils/DateUtils";
import type { Quadra } from "../../../types/interfaces";
import { calcularValor } from "../../../utils/Calculate";

interface ModalDetalhesPagamentoProps {
  isOpen: boolean;
  onClose: () => void;
  dados: {
    quadra: Quadra | null;
    data: string;
    horario: string;
    valor: number;
  };
  mensalistaDisponivel: boolean;
  onConfirmarPagamento: (valorPago: number, mensalista: boolean) => void;
}

export default function ModalDetalhesPagamento({
  isOpen,
  onClose,
  dados,
  onConfirmarPagamento,
  mensalistaDisponivel,
}: ModalDetalhesPagamentoProps) {
  const [mensalista, setMensalista] = useState(false);
  const [percentual, setPercentual] = useState(50);
  const [valorPago, setValorPago] = useState(dados.valor * (percentual / 100));

  useEffect(() => {
    if (mensalista && dados.quadra) {
      setValorPago(calcularValor(dados.quadra, dados.horario.split(" - ")[0], true));
    } else {
      setValorPago((dados.valor * percentual) / 100);
    }
  }, [mensalista, percentual, dados]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {/* Título */}
      <div className="text-center mb-4">
        <DollarSign
          className="mx-auto text-green-600 animate-pulse"
          size={38}
        />
        <h2 className="text-lg font-bold text-azulBase mt-2">
          Detalhes do Pagamento
        </h2>
        <p className="text-sm text-gray-600">
          Escolha a forma de pagamento e confirme sua reserva.
        </p>
      </div>

      {/* Informações da reserva */}
      <div className="bg-blue-50 border border-blue-300 text-sm rounded-lg px-4 py-3 mb-5 shadow-inner">
        <p>
          <span className="font-medium">Quadra:</span>{" "}
          <span className="text-azulBase">{dados.quadra?.nome}</span>
        </p>
        <p>
          <span className="font-medium">Data/Hora:</span>{" "}
          {`${formatarDataBrasileira(dados.data)} às ${
            dados.horario.split(" - ")[0]
          }`}
        </p>
        <p>
          <span className="font-medium">Valor total:</span>{" "}
          <span className="text-green-600 font-semibold">
            R$ {dados.valor.toFixed(2)}
          </span>
        </p>
      </div>

      {/* Mensalista */}
      {mensalistaDisponivel && (
        <div className="mb-5">
          <h3 className="font-medium text-sm mb-2 flex items-center gap-2">
            <CalendarCheck2 size={16} className="text-green-600" /> Opção
            Mensalista
          </h3>
          <label className="flex items-center gap-3 border border-green-500 bg-green-50 rounded-lg px-3 py-2 cursor-pointer hover:bg-green-100 transition">
            <input
              type="checkbox"
              checked={mensalista}
              onChange={(e) => {
                setMensalista(e.target.checked);
                if (e.target.checked) setPercentual(100);
              }}
              className="accent-green-600 w-4 h-4"
            />
            <span className="text-sm text-green-700 font-medium">
              Quero este horário fixo semanalmente (Mensalista)
            </span>
          </label>
          {mensalista && (
            <p className="text-xs text-green-700 mt-2 bg-green-100 p-2 rounded-md border border-green-300">
              <ShieldCheck size={14} className="inline text-green-700 mr-1" />
              Pagamento mensalista: <strong>100% deste horário agora</strong> e
              os próximos 3 horários serão cobrados na segunda semana.
            </p>
          )}
        </div>
      )}

      {/* Valor a pagar */}
      <div className="mb-5">
        <h3 className="font-medium text-sm mb-1 flex items-center gap-2">
          <DollarSignIcon size={17} className="text-green-600" /> Escolha o
          valor de pagamento
        </h3>
        {!mensalista && (
          <>
            <p className="text-xs text-gray-600 mb-2">
              Você pode pagar entre 50% (mínimo) e 100% (total) agora.
            </p>
            <input
              type="range"
              min={50}
              max={100}
              step={10}
              value={percentual}
              onChange={(e) => setPercentual(Number(e.target.value))}
              className="w-full mb-2 accent-violet-500"
            />
            <div className="text-xs flex justify-between mb-1">
              <span>Min: 50% (R$ {(dados.valor * 0.5).toFixed(2)})</span>
              <span>Total: 100% (R$ {dados.valor.toFixed(2)})</span>
            </div>
          </>
        )}
        <div className="bg-violet-100 rounded-md text-center py-2 font-semibold text-[15px] text-violet-800">
          Valor a pagar:{" "}
          <span className="text-green-600">R$ {valorPago.toFixed(2)}</span> (
          {mensalista ? "100%" : `${percentual}%`})
        </div>
      </div>

      {/* Botão de pagar */}
      <button
        onClick={() => onConfirmarPagamento(valorPago, mensalista)}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-semibold transition flex items-center justify-center gap-1"
      >
        <DollarSign size={18} />
        Pagar R$ {valorPago.toFixed(2)}
      </button>
    </Modal>
  );
}
