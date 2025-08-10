// Da tabela de reservas do banco de dados
export interface Reserva {
  id: number;
  usuario: Usuario;
  quadra: Quadra;
  tipoReserva: string;
  mensalidadeId?: number;
  pagamento: Pagamento;
  pagamentoFaltante: number;
  data: string;
  slot: string;
  status: string;
  statusPagamento: string;
}

export interface Pagamento {
  id: number;
  metodo: string;
  valor: number;
  status: string;
}

export interface Quadra {
  id: number;
  nome: string;
  tipo: string;
  status: string;
  horaAbertura: string;
  horaFechamento: string;
  precoNormal: number;
  precoNoturno: number;
  precoMensalNormal: number;
  precoMensalNoturno: number;
}

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  senha: string | null;
  permissao: string;
  metodoLogin: string;
  googleId: string | null;
}

export interface FilaEspera {
  id: number;
  usuario: Usuario;
  quadra: Quadra;
  data: Date;
  slot: string;
  status: string;
}

export interface Mensalidade {
  id: number;
  usuario: Usuario;
  quadra: Quadra;
  dataInicio: string;
  status: string;
  valorTotal: number;
  reservasRelacionadas: Reserva[];
}

export interface AgendaBloqueio {
  id: number,
  quadra: Quadra,
  dataHoraInicio: string,
}


