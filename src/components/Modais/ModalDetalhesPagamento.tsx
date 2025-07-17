import { useState } from "react";
import { CreditCard, DollarSign, Landmark } from "lucide-react";
import Modal from "./Modal";

interface ModalDetalhesPagamentoProps {
  isOpen: boolean;
  onClose: () => void;
  quadra: string;
  dataHora: string;
  valorTotal: number;
  onConfirmarPagamento: (
    valorPago: number,
    metodo: string,
    mensalista: boolean
  ) => void;
}

export default function ModalDetalhesPagamento({
  isOpen,
  onClose,
  quadra,
  dataHora,
  valorTotal,
  onConfirmarPagamento,
}: ModalDetalhesPagamentoProps) {
  const [mensalista, setMensalista] = useState(false);
  const [percentual, setPercentual] = useState(50);
  const [metodoPagamento, setMetodoPagamento] = useState("pix");

  const valorPago = (valorTotal * percentual) / 100;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-center text-lg font-semibold text-azulBase mb-2">
        Detalhes do pagamento
      </h2>

      <p className="text-center text-gray-700 text-sm mb-4">
        Escolha como e quanto deseja pagar pela sua reserva:
      </p>

      {/* Informações da reserva */}
      <div className="bg-blue-100/60 text-sm rounded-lg px-4 py-3 mb-6 border border-blue-300">
        <p>
          <span className="font-medium">Quadra:</span>{" "}
          <span className="text-azulBase">{quadra}</span>
        </p>
        <p>
          <span className="font-medium">Data/Hora:</span> {dataHora}
        </p>
        <p>
          <span className="font-medium">Valor total:</span> R${" "}
          {valorTotal.toFixed(2)}
        </p>
      </div>

      {/* Mensalista */}
      <div className="mb-6">
        <h3 className="font-medium text-sm mb-2">
          1. Opção de reserva mensalista
        </h3>
        <label className="flex items-center gap-3 border border-green-500 bg-green-50 rounded-lg px-3 py-2 cursor-pointer hover:bg-green-100 transition">
          <input
            type="checkbox"
            checked={mensalista}
            onChange={(e) => setMensalista(e.target.checked)}
            className="accent-green-600 w-4 h-4"
          />
          <span className="text-sm text-green-700 font-medium">
            Desejo esse horário fixo semanalmente (Mensalista)
          </span>
        </label>
      </div>

      {/* Valor a pagar */}
      <div className="mb-6">
        <h3 className="font-medium text-sm mb-1">
          2. Escolha o valor de pagamento
        </h3>
        <p className="text-xs text-gray-600 mb-2">
          Você pode pagar entre 50% (mínimo) e 100% (total) do valor da reserva
          agora.
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
          <span>Min: 50% (R$ {(valorTotal * 0.5).toFixed(2)})</span>
          <span>Total: 100% (R$ {valorTotal.toFixed(2)})</span>
        </div>
        <div className="bg-violet-100 rounded-md text-center py-2 font-semibold text-[15px] text-violet-800">
          Valor a pagar:{" "}
          <span className="text-green-600">R$ {valorPago.toFixed(2)}</span> (
          {percentual}%)
        </div>
      </div>

      {/* Método de pagamento */}
      <div className="mb-6">
        <h3 className="font-medium text-sm mb-2">
          3. Escolha o método de pagamento
        </h3>
        <div className="flex flex-col gap-2">
          <label
            className={`flex items-center gap-3 border rounded-md px-3 py-2 cursor-pointer transition ${
              metodoPagamento === "pix"
                ? "border-blue-600 bg-blue-50"
                : "border-gray-300"
            }`}
          >
            <input
              type="radio"
              name="metodo"
              value="pix"
              checked={metodoPagamento === "pix"}
              onChange={(e) => setMetodoPagamento(e.target.value)}
              className="accent-blue-600"
            />
            <Landmark size={18} className="text-blue-600" />
            <span className="text-sm font-medium">PIX</span>
          </label>

          <label
            className={`flex items-center gap-3 border rounded-md px-3 py-2 cursor-pointer transition ${
              metodoPagamento === "cartao"
                ? "border-blue-600 bg-blue-50"
                : "border-gray-300"
            }`}
          >
            <input
              type="radio"
              name="metodo"
              value="cartao"
              checked={metodoPagamento === "cartao"}
              onChange={(e) => setMetodoPagamento(e.target.value)}
              className="accent-blue-600"
            />
            <CreditCard size={18} className="text-blue-600" />
            <span className="text-sm font-medium">
              Cartão de crédito/débito
            </span>
          </label>
        </div>
      </div>

      {/* Botão de pagar */}
      <button
        onClick={() =>
          onConfirmarPagamento(valorPago, metodoPagamento, mensalista)
        }
        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-semibold transition"
      >
        <DollarSign size={18} className="inline mr-1 -mt-1" />
        Pagar R$ {valorPago.toFixed(2)}
      </button>
    </Modal>
  );
}
