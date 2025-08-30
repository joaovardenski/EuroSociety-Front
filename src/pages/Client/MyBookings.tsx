import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import HeaderEuro from "../../components/Layout/HeaderEuro";
import SearchOptionButton from "../../components/SearchOptionButton";
import BookingCard from "../../components/Reservas/BookingCard";
import FooterEuro from "../../components/Layout/FooterEuro";
import BottomNav from "../../components/Navigation/BottomNav";
import Modal from "../../components/Modais/Modal";
import ModalCancelarReserva from "../../components/Modais/Client/ModalCancelarReserva";
import LoadingMessage from "../../components/LoadingMessage";
import { Link } from "react-router-dom";
import type { Reserva } from "../../types/interfaces";
import axios from "axios";
import axiosPrivate from "../../api/axiosPrivate";

type FiltroReservas = "Todas" | "Próximas" | "Anteriores";
// Add this new type definition near the top of MyBookings.tsx
type ReservaComReembolso = Reserva & {
  podeReembolso: boolean;
};

function MyBookings() {
  const [modalOpen, setModalOpen] = useState(false);
  const [reservaSelecionada, setReservaSelecionada] = useState<ReservaComReembolso | null>(null);
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [searchOption, setSearchOption] = useState<FiltroReservas>("Próximas");
  const [isLoading, setIsLoading] = useState(true);

  // Pega reservas da API
  async function getMinhasReservas(filtro: FiltroReservas): Promise<Reserva[]> {
    try {
      const token = localStorage.getItem("token"); // ou onde você salva o token no login

      // Mapear filtro do frontend → filtro da API
      let filtroAPI = "ativas";
      if (filtro === "Próximas") filtroAPI = "ativas";
      if (filtro === "Anteriores") filtroAPI = "passadas";
      if (filtro === "Todas") filtroAPI = "todas";

      const response = await axiosPrivate.get(
        `/user/bookings?filter=${filtroAPI}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return response.data.data;
    } catch (error) {
      console.error("Erro ao buscar reservas:", error);
      return [];
    }
  }

  async function cancelarReservaAPI(reservaId: number) {
    try {
      console.log("Tentando cancelar reserva com ID:", reservaId);
      const token = localStorage.getItem("token");
      const response = await axiosPrivate.post(
        `/reservas/${reservaId}`,
        {}, // corpo vazio
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { reembolso: true },
        }
      );

      console.log("Resposta do cancelamento:", response.data);

      setReservas((prev) => prev.filter((r) => r.id !== reservaId));
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Erro ao cancelar reserva:",
          error.response?.data || error.message
        );
      } else if (error instanceof Error) {
        console.error("Erro ao cancelar reserva:", error.message);
      } else {
        console.error("Erro ao cancelar reserva:", error);
      }

      alert("Não foi possível cancelar a reserva. Tente novamente.");
    }
  }

  useEffect(() => {
    async function carregarReservas() {
      setIsLoading(true);
      const reservasAPI = await getMinhasReservas(searchOption);
      setReservas(reservasAPI);
      setIsLoading(false);
    }

    carregarReservas();
  }, [searchOption]);

  function abrirModal(reserva: Reserva) {
    const podeReembolso = podeTerReembolso(reserva);
    setReservaSelecionada({ ...reserva, podeReembolso });
    setModalOpen(true);
  }

  function confirmarCancelamento() {
    if (reservaSelecionada) {
      cancelarReservaAPI(reservaSelecionada.id);
    }
    setModalOpen(false);
    setReservaSelecionada(null);
  }

  function podeTerReembolso(reserva: Reserva): boolean {
    // A sua lógica aqui está correta. Mantenha-a como está.
    const [horaInicio] = reserva.slot.split(" - ");
    const [hora, minuto] = horaInicio.split(":").map(Number);
    const [ano, mes, dia] = reserva.data.split("T")[0].split("-").map(Number);
    const dataHoraReserva = new Date(ano, mes - 1, dia, hora, minuto);

    const diffMilissegundos = dataHoraReserva.getTime() - Date.now();
    const seteHorasMilissegundos = 7 * 60 * 60 * 1000;

    return (
      diffMilissegundos > seteHorasMilissegundos &&
      reserva.status.toLowerCase() === "confirmada"
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f3f7ff]">
      <HeaderEuro />

      <main className="flex flex-col flex-grow mb-12 px-4 py-8 max-w-5xl mx-auto w-full md:mb-0">
        {isLoading ? (
          <LoadingMessage message="Carregando reservas..." />
        ) : (
          <>
            {/* Título e filtros */}
            <div className="flex flex-col items-center justify-center gap-5 md:justify-between md:flex-row mb-3">
              <div className="flex items-center gap-4">
                <Link
                  to={"/home"}
                  className="text-azulBase hover:text-azulEscuro transition"
                >
                  <ArrowLeft size={23} />
                </Link>
                <h1 className="text-2xl font-semibold text-azulBase">
                  Minhas reservas
                </h1>
              </div>

              <div className="flex gap-3">
                <SearchOptionButton
                  label="Próximas"
                  isActive={searchOption === "Próximas"}
                  onClick={() => setSearchOption("Próximas")}
                />
                <SearchOptionButton
                  label="Anteriores"
                  isActive={searchOption === "Anteriores"}
                  onClick={() => setSearchOption("Anteriores")}
                />
                <SearchOptionButton
                  label="Todas"
                  isActive={searchOption === "Todas"}
                  onClick={() => setSearchOption("Todas")}
                />
              </div>
            </div>
            <hr className="hidden md:block mb-6 border-t-2 rounded-2xl border-azulBase opacity-70" />

            {/* Cards de reservas filtradas */}
            <div className="space-y-4">
              {reservas.length === 0 ? (
                <div className="flex flex-col bg-white items-center justify-center text-center text-gray-600 py-16">
                  <p className="text-lg font-semibold mb-2">
                    Nenhuma reserva encontrada para este filtro.
                  </p>
                  <Link
                    to={"/agendamento"}
                    className="text-azulBase hover:text-azulEscuro transition"
                  >
                    Clique aqui para agendar uma nova reserva
                  </Link>
                </div>
              ) : (
                reservas.map((reserva) => (
                  <BookingCard
                    key={reserva.id}
                    reserva={reserva}
                    onCancel={abrirModal}
                  />
                ))
              )}
            </div>
          </>
        )}
      </main>

      <BottomNav />
      <FooterEuro />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        {reservaSelecionada && (
          <ModalCancelarReserva
            quadra={reservaSelecionada.quadra?.nome}
            data={reservaSelecionada.data}
            horario={reservaSelecionada.slot}
            podeReembolso={reservaSelecionada.podeReembolso}
            onClose={() => setModalOpen(false)}
            onConfirm={confirmarCancelamento}
          />
        )}
      </Modal>
    </div>
  );
}

export default MyBookings;
