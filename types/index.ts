export interface User {
  id: string
  name: string
  email: string
  role: "SuperAdmin" | "OperacaoCF" | "ClienteGPA"
  avatar?: string
  created_at: string
  updated_at: string
}

export interface Regional {
  id: string
  nome: string
  ativo: boolean
  created_at: string
  updated_at: string
  lojas_count?: number
}

export interface Loja {
  id: string
  nome: string
  endereco_principal: string
  ativo: boolean
  regional_id: string
  created_at: string
  updated_at: string
  regional?: Regional
  enderecos_adicionais?: Endereco[]
  contatos?: Contato[]
  parcerias?: Parceria[]
}

export interface OSC {
  id: string
  cnpj: string
  nome: string
  ativo: boolean
  status_banimento: "ativo" | "suspenso" | "banido"
  justificativa_suspensao?: string
  created_at: string
  updated_at: string
  contatos?: Contato[]
  faltas?: Falta[]
  faltas_count?: number
}

export interface Parceria {
  id: string
  loja_id: string
  osc_id: string
  favorita: boolean
  ativa: boolean
  status_suspensao: boolean
  justificativa_suspensao?: string
  created_at: string
  updated_at: string
  loja?: Loja
  osc?: OSC
}

export interface Campanha {
  id: string
  nome: string
  data: string
  status: "planejamento" | "ativa" | "encerrada"
  created_at: string
  updated_at: string
  campanhas_loja?: CampanhaLoja[]
  lojas_participantes?: number
  oscs_confirmadas?: number
  total_doacoes_kg?: number
}

export interface CampanhaLoja {
  id: string
  campanha_id: string
  loja_id: string
  osc_id: string
  confirmada: boolean
  motivo_nao_comparecimento?: string
  status_prospecao: boolean
  observacao_prospecao?: string
  created_at: string
  updated_at: string
  campanha?: Campanha
  loja?: Loja
  osc?: OSC
  doacao?: Doacao
}

export interface Doacao {
  id: string
  campanha_loja_id: string
  quantidade_recebida_kg: number
  quantidade_validada_kg: number
  modo_validacao: "completa" | "amostragem"
  created_at: string
  updated_at: string
  campanha_loja?: CampanhaLoja
}

export interface Falta {
  id: string
  osc_id: string
  campanha_loja_id: string
  justificativa?: string
  data: string
  created_at: string
  updated_at: string
  osc?: OSC
  campanha_loja?: CampanhaLoja
}

export interface Contato {
  id: string
  entidade_tipo: "regional" | "loja" | "osc"
  entidade_id: string
  nome: string
  email: string
  telefone: string
  ativo: boolean
  created_at: string
  updated_at: string
}

export interface Endereco {
  id: string
  loja_id: string
  endereco_completo: string
  created_at: string
  updated_at: string
  loja?: Loja
}

export interface DashboardMetrics {
  total_campanhas: number
  campanhas_ativas: number
  total_doacoes_kg: number
  oscs_ativas: number
  oscs_suspensas: number
  oscs_banidas: number
  lojas_ativas: number
  taxa_confirmacao: number
  faltas_mes_atual: number
}

export interface SuspensionAction {
  osc_id: string
  action: "suspend" | "ban" | "reactivate"
  justificativa: string
  faltas_count?: number
}
