export function gerarHorarios(inicio: number, fim: number): string[] {
  const horarios: string[] = [];
  for (let h = inicio; h < fim; h++) {
    horarios.push(`${h}:00`);
  }
  return horarios;
}
