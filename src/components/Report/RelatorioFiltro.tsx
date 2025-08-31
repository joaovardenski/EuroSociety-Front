export interface FiltrosBasicos {
  tipoRelatorio: string;
  dataInicio: string;
  dataFim: string;
}

interface Props {
  filtros: FiltrosBasicos;
  setFiltros: (filtros: Partial<FiltrosBasicos>) => void;
  onGerar: () => void;
  loading: boolean;
}

export default function RelatorioFiltros({
  filtros,
  setFiltros,
  onGerar,
  loading,
}: Props) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md mb-8 flex flex-col md:flex-row md:items-center gap-6">
      <div className="flex flex-col">
        <label className="text-gray-700 font-medium mb-1">
          Tipo de relatório
        </label>
        <select
          className="border border-gray-300 rounded-md px-4 py-2"
          value={filtros.tipoRelatorio}
          onChange={(e) => setFiltros({ tipoRelatorio: e.target.value })}
        >
          <option value="financeiro">Financeiro</option>
          <option value="ocupacao">Ocupação</option>
        </select>
      </div>

      <div className="flex flex-col">
        <label className="text-gray-700 font-medium mb-1">Data início</label>
        <input
          type="date"
          className="border border-gray-300 rounded-md px-4 py-2"
          value={filtros.dataInicio}
          onChange={(e) => setFiltros({ dataInicio: e.target.value })}
        />
      </div>

      <div className="flex flex-col">
        <label className="text-gray-700 font-medium mb-1">Data fim</label>
        <input
          type="date"
          className="border border-gray-300 rounded-md px-4 py-2"
          value={filtros.dataFim}
          onChange={(e) => setFiltros({ dataFim: e.target.value })}
        />
      </div>

      <div className="mt-4 md:mt-6">
        <button
          onClick={onGerar}
          disabled={loading}
          className="bg-[#2b4363] text-white px-6 py-2 rounded-md font-medium hover:bg-[#1f324b] transition"
        >
          {loading ? "Gerando..." : "Gerar"}
        </button>
      </div>
    </div>
  );
}
