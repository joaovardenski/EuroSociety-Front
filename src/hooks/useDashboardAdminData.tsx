// hooks/useDashboardData.ts
import { useEffect, useState } from "react";
import axiosPrivate from "../api/axiosPrivate";
import type { Reserva } from "../types/interfacesFront";

interface DashboardAdminData {
  agendamentosHoje: number;
  receitaMes: number;
  novosClientes: number;
  pagamentosPendentes: number;
  ultimasReservas: Reserva[];
}

export function useDashboardAdminData() {
  const [data, setData] = useState<DashboardAdminData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axiosPrivate.get("/admin/dashboard");
        setData(response.data.data);
        console.log("Dados: ", response.data.data);
      } catch (error) {
        console.error("Erro ao carregar dashboard:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return { data, loading };
}
