"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authApi } from "@/lib/api/auth";
import { setAuthToken } from "@/lib/api/client";
import type { LoginPayload, RegisterPayload, User } from "@/types/auth";

export type AuthStatus = "idle" | "loading" | "authenticated" | "unauthenticated";

interface AuthState {
  token: string | null;
  user: User | null;
  status: AuthStatus;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  fetchMe: () => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      status: "idle",
      login: async (payload) => {
        set({ status: "loading" });
        try {
          const { data } = await authApi.login(payload);
          setAuthToken(data.token);
          set({ token: data.token, user: data.user, status: "authenticated" });
        } catch (error) {
          set({ status: "unauthenticated" });
          throw error;
        }
      },
      register: async (payload) => {
        set({ status: "loading" });
        try {
          const { data } = await authApi.register(payload);
          if (data.token) setAuthToken(data.token);
          set({
            token: data.token ?? null,
            user: data.user,
            status: data.token ? "authenticated" : "unauthenticated",
          });
        } catch (error) {
          set({ status: "unauthenticated" });
          throw error;
        }
      },
      fetchMe: async () => {
        const { token } = get();
        if (!token) return;
        try {
          const { data } = await authApi.me(token);
          set({ user: data, status: "authenticated" });
        } catch {
          get().logout();
        }
      },
      logout: () => {
        setAuthToken(null);
        set({ token: null, user: null, status: "unauthenticated" });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ token: state.token, user: state.user }),
      onRehydrateStorage: () => (state) => {
        setAuthToken(state?.token ?? null);
      },
    },
  ),
);