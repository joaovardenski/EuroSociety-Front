// src/pages/Client/NewBooking.tsx

import { useEffect, useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

// Utils
import { getCurrentDate, gerarHorarioFim } from "../../utils/DateUtils";
import { calcularValor } from "../../utils/Calculate";

// Components
import HeaderEuro from "../../components/Layout/HeaderEuro";
import FiltroTipo from "../../components/Filtros/FiltroTipo";
import FiltroData from "../../components/Filtros/FiltroData";
import AvailableCourts from "../../components/Reservas/AvailableCourts";
import FooterEuro from "../../components/Layout/FooterEuro";
import BottomNav from "../../components/Navigation/BottomNav";
import LegendaReservas from "../../components/Reservas/LegendaReservas";
import LoadingMessage from "../../components/LoadingMessage";

// Modals
import ModalConfirmarAgendamento from "../../components/Modais/Client/ModalConfirmarAgendamento";
import ModalDetalhesPagamento from "../../components/Modais/Client/ModalDetalhesPagamento";
import ModalFilaDeEspera from "../../components/Modais/Client/ModalFilaDeEspera";

// Hooks
import { useAuth } from "../../hooks/useAuth";

// API
import axiosPrivate from "../../api/axiosPrivate";
import { AxiosError } from "axios";

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

interface ReservaPendente {
  id: number;
  user_id: number;
  quadra_id: number;
  data: string;
  slot: string;
  valor: number;
  status: string;
}

interface PreferenceResponse {
  preferenceId: string;
  init_point: string;
}

type ModalType = "confirmar" | "pagamento" | "fila" | null;

export default function NewBooking() {
  // ----------------- Estados -----------------
  const [tipoSelecionado, setTipoSelecionado] = useState("Todas");
  const [dataSelecionada, setDataSelecionada] = useState(getCurrentDate());

  const [quadras, setQuadras] = useState<Quadra[]>([]);
  const [indisponibilidades, setIndisponibilidades] = useState<
    Indisponibilidade[]
  >([]);
  const [bloqueios, setBloqueios] = useState<Bloqueio[]>([]);

  const [loading, setLoading] = useState(true);
  const [modalAtivo, setModalAtivo] = useState<ModalType>(null);

  const [horarioSelecionado, setHorarioSelecionado] = useState<{
    quadra: Quadra | null;
    horario: string;
    data: string;
    valor: number;
    mensalistaDisponivel: boolean;
  }>({
    quadra: null,
    horario: "",
    data: dataSelecionada,
    valor: 0,
    mensalistaDisponivel: false,
  });

  const { user, isLoading: isLoadingAuth } = useAuth();

  const cacheIndisponibilidades = useMemo(
    () => new Map<string, Indisponibilidade[]>(),
    []
  );
  const cacheBloqueios = useMemo(() => new Map<string, Bloqueio[]>(), []);

  // ----------------- Funções API -----------------
  const carregarDados = useCallback(
    async (data: string) => {
      setLoading(true);

      try {
        // Carrega quadras apenas uma vez
        if (quadras.length === 0) {
          const responseQuadras = await axiosPrivate.get("/quadras");
          const quadrasFormatadas: Quadra[] = responseQuadras.data.data.map(
            (q: QuadraAPI) => ({
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
            })
          );
          setQuadras(quadrasFormatadas);
        }

        // ---------------- Cache para Indisponibilidades ----------------
        let indisponiveisData: Indisponibilidade[];
        if (cacheIndisponibilidades.has(data)) {
          indisponiveisData = cacheIndisponibilidades.get(data)!;
        } else {
          const indisponiveisRes = await axiosPrivate.get(
            "/reservas/indisponiveis",
            { params: { data } }
          );
          indisponiveisData = indisponiveisRes.data ?? [];
          cacheIndisponibilidades.set(data, indisponiveisData);
        }

        // ---------------- Cache para Bloqueios ----------------
        let bloqueiosData: Bloqueio[];
        if (cacheBloqueios.has(data)) {
          bloqueiosData = cacheBloqueios.get(data)!;
        } else {
          const bloqueiosRes = await axiosPrivate.get(
            "/agenda-bloqueios/bloqueados-por-data",
            { params: { data } }
          );
          bloqueiosData = bloqueiosRes.data ?? [];
          cacheBloqueios.set(data, bloqueiosData);
        }

        // Atualiza os estados
        setIndisponibilidades(indisponiveisData);
        setBloqueios(bloqueiosData);
      } catch (error) {
        console.error("Erro ao carregar dados de quadras:", error);
      } finally {
        setLoading(false);
      }
    },
    [quadras, cacheIndisponibilidades, cacheBloqueios]
  );

  useEffect(() => {
    carregarDados(dataSelecionada);
  }, [dataSelecionada, carregarDados]);

  // ----------------- Helpers -----------------
  const getIndisponiveis = useCallback(
    (nome: string) =>
      indisponibilidades.find((q) => q.nome === nome)?.indisponiveis || [],
    [indisponibilidades]
  );

  const getBloqueadas = useCallback(
    (nome: string) => bloqueios.find((q) => q.nome === nome)?.bloqueados || [],
    [bloqueios]
  );

  const quadrasFiltradas = useMemo(() => {
    return quadras.filter(
      (q) =>
        tipoSelecionado === "Todas" ||
        q.tipo.toLowerCase() === tipoSelecionado.toLowerCase()
    );
  }, [quadras, tipoSelecionado]);

  // ----------------- Handlers -----------------
  const handleSetDataSelecionada = (novaData: string) => {
    if (novaData < getCurrentDate()) {
      alert("Não é possível selecionar uma data passada.");
      return;
    }
    setDataSelecionada(novaData);
  };

  const handleHorarioClick = useCallback(
    async (
      quadraId: number,
      horario: string,
      indisponivel: boolean,
      bloqueado: boolean
    ) => {
      const quadra = quadras.find((q) => q.id === quadraId);
      if (!quadra) return;

      const valor = calcularValor(quadra, horario, false);

      setHorarioSelecionado({
        quadra,
        horario: `${horario} - ${gerarHorarioFim(horario)}`,
        data: dataSelecionada,
        valor,
        mensalistaDisponivel: false,
      });

      if (bloqueado) return;
      if (indisponivel) {
        setModalAtivo("fila");
        return;
      }

      try {
        const response = await axiosPrivate.post(
          "/mensalidades/check-disponibilidade",
          {
            quadra_id: quadraId,
            data_inicio: dataSelecionada,
            horario,
          }
        );

        const mensalistaDisponivel = response.data.disponivel;

        setHorarioSelecionado((prev) => ({ ...prev, mensalistaDisponivel }));
        setModalAtivo("confirmar");
      } catch (error: unknown) {
        const axiosError = error as AxiosError;

        if (axiosError.response?.status === 409) {
          setHorarioSelecionado((prev) => ({
            ...prev,
            mensalistaDisponivel: false,
          }));
          setModalAtivo("confirmar");
        } else if (axiosError instanceof Error) {
          console.error(
            "Erro ao verificar disponibilidade mensalista:",
            axiosError.message
          );
          alert(
            "Ocorreu um erro ao verificar a disponibilidade. Por favor, tente novamente."
          );
        } else {
          console.error(
            "Erro desconhecido ao verificar disponibilidade:",
            error
          );
          alert("Ocorreu um erro desconhecido. Por favor, tente novamente.");
        }
      }
    },
    [quadras, dataSelecionada]
  );

  const handleConfirmarPagamento = async (
    quadra: Quadra | null,
    horario: string,
    data: string,
    valor: number,
    quantidade_pagamento: number,
    mensalista: boolean
  ) => {
    if (!user || !quadra) {
      alert(
        "Dados de usuário ou quadra não encontrados. Por favor, recarregue a página."
      );
      return;
    }

    try {
      const reservaResponse = await axiosPrivate.post<
        ReservaPendente | ReservaPendente[]
      >("/reservas", {
        user_id: user.id,
        quadra_id: quadra.id,
        data,
        slot: horario.split(" - ")[0],
        valor: mensalista ? quantidade_pagamento : valor,
        tipo_reserva: mensalista ? "mensal" : "unica",
      });

      const reservaId = mensalista
        ? (reservaResponse.data as ReservaPendente[])[0].id
        : (reservaResponse.data as ReservaPendente).id;

      const pagamentoResponse = await axiosPrivate.post<PreferenceResponse>(
        "/mercado-pago/pagar",
        {
          reserva_id: reservaId,
          quantidade_pagamento,
        }
      );

      window.location.href = pagamentoResponse.data.init_point;
    } catch (error) {
      console.error("Erro ao processar o pagamento:", error);
      alert("Ocorreu um erro ao tentar agendar. Por favor, tente novamente.");
    }
  };

  const handleEntrarFila = async () => {
    if (!user || !horarioSelecionado.quadra) {
      alert("Usuário ou quadra não encontrados.");
      return;
    }

    try {
      await axiosPrivate.post("/fila-espera", {
        user_id: user.id,
        quadra_id: horarioSelecionado.quadra.id,
        data: horarioSelecionado.data,
        slot: horarioSelecionado.horario.split(" - ")[0],
      });

      alert("Você entrou na fila de espera com sucesso!");
      setModalAtivo(null);
    } catch (error) {
      console.error("Erro ao entrar na fila de espera:", error);
      alert(
        "Ocorreu um erro ao tentar entrar na fila. Por favor, tente novamente."
      );
    }
  };

  // ----------------- JSX -----------------
  return (
    <div className="min-h-screen flex flex-col bg-[#f3f7ff]">
      <HeaderEuro />

      <main className="bg-white mt-7 mb-20 rounded-4xl flex-grow max-w-5xl w-full mx-auto px-4 py-8 shadow-2xl md:mb-10">
        {/* Topo */}
        <div className="relative flex items-center justify-center mb-6">
          <Link
            to={"/home"}
            className="absolute left-0 text-azulBase hover:text-azulEscuro transition"
          >
            <ArrowLeft size={23} />
          </Link>
          <h1 className="text-xl font-semibold text-azulBase text-center md:text-2xl">
            Disponibilidade de quadras
          </h1>
        </div>

        {/* Filtros */}
        <div className="bg-gray-100 shadow-md rounded-lg p-4 mb-6 flex flex-wrap gap-4 md:gap-6 items-center justify-between">
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

        {/* Conteúdo */}
        {loading || isLoadingAuth ? (
          <LoadingMessage message="Carregando quadras disponíveis..." />
        ) : (
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
                  handleHorarioClick(
                    quadra.id,
                    horario,
                    indisponivel,
                    bloqueado
                  )
                }
                isAdmin={false}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modais */}
      {modalAtivo === "confirmar" && (
        <ModalConfirmarAgendamento
          isOpen
          onClose={() => setModalAtivo(null)}
          dados={horarioSelecionado}
          onConfirmar={() => setModalAtivo("pagamento")}
        />
      )}

      {modalAtivo === "pagamento" && (
        <ModalDetalhesPagamento
          isOpen
          onClose={() => setModalAtivo(null)}
          dados={horarioSelecionado}
          mensalistaDisponivel={horarioSelecionado.mensalistaDisponivel}
          onConfirmarPagamento={async (valorPago, mensalista) => {
            await handleConfirmarPagamento(
              horarioSelecionado.quadra,
              horarioSelecionado.horario,
              horarioSelecionado.data,
              horarioSelecionado.valor,
              valorPago,
              mensalista
            );
          }}
        />
      )}

      {modalAtivo === "fila" && (
        <ModalFilaDeEspera
          isOpen
          onClose={() => setModalAtivo(null)}
          dados={horarioSelecionado}
          onEntrarFila={handleEntrarFila}
        />
      )}

      <BottomNav />
      <FooterEuro />
    </div>
  );
}
