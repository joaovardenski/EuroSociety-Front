import type { Quadra } from "../types/interfacesFront";

export const calcularValor = (
  quadra: Quadra,
  horario: string,
  mensal: boolean
) => {
  const horaInt = parseInt(horario.split(":")[0], 10);
  if (mensal) {
    return horaInt >= 18 ? quadra.precoNoturnoMensal : quadra.precoNormalMensal;
  } else {
    return horaInt >= 18 ? quadra.precoNoturno : quadra.precoNormal;
  }
};
