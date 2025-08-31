// Usuários
export interface Usuario {
  id: number;
  nome: string;
  email: string;
  senha?: string | null;         // 'password' no banco
  permissao: string;
  metodoLogin: string;
  googleId?: string | null;
}

// Quadras
export interface Quadra {
  id: number;
  nome: string;
  tipo: string;
  status: string;
  horaAbertura: string;          // 'hora_abertura' no banco
  horaFechamento: string;        // 'hora_fechamento' no banco
  precoNormal: number;           // 'preco_normal'
  precoNoturno: number;          // 'preco_noturno'
  precoMensalNormal: number;     // 'preco_normal_mensal'
  precoMensalNoturno: number;    // 'preco_noturno_mensal'
}

// Pagamentos
export interface Pagamento {
  id: number;
  userId: number;
  metodo: string;
  valor: number;
  status: string;
  tipo: string;
  idMp: string;                  // 'id_mp'
  createdAt: string;
  updatedAt: string;
}

// Mensalidades
export interface Mensalidade {
  id: number;
  userId: number;
  quadraId: number;
  dataInicio: string;            // 'data_inicio'
  slot: string;
  status: string;
  valorTotal: number;            // 'valor_total'
  createdAt: string;
  updatedAt: string;
}

// Reservas
export interface Reserva {
  id: number;
  userId?: number | null;
  quadraId: number;
  tipoReserva: string;           // 'tipo_reserva'
  mensalidadeId?: number | null;
  pagamentoId?: number | null;
  pagamentoFaltante: number;     // 'pagamento_faltante'
  data: string;
  slot: string;
  status: string;
  cliente_nome?: string | null;   // 'cliente_nome'
  createdAt: string;
  updatedAt: string;
  // Relacionamentos opcionais
  user?: Usuario | null;
  quadra?: Quadra;
  pagamento?: Pagamento;
  mensalidade?: Mensalidade;
}

// Fila de espera
export interface FilaEspera {
  id: number;
  userId: number;
  quadraId: number;
  data: string;
  slot: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  user?: Usuario;
  quadra?: Quadra;
}

// Bloqueios de agenda
export interface AgendaBloqueio {
  id: number;
  quadraId: number;
  data: string;
  slot: string;
  createdAt: string;
  updatedAt: string;
  quadra?: Quadra;
}

export interface ReservaBackend {
  id: number;
  user?: Usuario | null;
  user_id?: number | null;
  quadra?: Quadra;
  quadra_id: number;
  tipo_reserva: string;
  mensalidade_id?: number | null;
  pagamento_id?: number | null;
  pagamento_faltante: string;
  data: string;
  slot: string;
  status: string;
  cliente_nome?: string | null;
  created_at: string;
  updated_at: string;
}
