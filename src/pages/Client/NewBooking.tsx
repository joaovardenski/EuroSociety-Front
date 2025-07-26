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

// Types locais
type Quadra = {
  id: number;
  nome: string;
  tipo: string;
  status: string;
  horaAbertura: number;
  horaFechamento: number;
  precoNormal: number;
  precoNoturno: number;
  descontoMensalista: number;
};

type Indisponibilidade = { nome: string; indisponiveis: string[] };
type Bloqueio = { nome: string; bloqueados: string[] };

export default function NewBooking() {
  // ----------------- Estados -----------------
  const [tipoSelecionado, setTipoSelecionado] = useState("Todas");
  const [dataSelecionada, setDataSelecionada] = useState(getCurrentDate());

  const [quadras, setQuadras] = useState<Quadra[]>([]);
  const [indisponibilidades, setIndisponibilidades] = useState<Indisponibilidade[]>([]);
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
  });

  // ----------------- “APIs” locais (substitua por fetch/axios depois) -----------------
  async function getQuadras(): Promise<Quadra[]> {
    const mod = await import("../../data/Variaveis");
    return mod.Quadras as Quadra[];
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

  // ----------------- Handlers -----------------
  function handleHorarioClick(
    quadraId: number,
    horario: string,
    indisponivel: boolean,
    bloqueado: boolean
  ) {
    const quadraConfig = quadras.find((q) => q.id === quadraId);
    if (!quadraConfig) return;

    const valor = calcularValor(quadraConfig, horario);
    setHorarioSelecionado({
      quadra: quadraConfig.nome,
      horario: `${horario} - ${gerarHorarioFim(horario)}`,
      data: dataSelecionada,
      valor,
    });

    if (bloqueado) return;
    if (indisponivel) {
      setModalFilaAberto(true);
    } else {
      setModalConfirmarAberto(true);
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
            to={"/"}
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
        {isLoading ? (
          <LoadingMessage message="Carregando quadras disponíveis..." />
        ) : (
          <div className="space-y-6">
            {quadras.filter((quadra) => tipoSelecionado === "Todas" || quadra.tipo.toLowerCase() === tipoSelecionado.toLowerCase())
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
          onConfirmarPagamento={() => setModalPagamentoAberto(false)}
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
