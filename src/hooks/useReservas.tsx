import { useState, useEffect } from "react";
import axiosPrivate from "../api/axiosPrivate";
import type { Reserva } from "../types/interfacesFront";

export default function useReservas(isReady: boolean) {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function carregarReservas() {
      try {
        const response = await axiosPrivate.get(`/user/bookings?filter=ativas`);
        setReservas(
          Array.isArray(response.data.data) ? response.data.data : []
        );
      } catch (error) {
        console.error("Erro ao carregar reservas:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (isReady) carregarReservas();
  }, [isReady]);

  return { reservas, isLoading };
}
