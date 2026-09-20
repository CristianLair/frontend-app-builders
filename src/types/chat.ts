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

export type MarketKind = "crypto" | "bolsa_ar" | "dolar";

export interface MarketQuote {
  symbol: string;
  name: string;
  market: MarketKind;
  currency: string;
  price: number;
  change_24h_pct?: number | null;
  source?: string;
  is_demo?: boolean;
  updated_at?: string;
}

export interface PaperPosition {
  id: string;
  symbol: string;
  name: string;
  market: string;
  currency: string;
  quantity: number;
  entry_price: number;
  current_price: number;
  invested_ars: number;
  current_value_ars: number;
  pl_ars: number;
  pl_pct: number;
  change_24h_pct?: number | null;
  is_demo?: boolean;
  opened_at?: string | null;
}

export interface PortfolioSummary {
  invested_ars: number;
  current_value_ars: number;
  pl_ars: number;
  pl_pct: number;
}

export interface ChatResponse {
  conversation_id: string;
  reply: string;
  options?: string[];
  investment?: InvestmentProjection | InvestmentProjection[];
  alternatives?: InvestmentProjection[];
  credit?: CreditProjection;
  quote?: MarketQuote;
  position?: PaperPosition;
  positions?: PaperPosition[];
  portfolio?: PortfolioSummary;
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