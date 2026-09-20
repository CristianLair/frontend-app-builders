import { http } from "@/lib/api/client";
import type { MarketQuote } from "@/types/chat";

export interface MarketAsset {
  symbol: string;
  name: string;
  market: string;
  currency: string;
}

export const marketApi = {
  async quote(symbols: string[]) {
    return http.get<MarketQuote | { quotes: MarketQuote[] }>("/api/market/quote", {
      query: { symbols: symbols.join(",") },
    });
  },
  async assets() {
    return http.get<{ assets: MarketAsset[] }>("/api/market/assets");
  },
};