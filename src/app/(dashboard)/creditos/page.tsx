"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { cardsApi } from "@/lib/api/cards";
import { creditsApi } from "@/lib/api/credits";
import { isApiError } from "@/lib/api/error";
import { projectCredit, ratePercent, ratePercentMonthly, TERM_OPTIONS } from "@/lib/finance";
import { formatDate, formatMoney } from "@/lib/utils";
import type { Credit } from "@/types/credit";
import { useDemoStore } from "@/store/use-demo-store";

const DEMO_SALARY = 200000;
const DEMO_CREDITS: Credit[] = [
  {
    id: "demo-credit",
    amount: 500000,
    cuotas: 12,
    interest_rate: 0.15,
    total_to_pay: 575000,
    monthly_payment: 47916.67,
    status: "active",
    created_at: "2026-08-20T10:00:00.000Z",
    max_allowed: DEMO_SALARY * 0.3,
    salary_monthly: DEMO_SALARY,
  },
];

export default function CreditosPage() {
  const demo = useDemoStore((store) => store.mode) === "demo";

  const [credits, setCredits] = useState<Credit[]>(demo ? DEMO_CREDITS : []);
  const [salary, setSalary] = useState<number | null>(demo ? DEMO_SALARY : null);
  const [loading, setLoading] = useState(false);

  const [amount, setAmount] = useState("");
  const [cuotas, setCuotas] = useState(12);

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (demo) return;
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const [credRes, cardRes] = await Promise.all([creditsApi.list(), cardsApi.get()]);
        if (cancelled) return;
        setCredits(credRes.data.credits);
        setSalary(cardRes.data.card.salary_monthly ?? null);
      } catch {
        if (cancelled) return;
        try {
          const credRes = await creditsApi.list();
          if (!cancelled) setCredits(credRes.data.credits);
        } catch {
          // Sin backend: listas vacías.
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [demo]);

  const value = Number(amount);
  const preview = value > 0 ? projectCredit(value, cuotas) : null;
  const maxAllowed = salary !== null ? salary * 0.3 : null;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setSuccess(null);
    if (!value || value <= 0) {
      setFormError("Ingresá un monto mayor a 0");
      return;
    }
    setSubmitting(true);
    try {
      if (demo) {
        setCredits((previous) => [
          {
            id: crypto.randomUUID(),
            amount: value,
            cuotas,
            interest_rate: preview?.rate ?? 0,
            total_to_pay: preview?.total ?? value,
            monthly_payment: preview?.monthly ?? value / cuotas,
            status: "active",
            created_at: new Date().toISOString(),
            max_allowed: maxAllowed ?? undefined,
            salary_monthly: salary ?? undefined,
          },
          ...previous,
        ]);
        setSuccess("Crédito aprobado en modo demo.");
      } else {
        const { data } = await creditsApi.create({ amount: value, cuotas });
        setCredits((previous) => [data.credit, ...previous]);
        setSuccess("Crédito aprobado correctamente.");
      }
      setAmount("");
    } catch (err) {
      setFormError(isApiError(err) ? err.message : "Ocurrió un error inesperado");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Créditos</h1>
        <p className="text-sm text-gray-400">Simulá y solicitá un préstamo en cuotas</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-200">
            Simular crédito
          </h2>
          <p className="mb-5 mt-1 text-sm text-gray-400">
            {maxAllowed !== null
              ? `Con tu salario podés pedir hasta ${formatMoney(maxAllowed)} (30%).`
              : "Elegí monto y cuotas (1 a 24 meses)."}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {formError && <Alert variant="error">{formError}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Input
              label="Monto"
              name="credit_amount"
              type="number"
              min={1}
              required
              placeholder="0"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
            />
            <div className="space-y-1.5">
              <label htmlFor="credit_cuotas" className="text-sm font-medium text-gray-300">
                Cuotas
              </label>
              <select
                id="credit_cuotas"
                value={cuotas}
                onChange={(event) => setCuotas(Number(event.target.value))}
                className="h-10 w-full rounded-lg border border-white/15 bg-white/5 px-3 text-sm text-white caret-pink-400 focus:border-pink-500/40 focus:outline-2 focus:outline-pink-500/30"
              >
                {TERM_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option} {option === 1 ? "cuota" : "cuotas"} ·{" "}
                    {ratePercent(projectCredit(1, option).rate)}% total
                  </option>
                ))}
              </select>
            </div>

            {preview && (
              <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm">
                <dl className="grid grid-cols-2 gap-2">
                  <div>
                    <dt className="text-gray-400">Tasa total al vencimiento</dt>
                    <dd className="font-medium text-gray-100">
                      {ratePercent(preview.rate)}%
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-400">Por cuota (equiv.)</dt>
                    <dd className="font-medium text-gray-100">
                      ~{ratePercentMonthly(preview.rate, cuotas)}%
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-400">Interés total</dt>
                    <dd className="font-medium text-gray-100">
                      {formatMoney(preview.total - value)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-400">Total a pagar</dt>
                    <dd className="font-semibold text-white">{formatMoney(preview.total)}</dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="text-gray-400">Cuota mensual</dt>
                    <dd className="font-medium text-gray-100">{formatMoney(preview.monthly)}</dd>
                  </div>
                </dl>
              </div>
            )}

            <Button type="submit" isLoading={submitting} className="w-full">
              Solicitar crédito
            </Button>
          </form>
        </Card>

        <Card>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-200">
            Mis créditos
          </h2>
          {loading ? (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Spinner size="sm" />
              Cargando créditos…
            </div>
          ) : credits.length === 0 ? (
            <p className="text-sm text-gray-400">No tenés créditos activos.</p>
          ) : (
            <ul className="space-y-4">
              {credits.map((credit) => (
                <li
                  key={credit.id}
                  className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="min-w-0 truncate font-semibold text-white">
                      {formatMoney(credit.amount)}
                    </p>
                    <span className="shrink-0 rounded-full bg-green-500/20 px-2.5 py-0.5 text-xs font-medium capitalize text-green-300">
                      {credit.status}
                    </span>
                  </div>
                  <p className="mt-1 text-gray-400">
                    {credit.cuotas} cuotas · {ratePercent(credit.interest_rate)}% · Total{" "}
                    {formatMoney(credit.total_to_pay)}
                  </p>
                  <p className="text-gray-400">
                    Cuota mensual {formatMoney(credit.monthly_payment)} ·{" "}
                    {formatDate(credit.created_at)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}