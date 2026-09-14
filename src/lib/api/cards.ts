import { http } from "@/lib/api/client";
import type { Card, CardPayload } from "@/types/card";

export const cardsApi = {
  get() {
    return http.get<{ card: Card }>("/api/cards");
  },
  register(payload: CardPayload) {
    return http.post<{ message: string; card: Card }>("/api/cards", payload);
  },
};