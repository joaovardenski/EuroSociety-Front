export function getPrimeiroEUltimoNome(nome?: string): string {
    if (!nome) return "Usuário Desconhecido";

    const partes = nome.trim().split(" ").filter(Boolean);

    if (partes.length === 1) return partes[0];

    return `${partes[0]} ${partes[partes.length - 1]}`;
  }