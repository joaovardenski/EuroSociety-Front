import { useEffect, useState } from "react";
import HeaderEuro from "../../components/Layout/HeaderEuro";
import FooterEuro from "../../components/Layout/FooterEuro";
import AdminSidebar from "../../components/Navigation/AdminSidebar";
import CardQuadraVariaveis from "../../components/CardQuadraVariaveis";

import { Quadras } from "../../data/Variaveis";

// Tipos das quadras
interface QuadraConfig {
  precoNormal: number;
  precoNoturno: number;
  horaAbertura: string;
  horaFechamento: string;
  descontoMensalista: number;
}

export default function VariablesAdmin() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ----------------- STATES -----------------
  const [society, setSociety] = useState<QuadraConfig>({
    precoNormal: 0,
    precoNoturno: 0,
    horaAbertura: "08:00",
    horaFechamento: "22:00",
    descontoMensalista: 0,
  });

  const [fut1, setFut1] = useState<QuadraConfig>({
    precoNormal: 0,
    precoNoturno: 0,
    horaAbertura: "07:00",
    horaFechamento: "21:00",
    descontoMensalista: 0,
  });

  const [fut2, setFut2] = useState<QuadraConfig>({
    precoNormal: 0,
    precoNoturno: 0,
    horaAbertura: "07:00",
    horaFechamento: "21:00",
    descontoMensalista: 0,
  });

  // ----------------- FETCH INITIAL DATA -----------------
  useEffect(() => {
    async function fetchQuadras() {
      try {
        setLoading(true);
        // Simulação de API
        // const response = await fetch("/api/admin/quadras"); // <-- API real no futuro
        const response = Quadras;
        // if (!response.ok) throw new Error("Erro ao buscar dados das quadras");

        //const data = await response.json();
        const data = response;
        setSociety({
          precoNormal: data.society.precoNormal,
          precoNoturno: data.society.precoNoturno,
          horaAbertura: formatHora(data.society.horaAbertura),
          horaFechamento: formatHora(data.society.horaFechamento),
          descontoMensalista: data.society.descontoMensalista * 100,
        });
        setFut1({
          precoNormal: data.futevolei1.precoNormal,
          precoNoturno: data.futevolei1.precoNoturno,
          horaAbertura: formatHora(data.futevolei1.horaAbertura),
          horaFechamento: formatHora(data.futevolei1.horaFechamento),
          descontoMensalista: data.futevolei1.descontoMensalista * 100,
        });
        setFut2({
          precoNormal: data.futevolei2.precoNormal,
          precoNoturno: data.futevolei2.precoNoturno,
          horaAbertura: formatHora(data.futevolei2.horaAbertura),
          horaFechamento: formatHora(data.futevolei2.horaFechamento),
          descontoMensalista: data.futevolei2.descontoMensalista * 100,
        });
      } catch (err) {
        console.error(err);
        setError("Falha ao carregar dados. Tente novamente.");
      } finally {
        setLoading(false);
      }
    }
    fetchQuadras();
  }, []);

  // ----------------- HELPERS -----------------
  function formatHora(hora: number): string {
    return `${String(hora).padStart(2, "0")}:00`;
  }

  function validarQuadra(q: QuadraConfig): string {
    if (q.precoNormal <= 0) return "Preço normal deve ser maior que 0";
    if (q.precoNoturno <= 0) return "Preço noturno deve ser maior que 0";
    if (q.precoNoturno < q.precoNormal)
      return "Preço noturno deve ser maior ou igual ao normal";
    if (!q.horaAbertura || !q.horaFechamento)
      return "Horários não podem ser vazios";
    if (q.horaAbertura >= q.horaFechamento)
      return "Horário de abertura deve ser antes do fechamento";
    return "";
  }

  async function salvarAlteracoes(tipo: "society" | "fut1" | "fut2") {
    const quadra = tipo === "society" ? society : tipo === "fut1" ? fut1 : fut2;
    const validacao = validarQuadra(quadra);
    if (validacao) {
      alert(validacao);
      return;
    }

    try {
      const body = {
        ...quadra,
        descontoMensalista: quadra.descontoMensalista / 100, // converter para 0.x
      };
      const response = await fetch(`/api/admin/quadras/${tipo}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error("Erro ao salvar alterações");
      alert("Alterações salvas com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar. Verifique sua conexão.");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-600">Carregando dados...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-600 font-semibold">{error}</p>
      </div>
    );
  }

  // ----------------- COMPONENT -----------------
  return (
    <div className="flex flex-col min-h-screen bg-[#e6f4ff]">
      <HeaderEuro />
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar />

        <main className="flex-1 p-8 overflow-y-auto max-h-130">
          <h1 className="text-2xl font-semibold text-azulBase mb-8">
            Variáveis e configurações
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Society */}
            <CardQuadraVariaveis
              titulo="Quadra Society"
              config={society}
              setConfig={setSociety}
              onSave={() => salvarAlteracoes("society")}
            />

            {/* Futevôlei 1 */}
            <CardQuadraVariaveis
              titulo="Quadra de Futevôlei 1"
              config={fut1}
              setConfig={setFut1}
              onSave={() => salvarAlteracoes("fut1")}
            />

            {/* Futevôlei 2 */}
            <CardQuadraVariaveis
              titulo="Quadra de Futevôlei 2"
              config={fut2}
              setConfig={setFut2}
              onSave={() => salvarAlteracoes("fut2")}
            />
          </div>
        </main>
      </div>
      <FooterEuro />
    </div>
  );
}
