import { http } from "@/lib/api/client";
import type { Transaction } from "@/types/transaction";

export const transactionsApi = {
  list(query?: { page?: number; limit?: number }) {
    return http.get<Transaction[]>("/api/transactions", { query });
  },
  get(id: string) {
    return http.get<Transaction>(`/api/transactions/${id}`);
  },
};