"use client";

import { Card } from "@/components/ui/card";
import { DemoMetrics } from "@/components/demo/demo-metrics";
import {
  demoAccounts,
  demoInvestments,
  demoSummary,
  demoTransactions,
  demoUser,
} from "@/lib/demo/data";
import { cn, formatMoney } from "@/lib/utils";

const transactionLabels = {
  inversion: "Inversión",
  credito: "Crédito",
  ingreso: "Ingreso",
  egreso: "Egreso",
} as const;

export function DemoDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Hola, {demoUser.name}</h1>
        <p className="text-sm text-gray-400">
          Vista previa con datos de ejemplo: inversiones y créditos simulados.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-sm text-gray-400">Saldo disponible</p>
          <p className="mt-1 text-2xl font-semibold text-white">
            {formatMoney(demoSummary.available)}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-gray-400">Invertido</p>
          <p className="mt-1 text-2xl font-semibold text-white">
            {formatMoney(demoSummary.invested)}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-gray-400">Deuda activa</p>
          <p className="mt-1 text-2xl font-semibold text-white">
            {formatMoney(demoSummary.owed)}
          </p>
        </Card>
      </div>

      <DemoMetrics />

      <Card>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-200">
          Cuentas
        </h2>
        <ul className="divide-y divide-white/10">
          {demoAccounts.map((account) => (
            <li key={account.id} className="flex items-center justify-between gap-4 py-3">
              <div className="min-w-0">
                <p className="truncate font-medium text-white">{account.name}</p>
                <p className="truncate text-sm text-gray-400">{account.number}</p>
              </div>
              <p className="shrink-0 font-semibold text-white">{formatMoney(account.balance)}</p>
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-200">
          Inversiones activas
        </h2>
        <ul className="divide-y divide-white/10">
          {demoInvestments.map((investment) => (
            <li key={investment.id} className="flex items-center justify-between gap-4 py-3">
              <div className="min-w-0">
                <p className="truncate font-medium text-white">{investment.name}</p>
                <p className="truncate text-sm text-gray-400">
                  Vence el{" "}
                  {new Date(investment.maturity).toLocaleDateString("es-AR", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="font-semibold text-white">{formatMoney(investment.total)}</p>
                <p className="text-xs text-green-400">
                  +{formatMoney(investment.net)} ({Math.round(investment.rate * 100)}%
                  total)
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-200">
          Movimientos recientes
        </h2>
        <ul className="divide-y divide-white/10">
          {demoTransactions.map((transaction) => (
            <li key={transaction.id} className="flex items-center justify-between gap-4 py-3">
              <div className="min-w-0">
                <p className="truncate font-medium text-white">{transaction.concept}</p>
                <p className="truncate text-sm text-gray-400">
                  {transactionLabels[transaction.category]} · {transaction.createdAt}
                </p>
              </div>
              <p
                className={cn(
                  "shrink-0 font-semibold",
                  transaction.amount < 0 ? "text-red-400" : "text-green-400",
                )}
              >
                {transaction.amount < 0 ? "−" : "+"}
                {formatMoney(Math.abs(transaction.amount))}
              </p>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}