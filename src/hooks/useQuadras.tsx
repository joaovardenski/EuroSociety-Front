import { useEffect, useState } from "react";
import axiosPrivate from "../api/axiosPrivate";
import type { Quadra } from "../types/interfacesFront";

interface QuadraAPI {
  id: number;
  nome: string;
  tipo?: string;
  status?: string;
  hora_abertura: string;
  hora_fechamento: string;
  preco_normal: string | number;
  preco_noturno: string | number;
  preco_normal_mensal: string | number;
  preco_noturno_mensal: string | number;
}

export default function useQuadras() {
  const [quadras, setQuadras] = useState<Quadra[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuadras = async () => {
      try {
        const response = await axiosPrivate.get<{ data: QuadraAPI[] }>(
          "/quadras"
        );
        setQuadras(
          response.data.data.map((q) => ({
            id: q.id,
            nome: q.nome,
            tipo: q.tipo || "",
            status: q.status || "ativa",
            horaAbertura: q.hora_abertura,
            horaFechamento: q.hora_fechamento,
            precoNormal: Number(q.preco_normal),
            precoNoturno: Number(q.preco_noturno),
            precoMensalNormal: Number(q.preco_normal_mensal),
            precoMensalNoturno: Number(q.preco_noturno_mensal),
          }))
        );
      } catch (error) {
        console.error("Erro ao buscar quadras:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuadras();
  }, []);

  return { quadras, loading };
}
