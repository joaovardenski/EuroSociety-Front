// Hooks
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Utils
import { getCurrentDate, gerarHorarioFim } from "../../utils/DateUtils";

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

// Icons
import { ArrowLeft } from "lucide-react";

import axiosPrivate from "../../api/axiosPrivate";
import { useAuth } from "../../hooks/useAuth";

// Types locais
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

export default function NewBooking() {
  // ----------------- Estados -----------------
  const [tipoSelecionado, setTipoSelecionado] = useState("Todas");
  const [dataSelecionada, setDataSelecionada] = useState(getCurrentDate());

  const [quadras, setQuadras] = useState<Quadra[]>([]);
  const [indisponibilidades, setIndisponibilidades] = useState<
    Indisponibilidade[]
  >([]);
  const [bloqueios, setBloqueios] = useState<Bloqueio[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const [modalConfirmarAberto, setModalConfirmarAberto] = useState(false);
  const [modalPagamentoAberto, setModalPagamentoAberto] = useState(false);
  const [modalFilaAberto, setModalFilaAberto] = useState(false);

  const [horarioSelecionado, setHorarioSelecionado] = useState({
    quadra: "",
    horario: "",
    data: dataSelecionada,
    valor: 0,
    mensalistaDisponivel: false,
  });

  const { user, isLoading: isLoadingAuth } = useAuth();

  // ----------------- “APIs” locais (substitua por fetch/axios depois) -----------------
  async function getQuadras(): Promise<Quadra[]> {
    const mod = await import("../../data/Variaveis");
    return mod.quadras as Quadra[];
  }

  async function getIndisponibilidades(): Promise<Indisponibilidade[]> {
    const mod = await import("../../data/Variaveis");
    return mod.indisponibilidadesQuadras as Indisponibilidade[];
  }

  async function getBloqueios(): Promise<Bloqueio[]> {
    const mod = await import("../../data/Variaveis");
    return mod.bloqueadasQuadras as Bloqueio[];
  }

  // ----------------- Efeito de entrada ----------------- (Pega os dados iniciais e coloca no estado)
  useEffect(() => {
    async function carregarDados() {
      try {
        const [quadras, indisponiveis, bloqueados] = await Promise.all([
          getQuadras(),
          getIndisponibilidades(),
          getBloqueios(),
        ]);
        setQuadras(quadras);
        setIndisponibilidades(indisponiveis);
        setBloqueios(bloqueados);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setIsLoading(false);
      }
    }

    carregarDados();
  }, []);

  // ----------------- Helpers -----------------
  const getIndisponiveis = (nome: string) =>
    indisponibilidades.find((q) => q.nome === nome)?.indisponiveis || [];

  const getBloqueadas = (nome: string) =>
    bloqueios.find((q) => q.nome === nome)?.bloqueados || [];

  const calcularValor = (quadra: Quadra, horario: string) => {
    const horaInt = parseInt(horario.split(":")[0], 10);
    return horaInt >= 18 ? quadra.precoNoturno : quadra.precoNormal;
  };

  async function handlePagamento(
    usuarioId: number,
    quadraId: number,
    data: string,
    slot: string,
    valor: number,
    quantidade_pagamento: number,
    mensalista: boolean
  ) {
    console.log(
      `2) Entrou no HandlePagamento com os dados: ${usuarioId}, ${quadraId}, ${data}, ${slot}, ${valor}, ${quantidade_pagamento}, ${mensalista}`
    );
    try {
      const reservaResponse = await axiosPrivate.post<ReservaPendente>(
        "/reservas",
        {
          user_id: usuarioId,
          quadra_id: quadraId,
          data: data,
          slot: slot,
          valor: valor,
          tipo_reserva: mensalista ? "mensal" : "unica",
        }
      );

      const reservaCriada = reservaResponse.data;

      console.log("3) Reserva criada:", reservaCriada);

      const pagamentoResponse = await axiosPrivate.post<PreferenceResponse>(
        "/mercado-pago/pagar",
        {
          reserva_id: reservaCriada.id,
          quantidade_pagamento: 0.01, // Teste de pagamento
        }
      );

      console.log("4) Resposta do pagamento:", pagamentoResponse.data);

      const { init_point } = pagamentoResponse.data;
      window.location.href = init_point;
    } catch (error) {
      console.error("Erro ao processar o pagamento:", error);
      alert("Ocorreu um erro ao tentar agendar. Por favor, tente novamente.");
    }
  }

  function handleConfirmarPagamento(
    quadraNome: string,
    horario: string,
    data: string,
    valor: number,
    quantidade_pagamento: number,
    mensalista: boolean
  ) {
    // Encontre o ID da quadra pelo nome
    const quadraConfig = quadras.find((q) => q.nome === quadraNome);

    if (!user || !quadraConfig) {
      alert(
        "Dados de usuário ou quadra não encontrados. Por favor, recarregue a página."
      );
      return;
    }
    console.log(
      `1) Entrou no HandleConfirmarPagamento com os dados: ${quadraNome}, ${horario}, ${data}, ${valor}, ${quantidade_pagamento}, ${mensalista} e o user id: ${user.id}`
    );

    // Chame a função de pagamento com os dados necessários
    handlePagamento(
      user.id,
      quadraConfig.id,
      data,
      horario.split(" - ")[0], // Pega apenas a hora de início
      valor,
      quantidade_pagamento,
      mensalista
    );
    setModalPagamentoAberto(false);
  }

  // ----------------- Handlers -----------------
  async function handleHorarioClick(
    quadraId: number,
    horario: string,
    indisponivel: boolean,
    bloqueado: boolean
  ) {
    const quadraConfig = quadras.find((q) => q.id === quadraId);
    if (!quadraConfig) return;

    const valor = calcularValor(quadraConfig, horario);

    // Inicializa mensalistaDisponivel como false
    setHorarioSelecionado({
      quadra: quadraConfig.nome,
      horario: `${horario} - ${gerarHorarioFim(horario)}`,
      data: dataSelecionada,
      valor,
      mensalistaDisponivel: false,
    });

    if (bloqueado) return;
    if (indisponivel) {
      setModalFilaAberto(true);
      return;
    }

    try {
      console.log("Verificando disponibilidade de mensalista...");
      const response = await axiosPrivate.post(
        "/mensalidades/check-disponibilidade",
        {
          quadra_id: quadraId,
          data_inicio: dataSelecionada,
          horario: horario,
        }
      );

      const mensalistaDisponivel = response.data.disponivel;

      // Atualiza apenas o campo mensalistaDisponivel
      setHorarioSelecionado((prev) => ({
        ...prev,
        mensalistaDisponivel,
      }));

      setModalConfirmarAberto(true);
      setModalPagamentoAberto(false);
    } catch (error: any) {
      console.error("Erro ao verificar disponibilidade mensalista:", error);

      // Se for conflito de horário/mensalidade (status 409), apenas mantém mensalistaDisponivel como false
      if (error.response?.status === 409) {
        setHorarioSelecionado((prev) => ({
          ...prev,
          mensalistaDisponivel: false,
        }));
        setModalConfirmarAberto(true);
      } else {
        // Para outros erros de servidor, ainda dá o alert
        alert(
          "Ocorreu um erro ao verificar a disponibilidade. Por favor, tente novamente."
        );
        setModalConfirmarAberto(true);
      }
    }
  }

  function handleSetDataSelecionada(novaData: string) {
    if (novaData < getCurrentDate()) {
      alert("Não é possível selecionar uma data passada.");
      return;
    }
    setDataSelecionada(novaData);
  }

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
        {isLoading || isLoadingAuth ? (
          <LoadingMessage message="Carregando quadras disponíveis..." />
        ) : (
          <div className="space-y-6">
            {quadras
              .filter(
                (quadra) =>
                  tipoSelecionado === "Todas" ||
                  quadra.tipo.toLowerCase() === tipoSelecionado.toLowerCase()
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
                  isAdmin={false}
                />
              ))}
          </div>
        )}
      </main>

      {/* Modais */}
      {modalConfirmarAberto && (
        <ModalConfirmarAgendamento
          isOpen={modalConfirmarAberto}
          onClose={() => setModalConfirmarAberto(false)}
          dados={horarioSelecionado}
          onConfirmar={() => {
            setModalConfirmarAberto(false);
            setModalPagamentoAberto(true);
          }}
        />
      )}

      {modalPagamentoAberto && (
        <ModalDetalhesPagamento
          isOpen={modalPagamentoAberto}
          onClose={() => setModalPagamentoAberto(false)}
          dados={horarioSelecionado}
          mensalistaDisponivel={horarioSelecionado.mensalistaDisponivel}
          // Chame a função auxiliar para confirmar o pagamento
          onConfirmarPagamento={(valorPago, mensalista) => {
            handleConfirmarPagamento(
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

      {modalFilaAberto && (
        <ModalFilaDeEspera
          isOpen={modalFilaAberto}
          onClose={() => setModalFilaAberto(false)}
          dados={horarioSelecionado}
          onEntrarFila={() => setModalFilaAberto(false)}
        />
      )}

      <BottomNav />
      <FooterEuro />
    </div>
  );
}
