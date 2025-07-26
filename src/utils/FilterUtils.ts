import type { Reserva } from "../components/Reservas/BookingCard";

//Filtra por Todas / Próximas / Anteriores
export function filtrarReservas(reservas: Reserva[], filtro: string): Reserva[] {
    const agora = new Date();

    return reservas
      .filter((reserva) => {
        const [horaInicio] = reserva.slot.split(" - ");
        const dataHoraReserva = new Date(`${reserva.data}T${horaInicio}:00`);

        if (filtro === "Próximas")
          return dataHoraReserva >= agora && reserva.status !== "CANCELADO";
        if (filtro === "Anteriores") return dataHoraReserva < agora;
        return true;
      })
      .sort((a, b) => {
        const [horaInicioA] = a.slot.split(" - ");
        const [horaInicioB] = b.slot.split(" - ");
        const dataHoraA = new Date(`${a.data}T${horaInicioA}:00`).getTime();
        const dataHoraB = new Date(`${b.data}T${horaInicioB}:00`).getTime();

        return filtro === "Anteriores"
          ? dataHoraB - dataHoraA
          : dataHoraA - dataHoraB;
      });
  }