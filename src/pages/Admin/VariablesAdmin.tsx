import { useEffect, useState } from "react";
import HeaderEuro from "../../components/Layout/HeaderEuro";
import FooterEuro from "../../components/Layout/FooterEuro";
import AdminSidebar from "../../components/Navigation/AdminSidebar";
import CardQuadraVariaveis from "../../components/CardQuadraVariaveis";
import LoadingMessage from "../../components/LoadingMessage";
import { isValidInterval, isValidPrice } from "../../utils/Validators";
import axiosPrivate from "../../api/axiosPrivate";

// Tipos das quadras
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

export default function VariablesAdmin() {
  const [isLoading, setIsLoading] = useState(true);

  // ----------------- STATES -----------------
  const [society, setSociety] = useState<QuadraConfig>({
    id: 1,
    nome: "Quadra Society",
    tipo: "society",
    status: "ativo",
    preco_normal: 0,
    preco_noturno: 0,
    preco_normal_mensal: 0, // Troca aqui
    preco_noturno_mensal: 0, // Troca aqui
    hora_abertura: "",
    hora_fechamento: "",
  });

  const [areia1, setAreia1] = useState<QuadraConfig>({
    id: 2,
    nome: "Quadra de Areia 1",
    tipo: "areia",
    status: "ativo",
    preco_normal: 0,
    preco_noturno: 0,
    preco_normal_mensal: 0, // Troca aqui
    preco_noturno_mensal: 0, // Troca aqui
    hora_abertura: "",
    hora_fechamento: "",
  });

  const [areia2, setAreia2] = useState<QuadraConfig>({
    id: 3,
    nome: "Quadra de Areia 2",
    tipo: "areia",
    status: "ativo",
    preco_normal: 0,
    preco_noturno: 0,
    preco_normal_mensal: 0, // Troca aqui
    preco_noturno_mensal: 0, // Troca aqui
    hora_abertura: "",
    hora_fechamento: "",
  });

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
        const quadras = await getQuadras();

        const societyData = quadras.find((q) => q.id === 1);
        const areia1Data = quadras.find((q) => q.id === 2);
        const areia2Data = quadras.find((q) => q.id === 3);

        if (societyData) setSociety(societyData);
        if (areia1Data) setAreia1(areia1Data);
        if (areia2Data) setAreia2(areia2Data);
        console.log("Estados atualizados com os dados das quadras.");
        console.log("Society:", societyData);
        console.log("Areia 1:", areia1Data);
        console.log("Areia 2:", areia2Data);
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
      quadra.preco_normal_mensal, // Troca aqui
      quadra.preco_noturno_mensal, // Troca aqui
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

    // O objeto para a API já está formatado corretamente
    console.log("Salvando dados da quadra:", quadra);

    try {
      const response = await axiosPrivate.put(`/quadras/${quadra.id}`, quadra);
      console.log("Dados salvos com sucesso:", response.data);
      alert("Configurações salvas com sucesso!");
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
                <CardQuadraVariaveis
                  titulo="Quadra Society"
                  config={society}
                  setConfig={setSociety}
                  onSave={() => salvarVariaveis(society)}
                />
                <CardQuadraVariaveis
                  titulo="Quadra de Areia 1"
                  config={areia1}
                  setConfig={setAreia1}
                  onSave={() => salvarVariaveis(areia1)}
                />
                <CardQuadraVariaveis
                  titulo="Quadra de Areia 2"
                  config={areia2}
                  setConfig={setAreia2}
                  onSave={() => salvarVariaveis(areia2)}
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