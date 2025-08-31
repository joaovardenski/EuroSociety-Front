import { useEffect, useState } from "react";
import HeaderEuro from "../../components/Layout/HeaderEuro";
import FooterEuro from "../../components/Layout/FooterEuro";
import AdminSidebar from "../../components/Navigation/AdminSidebar";
import CardQuadraVariaveis from "../../components/CardQuadraVariaveis";
import LoadingMessage from "../../components/LoadingMessage";
import { isValidInterval, isValidPrice } from "../../utils/Validators";
import axiosPrivate from "../../api/axiosPrivate";

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

export default function VariablesAdmin() {
  const [isLoading, setIsLoading] = useState(true);
  const [quadras, setQuadras] = useState<QuadraConfig[]>([]);

  // ----------------- FETCH INITIAL DATA -----------------
  async function getQuadras(): Promise<QuadraConfig[]> {
    try {
      const response = await axiosPrivate.get("/quadras");
      console.log("Dados das quadras recebidos:", response.data);
      return response.data.data;
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

  function validarQuadra(quadra: QuadraConfig) {
    const precos = [
      quadra.preco_normal,
      quadra.preco_noturno,
      quadra.preco_normal_mensal,
      quadra.preco_noturno_mensal,
    ];

    const todosPrecosValidos = precos.every(isValidPrice);
    const intervaloValido = isValidInterval(
      quadra.hora_abertura,
      quadra.hora_fechamento
    );

    return todosPrecosValidos && intervaloValido;
  }

  async function salvarVariaveis(quadra: QuadraConfig) {
    if (!validarQuadra(quadra)) {
      alert("Dados inválidos. Verifique os preços e horários.");
      return;
    }

    try {
      const response = await axiosPrivate.put(`/quadras/${quadra.id}`, quadra);
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
