import { http } from "@/lib/api/client";
import type { CreateInvestmentPayload, InvestmentListResponse } from "@/types/investment";

export const investmentsApi = {
  list() {
    return http.get<InvestmentListResponse>("/api/investments");
  },
  create(payload: CreateInvestmentPayload) {
    return http.post<{
      message: string;
      investment: InvestmentListResponse["investments"][number];
    }>("/api/investments", payload);
  },
};