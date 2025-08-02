export function getCurrentDate(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function gerarHorarioFim(inicio: string): string {
  const [hora, minuto] = inicio.split(":").map(Number);

  const date = new Date();
  date.setHours(hora);
  date.setMinutes(minuto);
  date.setSeconds(0);
  date.setMilliseconds(0);

  // Soma 1 hora
  date.setHours(date.getHours() + 1);

  const horaFinal = String(date.getHours()).padStart(2, "0");
  const minutoFinal = String(date.getMinutes()).padStart(2, "0");

  return `${horaFinal}:${minutoFinal}`;
}


export function formatarDataBrasileira(dataIso: string): string {
  const [ano, mes, dia] = dataIso.split("-");
  return `${dia}/${mes}/${ano}`;
}
