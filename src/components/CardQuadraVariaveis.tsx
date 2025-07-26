import InputConfig from "./InputConfig";

interface QuadraConfig {
  id: number;
  precoNormal: number;
  precoNoturno: number;
  horaAbertura: string;
  horaFechamento: string;
  descontoMensalista: number;
}

export default function CardQuadra({
  titulo,
  config,
  setConfig,
  onSave,
}: {
  titulo: string;
  config: QuadraConfig;
  setConfig: (value: QuadraConfig) => void;
  onSave: () => void;
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-lg font-semibold border-b pb-2 mb-4">{titulo}</h2>
      <div className="space-y-3">
        <InputConfig
          label="Preço normal (R$/h)"
          value={config.precoNormal}
          onChange={(val) => setConfig({ ...config, precoNormal: Number(val) })}
          type="number"
        />
        <InputConfig
          label="Preço após 18h (R$/h)"
          value={config.precoNoturno}
          onChange={(val) => setConfig({ ...config, precoNoturno: Number(val) })}
          type="number"
        />
        <InputConfig
          label="Horário de abertura"
          value={config.horaAbertura}
          onChange={(val) => setConfig({ ...config, horaAbertura: val })}
          type="time"
        />
        <InputConfig
          label="Horário de fechamento"
          value={config.horaFechamento}
          onChange={(val) => setConfig({ ...config, horaFechamento: val })}
          type="time"
        />
        <InputConfig
          label="Desconto (%) mensalista"
          value={config.descontoMensalista}
          onChange={(val) =>
            setConfig({ ...config, descontoMensalista: Number(val) })
          }
          type="number"
        />
        <button
          onClick={onSave}
          className="mt-2 bg-[#2b4363] text-white px-4 py-2 rounded-md hover:bg-[#1f324b] transition"
        >
          Salvar {titulo}
        </button>
      </div>
    </div>
  );
}