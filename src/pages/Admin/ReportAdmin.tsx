import { useState } from "react";

import HeaderEuro from "../../components/Layout/HeaderEuro";
import FooterEuro from "../../components/Layout/FooterEuro";
import AdminSidebar from "../../components/Navigation/AdminSidebar";

export default function ReportAdmin() {
  // const currentYear = new Date().getFullYear();
  const [tipoRelatorio, setTipoRelatorio] = useState("financeiro");
  const [tipoQuadra, setTipoQuadra] = useState("todas");
  const [dataInicio, setDataInicio] = useState("2025-01-01");
  const [dataFim, setDataFim] = useState("2025-12-31");

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
                <option value="financeiro">Todas</option>
                <option value="society">Society</option>
                <option value="futevolei">Futevôlei</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1">
                Data início
              </label>
              <input
                type="date"
                className="border border-gray-300 rounded-md px-4 py-2"
                defaultValue="2025-01-01"
                onChange={(e) => setDataInicio(e.target.value)}
                value={dataInicio}
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1">Data fim</label>
              <input
                type="date"
                className="border border-gray-300 rounded-md px-4 py-2"
                defaultValue="2025-12-31"
                onChange={(e) => setDataFim(e.target.value)}
                value={dataFim}
              />
            </div>

            <div className="mt-4 md:mt-6">
              <button className="bg-[#2b4363] text-white px-6 py-2 rounded-md font-medium hover:bg-[#1f324b] transition">
                Gerar
              </button>
            </div>
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-lg font-semibold text-azulBase mb-4">
                Receita por período
              </h2>
              <div className="h-64 flex items-center justify-center text-gray-400">
                [Gráfico Receita]
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-lg font-semibold text-azulBase mb-4">
                Ocupação por quadra
              </h2>
              <div className="h-64 flex items-center justify-center text-gray-400">
                [Gráfico Ocupação]
              </div>
            </div>
          </div>
        </main>
      </div>

      <FooterEuro />
    </div>
  );
}
