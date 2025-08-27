import InputConfig from "./InputConfig";
interface QuadraConfig {
  id: number;
  nome: string;
  tipo: string;
  status: string;
  preco_normal: number;
  preco_noturno: number;
  preco_normal_mensal: number; // Troca aqui
  preco_noturno_mensal: number; // Troca aqui
  hora_abertura: string;
  hora_fechamento: string;
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
          value={config.preco_normal}
          onChange={(val) => setConfig({ ...config, preco_normal: Number(val) })}
          type="number"
        />
        <InputConfig
          label="Preço após 18h (R$/h)"
          value={config.preco_noturno}
          onChange={(val) => setConfig({ ...config, preco_noturno: Number(val) })}
          type="number"
        />
        <InputConfig
          label="Horário de abertura"
          value={config.hora_abertura}
          onChange={(val) => setConfig({ ...config, hora_abertura: val })}
          type="time"
        />
        <InputConfig
          label="Horário de fechamento"
          value={config.hora_fechamento}
          onChange={(val) => setConfig({ ...config, hora_fechamento: val })}
          type="time"
        />
        <InputConfig
          label="Preço mensal normal (R$/h)" // Troca aqui
          value={config.preco_normal_mensal} // Troca aqui
          onChange={(val) =>
            setConfig({ ...config, preco_normal_mensal: Number(val) }) // Troca aqui
          }
          type="number"
        />
        <InputConfig
          label="Preço mensal após 18h (R$/h)" // Troca aqui
          value={config.preco_noturno_mensal} // Troca aqui
          onChange={(val) =>
            setConfig({ ...config, preco_noturno_mensal: Number(val) }) // Troca aqui
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