// Hooks
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Utils
import {
  getCurrentDate,
  gerarHorarioFim,
  formatarDataBrasileira,
} from "../../utils/DateUtils";

// Components
import HeaderEuro from "../../components/HeaderEuro";
import FiltroTipo from "../../components/Filtros/FiltroTipo";
import FiltroData from "../../components/Filtros/FiltroData";
import AvailableCourts from "../../components/AvailableCourts";
import FooterEuro from "../../components/FooterEuro";
import BottomNav from "../../components/BottomNav";
// Modals
import ModalConfirmarAgendamento from "../../components/Modais/Client/ModalConfirmarAgendamento";
import ModalDetalhesPagamento from "../../components/Modais/Client/ModalDetalhesPagamento";
import ModalFilaDeEspera from "../../components/Modais/Client/ModalFilaDeEspera";

//Icons
import { ArrowLeft } from "lucide-react";

// Mock Data
import { Quadras, indisponibilidadesQuadras, bloqueadasQuadras } from "../../data/Variaveis";

export default function NewBooking() {
  const navigate = useNavigate();

  {/*Dados iniciais pro filtro*/}
  const [tipoSelecionado, setTipoSelecionado] = useState("Todas");
  const [dataSelecionada, setDataSelecionada] = useState(getCurrentDate());

  {/*Dados do horário que foi selecionado para fazer alguma ação*/}
  const [horarioSelecionado, setHorarioSelecionado] = useState({
    quadra: "",
    horario: "",
    data: dataSelecionada,
    valor: 0,
  });

  {/*Dados do mock para horários com indisponibilidade*/}
  const getIndisponiveis = (nome: string) =>
    indisponibilidadesQuadras.find((q) => q.nome === nome)?.indisponiveis || [];

  const getBloqueadas = (nome: string) =>
      bloqueadasQuadras.find((q) => q.nome === nome)?.bloqueados || [];

  {/*Dados para controlar a abertura e fechamento dos modais*/}
  const [modalConfirmarAberto, setModalConfirmarAberto] = useState(false);
  const [modalPagamentoAberto, setModalPagamentoAberto] = useState(false);
  const [modalFilaAberto, setModalFilaAberto] = useState(false);

  {/*Função para clique em horário disponível (se horário disponível abre modal de confirmar, senão de fila de espera)*/}
  const handleHorarioClick = (quadraKey: keyof typeof Quadras, horario: string, indisponivel: boolean) => {
    const config = Quadras[quadraKey];

    setHorarioSelecionado({
      quadra: config.nome,
      horario: `${horario} - ${gerarHorarioFim(horario)}`,
      data: dataSelecionada,
      valor: config.preco,
    });

    if (indisponivel) {
      setModalFilaAberto(true);
    } else {
      setModalConfirmarAberto(true);
    }
    
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f3f7ff]">
      {/* HeaderEuro component*/}
      <HeaderEuro />

      <main className="bg-white mt-7 mb-20 rounded-4xl flex-grow max-w-5xl w-full mx-auto px-4 py-8 shadow-2xl md:mb-10">
        {/* Topo do card com título e botão de voltar*/}
        <div className="relative flex items-center justify-center mb-6">
          <button
            onClick={() => navigate("/")}
            className="absolute left-0 text-azulBase hover:text-azulEscuro transition"
          >
            <ArrowLeft size={23} />
          </button>
          <h1 className="text-xl font-semibold text-azulBase text-center md:text-2xl">
            Disponibilidade de quadras
          </h1>
        </div>

        {/* Filtros de tipo e data */}
        <div className="bg-blue-100/50 border border-blue-400 rounded-xl p-4 mb-6 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between md:gap-6">
          {/* Os filtros recebem o dado do filtro, e também a função de setar */}
          <FiltroTipo
            tipoSelecionado={tipoSelecionado}
            setTipoSelecionado={setTipoSelecionado}
          />
          <FiltroData
            dataSelecionada={dataSelecionada}
            setDataSelecionada={setDataSelecionada}
          />
        </div>

        {/* Mostra as quadras disponíveis e horários com base nos filtros */}
        <div className="space-y-6">
          {Object.entries(Quadras).map(([key, quadra]) => {
            {/* Verifica se a quadra é o tipo selecionado */}
            if (tipoSelecionado !== "Todas" && quadra.tipo.toLowerCase() !== tipoSelecionado.toLowerCase()) {
              return null;
            } else {
              return (
                <AvailableCourts
                  key={quadra.nome}
                  nome={quadra.nome}
                  horaAbertura={quadra.horaAbertura}
                  horaFechamento={quadra.horaFechamento}
                  indisponiveis={getIndisponiveis(quadra.nome)}
                  bloqueados={getBloqueadas(quadra.nome)}
                  onHorarioClick={(horario: string, indisponivel: boolean) =>
                    handleHorarioClick(key as keyof typeof Quadras, horario, indisponivel)
                  }
                />
              );
            }
          })}
        </div>
      </main>

      {/* Modais para confirmação, pagamento e fila de espera */}
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
          quadra={horarioSelecionado.quadra}
          dataHora={`${formatarDataBrasileira(horarioSelecionado.data)} às ${
            horarioSelecionado.horario.split(" - ")[0]
          }`}
          valorTotal={horarioSelecionado.valor}
          onConfirmarPagamento={(valor, metodo, mensalista) => {
            console.log("Pagamento efetuado:", { valor, metodo, mensalista });
            setModalPagamentoAberto(false);
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

      {/* Footer e bottomav */}
      <BottomNav />
      <FooterEuro />
    </div>
  );
}
