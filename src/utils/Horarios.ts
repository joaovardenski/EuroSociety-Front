export function gerarHorarios(inicio: string, fim: string, intervaloMin = 60): string[] {
  const [hInicio, mInicio] = inicio.split(":").map(Number);
  const [hFim, mFim] = fim.split(":").map(Number);

  const horarios: string[] = [];

  const atual = new Date();
  atual.setHours(hInicio, mInicio, 0, 0);

  const limite = new Date();
  limite.setHours(hFim, mFim, 0, 0);

  while (atual < limite) {
    const hora = String(atual.getHours()).padStart(2, "0");
    const minuto = String(atual.getMinutes()).padStart(2, "0");
    horarios.push(`${hora}:${minuto}`);
    atual.setMinutes(atual.getMinutes() + intervaloMin);
  }

  return horarios;
}
