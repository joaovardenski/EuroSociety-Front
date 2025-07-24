// Hooks
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Icons
import { ArrowLeft } from "lucide-react";

// Components
import HeaderEuro from "../../components/Layout/HeaderEuro";
import SearchOptionButton from "../../components/SearchOptionButton";
import BookingCard from "../../components/Reservas/BookingCard";
import type { Reserva } from "../../components/Reservas/BookingCard";
import FooterEuro from "../../components/Layout/FooterEuro";
import BottomNav from "../../components/Navigation/BottomNav";
import Modal from "../../components/Modais/Modal";
import ModalCancelarReserva from "../../components/Modais/Client/ModalCancelarReserva";
import LoadingMessage from "../../components/LoadingMessage";

// Types
type FiltroReservas = "Todas" | "Próximas" | "Anteriores";

function MyBookings() {
  const navigate = useNavigate();

  const [modalOpen, setModalOpen] = useState(false);
  const [reservaSelecionada, setReservaSelecionada] = useState<Reserva | null>(null);
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [searchOption, setSearchOption] = useState<FiltroReservas>("Todas");
  const [isLoading, setIsLoading] = useState(true);

  // Simulação de chamada de API (substitua por fetch/axios depois)
  async function getMinhasReservas(): Promise<Reserva[]> {
    return import("../../data/Variaveis").then((mod) => mod.minhasReservas);
  }

  useEffect(() => {
    async function carregarReservas() {
      try {
        const reservasAPI = await getMinhasReservas();
        setReservas(reservasAPI);
      } catch (error) {
        console.error("Erro ao carregar reservas:", error);
      } finally {
        setIsLoading(false);
      }
    }

    carregarReservas();
  }, []);

  function abrirModal(reserva: Reserva) {
    setReservaSelecionada(reserva);
    setModalOpen(true);
  }

  function confirmarCancelamento() {
    if (reservaSelecionada) {
      setReservas((prev) => prev.filter((r) => r.id !== reservaSelecionada.id));
    }

    setModalOpen(false);
    setReservaSelecionada(null);
  }

  function filtrarReservas(reservas: Reserva[], filtro: string): Reserva[] {
    const agora = new Date();

    return reservas
      .filter((reserva) => {
        const [horaInicio] = reserva.slot.split(" - ");
        const dataHoraReserva = new Date(`${reserva.data}T${horaInicio}:00`);

        if (filtro === "Próximas") return dataHoraReserva >= agora;
        if (filtro === "Anteriores") return dataHoraReserva < agora;
        return true;
      })
      .sort((a, b) => {
        const [horaInicioA] = a.slot.split(" - ");
        const [horaInicioB] = b.slot.split(" - ");
        const dataHoraA = new Date(`${a.data}T${horaInicioA}:00`).getTime();
        const dataHoraB = new Date(`${b.data}T${horaInicioB}:00`).getTime();

        return filtro === "Anteriores" ? dataHoraB - dataHoraA : dataHoraA - dataHoraB;
      });
  }

  const reservasFiltradas = filtrarReservas(reservas, searchOption);

  return (
    <div className="flex flex-col min-h-screen bg-[#f3f7ff]">
      <HeaderEuro />

      <main className="flex flex-col flex-grow mb-12 px-4 py-8 max-w-5xl mx-auto w-full md:mb-0">
        {isLoading ? (
          <LoadingMessage message="Carregando reservas..."/>
        ) : (
          <>
            {/* Título e filtros */}
            <div className="flex flex-col items-center justify-center gap-5 md:justify-between md:flex-row mb-3">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate(-1)}
                  className="text-azulBase hover:text-azulEscuro transition"
                >
                  <ArrowLeft size={23} />
                </button>
                <h1 className="text-2xl font-semibold text-azulBase">
                  Minhas reservas
                </h1>
              </div>

              <div className="flex gap-3">
                <SearchOptionButton
                  label="Todas"
                  isActive={searchOption === "Todas"}
                  onClick={() => setSearchOption("Todas")}
                />
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
              </div>
            </div>
            <hr className="hidden md:block mb-6 border-t-2 rounded-2xl border-azulBase opacity-70" />

            {/* Cards de reservas filtradas */}
            <div className="space-y-4">
              {reservasFiltradas.length === 0 ? (
                <div className="flex flex-col bg-white items-center justify-center text-center text-gray-600 py-16">
                  <p className="text-lg font-semibold mb-2">
                    Nenhuma reserva encontrada para este filtro.
                  </p>
                  <a
                    href="/agendamento"
                    className="text-azulBase hover:text-azulEscuro transition"
                  >
                    Clique aqui para agendar uma nova reserva
                  </a>
                </div>
              ) : (
                reservasFiltradas.map((reserva) => (
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
            quadra={reservaSelecionada.quadra}
            data={reservaSelecionada.data}
            horario={reservaSelecionada.slot}
            onClose={() => setModalOpen(false)}
            onConfirm={confirmarCancelamento}
          />
        )}
      </Modal>
    </div>
  );
}

export default MyBookings;
