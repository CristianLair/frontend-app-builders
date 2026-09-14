import { http } from "@/lib/api/client";
import type { CashItem, CashListResponse, CashPayload } from "@/types/cash";

export const cashApi = {
  listIn() {
    return http.get<CashListResponse>("/api/cashin");
  },
  listOut() {
    return http.get<CashListResponse>("/api/cashout");
  },
  createIn(payload: CashPayload) {
    return http.post<{ message: string; cashin: CashItem }>("/api/cashin", payload);
  },
  createOut(payload: CashPayload) {
    return http.post<{ message: string; cashout: CashItem }>("/api/cashout", payload);
  },
};