import { useState, useEffect, useCallback, useMemo } from "react";

// Utils
import { getCurrentDate, gerarHorarioFim } from "../../utils/DateUtils";

// Components
import HeaderEuro from "../../components/Layout/HeaderEuro";
import AdminSidebar from "../../components/Navigation/AdminSidebar";
import FooterEuro from "../../components/Layout/FooterEuro";
import FiltroTipo from "../../components/Filtros/FiltroTipo";
import FiltroData from "../../components/Filtros/FiltroData";
import AvailableCourts from "../../components/Reservas/AvailableCourts";
import LegendaReservas from "../../components/Reservas/LegendaReservas";
import LoadingMessage from "../../components/LoadingMessage";

// Modals
import ModalConfirmarAdmin from "../../components/Modais/Admin/ModalConfirmarAdmin";
import ModalAgendarAdmin from "../../components/Modais/Admin/ModalAgendarAdmin";
import ModalAgendarOcupadoAdmin from "../../components/Modais/Admin/ModalAgendarOcupadoAdmin";
import ModalDesbloquearAdmin from "../../components/Modais/Admin/ModalDesbloquearAdmin";

// API
import axiosPrivate from "../../api/axiosPrivate";

// Types
interface QuadraAPI {
  id: number;
  nome: string;
  tipo?: string;
  status?: string;
  hora_abertura: string;
  hora_fechamento: string;
  preco_normal: string | number;
  preco_noturno: string | number;
  preco_normal_mensal: string | number;
  preco_noturno_mensal: string | number;
}

type Quadra = {
  id: number;
  nome: string;
  tipo: string;
  status: string;
  horaAbertura: string;
  horaFechamento: string;
  precoNormal: number;
  precoNoturno: number;
  precoMensalNormal: number;
  precoMensalNoturno: number;
};

type Indisponibilidade = { nome: string; indisponiveis: string[] };
type Bloqueio = { nome: string; bloqueados: string[] };

export default function AdminBooking() {
  // ----------------- Estados -----------------
  const [tipoSelecionado, setTipoSelecionado] = useState("Todas");
  const [dataSelecionada, setDataSelecionada] = useState(getCurrentDate());

  const [quadras, setQuadras] = useState<Quadra[]>([]);
  const [indisponibilidades, setIndisponibilidades] = useState<Indisponibilidade[]>([]);
  const [bloqueios, setBloqueios] = useState<Bloqueio[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [horarioSelecionado, setHorarioSelecionado] = useState({
    quadra: "",
    horario: "",
    data: dataSelecionada,
    valor: 0,
  });

  const [modalConfirmarAberto, setModalConfirmarAberto] = useState(false);
  const [modalAgendarAberto, setModalAgendarAberto] = useState(false);
  const [modalAgendarOcupadoAberto, setModalAgendarOcupadoAberto] = useState(false);
  const [modalDesbloquearAberto, setModalDesbloquearAberto] = useState(false);

  // ----------------- API Helpers -----------------
  const getQuadras = useCallback(async (): Promise<Quadra[]> => {
    const response = await axiosPrivate.get("/quadras");
    return response.data.data.map((q: QuadraAPI) => ({
      id: q.id,
      nome: q.nome,
      tipo: q.tipo || "",
      status: q.status || "ativa",
      horaAbertura: q.hora_abertura,
      horaFechamento: q.hora_fechamento,
      precoNormal: Number(q.preco_normal),
      precoNoturno: Number(q.preco_noturno),
      precoMensalNormal: Number(q.preco_normal_mensal),
      precoMensalNoturno: Number(q.preco_noturno_mensal),
    }));
  }, []);

  const getIndisponibilidades = useCallback(async (): Promise<Indisponibilidade[]> => {
    const response = await axiosPrivate.get("/reservas/indisponiveis", {
      params: { data: dataSelecionada },
    });
    return response.data ?? [];
  }, [dataSelecionada]);

  const getBloqueios = useCallback(async (): Promise<Bloqueio[]> => {
    const response = await axiosPrivate.get("/agenda-bloqueios/bloqueados-por-data", {
      params: { data: dataSelecionada },
    });
    return response.data ?? [];
  }, [dataSelecionada]);

  // ----------------- Carregamento de dados -----------------
  const carregarDados = useCallback(async () => {
    setIsLoading(true);
    try {
      if (!quadras.length) {
        const quadrasData = await getQuadras();
        setQuadras(quadrasData);
      }
      const [indisponiveisData, bloqueiosData] = await Promise.all([
        getIndisponibilidades(),
        getBloqueios(),
      ]);
      setIndisponibilidades(indisponiveisData);
      setBloqueios(bloqueiosData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setIsLoading(false);
    }
  }, [getQuadras, getIndisponibilidades, getBloqueios, quadras.length]);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  // ----------------- Helpers -----------------
  const getIndisponiveis = useCallback(
    (nome: string) => indisponibilidades.find((q) => q.nome === nome)?.indisponiveis || [],
    [indisponibilidades]
  );

  const getBloqueadas = useCallback(
    (nome: string) => bloqueios.find((q) => q.nome === nome)?.bloqueados || [],
    [bloqueios]
  );

  const calcularValor = useCallback((quadra: Quadra, horario: string) => {
    const horaInt = parseInt(horario.split(":")[0], 10);
    return horaInt >= 18 ? quadra.precoNoturno : quadra.precoNormal;
  }, []);

  const quadrasFiltradas = useMemo(
    () =>
      quadras.filter(
        (quadra) =>
          tipoSelecionado === "Todas" ||
          quadra.tipo.toLowerCase() === tipoSelecionado.toLowerCase()
      ),
    [quadras, tipoSelecionado]
  );

  // ----------------- Handlers -----------------
  const handleSetDataSelecionada = (novaData: string) => {
    if (novaData < getCurrentDate()) {
      alert("Não é possível selecionar uma data passada.");
      return;
    }
    setDataSelecionada(novaData);
  };

  const handleHorarioClick = (quadraId: number, horario: string, indisponivel: boolean, bloqueado: boolean) => {
    const quadra = quadras.find((q) => q.id === quadraId);
    if (!quadra) return;

    const valor = calcularValor(quadra, horario);

    setHorarioSelecionado({
      quadra: quadra.nome,
      horario: `${horario} - ${gerarHorarioFim(horario)}`,
      data: dataSelecionada,
      valor,
    });

    if (indisponivel) setModalAgendarOcupadoAberto(true);
    else if (bloqueado) setModalDesbloquearAberto(true);
    else setModalConfirmarAberto(true);
  };

  const bloquearHorario = async () => {
    try {
      const quadraId = quadras.find((q) => q.nome === horarioSelecionado.quadra)?.id;
      if (!quadraId) return;

      await axiosPrivate.post("/agenda-bloqueios", {
        quadra_id: quadraId,
        data: horarioSelecionado.data,
        slot: horarioSelecionado.horario.split(" - ")[0],
      });

      alert("Horário bloqueado com sucesso!");
      setModalConfirmarAberto(false);
      const bloqueiosData = await getBloqueios();
      setBloqueios(bloqueiosData);
    } catch (error) {
      console.error("Erro ao bloquear horário:", error);
      alert("Erro ao bloquear horário");
    }
  };

  const desbloquearHorario = async () => {
    try {
      const quadraId = quadras.find((q) => q.nome === horarioSelecionado.quadra)?.id;
      if (!quadraId) return;
      console.log(quadraId);
      console.log(horarioSelecionado.data)
      console.log(horarioSelecionado.horario.split(" - ")[0])

      await axiosPrivate.post("/agenda-bloqueios/desbloquear", {
          quadra_id: quadraId,
          data: horarioSelecionado.data,
          slot: horarioSelecionado.horario.split(" - ")[0],
      });

      alert("Horário desbloqueado com sucesso!");
      setModalDesbloquearAberto(false);
      const bloqueiosData = await getBloqueios();
      setBloqueios(bloqueiosData);
    } catch (error) {
      console.error("Erro ao desbloquear horário:", error);
      alert("Erro ao desbloquear horário");
    }
  };

  const cancelarReserva = async () => {
    try {
      const quadraId = quadras.find((q) => q.nome === horarioSelecionado.quadra)?.id;
      if (!quadraId) return;

      const response = await axiosPrivate.get("/reservas/por-horario", {
        params: { quadra_id: quadraId, data: horarioSelecionado.data, slot: horarioSelecionado.horario.split(" - ")[0] },
      });

      const reservaId = response.data.id;
      await axiosPrivate.post(`/reservas/${reservaId}/cancelar`, { params: { reembolso: false } });

      alert("Reserva cancelada com sucesso!");
      setModalAgendarOcupadoAberto(false);
      const indisponiveisData = await getIndisponibilidades();
      setIndisponibilidades(indisponiveisData);
    } catch (error) {
      console.error("Erro ao cancelar reserva:", error);
      alert("Erro ao cancelar reserva");
    }
  };

  const handleAgendarAdmin = async ({ nome, valor }: { nome: string; valor: number }) => {
    try {
      const quadra = quadras.find((q) => q.nome === horarioSelecionado.quadra);
      if (!quadra) return;

      await axiosPrivate.post("/reservas/agendar-admin", {
        quadra_id: quadra.id,
        data: horarioSelecionado.data,
        slot: horarioSelecionado.horario.split(" - ")[0],
        nome_cliente: nome,
        valor_pago: valor,
        valor_total: horarioSelecionado.valor,
      });

      alert("Reserva agendada com sucesso!");
      setModalAgendarAberto(false);
      const indisponiveisData = await getIndisponibilidades();
      setIndisponibilidades(indisponiveisData);
    } catch (error) {
      console.error(error);
      alert("Erro ao agendar reserva");
    }
  };

  // ----------------- JSX -----------------
  return (
    <div className="min-h-screen flex flex-col bg-[#e6f4ff]">
      <HeaderEuro />
      <div className="flex flex-1">
        <AdminSidebar />

        <main className="flex-grow p-6 max-w-6xl w-full mx-auto bg-white mt-6 mb-10 rounded-3xl shadow-xl max-h-117 overflow-y-auto">
          {isLoading ? (
            <LoadingMessage message="Carregando quadras..." />
          ) : (
            <>
              <h1 className="text-xl font-semibold text-azulBase mb-4">
                Disponibilidade de quadras
              </h1>

              {/* Filtros */}
              <div className="bg-blue-100/50 border border-blue-400 rounded-xl p-4 mb-6 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between md:gap-6">
                <FiltroTipo tipoSelecionado={tipoSelecionado} setTipoSelecionado={setTipoSelecionado} />
                <FiltroData dataSelecionada={dataSelecionada} setDataSelecionada={handleSetDataSelecionada} />
              </div>

              <LegendaReservas />

              {/* Lista de quadras */}
              <div className="space-y-6">
                {quadrasFiltradas.map((quadra) => (
                  <AvailableCourts
                    key={quadra.id}
                    nome={quadra.nome}
                    horaAbertura={quadra.horaAbertura}
                    horaFechamento={quadra.horaFechamento}
                    indisponiveis={getIndisponiveis(quadra.nome)}
                    bloqueados={getBloqueadas(quadra.nome)}
                    onHorarioClick={(horario, indisponivel, bloqueado) =>
                      handleHorarioClick(quadra.id, horario, indisponivel, bloqueado)
                    }
                    isAdmin={true}
                  />
                ))}
              </div>
            </>
          )}
        </main>
      </div>

      {/* Modais */}
      {modalConfirmarAberto && (
        <ModalConfirmarAdmin
          isOpen={modalConfirmarAberto}
          onClose={() => setModalConfirmarAberto(false)}
          dados={horarioSelecionado}
          onBloquear={bloquearHorario}
          onConfirmar={() => {
            setModalConfirmarAberto(false);
            setModalAgendarAberto(true);
          }}
        />
      )}

      {modalAgendarAberto && (
        <ModalAgendarAdmin
          isOpen={modalAgendarAberto}
          onClose={() => setModalAgendarAberto(false)}
          dados={horarioSelecionado}
          onConfirmar={handleAgendarAdmin}
        />
      )}

      {modalAgendarOcupadoAberto && (
        <ModalAgendarOcupadoAdmin
          isOpen={modalAgendarOcupadoAberto}
          onClose={() => setModalAgendarOcupadoAberto(false)}
          dados={horarioSelecionado}
          onConfirmar={cancelarReserva}
        />
      )}

      {modalDesbloquearAberto && (
        <ModalDesbloquearAdmin
          isOpen={modalDesbloquearAberto}
          onClose={() => setModalDesbloquearAberto(false)}
          dados={horarioSelecionado}
          onConfirmar={desbloquearHorario}
        />
      )}

      <FooterEuro />
    </div>
  );
}
