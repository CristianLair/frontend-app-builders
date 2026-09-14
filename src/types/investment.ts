export interface Investment {
  id: string;
  amount: number;
  term_months: number;
  return_rate: number;
  gross_return: number;
  app_fee: number;
  net_return: number;
  total_payout: number;
  status: string;
  maturity_date: string | null;
  created_at: string | null;
}

export interface CreateInvestmentPayload {
  amount: number;
  term_months: number;
}

export interface InvestmentListResponse {
  investments: Investment[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}