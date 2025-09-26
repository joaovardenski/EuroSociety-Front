import { useState, useEffect } from "react";
import axiosPrivate from "../api/axiosPrivate";

export default function useActiveBookingsCount(isReady: boolean) {
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function carregarCount() {
      try {
        const response = await axiosPrivate.get(`/user/active-bookings-count`);
        setCount(response.data.count || 0);
      } catch (error) {
        console.error("Erro ao carregar reservas:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (isReady) carregarCount();
  }, [isReady]);

  return { count, isLoading };
}
