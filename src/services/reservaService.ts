import axiosPrivate from "../api/axiosPrivate";
import type { Reserva } from "../types/interfacesFront";
import type { ReservaAPI } from "../types/interfacesApi";
import { mapReserva } from "../utils/Mappers";

export type FiltroReservas = "Todas" | "Próximas" | "Anteriores";

export async function getMinhasReservas(
  filtro: FiltroReservas
): Promise<Reserva[]> {
  let filtroAPI = "ativas";
  if (filtro === "Anteriores") filtroAPI = "passadas";
  if (filtro === "Todas") filtroAPI = "todas";

  const response = await axiosPrivate.get(`/user/bookings?filter=${filtroAPI}`);

  const data: ReservaAPI[] = Array.isArray(response.data.data)
    ? response.data.data
    : [];

  // 🔑 aqui traduz de API -> Front
  return data.map(mapReserva);
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
