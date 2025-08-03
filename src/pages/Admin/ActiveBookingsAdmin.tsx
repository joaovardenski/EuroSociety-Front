import { useEffect, useState } from "react";

// Components
import HeaderEuro from "../../components/Layout/HeaderEuro";
import AdminSidebar from "../../components/Navigation/AdminSidebar";
import FooterEuro from "../../components/Layout/FooterEuro";
import { Search } from "lucide-react";
import FiltroData from "../../components/Filtros/FiltroData";
import FiltroTipo from "../../components/Filtros/FiltroTipo";
import TableActiveBookings from "../../components/Reservas/TableActiveBookings";

// Modais
import ModalRecebimentoAdmin from "../../components/Modais/Admin/ModalRecebimento";
import ModalCancelarAdmin from "../../components/Modais/Admin/ModalCancelarAdmin";

// Utils
import { getCurrentDate } from "../../utils/DateUtils";
import type { Reserva } from "../../types/interfaces";

export default function ActiveBookingsAdmin() {
  const [tipoSelecionado, setTipoSelecionado] = useState("Todas");
  const [dataSelecionada, setDataSelecionada] = useState(getCurrentDate);

  const [agendamentos, setAgendamentos] = useState<Reserva[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [modalRecebimentoOpen, setModalRecebimentoOpen] = useState(false);
  const [modalCancelarOpen, setModalCancelarOpen] = useState(false);

  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState<{
    cliente: string;
    quadra: string;
    data: Date;
    horario: string;
    pagamentoFaltante: number;
  } | null>(null);

  function handleSetDataSelecionada(novaData: string) {
    if (novaData < getCurrentDate()) {
      alert("Não é possível selecionar uma data passada.");
      return;
    }
    setDataSelecionada(novaData);
  }

  // Simulando requisição de dados (trocar por fetch/axios depois)
  async function getReservasAtivas(): Promise<Reserva[]> {
    const mod = await import("../../data/Variaveis");
    return mod.reservasAtivas;
  }

  useEffect(() => {
    async function carregarAgendamentos() {
      try {
        const data = await getReservasAtivas();
        setAgendamentos(data);
      } catch (error) {
        console.error("Erro ao carregar agendamentos:", error);
      } finally {
        setIsLoading(false);
      }
    }

    carregarAgendamentos();
  }, []);

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
              <FiltroTipo
                tipoSelecionado={tipoSelecionado}
                setTipoSelecionado={setTipoSelecionado}
              />
            </div>
            <div className="flex">
              <input
                type="search"
                placeholder="Pesquisar"
                className="border-2 border-gray-600/50 py-1 px-2 rounded-xl outline-0"
              />
              <Search
                className="text-gray-600 relative right-8 top-2"
                size={18}
              />
            </div>
          </div>

          {isLoading ? (
            <p className="text-center text-gray-500">Carregando agendamentos...</p>
          ) : (
            <TableActiveBookings
              reservas={agendamentos}
              onReceberClick={(agendamento) => {
                setAgendamentoSelecionado({
                  cliente: agendamento.usuario.nome,
                  quadra: agendamento.quadra.nome,
                  data: agendamento.data,
                  horario: agendamento.slot,
                  pagamentoFaltante: agendamento.pagamentoFaltante,
                });
                setModalRecebimentoOpen(true);
              }}
              onCancelarClick={(agendamento) => {
                setAgendamentoSelecionado({
                  cliente: agendamento.usuario.nome,
                  quadra: agendamento.quadra.nome,
                  data: agendamento.data,
                  horario: agendamento.slot,
                  pagamentoFaltante: agendamento.pagamentoFaltante,
                });
                setModalCancelarOpen(true);
              }}
            />
          )}
        </main>
      </div>

      <FooterEuro />

      {/* Modais */}
      {agendamentoSelecionado && (
        <ModalRecebimentoAdmin
          isOpen={modalRecebimentoOpen}
          onClose={() => setModalRecebimentoOpen(false)}
          dados={agendamentoSelecionado}
          onConfirmar={() => {
            console.log("Recebimento confirmado!");
            setModalRecebimentoOpen(false);
          }}
        />
      )}

      {agendamentoSelecionado && (
        <ModalCancelarAdmin
          isOpen={modalCancelarOpen}
          onClose={() => setModalCancelarOpen(false)}
          dados={agendamentoSelecionado}
          onConfirmar={() => {
            console.log("Agendamento cancelado!");
            setModalCancelarOpen(false);
          }}
        />
      )}
    </div>
  );
}
