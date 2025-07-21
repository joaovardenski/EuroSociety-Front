// Hooks
import { useNavigate } from "react-router-dom";
// Icons
import {
  CalendarClock,
  PlusCircle,
  ClipboardList,
  Eye,
  CalendarPlus,
  List,
} from "lucide-react";
// Components
import HeaderEuro from "../../components/Layout/HeaderEuro";
import FooterEuro from "../../components/Layout/FooterEuro";
import BottomNav from "../../components/Navigation/BottomNav";
// Data
import { minhasReservas } from "../../data/Variaveis";
// Utils
import { formatarDataBrasileira } from "../../utils/DateUtils";

type Reserva = {
  id: number;
  usuario: string;
  quadra: string;
  data: string; // "2025-06-30"
  slot: string; // "10:00 - 11:00"
  status: string; // "CONFIRMADO", "CANCELADO" etc.
  statusPagamento: string; // "Parcial", "Total", "Reembolsado"
};

type ReservaComDataHora = Reserva & { dataHora: Date };

function Dashboard() {
  const navigate = useNavigate();
  // Simula usuário autenticado (futuramente será com API/token)
  const user = "João Victor";

  // Filtra apenas as reservas confirmadas
  const activeBookings = getReservasConfirmadas(minhasReservas);

  // Conta quantas reservas ativas existem
  const numberOfActiveBookings = activeBookings.length;

  // Busca a próxima reserva futura
  const lastBooking = getProximaReserva(activeBookings);

  function getReservasConfirmadas(reservas: Reserva[]): Reserva[] {
    return reservas.filter((reserva) => reserva.status === "CONFIRMADO");
  }

  function getProximaReserva(
    reservas: Reserva[]
  ): ReservaComDataHora | undefined {
    const agora = new Date();

    return reservas
      .map(adicionarDataHora)
      .filter((reserva) => reserva.dataHora > agora)
      .sort((a, b) => a.dataHora.getTime() - b.dataHora.getTime())[0];
  }

  function adicionarDataHora(reserva: Reserva): ReservaComDataHora {
    const [horaInicio] = reserva.slot.split(" - ");
    return {
      ...reserva,
      dataHora: new Date(`${reserva.data}T${horaInicio}:00`),
    };
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#e1e6f9]">
      <HeaderEuro />

      {/* Conteúdo principal */}
      <main className="flex flex-col items-center flex-grow px-4 py-10 w-full">
        {/* Boas-vindas */}
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Seja bem-vindo, <span className="text-azulBase">{user}</span>!
          </h1>
          <p className="text-gray-600 mt-2">
            Confira seus agendamentos e aproveite nossas quadras.
          </p>
        </div>

        {/* Cards */}
        <div className="flex flex-wrap gap-6 justify-center w-full max-w-6xl mb-10 md:mb-0">
          {/* Card - Próxima reserva */}
          <div className="flex-1 min-w-[280px] max-w-[350px] bg-white rounded-xl shadow-md p-6 flex flex-col justify-between">
            <div>
              <CalendarClock size={40} className="text-azulBase mb-3 mx-auto" />
              <h2 className="text-lg font-semibold text-center mb-2">
                Sua próxima reserva
              </h2>
              {lastBooking ? (
                <>
                  <p className="text-sm font-semibold text-gray-700">
                    Quadra:{" "}
                    <span className="font-medium">{lastBooking.quadra}</span>
                  </p>
                  <p className="text-sm font-semibold text-gray-700">
                    Data:{" "}
                    <span className="font-medium">
                      {formatarDataBrasileira(lastBooking.data)}
                    </span>
                  </p>
                  <p className="text-sm font-semibold text-gray-700">
                    Horário:{" "}
                    <span className="font-medium">{lastBooking.slot}</span>
                  </p>
                  <p className="text-sm font-semibold text-gray-700 mt-1">
                    Status:{" "}
                    <span
                      className={
                        lastBooking.status === "CONFIRMADO"
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {lastBooking.status}
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

          <div className="flex-1 min-w-[280px] max-w-[350px] bg-white rounded-xl shadow-md p-6 flex flex-col justify-between">
            <div className="text-center">
              <PlusCircle size={40} className="text-azulBase mb-3 mx-auto" />
              <h2 className="text-lg font-semibold mb-2">
                Realizar nova reserva
              </h2>
              <p className="text-sm text-gray-700 mb-4">
                Encontre o horário perfeito e reserve sua quadra favorita com
                facilidade.
              </p>
            </div>
            <button
              className="w-full font-semibold py-2 rounded bg-azulBase text-white hover:bg-azulBase/90 flex items-center justify-center gap-2"
              onClick={() => navigate("/agendamento")}
            >
              <CalendarPlus size={16} /> Agendar agora
            </button>
          </div>

          <div className="flex-1 min-w-[280px] max-w-[350px] bg-white rounded-xl shadow-md p-6 flex flex-col justify-between">
            <div className="text-center">
              <ClipboardList size={40} className="text-azulBase mb-3 mx-auto" />
              <h2 className="text-lg font-semibold mb-2">
                Minhas reservas ativas
              </h2>
              <p className="text-sm text-gray-700 mb-4">
                Você tem{" "}
                <span className="text-azulBase font-bold">
                  {numberOfActiveBookings}
                </span>{" "}
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
        </div>
      </main>

      <FooterEuro />

      <BottomNav />
    </div>
  );
}

export default Dashboard;
