// hooks/useQuadrasDisponiveis.ts
import { useState, useEffect } from "react";
import axiosPrivate from "../api/axiosPrivate";
import type { Quadra } from "../types/interfacesFront";

type Indisponibilidade = { nome: string; indisponiveis: string[] };
type Bloqueio = { nome: string; bloqueados: string[] };

export function useQuadrasDisponiveis(dataSelecionada: string) {
  const [quadras, setQuadras] = useState<Quadra[]>([]);
  const [indisponibilidades, setIndisponibilidades] = useState<
    Indisponibilidade[]
  >([]);
  const [bloqueios, setBloqueios] = useState<Bloqueio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarDados() {
      setLoading(true);
      try {
        const [quadrasRes, indisponiveisRes, bloqueiosRes] = await Promise.all([
          axiosPrivate.get("/quadras"),
          axiosPrivate.get("/reservas/indisponiveis", {
            params: { data: dataSelecionada },
          }),
          axiosPrivate.get("/agenda-bloqueios/bloqueados-por-data", {
            params: { data: dataSelecionada },
          }),
        ]);

        setQuadras(quadrasRes.data.data);
        setIndisponibilidades(indisponiveisRes.data);
        setBloqueios(bloqueiosRes.data);
      } catch (error) {
        console.error("Erro ao carregar quadras disponíveis:", error);
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, [dataSelecionada]);

  return { quadras, indisponibilidades, bloqueios, loading };
}
