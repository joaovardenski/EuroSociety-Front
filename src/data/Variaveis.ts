type Quadra = {
  id: number,
  nome: string,
  tipo: string,
  status: string,
  horaAbertura: number,
  horaFechamento: number,
  precoNormal: number,
  precoNoturno: number,
  descontoMensalista: number,
}

export const Quadras: Quadra[] = [
  {
    id: 1,
    nome: "Quadra Society",
    tipo: "Society",
    status: "disponível",
    horaAbertura: 8,
    horaFechamento: 18,
    precoNormal: 120,
    precoNoturno: 150,
    descontoMensalista: 0.15, // 15%
  },
  {
    id: 2,
    nome: "Quadra Futevôlei 1",
    tipo: "Futevôlei",
    status: "disponível",
    horaAbertura: 6,
    horaFechamento: 18,
    precoNormal: 100,
    precoNoturno: 120,
    descontoMensalista: 0.1,
  },
  {
    id: 3,
    nome: "Quadra Futevôlei 2",
    tipo: "Futevôlei",
    status: "disponível",
    horaAbertura: 8,
    horaFechamento: 20,
    precoNormal: 100,
    precoNoturno: 120,
    descontoMensalista: 0.1,
  },
];

export const indisponibilidadesQuadras = [
  //Pega das reservas já feitas
  {
    nome: "Quadra Society",
    indisponiveis: ["9:00", "13:00"],
  },
  {
    nome: "Quadra Futevôlei 1",
    indisponiveis: ["8:00", "14:00"],
  },
  {
    nome: "Quadra Futevôlei 2",
    indisponiveis: ["13:00"],
  },
];

export const bloqueadasQuadras = [
  //Pega de agenda bloqueio
  {
    nome: "Quadra Society",
    bloqueados: ["17:00"],
  },
  {
    nome: "Quadra Futevôlei 1",
    bloqueados: ["15:00"],
  },
  {
    nome: "Quadra Futevôlei 2",
    bloqueados: ["8:00"],
  },
];

export const minhasReservas = [
  {
    id: 1,
    usuario: "João Victor",
    quadra: "Quadra Society",
    data: "2025-07-26",
    slot: "10:00 - 11:00",
    status: "CONFIRMADO",
    statusPagamento: "Parcial",
  },
  {
    id: 2,
    usuario: "João Victor",
    quadra: "Quadra Futevôlei 2",
    data: "2026-10-01",
    slot: "13:00 - 14:00",
    status: "CANCELADO",
    statusPagamento: "Reembolsado",
  },
  {
    id: 3,
    usuario: "João Victor",
    quadra: "Quadra Futevôlei 1",
    data: "2025-07-30",
    slot: "15:00 - 16:00",
    status: "CONFIRMADO",
    statusPagamento: "Total",
  },
  {
    id: 4,
    usuario: "João Victor",
    quadra: "Quadra Futevôlei 1",
    data: "2025-07-16",
    slot: "15:00 - 16:00",
    status: "CONCLUIDO",
    statusPagamento: "Total",
  },
];

export const pagamentos = [
  {
    id: 1,
    idReserva: 1,
    metodo: "Cartão de Crédito",
    valor: 120,
    statusPagamento: "Parcial",
  },
  {
    id: 2,
    idReserva: 2,
    metodo: "Cartão de Crédito",
    valor: 75,
    statusPagamento: "Parcial",
  },
  {
    id: 3,
    idReserva: 3,
    metodo: "Cartão de Crédito",
    valor: 150,
    statusPagamento: "Total",
  },
];

export const agendamentosRecentes = [
  {
    cliente: "Carlos S.",
    quadra: "Society",
    dataHora: "05/07/2025 - 19:00",
    valor: 150,
    status: "Completo",
  },
  {
    cliente: "João Victor",
    quadra: "Futevôlei 1",
    dataHora: "06/07/2025 - 19:00",
    valor: 100,
    status: "Parcial",
  },
  {
    cliente: "João Victor",
    quadra: "Futevôlei 2",
    dataHora: "07/07/2025 - 19:00",
    valor: 100,
    status: "Parcial",
  },
];

export const estatisticasDashboard = {
  agendamentosHoje: 12,
  receitaMes: "R$ 1.850,75",
  novosClientes: 8,
  pagamentosPendentes: 2,
};

export const reservasAtivas = [
  {
    id: 1,
    usuario: "João Victor",
    quadra: "Quadra Society",
    data: "2025-07-30",
    slot: "10:00 - 11:00",
    statusPagamento: "Parcial",
    pagamentoFaltante: 30,
  },
  {
    id: 2,
    usuario: "Paulo",
    quadra: "Quadra Futevôlei 2",
    data: "2026-10-01",
    slot: "13:00 - 14:00",
    statusPagamento: "Parcial",
    pagamentoFaltante: 25,
  },
  {
    id: 3,
    usuario: "André",
    quadra: "Quadra Futevôlei 1",
    data: "2025-07-16",
    slot: "15:00 - 16:00",
    statusPagamento: "Completo",
    pagamentoFaltante: 0,
  },
];
