import { useEffect, useState } from "react";
import HeaderEuro from "../../components/Layout/HeaderEuro";
import FooterEuro from "../../components/Layout/FooterEuro";
import AdminSidebar from "../../components/Navigation/AdminSidebar";
import CardQuadraVariaveis from "../../components/CardQuadraVariaveis";
import LoadingMessage from "../../components/LoadingMessage";
import { isValidInterval, isValidPrice } from "../../utils/Validators";
import axiosPrivate from "../../api/axiosPrivate";
import type { Quadra } from "../../types/interfacesFront";
import type { QuadraAPI } from "../../types/interfacesApi";
import { mapQuadra } from "../../utils/Mappers";

export default function VariablesAdmin() {
  const [isLoading, setIsLoading] = useState(true);
  const [quadras, setQuadras] = useState<Quadra[]>([]);

  // ----------------- FETCH INITIAL DATA -----------------
  async function getQuadras(): Promise<Quadra[]> {
    try {
      const response = await axiosPrivate.get<{ data: QuadraAPI[] }>("/quadras");
      console.log("Dados das quadras recebidos:", response.data);
      // Mapeia cada quadra usando mapQuadra
      return response.data.data.map(mapQuadra);
    } catch (error) {
      console.error("Erro ao buscar dados das quadras:", error);
      return [];
    }
  }

  useEffect(() => {
    async function carregarDadosQuadras() {
      try {
        const quadrasData = await getQuadras();
        setQuadras(quadrasData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setIsLoading(false);
      }
    }

    carregarDadosQuadras();
  }, []);

  function validarQuadra(quadra: Quadra) {
    const precos = [
      quadra.precoNormal,
      quadra.precoNoturno,
      quadra.precoNormalMensal,
      quadra.precoNoturnoMensal,
    ];

    const todosPrecosValidos = precos.every(isValidPrice);
    const intervaloValido = isValidInterval(
      quadra.horaAbertura,
      quadra.horaFechamento
    );

    return todosPrecosValidos && intervaloValido;
  }

  async function salvarVariaveis(quadra: Quadra) {
    if (!validarQuadra(quadra)) {
      alert("Dados inválidos. Verifique os preços e horários.");
      return;
    }

    try {
      const response = await axiosPrivate.put(`/quadras/${quadra.id}`, {
        nome: quadra.nome,
        tipo: quadra.tipo,
        status: quadra.status,
        hora_abertura: quadra.horaAbertura,
        hora_fechamento: quadra.horaFechamento,
        preco_normal: quadra.precoNormal,
        preco_noturno: quadra.precoNoturno,
        preco_normal_mensal: quadra.precoNormalMensal,
        preco_noturno_mensal: quadra.precoNoturnoMensal,
      });
      console.log("Dados salvos com sucesso:", response.data);
      alert("Configurações salvas com sucesso!");

      // Atualiza o estado com os dados salvos
      setQuadras((prev) =>
        prev.map((q) => (q.id === quadra.id ? { ...q, ...quadra } : q))
      );
    } catch (error) {
      console.error("Erro ao salvar as configurações:", error);
      alert("Erro ao salvar. Tente novamente.");
    }
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
                {quadras.map((quadra) => (
                  <CardQuadraVariaveis
                    key={quadra.id}
                    titulo={quadra.nome}
                    config={quadra}
                    setConfig={(newConfig) =>
                      setQuadras((prev) =>
                        prev.map((q) => (q.id === quadra.id ? newConfig : q))
                      )
                    }
                    onSave={() => salvarVariaveis(quadra)}
                  />
                ))}
              </div>
            </>
          )}
        </main>
      </div>
      <FooterEuro />
    </div>
  );
}
