import type {
  AgendaBloqueioAPI as ApiAgendaBloqueio,
  ListaEsperaAPI as ApiListaEspera,
  MensalidadeAPI as ApiMensalidade,
  PagamentoAPI as ApiPagamento,
  QuadraAPI as ApiQuadra,
  ReservaAPI as ApiReserva,
  UserAPI as ApiUser,
} from "../types/interfacesApi";


import type {
  AgendaBloqueio,
  ListaEspera,
  Mensalidade,
  Pagamento,
  Quadra,
  Reserva,
  User,
} from "../types/interfacesFront";

// ----------------------
// Agenda Bloqueios
// ----------------------
export function mapAgendaBloqueio(api: ApiAgendaBloqueio): AgendaBloqueio {
  return {
    id: api.id,
    quadraId: api.quadra_id,
    data: api.data,
    slot: api.slot,
    createdAt: api.created_at,
    updatedAt: api.updated_at,
  };
}

// ----------------------
// Lista de Esperas
// ----------------------
export function mapListaEspera(api: ApiListaEspera): ListaEspera {
  return {
    id: api.id,
    userId: api.user_id,
    quadraId: api.quadra_id,
    data: api.data,
    slot: api.slot,
    status: api.status,
    createdAt: api.created_at,
    updatedAt: api.updated_at,
  };
}

// ----------------------
// Mensalidades
// ----------------------
export function mapMensalidade(api: ApiMensalidade): Mensalidade {
  return {
    id: api.id,
    userId: api.user_id,
    quadraId: api.quadra_id,
    dataInicio: api.data_inicio,
    slot: api.slot,
    status: api.status,
    valorTotal: api.valor_total,
    createdAt: api.created_at,
    updatedAt: api.updated_at,
  };
}


// ----------------------
// Pagamentos
// ----------------------
export function mapPagamento(api: ApiPagamento): Pagamento {
  return {
    id: api.id,
    userId: api.user_id,
    metodo: api.metodo,
    valor: api.valor,
    status: api.status,
    tipo: api.tipo,
    idMp: api.id_mp,
    createdAt: api.created_at,
    updatedAt: api.updated_at,
  };
}

// ----------------------
// Quadras
// ----------------------
export function mapQuadra(api: ApiQuadra): Quadra {
  return {
    id: api.id,
    nome: api.nome,
    tipo: api.tipo,
    status: api.status,
    horaAbertura: api.hora_abertura,
    horaFechamento: api.hora_fechamento,
    precoNormal: api.preco_normal,
    precoNoturno: api.preco_noturno,
    precoNormalMensal: api.preco_normal_mensal,
    precoNoturnoMensal: api.preco_noturno_mensal,
    createdAt: api.created_at,
    updatedAt: api.updated_at,
  };
}

// ----------------------
// Reservas
// ----------------------
export function mapReserva(api: ApiReserva): Reserva {
  return {
    id: api.id,
    userId: api.user_id,
    quadraId: api.quadra_id,
    tipoReserva: api.tipo_reserva,
    mensalidadeId: api.mensalidade_id,
    pagamentoId: api.pagamento_id,
    pagamentoFaltante: api.pagamento_faltante,
    data: api.data,
    slot: api.slot,
    status: api.status,
    clienteNome: api.cliente_nome,
    expiresAt: api.expires_at,
    createdAt: api.created_at,
    updatedAt: api.updated_at,

    user: api.user ? mapUser(api.user) : undefined,
    quadra: api.quadra ? mapQuadra(api.quadra) : undefined,
    pagamento: api.pagamento ? mapPagamento(api.pagamento) : undefined,
    mensalidade: api.mensalidade ? mapMensalidade(api.mensalidade) : undefined,
  };
}

// ----------------------
// Users
// ----------------------
export function mapUser(api: ApiUser): User {
  return {
    id: api.id,
    nome: api.nome,
    email: api.email,
    emailVerifiedAt: api.email_verified_at,
    password: api.password,
    resetToken: api.reset_token,
    permissao: api.permissao,
    metodoLogin: api.metodo_login,
    googleId: api.google_id,
    createdAt: api.created_at,
    updatedAt: api.updated_at,
  };
}
