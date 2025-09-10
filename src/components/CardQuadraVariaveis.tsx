import { useState } from "react";
import InputConfig from "./InputConfig";
import { Loader2 } from "lucide-react";
import type { Quadra } from "../types/interfacesFront";

// Função de formatação BRL
function formatCurrency(value: string | number): string {
  if (!value && value !== 0) return "";
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
  config: Quadra;
  setConfig: (value: Quadra) => void;
  onSave: () => Promise<void>;
}) {
  const [isLoading, setIsLoading] = useState(false);

  // Handler genérico para inputs monetários
  const handleCurrencyChange = (field: keyof Pick<Quadra, 'precoNormal' | 'precoNoturno' | 'precoNormalMensal' | 'precoNoturnoMensal'>, val: string) => {
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
              value={formatCurrency(config.precoNormal)}
              onChange={(val) => handleCurrencyChange("precoNormal", val)}
              type="text"
            />
            <InputConfig
              label="Preço após 18h (R$/h)"
              value={formatCurrency(config.precoNoturno)}
              onChange={(val) => handleCurrencyChange("precoNoturno", val)}
              type="text"
            />
          </div>
          <div className="space-y-3 flex-1">
            <InputConfig
              label="Preço mensal normal (R$/h)"
              value={formatCurrency(config.precoNormalMensal)}
              onChange={(val) => handleCurrencyChange("precoNormalMensal", val)}
              type="text"
            />
            <InputConfig
              label="Preço mensal após 18h (R$/h)"
              value={formatCurrency(config.precoNoturnoMensal)}
              onChange={(val) => handleCurrencyChange("precoNoturnoMensal", val)}
              type="text"
            />
          </div>
        </div>

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

        <button
          onClick={handleSave}
          disabled={isLoading}
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
