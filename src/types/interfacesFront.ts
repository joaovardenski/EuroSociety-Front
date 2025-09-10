// ----------------------
// Agenda Bloqueios
// ----------------------
export interface AgendaBloqueio {
  id: number;
  quadraId: number;
  data: string;
  slot: string;
  createdAt?: string | null;
  updatedAt?: string | null;
}

// ----------------------
// Lista de Esperas
// ----------------------
export interface ListaEspera {
  id: number;
  userId: number;
  quadraId: number;
  data: string;
  slot: string;
  status: string;
  createdAt?: string | null;
  updatedAt?: string | null;
}

// ----------------------
// Mensalidades
// ----------------------
export interface Mensalidade {
  id: number;
  userId: number;
  quadraId: number;
  dataInicio: string;
  slot: string;
  status: string;
  valorTotal: number;
  createdAt?: string | null;
  updatedAt?: string | null;
}

// ----------------------
// Pagamentos
// ----------------------
export interface Pagamento {
  id: number;
  userId: number;
  metodo: string;
  valor: number;
  status: string;
  tipo: string;
  idMp: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

// ----------------------
// Quadras
// ----------------------
export interface Quadra {
  id: number;
  nome: string;
  tipo: string;
  status: string;
  horaAbertura: string;
  horaFechamento: string;
  precoNormal: number;
  precoNoturno: number;
  precoNormalMensal: number;
  precoNoturnoMensal: number;
  createdAt?: string | null;
  updatedAt?: string | null;
}

// ----------------------
// Reservas
// ----------------------
export interface Reserva {
  id: number;
  userId: number;
  quadraId: number;
  tipoReserva: string;
  mensalidadeId: number | null;
  pagamentoId: number | null;
  pagamentoFaltante: number;
  data: string;
  slot: string;
  status: string;
  clienteNome: string | null;
  expiresAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;

  // Relacionamentos opcionais (preenchidos no front, se carregados)
  user?: User | null;
  quadra?: Quadra;
  pagamento?: Pagamento;
  mensalidade?: Mensalidade;
}

// ----------------------
// Users
// ----------------------
export interface User {
  id: number;
  nome: string;
  email: string;
  emailVerifiedAt: string | null;
  password: string;
  resetToken: string | null;
  permissao: string;
  metodoLogin: string;
  googleId: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}
