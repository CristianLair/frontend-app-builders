"use client";

import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { env } from "@/config/env";
import { useHydrated } from "@/hooks/use-hydrated";
import { useAuthStore } from "@/store/use-auth-store";

export default function DashboardPage() {
  const hydrated = useHydrated();
  const user = useAuthStore((store) => store.user);
  const status = useAuthStore((store) => store.status);
  const fetchMe = useAuthStore((store) => store.fetchMe);

  useEffect(() => {
    if (hydrated && status === "authenticated") {
      void fetchMe();
    }
  }, [hydrated, status, fetchMe]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">
          Hola, {user?.name ?? user?.email}
        </h1>
        <p className="text-sm text-zinc-500">
          Sesión autenticada contra el API Gateway en{" "}
          <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs">{env.apiUrl}</code>
        </p>
      </div>

      <Card>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-500">
          Perfil
        </h2>
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-zinc-500">Nombre</dt>
            <dd className="font-medium text-zinc-900">{user?.name ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-zinc-500">Correo</dt>
            <dd className="font-medium text-zinc-900">{user?.email ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-zinc-500">Rol</dt>
            <dd className="font-medium text-zinc-900">{user?.role ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-zinc-500">Usuario ID</dt>
            <dd className="font-mono text-zinc-900">{user?.id ?? "—"}</dd>
          </div>
        </dl>
      </Card>
    </div>
  );
}