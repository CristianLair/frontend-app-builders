import { http } from "@/lib/api/client";
import type { CreateCreditPayload, CreditListResponse } from "@/types/credit";

export const creditsApi = {
  list() {
    return http.get<CreditListResponse>("/api/credits");
  },
  create(payload: CreateCreditPayload) {
    return http.post<{ message: string; credit: CreditListResponse["credits"][number] }>(
      "/api/credits",
      payload,
    );
  },
};