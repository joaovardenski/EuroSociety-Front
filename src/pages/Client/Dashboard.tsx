// Hooks
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// Components
import HeaderEuro from "../../components/Layout/HeaderEuro";
import FooterEuro from "../../components/Layout/FooterEuro";
import BottomNav from "../../components/Navigation/BottomNav";
import ProximaReservaCard from "../../components/Reservas/ProximaReservaCard";
import CardNovaReserva from "../../components/Reservas/NovaReservaCard";
import ReservasAtivasCard from "../../components/Reservas/ReservasAtivasCard";
import LoadingMessage from "../../components/LoadingMessage";
// Types
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

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState<string>("");
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function carregarDados() {
      try {
        // Simula chamadas à API
        const usuarioDaAPI = await getUsuario();
        const reservasDaAPI = await getMinhasReservas();

        setUser(usuarioDaAPI);
        setReservas(reservasDaAPI);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setIsLoading(false);
      }
    }

    carregarDados();
  }, []);

  // Simulações de API (substitua com fetch/axios futuramente)
  async function getUsuario(): Promise<string> {
    return "João Victor";
  }

  async function getMinhasReservas(): Promise<Reserva[]> {
    return import("../../data/Variaveis").then((mod) => mod.minhasReservas);
  }

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

  const activeBookings = getReservasConfirmadas(reservas);
  const numberOfActiveBookings = activeBookings.length;
  const lastBooking = getProximaReserva(activeBookings);

  return (
    <div className="flex flex-col min-h-screen bg-[#e1e6f9]">
      <HeaderEuro />

      <main className="flex flex-col items-center flex-grow px-4 py-10 w-full">
        {isLoading ? (
          <LoadingMessage message="Carregando dados..."/>
        ) : (
          <>
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
              <ProximaReservaCard reserva={lastBooking} navigate={navigate} />
              <CardNovaReserva navigate={navigate} />
              <ReservasAtivasCard
                count={numberOfActiveBookings}
                navigate={navigate}
              />
            </div>
          </>
        )}
      </main>

      <FooterEuro />
      <BottomNav />
    </div>
  );
}

export default Dashboard;
