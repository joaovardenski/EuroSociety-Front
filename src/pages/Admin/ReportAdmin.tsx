import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line,
  Legend,
} from "recharts";

import HeaderEuro from "../../components/Layout/HeaderEuro";
import FooterEuro from "../../components/Layout/FooterEuro";
import AdminSidebar from "../../components/Navigation/AdminSidebar";
import axiosPrivate from "../../api/axiosPrivate";

type Receita = {
  mes: string;
  valor: number;
};

type Ocupacao = {
  quadra: string;
  usos: number;
};

export default function ReportAdmin() {
  const [tipoRelatorio, setTipoRelatorio] = useState("financeiro");
  const [tipoQuadra, setTipoQuadra] = useState("todas");
  const [dataInicio, setDataInicio] = useState("2025-01-01");
  const [dataFim, setDataFim] = useState("2025-12-31");
  const [loading, setLoading] = useState(false);

  const [receitaDados, setReceitaDados] = useState<Receita[]>([]);
  const [ocupacaoQuadras, setOcupacaoQuadras] = useState<Ocupacao[]>([]);

  async function getReceitaMensal(): Promise<Receita[]> {
    const year = new Date().getFullYear();
    try {
      const response = await axiosPrivate.get(
        `/admin/report/receitaMensal?year=${year}`
      );
      return response.data.report as Receita[];
    } catch (error) {
      console.error("Erro ao buscar receita mensal:", error);
      return [];
    }
  }

  async function getOcupacao(): Promise<Ocupacao[]> {
    try {
      const response = await axiosPrivate.get("/admin/report/ocupacaoQuadras");
      return response.data.report as Ocupacao[];
    } catch (error) {
      console.error("Erro ao buscar ocupação por quadra:", error);
      return [];
    }
  }

  async function gerarRelatorio() {
    setLoading(true);

    try {
      const params = {
        tipo_relatorio: tipoRelatorio,
        tipo_quadra: tipoQuadra,
        data_inicio: dataInicio,
        data_fim: dataFim,
      };

      const response = await axiosPrivate.get("/admin/report/generate", {
        params,
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `relatorio_${tipoRelatorio}.pdf`);
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url); // libera memória
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function carregarDadosRelatorios() {
      try {
        const receitaApi = await getReceitaMensal();
        const ocupacaoApi = await getOcupacao();

        setReceitaDados(receitaApi);
        setOcupacaoQuadras(ocupacaoApi);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    }

    carregarDadosRelatorios();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#e6f4ff]">
      <HeaderEuro />

      <div className="flex flex-1">
        <AdminSidebar />

        <main className="flex-1 p-8 overflow-y-auto max-h-130">
          <h1 className="text-2xl font-semibold text-azulBase mb-8">
            Relatórios e Métricas
          </h1>

          {/* Card de filtros */}
          <div className="bg-white p-6 rounded-xl shadow-md mb-8 flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1">
                Tipo de relatório
              </label>
              <select
                className="border border-gray-300 rounded-md px-4 py-2"
                onChange={(e) => setTipoRelatorio(e.target.value)}
                value={tipoRelatorio}
              >
                <option value="financeiro">Financeiro</option>
                <option value="ocupacao">Ocupação</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1">
                Tipo de quadra
              </label>
              <select
                className="border border-gray-300 rounded-md px-4 py-2"
                onChange={(e) => setTipoQuadra(e.target.value)}
                value={tipoQuadra}
              >
                <option value="todas">Todas</option>
                <option value="society">Society</option>
                <option value="futevolei">Areia</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1">
                Data início
              </label>
              <input
                type="date"
                className="border border-gray-300 rounded-md px-4 py-2"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1">Data fim</label>
              <input
                type="date"
                className="border border-gray-300 rounded-md px-4 py-2"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
              />
            </div>

            <div className="mt-4 md:mt-6">
              <button
                onClick={gerarRelatorio}
                disabled={loading}
                className="bg-[#2b4363] text-white px-6 py-2 rounded-md font-medium hover:bg-[#1f324b] transition"
              >
                {loading ? "Gerando..." : "Gerar"}
              </button>
            </div>
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-lg font-semibold text-azulBase mb-4">
                Receita por período
              </h2>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={receitaDados}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="valor"
                    stroke="#2b4363"
                    name="Receita (R$)"
                    strokeWidth={3}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-lg font-semibold text-azulBase mb-4">
                Ocupação por quadra (mensal)
              </h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={ocupacaoQuadras}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="quadra" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="usos" fill="#3182ce" name="Agendamentos" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </main>
      </div>

      <FooterEuro />
    </div>
  );
}
