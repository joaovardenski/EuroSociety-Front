import { CalendarClock, Eye } from "lucide-react";
import { formatarDataBrasileira } from "../../utils/DateUtils";

type Reserva = {
  id: number;
  usuario: string;
  quadra: string;
  data: string;
  slot: string;
  status: string;
  statusPagamento: string;
};

type ReservaComDataHora = Reserva & { dataHora: Date };

type Props = {
  reserva?: ReservaComDataHora;
  navigate: (path: string) => void;
};

export default function ProximaReservaCard({ reserva, navigate }: Props) {

  return (
    <div className="flex-1 min-w-[280px] max-w-[350px] bg-white rounded-xl shadow-md p-6 flex flex-col justify-between">
      <div>
        <CalendarClock size={40} className="text-azulBase mb-3 mx-auto" />
        <h2 className="text-lg font-semibold text-center mb-2">
          Sua próxima reserva
        </h2>
        {reserva ? (
          <>
            <p className="text-sm font-semibold text-gray-700">
              Quadra: <span className="font-medium">{reserva.quadra}</span>
            </p>
            <p className="text-sm font-semibold text-gray-700">
              Data:{" "}
              <span className="font-medium">
                {formatarDataBrasileira(reserva.data)}
              </span>
            </p>
            <p className="text-sm font-semibold text-gray-700">
              Horário: <span className="font-medium">{reserva.slot}</span>
            </p>
            <p className="text-sm font-semibold text-gray-700">
              Status:{" "}
              <span
                className={
                  reserva.status === "CONFIRMADO"
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                {reserva.status}
              </span>
            </p>
          </>
        ) : (
          <p className="text-sm text-gray-600 text-center">
            Nenhuma reserva futura encontrada.
          </p>
        )}
      </div>
      <button
        className="mt-4 w-full font-semibold py-2 rounded bg-white border-2 border-gray-400 text-sm hover:bg-gray-100 flex items-center justify-center gap-2"
        onClick={() => navigate("/minhas-reservas")}
      >
        <Eye size={16} /> Ver detalhes
      </button>
    </div>
  );
}
