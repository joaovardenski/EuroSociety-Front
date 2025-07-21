import Modal from "../Modal";

import InputFieldAuth from "../../Auth/InputFieldAuth";

interface ModalConfirmarAdminProps {
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

export default function ModalAgendarAdmin({
  isOpen,
  onClose,
  onConfirmar,
}: ModalConfirmarAdminProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-center text-xl font-semibold text-azulBase mb-5">
        Dados do agendamento
      </h2>

      <InputFieldAuth
        id="inome"
        label="Nome do cliente:"
        type="text"
        placeholder="Nome"
        value=""
      />
      <InputFieldAuth
        id="itelefone"
        label="Telefone:"
        type="text"
        placeholder="(xx) xxxxx-xxxx"
        value=""
      />
      <InputFieldAuth
        id="ivalor"
        label="Valor pago:"
        type="text"
        placeholder="R$0"
        value="0"
      />

      <div className="flex justify-between gap-4 mt-10">
        <button
          onClick={onClose}
          className="w-full py-2 rounded-md bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition"
        >
          Cancelar
        </button>
        <button
          onClick={onConfirmar}
          className="w-full py-2 rounded-md bg-azulBase text-white font-semibold hover:bg-azulEscuro transition"
        >
          Agendar
        </button>
      </div>
    </Modal>
  );
}
