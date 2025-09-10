// ----------------------
// Agenda Bloqueios
// ----------------------
export interface AgendaBloqueioAPI {
  id: number;
  quadra_id: number;
  data: string; // date
  slot: string;
  created_at?: string | null;
  updated_at?: string | null;
}

// ----------------------
// Lista de Esperas
// ----------------------
export interface ListaEsperaAPI {
  id: number;
  user_id: number;
  quadra_id: number;
  data: string;
  slot: string;
  status: string;
  created_at?: string | null;
  updated_at?: string | null;
}

// ----------------------
// Mensalidades
// ----------------------
export interface MensalidadeAPI {
  id: number;
  user_id: number;
  quadra_id: number;
  data_inicio: string;
  slot: string;
  status: string;
  valor_total: number;
  created_at?: string | null;
  updated_at?: string | null;
}

// ----------------------
// Pagamentos
// ----------------------
export interface PagamentoAPI {
  id: number;
  user_id: number;
  metodo: string;
  valor: number;
  status: string;
  tipo: string;
  id_mp: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

// ----------------------
// Quadras
// ----------------------
export interface QuadraAPI {
  id: number;
  nome: string;
  tipo: string;
  status: string;
  hora_abertura: string;
  hora_fechamento: string;
  preco_normal: number;
  preco_noturno: number;
  preco_normal_mensal: number;
  preco_noturno_mensal: number;
  created_at?: string | null;
  updated_at?: string | null;
}

// ----------------------
// Reservas
// ----------------------
export interface ReservaAPI {
  id: number;
  user_id: number;
  quadra_id: number;
  tipo_reserva: string;
  mensalidade_id: number | null;
  pagamento_id: number | null;
  pagamento_faltante: number;
  data: string;
  slot: string;
  status: string;
  cliente_nome: string | null;
  expires_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;

  // relacionamentos opcionais
  user?: UserAPI;
  quadra?: QuadraAPI;
  pagamento?: PagamentoAPI;
  mensalidade?: MensalidadeAPI;
}


// ----------------------
// Users
// ----------------------
export interface UserAPI {
  id: number;
  nome: string;
  email: string;
  email_verified_at: string | null;
  password: string;
  reset_token: string | null;
  permissao: string;
  metodo_login: string;
  google_id: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}
