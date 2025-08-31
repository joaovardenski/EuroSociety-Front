// hooks/useAgendamentos.ts
import { useState, useEffect } from "react";
import axiosPrivate from "../api/axiosPrivate";
import type { Reserva, ReservaBackend } from "../types/interfaces";

const mapReservasFromBackend = (data: ReservaBackend[]): Reserva[] => {
  return data.map((reserva) => ({
    id: reserva.id,
    user: reserva.user,
    userId: reserva.user_id,
    quadra: reserva.quadra,
    quadraId: reserva.quadra_id,
    tipoReserva: reserva.tipo_reserva,
    mensalidadeId: reserva.mensalidade_id,
    pagamentoId: reserva.pagamento_id,
    pagamentoFaltante: parseFloat(reserva.pagamento_faltante),
    data: reserva.data,
    slot: reserva.slot,
    status: reserva.status,
    clienteNome: reserva.cliente_nome,
    createdAt: reserva.created_at,
    updatedAt: reserva.updated_at,
    statusPagamento: parseFloat(reserva.pagamento_faltante) === 0 ? "Completo" : "Parcial",
  }));
};

export function useAgendamentosAtivos(dataSelecionada: string) {
  const [agendamentos, setAgendamentos] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgendamentos = async () => {
      setLoading(true);
      try {
        const response = await axiosPrivate.get("/reservas/por-data", {
          params: { data: dataSelecionada },
        });
        setAgendamentos(mapReservasFromBackend(response.data));
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
