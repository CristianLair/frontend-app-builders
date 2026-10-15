"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { creditsApi } from "@/lib/api/credits";
import { transactionsApi } from "@/lib/api/transactions";
import { demoTransactions } from "@/lib/demo/data";
import { cn, formatDate, formatMoney } from "@/lib/utils";
import type { Transaction } from "@/types/transaction";
import { useDemoStore } from "@/store/use-demo-store";
import { useMobileMode } from "@/components/viewport/mobile-mode-provider";

const CATEGORY_LABELS: Record<string, string> = {
  inversion: "Inversión",
  credito: "Crédito",
  ingreso: "Ingreso",
  egreso: "Egreso",
  transferencia: "Transferencia",
};

type CreditStatusKey = "solicitado" | "al_dia" | "a_vencer" | "pagado" | "vencido";

interface CreditHistoryItem {
  id: string;
  amount: number;
  cuotas: number;
  paidCuotas: number;
  total: number;
  monthly: number;
  status: CreditStatusKey;
  dueDate: string | null;
  created_at: string | null;
}

const CREDIT_STATUS: Record<CreditStatusKey, { label: string; className: string }> = {
  solicitado: { label: "Solicitado", className: "bg-amber-500/20 text-amber-300" },
  al_dia: { label: "Al día", className: "bg-green-500/20 text-green-300" },
  a_vencer: { label: "A vencer", className: "bg-orange-500/20 text-orange-300" },
  pagado: { label: "Pagado", className: "bg-blue-500/20 text-blue-300" },
  vencido: { label: "Vencido", className: "bg-red-500/20 text-red-300" },
};

const DEMO_CREDIT_HISTORY: CreditHistoryItem[] = [
  {
    id: "ch-1",
    amount: 500000,
    cuotas: 12,
    paidCuotas: 6,
    total: 575000,
    monthly: 47916.67,
    status: "al_dia",
    dueDate: "2027-02-20",
    created_at: "2026-08-20T10:00:00.000Z",
  },
  {
    id: "ch-2",
    amount: 200000,
    cuotas: 6,
    paidCuotas: 1,
    total: 215000,
    monthly: 35833.33,
    status: "a_vencer",
    dueDate: "2026-11-01",
    created_at: "2026-09-01T10:00:00.000Z",
  },
  {
    id: "ch-3",
    amount: 150000,
    cuotas: 3,
    paidCuotas: 3,
    total: 155000,
    monthly: 51666.67,
    status: "pagado",
    dueDate: null,
    created_at: "2026-05-10T10:00:00.000Z",
  },
  {
    id: "ch-4",
    amount: 300000,
    cuotas: 12,
    paidCuotas: 0,
    total: 345000,
    monthly: 28750,
    status: "solicitado",
    dueDate: null,
    created_at: "2026-10-05T10:00:00.000Z",
  },
];

function mapCreditStatus(status: string): CreditStatusKey {
  const value = status.toLowerCase();
  if (value.includes("pag") || value === "paid") return "pagado";
  if (value.includes("venc") || value === "overdue") return "vencido";
  if (value.includes("solic") || value === "pending" || value === "requested") return "solicitado";
  if (value.includes("vencer") || value === "due") return "a_vencer";
  return "al_dia";
}

function StatusBadge({ label, className }: { label: string; className: string }) {
  return (
    <span className={cn("shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium", className)}>
      {label}
    </span>
  );
}

export default function ActividadPage() {
  const demo = useDemoStore((store) => store.mode) === "demo";
  const { mobileMode } = useMobileMode();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [credits, setCredits] = useState<CreditHistoryItem[]>(
    demo ? DEMO_CREDIT_HISTORY : [],
  );
  const [loading, setLoading] = useState(!demo);

  useEffect(() => {
    if (demo) return;
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const [txRes, credRes] = await Promise.all([
          transactionsApi.list({ per_page: 20 }),
          creditsApi.list(),
        ]);
        if (cancelled) return;
        setTransactions(txRes.data.transactions);
        setCredits(
          credRes.data.credits.map((credit) => ({
            id: credit.id,
            amount: Number(credit.amount),
            cuotas: credit.cuotas,
            paidCuotas: 0,
            total: Number(credit.total_to_pay),
            monthly: Number(credit.monthly_payment),
            status: mapCreditStatus(credit.status),
            dueDate: null,
            created_at: credit.created_at,
          })),
        );
      } catch {
        // Sin backend: secciones vacías.
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [demo]);

  const demoList: Transaction[] = demoTransactions.map((tx) => ({
    id: tx.id,
    amount: tx.amount,
    currency: "ARS",
    type: tx.category,
    description: tx.concept,
    category: tx.category,
    status: tx.status,
    created_at: tx.createdAt,
  }));

  const transactionList = demo ? demoList : transactions;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-coral">
          Actividad
        </p>
        <h1 className={cn(
          "heading-gradient mt-1 font-extrabold tracking-tight",
          mobileMode ? "text-lg" : "text-2xl",
        )}>
          Tu historial completo
        </h1>
        <p className="text-sm text-gray-400">
          Transacciones y créditos: solicitados, pagados, a vencer y más.
        </p>
      </div>

      <div className={cn("grid gap-6", !mobileMode && "lg:grid-cols-2")}>
        <Card>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-200">
            Historial de transacciones
          </h2>
          {loading ? (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Spinner size="sm" />
              Cargando transacciones…
            </div>
          ) : transactionList.length === 0 ? (
            <p className="text-sm text-gray-400">Todavía no tenés transacciones.</p>
          ) : (
            <ul className="divide-y divide-white/10">
              {transactionList.map((transaction) => {
                const positive = transaction.amount >= 0;
                const category =
                  CATEGORY_LABELS[transaction.category ?? ""] ??
                  transaction.category ??
                  "Movimiento";
                return (
                  <li
                    key={transaction.id}
                    className="flex items-center justify-between gap-3 py-2.5"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-white">
                        {transaction.description || category}
                      </p>
                      <p className="truncate text-xs text-gray-400">
                        {category} · {formatDate(transaction.created_at)}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p
                        className={cn(
                          "text-sm font-semibold",
                          positive ? "text-green-400" : "text-red-400",
                        )}
                      >
                        {positive ? "+" : "−"}
                        {formatMoney(Math.abs(transaction.amount))}
                      </p>
                      <p
                        className={cn(
                          "text-[11px]",
                          transaction.status === "pending" ? "text-amber-300" : "text-green-300",
                        )}
                      >
                        {transaction.status === "pending" ? "Pendiente" : "Completado"}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        <Card>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-200">
            Historial de créditos
          </h2>
          {loading ? (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Spinner size="sm" />
              Cargando créditos…
            </div>
          ) : credits.length === 0 ? (
            <p className="text-sm text-gray-400">Todavía no tenés créditos.</p>
          ) : (
            <ul className="space-y-3">
              {credits.map((credit) => {
                const meta = CREDIT_STATUS[credit.status];
                const progress =
                  credit.cuotas > 0
                    ? Math.min(100, Math.round((credit.paidCuotas / credit.cuotas) * 100))
                    : 0;
                return (
                  <li
                    key={credit.id}
                    className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                      <p className="text-sm font-semibold text-white">
                        {formatMoney(credit.amount)}
                      </p>
                      <StatusBadge label={meta.label} className={meta.className} />
                    </div>
                    <p className="mt-1 text-xs text-gray-400">
                      {credit.cuotas} cuotas · Cuota {formatMoney(credit.monthly)} · Total{" "}
                      {formatMoney(credit.total)}
                    </p>
                    <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-brand-coral to-blue-400"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      {credit.paidCuotas}/{credit.cuotas} cuotas pagadas
                      {credit.dueDate ? ` · Próximo vencimiento ${formatDate(credit.dueDate)}` : ""}
                      {" · Solicitado el "}
                      {formatDate(credit.created_at)}
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </div>

      <p className="text-center text-sm text-gray-400">
        <Link href="/dashboard" className="text-brand-coral hover:underline">
          ← Volver al inicio
        </Link>
      </p>
    </div>
  );
}
