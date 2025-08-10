import { useEffect, useState } from "react";
import HeaderEuro from "../../components/Layout/HeaderEuro";
import FooterEuro from "../../components/Layout/FooterEuro";
import AdminSidebar from "../../components/Navigation/AdminSidebar";
import CardQuadraVariaveis from "../../components/CardQuadraVariaveis";
import LoadingMessage from "../../components/LoadingMessage";
import { isValidInterval, isValidPrice } from "../../utils/Validators";

// Tipos das quadras
interface QuadraConfig {
  id: number;
  precoNormal: number;
  precoNoturno: number;
  precoMensalNormal: number;
  precoMensalNoturno: number;
  horaAbertura: string;
  horaFechamento: string;
}

export default function VariablesAdmin() {
  const [isLoading, setIsLoading] = useState(true);

  // ----------------- STATES -----------------
  const [society, setSociety] = useState<QuadraConfig>({
    id: 1,
    precoNormal: 0,
    precoNoturno: 0,
    precoMensalNormal: 0,
    precoMensalNoturno: 0,
    horaAbertura: "",
    horaFechamento: "",
  });

  const [areia1, setAreia1] = useState<QuadraConfig>({
    id: 2,
    precoNormal: 0,
    precoNoturno: 0,
    precoMensalNormal: 0,
    precoMensalNoturno: 0,
    horaAbertura: "",
    horaFechamento: "",
  });

  const [areia2, setAreia2] = useState<QuadraConfig>({
    id: 3,
    precoNormal: 0,
    precoNoturno: 0,
    precoMensalNormal: 0,
    precoMensalNoturno: 0,
    horaAbertura: "",
    horaFechamento: "",
  });

  // ----------------- FETCH INITIAL DATA -----------------
  async function getQuadras(): Promise<QuadraConfig[]> {
    const mod = await import("../../data/Variaveis");
    return mod.quadras as QuadraConfig[];
  }

  useEffect(() => {
    async function carregarDadosQuadras() {
      try {
        const quadras = await getQuadras();

        // Encontrar cada quadra pelo ID
        const societyData = quadras.find((q) => q.id === 1);
        const areia1Data = quadras.find((q) => q.id === 2);
        const areia2Data = quadras.find((q) => q.id === 3);

        // Atualizar os states
        if (societyData) setSociety(societyData);
        if (areia1Data) setAreia1(areia1Data);
        if (areia2Data) setAreia2(areia2Data);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setIsLoading(false);
      }
    }

    carregarDadosQuadras();
  }, []);

  function validarQuadra(quadra: QuadraConfig) {
    const precos = [
      quadra.precoNormal,
      quadra.precoNoturno,
      quadra.precoMensalNormal,
      quadra.precoMensalNoturno,
    ];

    const todosPrecosValidos = precos.every(isValidPrice);
    const intervaloValido = isValidInterval(
      quadra.horaAbertura,
      quadra.horaFechamento
    );

    return todosPrecosValidos && intervaloValido;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#e6f4ff]">
      <HeaderEuro />
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar />

        <main className="flex-1 p-8 overflow-y-auto max-h-130">
          {isLoading ? (
            <LoadingMessage message="Carregando configurações..." />
          ) : (
            <>
              <h1 className="text-2xl font-semibold text-azulBase mb-8">
                Variáveis e configurações
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CardQuadraVariaveis
                  titulo="Quadra Society"
                  config={society}
                  setConfig={setSociety}
                  onSave={() => validarQuadra(society)}
                />
                <CardQuadraVariaveis
                  titulo="Quadra de Areia 1"
                  config={areia1}
                  setConfig={setAreia1}
                  onSave={() => validarQuadra(areia1)}
                />
                <CardQuadraVariaveis
                  titulo="Quadra de Areia 2"
                  config={areia2}
                  setConfig={setAreia2}
                  onSave={() => validarQuadra(areia2)}
                />
              </div>
            </>
          )}
        </main>
      </div>
      <FooterEuro />
    </div>
  );
}
