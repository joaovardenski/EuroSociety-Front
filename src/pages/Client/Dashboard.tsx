import { useEffect, useMemo } from "react";
import HeaderEuro from "../../components/Layout/HeaderEuro";
import FooterEuro from "../../components/Layout/FooterEuro";
import BottomNav from "../../components/Navigation/BottomNav";
import ProximaReservaCard from "../../components/Reservas/ProximaReservaCard";
import CardNovaReserva from "../../components/Reservas/NovaReservaCard";
import ReservasAtivasCard from "../../components/Reservas/ReservasAtivasCard";
import LoadingMessage from "../../components/LoadingMessage";
import type { Reserva } from "../../types/interfacesFront";
import { useAuth } from "../../hooks/useAuth";
import { getNomeCondensado } from "../../utils/NameUtils";
import useReservas from "../../hooks/useReservas";
import useActiveBookingsCount from "../../hooks/useUserAgendamentosAtivos";

type ReservaComDataHora = Reserva & { dataHora: Date };

function Dashboard() {
  const auth = useAuth();

  // Persistir nome apenas quando mudar
  useEffect(() => {
    if (auth.user?.nome) {
      localStorage.setItem("user_nome", auth.user.nome);
    }
  }, [auth.user?.nome]);

  const { reservas, isLoading } = useReservas(
    auth.isAuthenticated && !auth.isLoading
  );

  const { count: activeBookingsCount } = useActiveBookingsCount(
    auth.isAuthenticated && !auth.isLoading
  );

  const activeBookings = useMemo(
    () => reservas.filter((r) => r.status.toLowerCase() === "confirmada"),
    [reservas]
  );

  const lastBooking = useMemo(() => {
    const agora = new Date();
    return activeBookings
      .map(adicionarDataHora)
      .filter((r) => r.dataHora > agora)
      .sort((a, b) => a.dataHora.getTime() - b.dataHora.getTime())[0];
  }, [activeBookings]);

  const username = getNomeCondensado(
    localStorage.getItem("user_nome") || "Usuário"
  );

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
              <ReservasAtivasCard count={activeBookingsCount} />
            </div>
          </>
        )}
      </main>

      <FooterEuro />
      <BottomNav />
    </div>
  );
}

function adicionarDataHora(reserva: Reserva): ReservaComDataHora {
  const [horaInicio] = reserva.slot.split(" - ");
  const dataApenas = reserva.data.split("T")[0];
  return { ...reserva, dataHora: new Date(`${dataApenas}T${horaInicio}:00`) };
}

export default Dashboard;
