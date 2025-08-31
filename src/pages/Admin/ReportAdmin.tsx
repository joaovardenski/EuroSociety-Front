import { useEffect, useState, useCallback } from "react";
import HeaderEuro from "../../components/Layout/HeaderEuro";
import FooterEuro from "../../components/Layout/FooterEuro";
import AdminSidebar from "../../components/Navigation/AdminSidebar";
import axiosPrivate from "../../api/axiosPrivate";
import RelatorioFiltros from "../../components/Report/RelatorioFiltro";
import ReceitaGrafico from "../../components/Report/ReceitaGrafico";
import OcupacaoGrafico from "../../components/Report/OcupacaoGrafico";

export type Receita = { mes: string; valor: number };
export type Ocupacao = { quadra: string; usos: number };

export default function ReportAdmin() {
  // ------------------ ESTADOS ------------------
  const [tipoRelatorio, setTipoRelatorio] = useState("financeiro");
  const [dataInicio, setDataInicio] = useState("2025-01-01");
  const [dataFim, setDataFim] = useState("2025-12-31");
  const [anoReceita, setAnoReceita] = useState(new Date().getFullYear());
  const [mesOcupacao, setMesOcupacao] = useState(new Date().getMonth() + 1);

  const [loadingPDF, setLoadingPDF] = useState(false);
  const [receitaDados, setReceitaDados] = useState<Receita[]>([]);
  const [ocupacaoDados, setOcupacaoDados] = useState<Ocupacao[]>([]);

  // ------------------ FUNÇÕES DE FETCH ------------------
  const fetchReceita = useCallback(async (ano: number) => {
    try {
      const res = await axiosPrivate.get(
        `/admin/report/receitaMensal?year=${ano}`
      );
      setReceitaDados(res.data.report);
    } catch (err) {
      console.error("Erro ao buscar receita mensal:", err);
      setReceitaDados([]);
    }
  }, []);

  const fetchOcupacao = useCallback(async (ano: number, mes: number) => {
    try {
      const res = await axiosPrivate.get(
        `/admin/report/ocupacaoQuadras?year=${ano}&month=${mes}`
      );
      setOcupacaoDados(res.data.report);
    } catch (err) {
      console.error("Erro ao buscar ocupação por quadra:", err);
      setOcupacaoDados([]);
    }
  }, []);

  // ------------------ EFEITOS ------------------
  useEffect(() => {
    fetchReceita(anoReceita);
  }, [anoReceita, fetchReceita]);

  useEffect(() => {
    fetchOcupacao(new Date().getFullYear(), mesOcupacao);
  }, [mesOcupacao, fetchOcupacao]);

  // ------------------ GERAÇÃO DE PDF ------------------
  const gerarRelatorio = async () => {
    setLoadingPDF(true);
    try {
      const res = await axiosPrivate.get("/admin/report/generate", {
        params: {
          tipo_relatorio: tipoRelatorio,
          data_inicio: dataInicio,
          data_fim: dataFim,
        },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(
        new Blob([res.data], { type: "application/pdf" })
      );
      const link = document.createElement("a");
      link.href = url;
      link.download = `relatorio_${tipoRelatorio}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Erro ao gerar relatório:", err);
    } finally {
      setLoadingPDF(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#e6f4ff]">
      <HeaderEuro />

      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 p-8 overflow-y-auto">
          <h1 className="text-2xl font-semibold text-azulBase mb-8">
            Relatórios e Métricas
          </h1>

          {/* ---------------- FILTROS ---------------- */}
          <RelatorioFiltros
            filtros={{
              tipoRelatorio: tipoRelatorio,
              dataInicio: dataInicio,
              dataFim: dataFim,
            }}
            setFiltros={(novos) => {
              if (novos.tipoRelatorio !== undefined)
                setTipoRelatorio(novos.tipoRelatorio);
              if (novos.dataInicio !== undefined)
                setDataInicio(novos.dataInicio);
              if (novos.dataFim !== undefined) setDataFim(novos.dataFim);
            }}
            onGerar={gerarRelatorio}
            loading={loadingPDF}
          />

          {/* ---------------- GRÁFICOS ---------------- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <ReceitaGrafico
              dados={receitaDados}
              ano={anoReceita}
              setAno={setAnoReceita}
            />
            <OcupacaoGrafico
              dados={ocupacaoDados}
              mes={mesOcupacao}
              setMes={setMesOcupacao}
            />
          </div>
        </main>
      </div>
      <FooterEuro />
    </div>
  );
}
