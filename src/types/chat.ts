export interface InvestmentProjection {
  amount: number;
  term_months: number;
  return_rate: number;
  gross_return: number;
  app_fee: number;
  net_return: number;
  total_payout: number;
  maturity_date: string;
  amount_formatted: string;
  net_return_formatted: string;
  total_payout_formatted: string;
}

export interface CreditProjection {
  allowed: boolean;
  reason?: string;
  amount?: number;
  cuotas?: number;
  interest_rate?: number;
  total_to_pay?: number;
  monthly_payment?: number;
  remaining?: number;
  max_allowed?: number;
}

export interface ChatResponse {
  conversation_id: string;
  reply: string;
  options?: string[];
  investment?: InvestmentProjection | InvestmentProjection[];
  alternatives?: InvestmentProjection[];
  credit?: CreditProjection;
}

export interface ChatStoredMessage {
  role: "user" | "assistant";
  content: string;
  options?: string[] | null;
  created_at?: string;
}

export interface ChatHistoryResponse {
  messages: ChatStoredMessage[];
}