import { useState } from "react";
import InputConfig from "./InputConfig";

// Assumindo que você tem um ícone de carregamento, por exemplo, de 'lucide-react'
import { Loader2 } from "lucide-react"; 

interface QuadraConfig {
  id: number;
  nome: string;
  tipo: string;
  status: string;
  preco_normal: number;
  preco_noturno: number;
  preco_normal_mensal: number;
  preco_noturno_mensal: number;
  hora_abertura: string;
  hora_fechamento: string;
}

// Função de formatação BRL
function formatCurrency(value: string | number): string {
  if (!value) return "";
  const number = typeof value === "string" ? parseFloat(value.replace(/\D/g, "")) / 100 : value;
  if (isNaN(number)) return "";
  return number.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

// Função para converter máscara → número bruto
function parseCurrency(value: string): number {
  const number = parseFloat(value.replace(/\D/g, "")) / 100;
  return isNaN(number) ? 0 : number;
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
  onSave: () => Promise<void>; // Altere o tipo de onSave para Promise
}) {
  const [isLoading, setIsLoading] = useState(false);

  // Handler genérico para inputs monetários
  const handleCurrencyChange = (field: keyof QuadraConfig, val: string) => {
    setConfig({
      ...config,
      [field]: parseCurrency(val),
    });
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await onSave();
    } catch (error) {
      console.error("Falha ao salvar as configurações:", error);
      // Você pode adicionar um feedback visual de erro aqui
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-lg font-semibold border-b pb-2 mb-4">{titulo}</h2>
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="space-y-3 flex-1">
            <InputConfig
              label="Preço normal (R$/h)"
              value={formatCurrency(config.preco_normal)}
              onChange={(val) => handleCurrencyChange("preco_normal", val)}
              type="text"
            />
            <InputConfig
              label="Preço após 18h (R$/h)"
              value={formatCurrency(config.preco_noturno)}
              onChange={(val) => handleCurrencyChange("preco_noturno", val)}
              type="text"
            />
          </div>
          <div className="space-y-3 flex-1">
            <InputConfig
              label="Preço mensal normal (R$/h)"
              value={formatCurrency(config.preco_normal_mensal)}
              onChange={(val) => handleCurrencyChange("preco_normal_mensal", val)}
              type="text"
            />
            <InputConfig
              label="Preço mensal após 18h (R$/h)"
              value={formatCurrency(config.preco_noturno_mensal)}
              onChange={(val) => handleCurrencyChange("preco_noturno_mensal", val)}
              type="text"
            />
          </div>
        </div>
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

        <button
          onClick={handleSave}
          disabled={isLoading} // Desabilita o botão durante o carregamento
          className={`mt-4 w-full text-white px-4 py-2 rounded-lg transition ${
            isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-azulBase hover:bg-[#0f3c76]"
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <Loader2 size={20} className="animate-spin mr-2" />
              Salvando...
            </div>
          ) : (
            `Salvar ${titulo}`
          )}
        </button>
      </div>
    </div>
  );
}