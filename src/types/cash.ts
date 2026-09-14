export interface CashItem {
  id: string;
  amount: number;
  currency: string;
  source?: string;
  destination?: string;
  description?: string;
  status: string;
  created_at: string | null;
}

export interface CashPayload {
  amount: number;
  source?: string;
  destination?: string;
  description?: string;
}

export interface CashListResponse {
  total: number;
  page: number;
  per_page: number;
  pages: number;
  cashin?: CashItem[];
  cashout?: CashItem[];
}