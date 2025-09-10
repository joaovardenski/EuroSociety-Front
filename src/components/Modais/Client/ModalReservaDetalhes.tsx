import Modal from "../Modal";
import { formatarDataIso } from "../../../utils/DateUtils";
import { capitalizeFirstLetter } from "../../../utils/StringUtils";
import type { Reserva } from "../../../types/interfaces";
import {
  Calendar,
  Clock,
  User,
  BookmarkCheckIcon,
  CalendarCheckIcon,
} from "lucide-react";

interface ModalReservaDetalhesProps {
  isOpen: boolean;
  onClose: () => void;
  reserva: Reserva;
}

export default function ModalReservaDetalhes({
  isOpen,
  onClose,
  reserva,
}: ModalReservaDetalhesProps) {
  const nomeCliente = localStorage.getItem("user_nome") || reserva.cliente_nome || "Não informado";

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl font-bold mb-6 text-azulBase text-center">
        Detalhes da Reserva
      </h2>

      <div className="grid grid-cols-1 gap-4">
        {/* Cliente */}
        <div className="flex items-center gap-3 bg-gray-100 p-3 rounded-lg shadow-sm">
          <User size={20} className="text-azulBase" />
          <div>
            <p className="text-gray-600 text-xs">Cliente</p>
            <p className="font-medium text-gray-800">{nomeCliente}</p>
          </div>
        </div>

        {/* Data e Horário */}
        <div className="flex items-center gap-3 bg-gray-100 p-3 rounded-lg shadow-sm">
          <Calendar size={20} className="text-green-500" />
          <div>
            <p className="text-gray-600 text-xs">Data</p>
            <p className="font-medium text-gray-800">{formatarDataIso(reserva.data)}</p>
          </div>
          <Clock size={20} className="text-yellow-500 ml-6" />
          <div>
            <p className="text-gray-600 text-xs">Horário</p>
            <p className="font-medium text-gray-800">{reserva.slot}</p>
          </div>
        </div>

        {/* Tipo de Reserva */}
        <div className="flex items-center gap-3 bg-gray-100 p-3 rounded-lg shadow-sm">
          <BookmarkCheckIcon size={20} className="text-purple-500" />
          <div>
            <p className="text-gray-600 text-xs">Tipo de Reserva</p>
            <p className="font-medium text-gray-800">{capitalizeFirstLetter(reserva.tipo_reserva)}</p>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center gap-3 bg-gray-100 p-3 rounded-lg shadow-sm">
          <CalendarCheckIcon size={20} className="text-blue-500" />
          <div>
            <p className="text-gray-600 text-xs">Status</p>
            <p
              className={`font-medium ${
                reserva.status === "confirmada"
                  ? "text-green-600"
                  : reserva.status === "cancelada"
                  ? "text-red-600"
                  : "text-azulBase"
              }`}
            >
              {capitalizeFirstLetter(reserva.status)}
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
}
