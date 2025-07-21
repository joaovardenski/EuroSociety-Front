import { ClipboardList, List } from "lucide-react";

type Props = {
  count: number;
  navigate: (path: string) => void;
};

export default function ReservasAtivasCard({ count, navigate }: Props) {
  return (
    <div className="flex-1 min-w-[280px] max-w-[350px] bg-white rounded-xl shadow-md p-6 flex flex-col justify-between">
      <div className="text-center">
        <ClipboardList size={40} className="text-azulBase mb-3 mx-auto" />
        <h2 className="text-lg font-semibold mb-2">Minhas reservas ativas</h2>
        <p className="text-sm text-gray-700 mb-4">
          Você tem <span className="text-azulBase font-bold">{count}</span>{" "}
          reservas ativas no momento.
        </p>
        <p className="text-sm text-gray-700 mb-4">
          Acompanhe seus horários e gerencie seus jogos.
        </p>
      </div>
      <button
        className="w-full font-semibold py-2 rounded bg-white border-2 border-gray-400 text-sm hover:bg-gray-100 flex items-center justify-center gap-2"
        onClick={() => navigate("/minhas-reservas")}
      >
        <List size={16} /> Ver todas
      </button>
    </div>
  );
}
