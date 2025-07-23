import { useState } from "react";

// Utils
import { getCurrentDate, gerarHorarioFim } from "../../utils/DateUtils";

// Components
import HeaderEuro from "../../components/Layout/HeaderEuro";
import AdminSidebar from "../../components/Navigation/AdminSidebar";
import FooterEuro from "../../components/Layout/FooterEuro";
import FiltroTipo from "../../components/Filtros/FiltroTipo";
import FiltroData from "../../components/Filtros/FiltroData";
import AvailableCourts from "../../components/Reservas/AvailableCourts";

// Modals
import ModalConfirmarAdmin from "../../components/Modais/Admin/ModalConfirmarAdmin";
import ModalAgendarAdmin from "../../components/Modais/Admin/ModalAgendarAdmin";
import ModalAgendarOcupadoAdmin from "../../components/Modais/Admin/ModalAgendarOcupadoAdmin";

// Dados mock
import {
  Quadras,
  indisponibilidadesQuadras,
  bloqueadasQuadras,
} from "../../data/Variaveis";
import ModalDesbloquearAdmin from "../../components/Modais/Admin/ModalDesbloquearAdmin";
import LegendaReservas from "../../components/Reservas/LegendaReservas";

export default function AdminBooking() {
  const [tipoSelecionado, setTipoSelecionado] = useState("Todas");
  const [dataSelecionada, setDataSelecionada] = useState(getCurrentDate());

  const [horarioSelecionado, setHorarioSelecionado] = useState({
    quadra: "",
    horario: "",
    data: dataSelecionada,
    valor: 0,
  });

  const getIndisponiveis = (nome: string) =>
    indisponibilidadesQuadras.find((q) => q.nome === nome)?.indisponiveis || [];

  const getBloqueadas = (nome: string) =>
    bloqueadasQuadras.find((q) => q.nome === nome)?.bloqueados || [];

  const [modalConfirmarAberto, setModalConfirmarAberto] = useState(false);
  const [modalAgendarAberto, setModalAgendarAberto] = useState(false);
  const [modalAgendarOcupadoAberto, setModalAgendarOcupadoAberto] =
    useState(false);
  const [modalDesbloquearAberto, setModalDesbloquearAberto] = useState(false);

  const handleHorarioClick = (
    quadraKey: keyof typeof Quadras,
    horario: string,
    indisponivel: boolean,
    bloqueado: boolean
  ) => {
    const config = Quadras[quadraKey];

    setHorarioSelecionado({
      quadra: config.nome,
      horario: `${horario} - ${gerarHorarioFim(horario)}`,
      data: dataSelecionada,
      valor: config.preco,
    });

    if (indisponivel) {
      setModalAgendarOcupadoAberto(true);
    } else if (bloqueado) {
      setModalDesbloquearAberto(true);
    } else {
      setModalConfirmarAberto(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#e6f4ff]">
      <HeaderEuro />

      <div className="flex flex-1">
        <AdminSidebar />

        <main className="flex-grow p-6 max-w-6xl w-full mx-auto bg-white mt-6 mb-10 rounded-3xl shadow-xl max-h-117 overflow-y-auto">
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
              setDataSelecionada={setDataSelecionada}
            />
          </div>

          <LegendaReservas />

          {/* Lista de quadras */}
          <div className="space-y-6">
            {Object.entries(Quadras).map(([key, quadra]) => {
              if (
                tipoSelecionado !== "Todas" &&
                quadra.tipo.toLowerCase() !== tipoSelecionado.toLowerCase()
              ) {
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
                    onHorarioClick={(
                      horario: string,
                      indisponivel: boolean,
                      bloqueados: boolean
                    ) =>
                      handleHorarioClick(
                        key as keyof typeof Quadras,
                        horario,
                        indisponivel,
                        bloqueados
                      )
                    }
                  />
                );
              }
            })}
          </div>
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
