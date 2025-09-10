import { useState, useMemo } from "react";
// Components
import HeaderEuro from "../../components/Layout/HeaderEuro";
import AdminSidebar from "../../components/Navigation/AdminSidebar";
import FooterEuro from "../../components/Layout/FooterEuro";
import { Search } from "lucide-react";
import FiltroData from "../../components/Filtros/FiltroData";
import TableActiveBookings from "../../components/Reservas/TableActiveBookings";
// Modais
import ModalRecebimentoAdmin from "../../components/Modais/Admin/ModalRecebimento";
import ModalCancelarAdmin from "../../components/Modais/Admin/ModalCancelarAdmin";
// Utils
import { getCurrentDate } from "../../utils/DateUtils";
import type { Reserva } from "../../types/interfacesFront";
import { useAgendamentosAtivos } from "../../hooks/useAgendamentosAtivos";
import axiosPrivate from "../../api/axiosPrivate";

export default function ActiveBookingsAdmin() {
  const [dataSelecionada, setDataSelecionada] = useState(getCurrentDate());
  const [searchQuery, setSearchQuery] = useState("");
  const [modalRecebimentoOpen, setModalRecebimentoOpen] = useState(false);
  const [modalCancelarOpen, setModalCancelarOpen] = useState(false);
  const [agendamentoSelecionado, setAgendamentoSelecionado] =
    useState<Reserva | null>(null);

  const {
    agendamentos,
    setAgendamentos,
    loading: isLoading,
  } = useAgendamentosAtivos(dataSelecionada);

  // Filtra os agendamentos com useMemo para melhor desempenho
  const agendamentosFiltrados = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return agendamentos.filter(
      (r) =>
        r.cliente_nome?.toLowerCase().includes(query) ||
        r.user?.nome.toLowerCase().includes(query)
    );
  }, [agendamentos, searchQuery]);

  // Valida e altera a data selecionada
  const handleSetDataSelecionada = (novaData: string) => {
    if (novaData < getCurrentDate()) {
      alert("Não é possível selecionar uma data passada.");
      return;
    }
    setDataSelecionada(novaData);
  };

  // Confirma pagamento restante
  const confirmarPagamentoRestante = async (reservaId: number) => {
    try {
      await axiosPrivate.post(
        `/reservas/${reservaId}/confirmar-pagamento-restante`
      );
      setAgendamentos((prev) =>
        prev.map((r) =>
          r.id === reservaId
            ? {
                ...r,
                pagamentoFaltante: 0,
                status: "agendada",
                statusPagamento: "Completo",
              }
            : r
        )
      );
      setModalRecebimentoOpen(false);
    } catch (err) {
      console.error("Erro ao confirmar pagamento restante:", err);
    }
  };

  // Cancela a reserva
  const cancelarReserva = async (reservaId: number) => {
    try {
      await axiosPrivate.post(
        `/reservas/${reservaId}/cancelar?reembolso=false`
      );
      setAgendamentos((prev) => prev.filter((r) => r.id !== reservaId));
      setModalCancelarOpen(false);
    } catch (err) {
      console.error("Erro ao cancelar reserva:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#e6f4ff]">
      <HeaderEuro />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-grow p-6 max-w-6xl w-full mx-auto bg-white mt-6 mb-10 rounded-3xl shadow-xl">
          <h1 className="text-xl font-semibold text-azulBase mb-4">
            Agendamentos ativos
          </h1>

          {/* Filtros */}
          <div className="bg-gray-100/50 border border-black rounded-xl mb-6 py-4 flex items-center justify-between gap-6">
            <div className="flex items-center gap-4 pl-4">
              <FiltroData
                dataSelecionada={dataSelecionada}
                setDataSelecionada={handleSetDataSelecionada}
              />
            </div>
            <div className="flex">
              <input
                type="search"
                placeholder="Pesquisar"
                className="border-2 border-gray-600/50 py-1 px-2 rounded-xl outline-0"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search
                className="text-gray-600 relative right-8 top-2"
                size={18}
              />
            </div>
          </div>

          {isLoading ? (
            <p className="text-center text-gray-500">
              Carregando agendamentos...
            </p>
          ) : (
            <TableActiveBookings
              reservas={agendamentosFiltrados}
              onReceberClick={(reserva) => {
                setAgendamentoSelecionado(reserva);
                setModalRecebimentoOpen(true);
              }}
              onCancelarClick={(reserva) => {
                setAgendamentoSelecionado(reserva);
                setModalCancelarOpen(true);
              }}
            />
          )}
        </main>
      </div>
      <FooterEuro />

      {/* Modais */}
      {agendamentoSelecionado && (
        <>
          <ModalRecebimentoAdmin
            isOpen={modalRecebimentoOpen}
            onClose={() => setModalRecebimentoOpen(false)}
            dados={agendamentoSelecionado}
            onConfirmar={() =>
              confirmarPagamentoRestante(agendamentoSelecionado.id)
            }
          />
          <ModalCancelarAdmin
            isOpen={modalCancelarOpen}
            onClose={() => setModalCancelarOpen(false)}
            dados={agendamentoSelecionado}
            onConfirmar={() => cancelarReserva(agendamentoSelecionado.id)}
          />
        </>
      )}
    </div>
  );
}
