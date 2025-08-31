import { useEffect, useState } from "react";
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
import type { Reserva, Usuario, Quadra } from "../../types/interfaces";
import axiosPrivate from "../../api/axiosPrivate";

// Interface para os dados crus do backend, usando snake_case
interface ReservaBackend {
  id: number;
  user?: Usuario | null;
  user_id?: number | null;
  quadra?: Quadra;
  quadra_id: number;
  tipo_reserva: string;
  mensalidade_id?: number | null;
  pagamento_id?: number | null;
  pagamento_faltante: string;
  data: string;
  slot: string;
  status: string;
  cliente_nome?: string | null;
  created_at: string;
  updated_at: string;
}

// Função de mapeamento que transforma os dados do backend para a nossa interface
const mapReservasFromBackend = (data: ReservaBackend[]): Reserva[] => {
  return data.map((reserva) => ({
    id: reserva.id,
    user: reserva.user,
    userId: reserva.user_id,
    quadra: reserva.quadra,
    quadraId: reserva.quadra_id,
    tipoReserva: reserva.tipo_reserva,
    mensalidadeId: reserva.mensalidade_id,
    pagamentoId: reserva.pagamento_id,
    // Converte a string do backend para um número
    pagamentoFaltante: parseFloat(reserva.pagamento_faltante),
    data: reserva.data,
    slot: reserva.slot,
    status: reserva.status,
    clienteNome: reserva.cliente_nome,
    createdAt: reserva.created_at,
    updatedAt: reserva.updated_at,
    // Adiciona a propriedade de status de pagamento com base na lógica do frontend
    statusPagamento: parseFloat(reserva.pagamento_faltante) === 0 ? "Completo" : "Parcial",
  }));
};

export default function ActiveBookingsAdmin() {
  const [dataSelecionada, setDataSelecionada] = useState(getCurrentDate);
  const [agendamentos, setAgendamentos] = useState<Reserva[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalRecebimentoOpen, setModalRecebimentoOpen] = useState(false);
  const [modalCancelarOpen, setModalCancelarOpen] = useState(false);
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState<Reserva | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const agendamentosFiltrados = agendamentos.filter((reserva) =>
    reserva.cliente_nome?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false
  );

  function handleSetDataSelecionada(novaData: string) {
    if (novaData < getCurrentDate()) {
      alert("Não é possível selecionar uma data passada.");
      return;
    }
    setDataSelecionada(novaData);
  }

  // A função de cálculo foi movida para o componente da tabela para maior clareza
  const confirmarPagamentoRestante = async (reservaId: number) => {
    console.log(reservaId)
    try {
      await axiosPrivate.post(`/reservas/${reservaId}/confirmar-pagamento-restante`);
      setAgendamentos((prev) =>
        prev.map((r) =>
          r.id === reservaId
            ? { ...r, pagamentoFaltante: 0, status: "agendada", statusPagamento: "Completo" }
            : r
        )
      );
      setModalRecebimentoOpen(false);
    } catch (err) {
      console.error("Erro ao confirmar pagamento restante:", err);
    }
  };

  const cancelarReserva = async (reservaId: number) => {
    try {
      await axiosPrivate.delete(`/reservas/${reservaId}/cancelar?reembolso=false`);
      setAgendamentos((prev) => prev.filter((r) => r.id !== reservaId));
      setModalCancelarOpen(false);
    } catch (err) {
      console.error("Erro ao cancelar reserva:", err);
    }
  };

  useEffect(() => {
    async function carregarAgendamentos() {
      setIsLoading(true);
      try {
        const response = await axiosPrivate.get("/reservas/por-data", {
          params: { data: dataSelecionada },
        });
        // Mapeia os dados do backend para a interface do frontend
        const agendamentosFormatados = mapReservasFromBackend(response.data);
        console.log("Agendamentos formatados:", agendamentosFormatados)
        setAgendamentos(agendamentosFormatados);
      } catch (error) {
        console.error("Erro ao carregar agendamentos:", error);
      } finally {
        setIsLoading(false);
      }
    }
    carregarAgendamentos();
  }, [dataSelecionada]);

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
              onReceberClick={(agendamento) => {
                setAgendamentoSelecionado(agendamento);
                setModalRecebimentoOpen(true);
              }}
              onCancelarClick={(agendamento) => {
                setAgendamentoSelecionado(agendamento);
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
            onConfirmar={() => {
              confirmarPagamentoRestante(agendamentoSelecionado.id);
            }}
          />
          <ModalCancelarAdmin
            isOpen={modalCancelarOpen}
            onClose={() => setModalCancelarOpen(false)}
            dados={agendamentoSelecionado}
            onConfirmar={() => {
              cancelarReserva(agendamentoSelecionado.id);
            }}
          />
        </>
      )}
    </div>
  );
}