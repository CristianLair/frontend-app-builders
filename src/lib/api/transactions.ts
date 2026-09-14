import { http } from "@/lib/api/client";
import type { Transaction, TransactionListResponse } from "@/types/transaction";

export const transactionsApi = {
  list(query?: { page?: number; per_page?: number }) {
    return http.get<TransactionListResponse>("/api/transactions", { query });
  },
  get(id: string) {
    return http.get<{ transaction: Transaction }>(`/api/transactions/${id}`);
  },
};