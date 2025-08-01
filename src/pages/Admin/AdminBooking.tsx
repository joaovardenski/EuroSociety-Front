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
          onBloquear={() => setModalConfirmarAberto(false)}
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
          onConfirmar={() => setModalAgendarAberto(false)}
        />
      )}

      {modalAgendarOcupadoAberto && (
        <ModalAgendarOcupadoAdmin
          isOpen={modalAgendarOcupadoAberto}
          onClose={() => setModalAgendarOcupadoAberto(false)}
          dados={horarioSelecionado}
          onConfirmar={() => setModalAgendarOcupadoAberto(false)}
        />
      )}

      {modalDesbloquearAberto && (
        <ModalDesbloquearAdmin
          isOpen={modalDesbloquearAberto}
          onClose={() => setModalDesbloquearAberto(false)}
          dados={horarioSelecionado}
          onConfirmar={() => setModalDesbloquearAberto(false)}
        />
      )}

      <FooterEuro />
    </div>
  );
}
