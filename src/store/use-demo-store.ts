"use client";

import { create } from "zustand";
import { env } from "@/config/env";

export type BackendMode = "checking" | "live" | "demo";

interface DemoState {
  mode: BackendMode;
  check: () => Promise<void>;
  enableDemo: () => void;
  disableDemo: () => void;
}

export const useDemoStore = create<DemoState>()((set) => ({
  mode: "checking",
  check: async () => {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 3500);
      const response = await fetch(`${env.apiUrl}/api/health`, {
        signal: controller.signal,
        cache: "no-store",
      });
      clearTimeout(timer);
      set({ mode: response.ok ? "live" : "demo" });
    } catch {
      set({ mode: "demo" });
    }
  },
  enableDemo: () => set({ mode: "demo" }),
  disableDemo: () => set({ mode: "live" }),
}));