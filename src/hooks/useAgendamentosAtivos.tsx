import { useState, useEffect } from "react";
import axiosPrivate from "../api/axiosPrivate";
import type { Reserva } from "../types/interfacesFront";
import type { ReservaAPI } from "../types/interfacesApi";
import { mapReserva } from "../utils/Mappers";

export function useAgendamentosAtivos(dataSelecionada: string) {
  const [agendamentos, setAgendamentos] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgendamentos = async () => {
      setLoading(true);
      try {
        const response = await axiosPrivate.get<ReservaAPI[]>("/reservas/por-data", {
          params: { data: dataSelecionada },
        });

        setAgendamentos(response.data.map(mapReserva));
      } catch (error) {
        console.error("Erro ao carregar agendamentos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgendamentos();
  }, [dataSelecionada]);

  return { agendamentos, setAgendamentos, loading };
}
