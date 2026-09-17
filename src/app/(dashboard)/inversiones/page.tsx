"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { demoInvestments } from "@/lib/demo/data";
import { investmentsApi } from "@/lib/api/investments";
import { isApiError } from "@/lib/api/error";
import { projectInvestment, ratePercent, ratePercentMonthly, TERM_OPTIONS } from "@/lib/finance";
import { formatDate, formatMoney } from "@/lib/utils";
import type { Investment } from "@/types/investment";
import { useDemoStore } from "@/store/use-demo-store";

const DEMO_INVESTMENTS: Investment[] = demoInvestments.map((item) => ({
  id: item.id,
  amount: item.amount,
  term_months: item.amount === 200000 ? 6 : item.amount === 500000 ? 12 : 24,
  return_rate: item.rate,
  gross_return: item.net,
  app_fee: 0,
  net_return: item.net,
  total_payout: item.total,
  status: "active",
  maturity_date: item.maturity,
  created_at: null,
}));

export default function InversionesPage() {
  const demo = useDemoStore((store) => store.mode) === "demo";

  const [investments, setInvestments] = useState<Investment[]>(
    demo ? DEMO_INVESTMENTS : [],
  );
  const [loading, setLoading] = useState(false);

  const [amount, setAmount] = useState("");
  const [terms, setTerms] = useState(12);

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (demo) return;
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await investmentsApi.list();
        if (!cancelled) setInvestments(data.investments);
      } catch {
        // Sin backend: listas vacías.
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
  const preview = value > 0 ? projectInvestment(value, terms) : null;

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
        const now = new Date();
        const maturity = new Date(now.getTime() + terms * 30 * 24 * 60 * 60 * 1000);
        setInvestments((previous) => [
          {
            id: crypto.randomUUID(),
            amount: value,
            term_months: terms,
            return_rate: preview?.rate ?? 0,
            gross_return: preview?.gross ?? 0,
            app_fee: preview?.fee ?? 0,
            net_return: preview?.net ?? 0,
            total_payout: preview?.total ?? value,
            status: "active",
            maturity_date: maturity.toISOString(),
            created_at: now.toISOString(),
          },
          ...previous,
        ]);
        setSuccess("Inversión creada en modo demo.");
      } else {
        const { data } = await investmentsApi.create({ amount: value, term_months: terms });
        setInvestments((previous) => [data.investment, ...previous]);
        setSuccess("Inversión creada correctamente.");
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
        <h1 className="text-2xl font-semibold text-white">Inversiones</h1>
        <p className="text-sm text-gray-400">Invertí tu dinero y hacelo crecer</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-200">
            Simular inversión
          </h2>
          <p className="mb-5 mt-1 text-sm text-gray-400">
            Plazos de 1 a 24 meses. La tasa es sobre el total al vencimiento, no
            mensual: si invertís $100.000 a 24 meses, recibís $130.000.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {formError && <Alert variant="error">{formError}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Input
              label="Monto a invertir"
              name="investment_amount"
              type="number"
              min={1}
              required
              placeholder="0"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
            />
            <div className="space-y-1.5">
              <label htmlFor="investment_terms" className="text-sm font-medium text-gray-300">
                Plazo
              </label>
              <select
                id="investment_terms"
                value={terms}
                onChange={(event) => setTerms(Number(event.target.value))}
                className="h-10 w-full rounded-lg border border-white/15 bg-white/5 px-3 text-sm text-white caret-pink-400 focus:border-pink-500/40 focus:outline-2 focus:outline-pink-500/30"
              >
                {TERM_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option} {option === 1 ? "mes" : "meses"} ·{" "}
                    {ratePercent(projectInvestment(1, option).rate)}% total
                  </option>
                ))}
              </select>
            </div>

            {preview && (
              <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm">
                <dl className="grid grid-cols-2 gap-2">
                  <div>
                    <dt className="text-gray-400">Rendimiento total</dt>
                    <dd className="font-medium text-gray-100">
                      {ratePercent(preview.rate)}%
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-400">Por mes (equiv.)</dt>
                    <dd className="font-medium text-gray-100">
                      ~{ratePercentMonthly(preview.rate, terms)}%
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-400">Ganancia total</dt>
                    <dd className="font-medium text-green-400">
                      +{formatMoney(preview.net)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-400">Recibís al finalizar</dt>
                    <dd className="font-semibold text-white">
                      {formatMoney(preview.total)}
                    </dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="text-gray-400">Duración</dt>
                    <dd className="font-medium text-gray-100">
                      {terms} {terms === 1 ? "mes" : "meses"}
                    </dd>
                  </div>
                </dl>
              </div>
            )}

            <Button type="submit" isLoading={submitting} className="w-full">
              Invertir ahora
            </Button>
          </form>
        </Card>

        <Card>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-200">
            Mis inversiones
          </h2>
          {loading ? (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Spinner size="sm" />
              Cargando inversiones…
            </div>
          ) : investments.length === 0 ? (
            <p className="text-sm text-gray-400">No tenés inversiones activas.</p>
          ) : (
            <ul className="space-y-4">
              {investments.map((investment) => (
                <li
                  key={investment.id}
                  className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="min-w-0 truncate font-semibold text-white">
                      {formatMoney(investment.amount)}
                    </p>
                    <span className="shrink-0 rounded-full bg-green-500/20 px-2.5 py-0.5 text-xs font-medium capitalize text-green-300">
                      {investment.status}
                    </span>
                  </div>
                  <p className="mt-1 text-gray-400">
                    {investment.term_months} meses · {ratePercent(investment.return_rate)}%
                  </p>
                  <p className="text-gray-400">
                    Ganancia {formatMoney(investment.net_return)} · Total{" "}
                    {formatMoney(investment.total_payout)} · Vence{" "}
                    {formatDate(investment.maturity_date)}
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