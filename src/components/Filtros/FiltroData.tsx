interface FiltroDataProps {
  dataSelecionada: string;
  setDataSelecionada: (value: string) => void;
};

export default function FiltroData({ dataSelecionada, setDataSelecionada }: FiltroDataProps) {
  return (
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
  );
}
