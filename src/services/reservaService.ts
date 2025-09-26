import axiosPrivate from "../api/axiosPrivate";
import type { Reserva } from "../types/interfacesFront";
import type { ReservaAPI } from "../types/interfacesApi";
import { mapReserva } from "../utils/Mappers";

export type FiltroReservas = "Todas" | "Próximas" | "Anteriores";
interface MetaReservas {
  current_page: number;
  last_page: number;
  total: number;
}


export async function getMinhasReservas(
  filtro: FiltroReservas,
  page = 1
): Promise<{ data: Reserva[]; meta: MetaReservas }> {
  let filtroAPI = "ativas";
  if (filtro === "Anteriores") filtroAPI = "passadas";
  if (filtro === "Todas") filtroAPI = "todas";

  const response = await axiosPrivate.get(
    `/user/bookings?filter=${filtroAPI}&page=${page}`
  );

  const reservasAPI: ReservaAPI[] = Array.isArray(response.data.data.data)
    ? response.data.data.data
    : [];

  return {
    data: reservasAPI.map(mapReserva),
    meta: {
      current_page: response.data.data.current_page,
      last_page: response.data.data.last_page,
      total: response.data.data.total,
    },
  };
}

export async function cancelarMinhaReserva(
  reservaId: number,
  comReembolso: boolean
) {
  return axiosPrivate.post(
    `/reservas/${reservaId}/cancelar`,
    {},
    { params: { reembolso: comReembolso } }
  );
}
