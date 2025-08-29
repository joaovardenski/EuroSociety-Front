import { useState, useEffect } from "react";

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
import axiosPrivate from "../../api/axiosPrivate";

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
  const [tipoSelecionado, setTipoSelecionado] = useState("Todas");
  const [dataSelecionada, setDataSelecionada] = useState(getCurrentDate());

  const [quadras, setQuadras] = useState<Quadra[]>([]);
  const [indisponibilidades, setIndisponibilidades] = useState<
    Indisponibilidade[]
  >([]);
  const [bloqueios, setBloqueios] = useState<Bloqueio[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const [horarioSelecionado, setHorarioSelecionado] = useState({
    quadra: "",
    horario: "",
    data: dataSelecionada,
    valor: 0,
  });

  async function getQuadras(): Promise<Quadra[]> {
    const token = localStorage.getItem("access_token");

    const response = await axiosPrivate.get("/quadras", {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("Resposta da API /quadras:", response.data);

    // Adapta os nomes para o front
    return response.data.data.map((q: any) => ({
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
  }

  async function getIndisponibilidades(): Promise<Indisponibilidade[]> {
    const token = localStorage.getItem("access_token");
    const response = await axiosPrivate.get("/reservas/indisponiveis", {
      headers: { Authorization: `Bearer ${token}` },
      params: { data: dataSelecionada },
    });
    console.log("Resposta da API /reservas/indisponiveis:", response.data);

    return response.data as Indisponibilidade[];
  }

  async function getBloqueios(): Promise<Bloqueio[]> {
    const token = localStorage.getItem("access_token");
    const response = await axiosPrivate.get(
      "/agenda-bloqueios/bloqueados-por-data",
      {
        headers: { Authorization: `Bearer ${token}` },
        params: { data: dataSelecionada }, // Passa a data selecionada como parâmetro
      }
    );
    console.log(
      "Resposta da API /agenda-bloqueios/bloqueados-por-data:",
      response.data
    );

    return response.data as Bloqueio[];
  }

  // ----------------- Efeito de entrada ----------------- (Pega os dados iniciais e coloca no estado)
  // ----------------- Efeito para carregar quadras apenas uma vez -----------------
  useEffect(() => {
    async function carregarQuadras() {
      setIsLoading(true);
      try {
        const quadrasData = await getQuadras();
        setQuadras(quadrasData);
        const indisponiveisData = await getIndisponibilidades();
        setIndisponibilidades(indisponiveisData);
        const bloqueiosData = await getBloqueios();
        setBloqueios(bloqueiosData);
      } catch (error) {
        console.error("Erro ao carregar quadras:", error);
      } finally {
        setIsLoading(false);
      }
    }
    carregarQuadras();
  }, []);

  // Novo useEffect para carregar indisponibilidades E bloqueios quando a data muda.
  useEffect(() => {
    // Define the functions *inside* the useEffect
    async function getBloqueios() {
      const response = await axiosPrivate.get(
        "/agenda-bloqueios/bloqueados-por-data",
        {
          params: { data: dataSelecionada },
        }
      );
      return response.data as Bloqueio[];
    }

    async function getIndisponibilidades() {
      const response = await axiosPrivate.get("/reservas/indisponiveis", {
        params: { data: dataSelecionada },
      });
      return response.data as Indisponibilidade[];
    }

    async function carregarHorarios() {
      setIsLoading(true);
      try {
        const indisponiveisData = await getIndisponibilidades();
        setIndisponibilidades(indisponiveisData);

        const bloqueiosData = await getBloqueios();
        setBloqueios(bloqueiosData);
      } catch (error) {
        console.error("Erro ao carregar horários:", error);
      } finally {
        setIsLoading(false);
      }
    }

    carregarHorarios();
  }, [dataSelecionada]);

  // ----------------- Helpers -----------------
  const getIndisponiveis = (nome: string) =>
    indisponibilidades.find((q) => q.nome === nome)?.indisponiveis || [];

  const getBloqueadas = (nome: string) =>
    bloqueios.find((q) => q.nome === nome)?.bloqueados || [];

  const calcularValor = (quadra: Quadra, horario: string) => {
    const horaInt = parseInt(horario.split(":")[0], 10);
    return horaInt >= 18 ? quadra.precoNoturno : quadra.precoNormal;
  };

  const [modalConfirmarAberto, setModalConfirmarAberto] = useState(false);
  const [modalAgendarAberto, setModalAgendarAberto] = useState(false);
  const [modalAgendarOcupadoAberto, setModalAgendarOcupadoAberto] =
    useState(false);
  const [modalDesbloquearAberto, setModalDesbloquearAberto] = useState(false);

  const handleHorarioClick = (
    quadraId: number,
    horario: string,
    indisponivel: boolean,
    bloqueado: boolean
  ) => {
    const quadraConfig = quadras.find((q) => q.id === quadraId);
    if (!quadraConfig) return;

    const valor = calcularValor(quadraConfig, horario);

    setHorarioSelecionado({
      quadra: quadraConfig.nome,
      horario: `${horario} - ${gerarHorarioFim(horario)}`,
      data: dataSelecionada,
      valor,
    });

    if (indisponivel) {
      setModalAgendarOcupadoAberto(true);
    } else if (bloqueado) {
      setModalDesbloquearAberto(true);
    } else {
      setModalConfirmarAberto(true);
    }
  };

  function handleSetDataSelecionada(novaData: string) {
    if (novaData < getCurrentDate()) {
      alert("Não é possível selecionar uma data passada.");
      return;
    }
    setDataSelecionada(novaData);
  }

  async function bloquearHorario() {
    const token = localStorage.getItem("access_token");
    try {
      console.log(
        "Dados para bloqueio:",
        quadras.find((q) => q.nome === horarioSelecionado.quadra)?.id,
        horarioSelecionado.data,
        horarioSelecionado.horario.split(" - ")[0]
      );
      await axiosPrivate.post(
        "/agenda-bloqueios",
        {
          quadra_id: quadras.find((q) => q.nome === horarioSelecionado.quadra)
            ?.id,
          data: horarioSelecionado.data,
          slot: horarioSelecionado.horario.split(" - ")[0], // pega só o início
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Horário bloqueado com sucesso!");
      setModalConfirmarAberto(false);
      // Atualiza lista de bloqueios
      const bloqueiosData = await getBloqueios();
      setBloqueios(bloqueiosData);
    } catch (error) {
      console.error("Erro ao bloquear horário:", error);
      alert("Erro ao bloquear horário");
    }
  }

  async function desbloquearHorario() {
    const token = localStorage.getItem("access_token");
    try {
      await axiosPrivate.delete("/agenda-bloqueios/desbloquear", {
        headers: { Authorization: `Bearer ${token}` },
        data: {
          quadra_id: quadras.find((q) => q.nome === horarioSelecionado.quadra)
            ?.id,
          data: horarioSelecionado.data,
          slot: horarioSelecionado.horario.split(" - ")[0], // pega só o início
        },
      });
      alert("Horário desbloqueado com sucesso!");
      setModalDesbloquearAberto(false);
      // Atualiza lista de bloqueios
      const bloqueiosData = await getBloqueios();
      setBloqueios(bloqueiosData);
    } catch (error) {
      console.error("Erro ao desbloquear horário:", error);
      alert("Erro ao desbloquear horário");
    }
  }

  async function cancelarReserva() {
    const token = localStorage.getItem("access_token");
    try {
      const quadraId = quadras.find(
        (q) => q.nome === horarioSelecionado.quadra
      )?.id;

      const response = await axiosPrivate.get("/reservas/por-horario", {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          quadra_id: quadraId,
          data: horarioSelecionado.data,
          slot: horarioSelecionado.horario.split(" - ")[0],
        },
      });

      console.log("Resposta getReservaPorHorario:", response.data);
      const reservaId = response.data.id;

      const cancelResponse = await axiosPrivate.delete(
        `/reservas/${reservaId}/cancelar`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { reembolso: false },
        }
      );

      console.log("Resposta cancelarReserva:", cancelResponse.data);

      alert("Reserva cancelada com sucesso!");
      setModalAgendarOcupadoAberto(false);

      const indisponiveisData = await getIndisponibilidades();
      setIndisponibilidades(indisponiveisData);
    } catch (error: any) {
      console.error(
        "Erro ao cancelar reserva:",
        error.response?.data || error.message
      );
      alert("Erro ao cancelar reserva");
    }
  }

  async function handleAgendarAdmin({
    nome,
    valor,
  }: {
    nome: string;
    valor: number;
  }) {
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

      // Atualiza lista de indisponibilidades
      const indisponiveisData = await getIndisponibilidades();
      setIndisponibilidades(indisponiveisData);
    } catch (error) {
      console.error(error);
      alert("Erro ao agendar reserva");
    }
  }

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
                <FiltroTipo
                  tipoSelecionado={tipoSelecionado}
                  setTipoSelecionado={setTipoSelecionado}
                />
                <FiltroData
                  dataSelecionada={dataSelecionada}
                  setDataSelecionada={handleSetDataSelecionada}
                />
              </div>
              <LegendaReservas />
              {/* Lista de quadras */}
              <div className="space-y-6">
                {quadras
                  .filter(
                    (quadra) =>
                      tipoSelecionado === "Todas" ||
                      quadra.tipo.toLowerCase() ===
                        tipoSelecionado.toLowerCase()
                  )
                  .map((quadra) => (
                    <AvailableCourts
                      key={quadra.id}
                      nome={quadra.nome}
                      horaAbertura={quadra.horaAbertura}
                      horaFechamento={quadra.horaFechamento}
                      indisponiveis={getIndisponiveis(quadra.nome)}
                      bloqueados={getBloqueadas(quadra.nome)}
                      onHorarioClick={(horario, indisponivel, bloqueado) =>
                        handleHorarioClick(
                          quadra.id,
                          horario,
                          indisponivel,
                          bloqueado
                        )
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
