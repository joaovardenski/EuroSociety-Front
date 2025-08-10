interface FiltroTipoProps {
  tipoSelecionado: string;
  setTipoSelecionado: (value: string) => void;
};

export default function FiltroTipo({ tipoSelecionado, setTipoSelecionado }: FiltroTipoProps) {
  return (
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
        <option value="Areia">Areia</option>
      </select>
    </div>
  );
}

