export interface Credit {
  id: string;
  amount: number;
  cuotas: number;
  interest_rate: number;
  total_to_pay: number;
  monthly_payment: number;
  status: string;
  created_at: string | null;
  max_allowed?: number;
  salary_monthly?: number;
}

export interface CreateCreditPayload {
  amount: number;
  cuotas: number;
}

export interface CreditListResponse {
  credits: Credit[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}