import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderEuro from "../../components/HeaderEuro";
import FooterEuro from "../../components/FooterEuro";
import BottomNav from "../../components/BottomNav";
import { ArrowLeft } from "lucide-react";

// Função para gerar horários com intervalo de 1h
function gerarHorarios(horaInicio: number, horaFim: number): string[] {
  const horarios: string[] = [];
  for (let h = horaInicio; h < horaFim; h++) {
    horarios.push(`${h}:00`);
  }
  return horarios;
}

// Quadras com horários personalizados
const quadrasMock = [
  {
    nome: "Quadra Society",
    tipo: "Society",
    horaAbertura: 8,
    horaFechamento: 18,
    indisponiveis: ["9:00", "13:00"],
  },
  {
    nome: "Quadra Futevôlei 1",
    tipo: "Futevôlei",
    horaAbertura: 6,
    horaFechamento: 18,
    indisponiveis: ["8:00", "14:00"],
  },
  {
    nome: "Quadra Futevôlei 2",
    tipo: "Futevôlei",
    horaAbertura: 8,
    horaFechamento: 20,
    indisponiveis: ["13:00"],
  },
];

export default function NewBooking() {
  const navigate = useNavigate();
  const [tipoSelecionado, setTipoSelecionado] = useState("Todas");
  const [dataSelecionada, setDataSelecionada] = useState("2025-06-30");

  const quadrasFiltradas = quadrasMock.filter((quadra) =>
    tipoSelecionado === "Todas"
      ? true
      : quadra.tipo.toLowerCase() === tipoSelecionado.toLowerCase()
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#f3f7ff]">
      <HeaderEuro />

      <main className="bg-white mt-7 mb-20 rounded-4xl flex-grow max-w-5xl w-full mx-auto px-4 py-8 shadow-2xl md:mb-0">
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

        {/* Filtros */}
        <div className="bg-blue-100/50 border border-blue-400 rounded-xl p-4 mb-6 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between md:gap-6">
          {/* Filtro de tipo */}
          <div className="flex flex-col gap-1 w-full md:w-auto md:flex-row md:items-center md:gap-3">
            <label htmlFor="tipo" className="text-gray-700 font-medium">
              Tipo de quadra:
            </label>
            <select
              id="tipo"
              value={tipoSelecionado}
              onChange={(e) => setTipoSelecionado(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="Todas">Todas</option>
              <option value="Society">Society</option>
              <option value="Futevôlei">Futevôlei</option>
            </select>
          </div>

          {/* Filtro de data */}
          <div className="flex flex-col gap-1 w-full md:w-auto md:flex-row md:items-center md:gap-3">
            <label htmlFor="data" className="text-gray-700 font-medium">
              Data:
            </label>
            <input
              type="date"
              id="data"
              value={dataSelecionada}
              onChange={(e) => setDataSelecionada(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        {/* Horários por quadra */}
        <div className="space-y-6">
          {quadrasFiltradas.map((quadra) => {
            const horarios = gerarHorarios(
              quadra.horaAbertura,
              quadra.horaFechamento
            );
            return (
              <div key={quadra.nome}>
                <h2 className="font-bold text-xl text-azulBase mb-1">
                  {quadra.nome}
                </h2>
                <hr className="border opacity-60 mb-5" />
                <div className="flex flex-wrap gap-3">
                  {horarios.map((hora) => {
                    const isIndisponivel = quadra.indisponiveis.includes(hora);
                    return (
                      <button
                        key={hora}
                        disabled={isIndisponivel}
                        className={` flex items-center justify-center px-5 py-2.5 w-18 rounded-lg border text-[14px] md:text-base font-semibold transition-all md:w-22 ${
                          isIndisponivel
                            ? "bg-gray-300 text-gray-600 line-through cursor-not-allowed"
                            : "bg-white text-azulBase border-azulBase hover:bg-azulBase hover:text-white"
                        }`}
                      >
                        {hora}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <BottomNav />
      <FooterEuro />
    </div>
  );
}
