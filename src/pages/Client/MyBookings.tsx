import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

import HeaderEuro from "../../components/Layout/HeaderEuro";
import SearchOptionButton from "../../components/SearchOptionButton";
import BookingCard from "../../components/Reservas/BookingCard";
import FooterEuro from "../../components/Layout/FooterEuro";
import BottomNav from "../../components/Navigation/BottomNav";
import Modal from "../../components/Modais/Modal";
import ModalCancelarReserva from "../../components/Modais/Client/ModalCancelarReserva";
import LoadingMessage from "../../components/LoadingMessage";

import type { Reserva } from "../../types/interfacesFront";
import {
  getMinhasReservas,
  cancelarMinhaReserva,
} from "../../services/reservaService";
import useQuadras from "../../hooks/useQuadras";
import type { FiltroReservas } from "../../services/reservaService";

type ReservaComReembolso = Reserva & { podeReembolso: boolean };

export default function MyBookings() {
  // -----------------------
  // Estados
  // -----------------------
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [searchOption, setSearchOption] = useState<FiltroReservas>("Próximas");
  const [meta, setMeta] = useState<{
    current_page: number;
    last_page: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [reservaSelecionada, setReservaSelecionada] =
    useState<ReservaComReembolso | null>(null);

  const { quadras, loading: quadrasLoading } = useQuadras();

  // -----------------------
  // Funções auxiliares
  // -----------------------

  async function carregarReservas(filtro: FiltroReservas, page = 1) {
    setIsLoading(true);
    try {
      const { data: reservasAPI, meta } = await getMinhasReservas(filtro, page);

      // Mapeia cada reserva para data + horário em Date
      const reservasComData = reservasAPI.map((reserva) => {
        const [horaInicio] = reserva.slot.split(" - ");
        const [hora, minuto] = horaInicio.split(":").map(Number);
        const [ano, mes, dia] = reserva.data
          .split("T")[0]
          .split("-")
          .map(Number);
        return {
          ...reserva,
          dataHora: new Date(ano, mes - 1, dia, hora, minuto),
        };
      });

      const agora = new Date();
      const ativas = reservasComData
        .filter(
          (r) => r.dataHora >= agora && r.status.toLowerCase() === "confirmada"
        )
        .sort((a, b) => a.dataHora.getTime() - b.dataHora.getTime());

      const passadas = reservasComData
        .filter(
          (r) => r.dataHora < agora || r.status.toLowerCase() !== "confirmada"
        )
        .sort((a, b) => b.dataHora.getTime() - a.dataHora.getTime());

      setReservas([...ativas, ...passadas]); // salva reservas
      setMeta(meta); // salva paginação
    } catch (error) {
      console.error("Erro ao carregar reservas:", error);
      setReservas([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    carregarReservas(searchOption); // só o filtro
  }, [searchOption]);

  // Abrir modal de cancelamento
  function abrirModal(reserva: Reserva) {
    setReservaSelecionada({
      ...reserva,
      podeReembolso: podeTerReembolso(reserva),
    });
    setModalOpen(true);
  }

  // Confirmar cancelamento de reserva
  async function confirmarCancelamento() {
    if (!reservaSelecionada) return;

    try {
      await cancelarMinhaReserva(
        reservaSelecionada.id,
        reservaSelecionada.podeReembolso
      );
      setReservas((prev) => prev.filter((r) => r.id !== reservaSelecionada.id));
    } catch (error) {
      console.error("Erro ao cancelar reserva:", error);
      alert("Não foi possível cancelar a reserva. Tente novamente.");
    } finally {
      setModalOpen(false);
      setReservaSelecionada(null);
    }
  }

  // Determina se a reserva ainda pode ter reembolso
  function podeTerReembolso(reserva: Reserva): boolean {
    // Apenas reservas confirmadas e do tipo "unica" podem ter reembolso
    if (
      reserva.status.toLowerCase() !== "confirmada" ||
      reserva.tipoReserva !== "unica"
    ) {
      return false;
    }

    const [horaInicio] = reserva.slot.split(" - ");
    const [hora, minuto] = horaInicio.split(":").map(Number);
    const [ano, mes, dia] = reserva.data.split("T")[0].split("-").map(Number);
    const dataHoraReserva = new Date(ano, mes - 1, dia, hora, minuto);

    const diffMilissegundos = dataHoraReserva.getTime() - Date.now();
    const seteHorasMilissegundos = 7 * 60 * 60 * 1000;

    return diffMilissegundos > seteHorasMilissegundos;
  }

  // -----------------------
  // Hooks
  // -----------------------
  useEffect(() => {
    carregarReservas(searchOption);
  }, [searchOption]);

  // -----------------------
  // JSX
  // -----------------------
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
                  to="/home"
                  className="text-azulBase hover:text-azulEscuro transition"
                >
                  <ArrowLeft size={23} />
                </Link>
                <h1 className="text-2xl font-semibold text-azulBase">
                  Minhas reservas
                </h1>
              </div>

              <div className="flex gap-3">
                {(["Próximas", "Anteriores", "Todas"] as FiltroReservas[]).map(
                  (filtro) => (
                    <SearchOptionButton
                      key={filtro}
                      label={filtro}
                      isActive={searchOption === filtro}
                      onClick={() => setSearchOption(filtro)}
                    />
                  )
                )}
              </div>
            </div>

            <hr className="hidden md:block mb-6 border-t-2 rounded-2xl border-azulBase opacity-70" />

            {/* Lista de reservas */}
            <div className="space-y-4">
              {reservas.length === 0 ? (
                <div className="flex flex-col bg-white items-center justify-center text-center text-gray-600 py-16">
                  <p className="text-lg font-semibold mb-2">
                    Nenhuma reserva encontrada para este filtro.
                  </p>
                  <Link
                    to="/agendamento"
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
                    quadras={quadras}
                    loading={quadrasLoading}
                  />
                ))
              )}
            </div>

            {/* Paginação */}
            {meta && meta.last_page > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <button
                  disabled={meta.current_page === 1}
                  onClick={() =>
                    carregarReservas(searchOption, meta.current_page - 1)
                  }
                  className="px-4 py-2 rounded-lg border border-azulBase text-azulBase 
                           hover:bg-azulBase hover:text-white transition disabled:opacity-50"
                >
                  Anterior
                </button>

                <span className="text-gray-600 font-medium">
                  Página {meta.current_page} de {meta.last_page}
                </span>

                <button
                  disabled={meta.current_page === meta.last_page}
                  onClick={() =>
                    carregarReservas(searchOption, meta.current_page + 1)
                  }
                  className="px-4 py-2 rounded-lg border border-azulBase text-azulBase 
                           hover:bg-azulBase hover:text-white transition disabled:opacity-50"
                >
                  Próxima
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <BottomNav />
      <FooterEuro />

      {/* Modal de cancelamento */}
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
