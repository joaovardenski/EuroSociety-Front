// Hooks
import { useEffect, useState } from "react";
// Components
import HeaderEuro from "../../components/Layout/HeaderEuro";
import FooterEuro from "../../components/Layout/FooterEuro";
import BottomNav from "../../components/Navigation/BottomNav";
import ProximaReservaCard from "../../components/Reservas/ProximaReservaCard";
import CardNovaReserva from "../../components/Reservas/NovaReservaCard";
import ReservasAtivasCard from "../../components/Reservas/ReservasAtivasCard";
import LoadingMessage from "../../components/LoadingMessage";
import type { Reserva } from "../../types/interfaces";
import { useAuth } from "../../hooks/useAuth";
import { getNomeCondensado } from "../../utils/NameUtils";
import axiosPrivate from "../../api/axiosPrivate";

type ReservaComDataHora = Reserva & { dataHora: Date };

function Dashboard() {
  const auth = useAuth();
  localStorage.setItem("user_nome", auth.user?.nome || "");
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const username = getNomeCondensado(
    localStorage.getItem("user_nome") || "Usuário Desconhecido"
  );
  useEffect(() => {
    async function carregarReservas() {
      try {
        const reservasDaAPI = await getMinhasReservas();
        setReservas(reservasDaAPI);
        console.log("1) Reservas carregadas:", reservasDaAPI);
      } catch (error) {
        console.error("Erro ao carregar reservas:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (!auth.isLoading && auth.isAuthenticated) {
      carregarReservas();
    }
  }, [auth.isLoading, auth.isAuthenticated]);

  async function getMinhasReservas(): Promise<Reserva[]> {
    const token = localStorage.getItem("token");
    const response = await axiosPrivate.get(`/user/bookings?filter=ativas`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log(
      "0) Resposta da API /user/bookings?filter=ativas:",
      response.data
    );

    // acessa o campo 'data' da resposta
    const reservas = response.data.data;
    return Array.isArray(reservas) ? reservas : [];
  }

  function getReservasConfirmadas(reservas: Reserva[]): Reserva[] {
    return reservas.filter(
      (reserva) => reserva.status.toLowerCase() === "confirmada"
    );
  }

  function getProximaReserva(
    reservas: Reserva[]
  ): ReservaComDataHora | undefined {
    // Pega minha próxima reserva
    const agora = new Date();
    console.log("2) Reservas para processar:", reservas);
    return reservas
      .map(adicionarDataHora)
      .filter(
        (reserva) =>
          reserva.dataHora > agora &&
          reserva.status.toLowerCase() === "confirmada"
      )

      .sort((a, b) => a.dataHora.getTime() - b.dataHora.getTime())[0];
  }

  function adicionarDataHora(reserva: Reserva): ReservaComDataHora {
    const [horaInicio] = reserva.slot.split(" - ");

    // Extrai só o "YYYY-MM-DD" da data ISO que vem da API
    const dataApenas = reserva.data.split("T")[0];

    return {
      ...reserva,
      dataHora: new Date(`${dataApenas}T${horaInicio}:00`),
    };
  }

  const activeBookings = getReservasConfirmadas(reservas || []);
  console.log("3) Reservas ativas:", activeBookings);
  const numberOfActiveBookings = activeBookings.length;
  const lastBooking = getProximaReserva(activeBookings);

  return (
    <div className="flex flex-col min-h-screen bg-[#e1e6f9]">
      <HeaderEuro />

      <main className="flex flex-col items-center flex-grow px-4 py-10 w-full">
        {isLoading ? (
          <LoadingMessage message="Carregando dados..." />
        ) : (
          <>
            {/* Boas-vindas */}
            <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900">
                Seja bem-vindo,{" "}
                <span className="text-azulBase">{username}</span>!
              </h1>
              <p className="text-gray-600 mt-2">
                Confira seus agendamentos e aproveite nossas quadras.
              </p>
            </div>

            {/* Cards */}
            <div className="flex flex-wrap gap-6 justify-center w-full max-w-6xl mb-10 md:mb-0">
              <ProximaReservaCard reserva={lastBooking} />
              <CardNovaReserva />
              <ReservasAtivasCard count={numberOfActiveBookings} />
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
