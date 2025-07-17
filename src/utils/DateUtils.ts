export function getCurrentDate(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function gerarHorarioFim(inicio: string): string {
  const [hora] = inicio.split(":").map(Number);
  return `${hora + 1}:00`;
}

export function formatarDataBrasileira(dataIso: string): string {
  const [ano, mes, dia] = dataIso.split("-");
  return `${dia}/${mes}/${ano}`;
}
