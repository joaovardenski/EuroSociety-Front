import type { Quadra } from "../types/interfaces";

export const calcularValor = (quadra: Quadra, horario: string, mensal: boolean) => {
    const horaInt = parseInt(horario.split(":")[0], 10);
    if (mensal) {
      return horaInt >= 18
        ? quadra.precoMensalNoturno
        : quadra.precoMensalNormal;
    } else {
      return horaInt >= 18 ? quadra.precoNoturno : quadra.precoNormal;
    }
  };