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
  bootstrap: () => void;
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
        if (!token) {
          set({ status: "unauthenticated" });
          return;
        }
        try {
          const { data } = await authApi.me(token);
          set({ user: data.user, status: "authenticated" });
        } catch {
          get().logout();
        }
      },
      // Resuelve el estado inicial una vez montado en el cliente. Es
      // idempotente: sólo actúa si todavía estamos en "idle". Se invoca desde
      // <AuthBootstrap /> (en el layout raíz) y al terminar la hidratación.
      bootstrap: () => {
        const { status, token } = get();
        if (status !== "idle") return;
        setAuthToken(token);
        if (token) {
          set({ status: "loading" });
          void get().fetchMe();
        } else {
          set({ status: "unauthenticated" });
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
      // OJO: este callback se ejecuta de forma SÍNCRONA durante create(), antes
      // de que exista la const `useAuthStore`. Referenciar el store acá lanza un
      // ReferenceError (TDZ) que rompe la hidratación y deja `status` en "idle"
      // (spinner infinito). Por eso sólo sincronizamos el token del cliente HTTP;
      // el `status` se resuelve en bootstrap().
      onRehydrateStorage: () => (state) => {
        setAuthToken(state?.token ?? null);
      },
    },
  ),
);
