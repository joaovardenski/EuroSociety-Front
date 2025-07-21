import { CalendarPlus, PlusCircle } from "lucide-react";

type Props = {
  navigate: (path: string) => void;
};

export default function CardNovaReserva({ navigate }: Props) {
  return (
    <div className="flex-1 min-w-[280px] max-w-[350px] bg-white rounded-xl shadow-md p-6 flex flex-col justify-between">
      <div className="text-center">
        <PlusCircle size={40} className="text-azulBase mb-3 mx-auto" />
        <h2 className="text-lg font-semibold mb-2">Realizar nova reserva</h2>
        <p className="text-sm text-gray-700 mb-4">
          Encontre o horário perfeito e reserve sua quadra favorita com facilidade.
        </p>
      </div>
      <button
        className="w-full font-semibold py-2 rounded bg-azulBase text-white hover:bg-azulBase/90 flex items-center justify-center gap-2"
        onClick={() => navigate("/agendamento")}
      >
        <CalendarPlus size={16} /> Agendar agora
      </button>
    </div>
  );
}
