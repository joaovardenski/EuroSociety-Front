import { useEffect, useState } from "react";
import axiosPrivate from "../api/axiosPrivate";
import type { Quadra } from "../types/interfacesFront";
import type { QuadraAPI } from "../types/interfacesApi";
import { mapQuadra } from "../utils/Mappers";

export default function useQuadras() {
  const [quadras, setQuadras] = useState<Quadra[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuadras = async () => {
      setLoading(true);
      try {
        const response = await axiosPrivate.get<QuadraAPI[]>("/quadras");

        // Mapeia cada quadra usando o mapQuadra
        setQuadras(response.data.map(mapQuadra));
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
