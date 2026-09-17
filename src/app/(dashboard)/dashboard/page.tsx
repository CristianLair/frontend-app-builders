"use client";

import { useEffect, useState } from "react";
import { DemoDashboard } from "@/components/demo/demo-dashboard";
import { QuickActions } from "@/components/finance/quick-actions";
import { Card } from "@/components/ui/card";
import { env } from "@/config/env";
import { useHydrated } from "@/hooks/use-hydrated";
import { creditsApi } from "@/lib/api/credits";
import { investmentsApi } from "@/lib/api/investments";
import { transactionsApi } from "@/lib/api/transactions";
import { formatDate, formatMoney } from "@/lib/utils";
import type { Transaction } from "@/types/transaction";
import { useAuthStore } from "@/store/use-auth-store";
import { useDemoStore } from "@/store/use-demo-store";

export default function DashboardPage() {
  const hydrated = useHydrated();
  const user = useAuthStore((store) => store.user);
  const status = useAuthStore((store) => store.status);
  const fetchMe = useAuthStore((store) => store.fetchMe);
  const demoMode = useDemoStore((store) => store.mode) === "demo";

  const [invested, setInvested] = useState<number | null>(null);
  const [owed, setOwed] = useState<number | null>(null);
  const [movements, setMovements] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (hydrated && status === "authenticated") void fetchMe();
  }, [hydrated, status, fetchMe]);

  useEffect(() => {
    if (!hydrated || status !== "authenticated" || demoMode) return;
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const [inv, cred, tx] = await Promise.all([
          investmentsApi.list(),
          creditsApi.list(),
          transactionsApi.list({ per_page: 8 }),
        ]);
        if (cancelled) return;
        setInvested(inv.data.investments.reduce((sum, item) => sum + Number(item.amount), 0));
        setOwed(
          cred.data.credits
            .filter((item) => item.status === "active")
            .reduce((sum, item) => sum + Number(item.amount), 0),
        );
        setMovements(tx.data.transactions);
      } catch {
        // Sin backend: las secciones quedan vacías, no rompe la vista.
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [hydrated, status, demoMode]);

  if (demoMode) {
    return (
      <div className="space-y-6">
        <QuickActions />
        <DemoDashboard />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">
          Hola, {user?.name ?? user?.email}
        </h1>
        <p className="text-sm text-gray-400">
          Bienvenido a tu panel. Conectado al gateway en{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs text-gray-300">{env.apiUrl}</code>
        </p>
      </div>

      <QuickActions />

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <p className="text-sm text-gray-400">Invertido</p>
          <p className="mt-1 text-2xl font-semibold text-white">
            {invested === null ? (loading ? "…" : "—") : formatMoney(invested)}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-gray-400">Deuda activa</p>
          <p className="mt-1 text-2xl font-semibold text-white">
            {owed === null ? (loading ? "…" : "—") : formatMoney(owed)}
          </p>
        </Card>
      </div>

      <Card>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-200">
          Movimientos recientes
        </h2>
        {movements.length === 0 ? (
          <p className="text-sm text-gray-400">
            {loading ? "Cargando movimientos…" : "Todavía no tenés movimientos."}
          </p>
        ) : (
          <ul className="divide-y divide-white/10">
            {movements.map((movement) => (
              <li key={movement.id} className="flex items-center justify-between gap-4 py-3">
                <div className="min-w-0">
                  <p className="truncate font-medium text-white">
                    {movement.description || movement.category || "Movimiento"}
                  </p>
                  <p className="truncate text-sm text-gray-400">{formatDate(movement.created_at)}</p>
                </div>
                <p className="shrink-0 font-semibold text-white">{formatMoney(movement.amount)}</p>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}