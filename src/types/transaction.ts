export interface Transaction {
  id: string;
  amount: number;
  currency: string;
  type: string;
  description?: string;
  category?: string;
  status: string;
  created_at: string | null;
}

export interface TransactionListResponse {
  transactions: Transaction[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}