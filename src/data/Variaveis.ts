import type { Quadra } from "../types/interfaces";
import type { Usuario } from "../types/interfaces";
import type { Pagamento } from "../types/interfaces";
import type { Reserva } from "../types/interfaces";
import type { FilaEspera } from "../types/interfaces";

export const quadras: Quadra[] = [
  {
    id: 1,
    nome: "Quadra Society",
    tipo: "Society",
    status: "disponível",
    horaAbertura: "08:00",
    horaFechamento: "18:00",
    precoNormal: 130,
    precoNoturno: 150,
    precoMensalNormal: 120,
    precoMensalNoturno: 130,
  },
  {
    id: 2,
    nome: "Quadra de Areia 1",
    tipo: "Areia",
    status: "disponível",
    horaAbertura: "06:00",
    horaFechamento: "18:00",
    precoNormal: 80,
    precoNoturno: 90,
    precoMensalNormal: 75,
    precoMensalNoturno: 80,
  },
  {
    id: 3,
    nome: "Quadra de Areia 2",
    tipo: "Areia",
    status: "disponível",
    horaAbertura: "08:00",
    horaFechamento: "20:00",
    precoNormal: 80,
    precoNoturno: 90,
    precoMensalNormal: 75,
    precoMensalNoturno: 80,
  },
];

export const usuarios: Usuario[] = [
  {
    id: 1,
    nome: "João Victor",
    email: "joao@example.com",
    senha: "",
    permissao: "cliente",
    metodoLogin: "google",
    googleId: "383920174635291028373",
  },
  {
    id: 2,
    nome: "Paulo",
    email: "paulo@example.com",
    senha: "123456",
    permissao: "cliente",
    metodoLogin: "tradicional",
    googleId: null,
  },
  {
    id: 3,
    nome: "André",
    email: "andre@example.com",
    senha: "123456",
    permissao: "cliente",
    metodoLogin: "tradicional",
    googleId: null,
  },
];

export const pagamentos: Pagamento[] = [
  {
    id: 1,
    metodo: "Cartão de Crédito",
    valor: 120,
    status: "Parcial",
  },
  {
    id: 2,
    metodo: "Cartão de Crédito",
    valor: 75,
    status: "Parcial",
  },
  {
    id: 3,
    metodo: "Cartão de Crédito",
    valor: 150,
    status: "Total",
  },
];

export const reservas: Reserva[] = [
  {
    id: 1,
    usuario: usuarios[0],
    quadra: quadras[0],
    tipoReserva: "Avulsa",
    pagamento: pagamentos[0],
    pagamentoFaltante: 30,
    data: "2025-07-30",
    slot: "10:00 - 11:00",
    status: "Confirmado",
    statusPagamento: "Parcial",
  },
  {
    id: 2,
    usuario: usuarios[1],
    quadra: quadras[2],
    tipoReserva: "Avulsa",
    pagamento: pagamentos[1],
    pagamentoFaltante: 30,
    data: "2026-10-01",
    slot: "13:00 - 14:00",
    status: "Cancelado",
    statusPagamento: "Reembolsado",
  },
  {
    id: 3,
    usuario: usuarios[2],
    quadra: quadras[1],
    tipoReserva: "Avulsa",
    pagamento: pagamentos[2],
    pagamentoFaltante: 0,
    data: "2025-07-16",
    slot: "15:00 - 16:00",
    status: "Concluido",
    statusPagamento: "Total",
  },
];

export const filaEspera: FilaEspera[] = [
  {
    id: 1,
    usuario: usuarios[0],
    quadra: quadras[0],
    data: new Date("2025-08-01"),
    slot: "13:00 - 14:00",
    status: "Aguardando",
  },
];

export const indisponibilidadesQuadras = [
  //Pega das reservas já feitas
  {
    nome: "Quadra Society",
    indisponiveis: ["9:00", "13:00"],
  },
  {
    nome: "Quadra de Areia 1",
    indisponiveis: ["8:00", "14:00"],
  },
  {
    nome: "Quadra de Areia 2",
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
    nome: "Quadra de Areia 1",
    bloqueados: ["15:00"],
  },
  {
    nome: "Quadra de Areia 2",
    bloqueados: ["8:00"],
  },
];

export const minhasReservas: Reserva[] = [
  {
    id: 1,
    usuario: usuarios[0],
    quadra: quadras[0],
    tipoReserva: "Avulsa",
    pagamento: pagamentos[0],
    pagamentoFaltante: 30,
    data: "2025-08-20",
    slot: "10:00 - 11:00",
    status: "Confirmado",
    statusPagamento: "Parcial",
  },
  {
    id: 2,
    usuario: usuarios[0],
    quadra: quadras[2],
    tipoReserva: "Avulsa",
    pagamento: pagamentos[1],
    pagamentoFaltante: 30,
    data: "2026-10-01",
    slot: "13:00 - 14:00",
    status: "Cancelado",
    statusPagamento: "Reembolsado",
  },
  {
    id: 3,
    usuario: usuarios[0],
    quadra: quadras[1],
    tipoReserva: "Avulsa",
    pagamento: pagamentos[2],
    pagamentoFaltante: 0,
    data: "2025-07-30",
    slot: "15:00 - 16:00",
    status: "Concluido",
    statusPagamento: "Total",
  },
  {
    id: 4,
    usuario: usuarios[0],
    quadra: quadras[1],
    tipoReserva: "Avulsa",
    pagamento: pagamentos[2],
    pagamentoFaltante: 0,
    data: "2025-08-04",
    slot: "18:00 - 19:00",
    status: "Confirmado",
    statusPagamento: "Total",
  },
];

export const agendamentosRecentes: Reserva[]= [
  {
    id: 20,
    usuario: usuarios[0],
    quadra: quadras[2],
    tipoReserva: "Avulsa",
    pagamento: pagamentos[2],
    pagamentoFaltante: 0,
    data: "2025-08-05",
    slot: "16:00",
    status: "Confirmado",
    statusPagamento: "confirmada",
  },
  {
    id: 21,
    usuario: usuarios[1],
    quadra: quadras[1],
    tipoReserva: "Avulsa",
    pagamento: pagamentos[1],
    pagamentoFaltante: 20,
    data: "2025-08-05",
    slot: "12:00",
    status: "Confirmado",
    statusPagamento: "parcial",
  },
  {
    id: 22,
    usuario: usuarios[0],
    quadra: quadras[0],
    tipoReserva: "Avulsa",
    pagamento: pagamentos[0],
    pagamentoFaltante: 50,
    data: "2025-08-05",
    slot: "14:00",
    status: "confirmada",
    statusPagamento: "Parcial",
  },
];

export const estatisticasDashboard = {
  agendamentosHoje: 12,
  receitaMes: 1850.75,
  novosClientes: 8,
  pagamentosPendentes: 2,
};

export const reservasAtivas: Reserva[] = [
  {
    id: 1,
    usuario: usuarios[0],
    quadra: quadras[0],
    tipoReserva: "Avulsa",
    pagamento: pagamentos[0],
    pagamentoFaltante: 30,
    data: "2025-07-30",
    slot: "10:00 - 11:00",
    status: "Confirmado",
    statusPagamento: "Parcial",
  },
  {
    id: 2,
    usuario: usuarios[1],
    quadra: quadras[2],
    tipoReserva: "Avulsa",
    pagamento: pagamentos[1],
    pagamentoFaltante: 30,
    data: "2026-10-01",
    slot: "13:00 - 14:00",
    status: "Confirmado",
    statusPagamento: "Parcial",
  },
  {
    id: 3,
    usuario: usuarios[2],
    quadra: quadras[1],
    tipoReserva: "Avulsa",
    pagamento: pagamentos[2],
    pagamentoFaltante: 0,
    data: "2025-07-16",
    slot: "15:00 - 16:00",
    status: "Confirmado",
    statusPagamento: "Completo",
  },
];

export const receitaPorMes2025 = [
  { mes: "Jan", valor: 1200 },
  { mes: "Fev", valor: 950 },
  { mes: "Mar", valor: 1800 },
  { mes: "Abr", valor: 1300 },
  { mes: "Mai", valor: 1650 },
  { mes: "Jun", valor: 1700 },
  { mes: "Jul", valor: 2100 },
  { mes: "Ago", valor: 1850 },
  { mes: "Set", valor: 1950 },
  { mes: "Out", valor: 1750 },
  { mes: "Nov", valor: 1600 },
  { mes: "Dez", valor: 1900 },
];

export const ocupacaoPorQuadra = [
  { quadra: "Society", usos: 120 },
  { quadra: "Areia 1", usos: 90 },
  { quadra: "Areia 2", usos: 105 },
];
