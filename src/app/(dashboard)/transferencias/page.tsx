"use client";

import { useEffect, useState, type FormEvent, type PropsWithChildren } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { cashApi } from "@/lib/api/cash";
import { isApiError } from "@/lib/api/error";
import { formatDate, formatMoney } from "@/lib/utils";
import type { CashItem } from "@/types/cash";
import { useDemoStore } from "@/store/use-demo-store";

interface Movement extends CashItem {
  kind: "cashin" | "cashout";
}

const DEMO_MOVEMENTS: Movement[] = [
  {
    id: "m1",
    kind: "cashin",
    amount: 800000,
    currency: "ARS",
    source: "Cuenta bancaria",
    description: "Depósito inicial",
    status: "completed",
    created_at: "2026-09-10T10:00:00.000Z",
  },
  {
    id: "m2",
    kind: "cashout",
    amount: 125000,
    currency: "ARS",
    destination: "Cuota crédito",
    description: "Pago de cuota",
    status: "completed",
    created_at: "2026-09-05T12:30:00.000Z",
  },
  {
    id: "m3",
    kind: "cashout",
    amount: 60000,
    currency: "ARS",
    destination: "Transferencia",
    description: "Envío a terceros",
    status: "pending",
    created_at: "2026-09-03T09:15:00.000Z",
  },
];

function SectionCard({ title, subtitle, children }: PropsWithChildren<{ title: string; subtitle: string }>) {
  return (
    <Card>
      <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-200">{title}</h2>
      <p className="mb-5 mt-1 text-sm text-gray-400">{subtitle}</p>
      {children}
    </Card>
  );
}

interface CashFormProps {
  demo: boolean;
  onAdded: (movement: Movement) => void;
}

function CashInForm({ demo, onAdded }: CashFormProps) {
  const [amount, setAmount] = useState("");
  const [source, setSource] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = Number(amount);
    if (!value || value <= 0) {
      setError("Ingresá un monto mayor a 0");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      if (demo) {
        onAdded({
          id: crypto.randomUUID(),
          kind: "cashin",
          amount: value,
          currency: "ARS",
          source,
          description,
          status: "completed",
          created_at: new Date().toISOString(),
        });
      } else {
        const { data } = await cashApi.createIn({ amount: value, source, description });
        onAdded({ ...data.cashin, kind: "cashin" });
      }
      setAmount("");
      setSource("");
      setDescription("");
    } catch (err) {
      setError(isApiError(err) ? err.message : "Ocurrió un error inesperado");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <Alert variant="error">{error}</Alert>}
      <Input
        label="Monto a recibir"
        name="cashin_amount"
        type="number"
        min={1}
        required
        placeholder="0"
        value={amount}
        onChange={(event) => setAmount(event.target.value)}
      />
      <Input
        label="Origen (opcional)"
        name="cashin_source"
        placeholder="Cuenta bancaria, efectivo…"
        value={source}
        onChange={(event) => setSource(event.target.value)}
      />
      <Input
        label="Descripción (opcional)"
        name="cashin_description"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      />
      <Button type="submit" isLoading={submitting} className="w-full">
        Registrar cash-in
      </Button>
    </form>
  );
}

function CashOutForm({ demo, onAdded }: CashFormProps) {
  const [amount, setAmount] = useState("");
  const [destination, setDestination] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = Number(amount);
    if (!value || value <= 0) {
      setError("Ingresá un monto mayor a 0");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      if (demo) {
        onAdded({
          id: crypto.randomUUID(),
          kind: "cashout",
          amount: value,
          currency: "ARS",
          destination,
          description,
          status: "completed",
          created_at: new Date().toISOString(),
        });
      } else {
        const { data } = await cashApi.createOut({ amount: value, destination, description });
        onAdded({ ...data.cashout, kind: "cashout" });
      }
      setAmount("");
      setDestination("");
      setDescription("");
    } catch (err) {
      setError(isApiError(err) ? err.message : "Ocurrió un error inesperado");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <Alert variant="error">{error}</Alert>}
      <Input
        label="Monto a enviar"
        name="cashout_amount"
        type="number"
        min={1}
        required
        placeholder="0"
        value={amount}
        onChange={(event) => setAmount(event.target.value)}
      />
      <Input
        label="Destino (opcional)"
        name="cashout_destination"
        placeholder="CBU, alias, cuenta…"
        value={destination}
        onChange={(event) => setDestination(event.target.value)}
      />
      <Input
        label="Descripción (opcional)"
        name="cashout_description"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      />
      <Button type="submit" isLoading={submitting} className="w-full">
        Realizar transferencia
      </Button>
    </form>
  );
}

export default function TransferenciasPage() {
  const demo = useDemoStore((store) => store.mode) === "demo";
  const [movements, setMovements] = useState<Movement[]>(demo ? DEMO_MOVEMENTS : []);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (demo) return;
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const [inRes, outRes] = await Promise.all([cashApi.listIn(), cashApi.listOut()]);
        if (cancelled) return;
        const combined: Movement[] = [
          ...(inRes.data.cashin ?? []).map((item) => ({ ...item, kind: "cashin" as const })),
          ...(outRes.data.cashout ?? []).map((item) => ({ ...item, kind: "cashout" as const })),
        ].sort((a, b) => (b.created_at ?? "").localeCompare(a.created_at ?? ""));
        setMovements(combined);
      } catch {
        // Si el backend falla, mostramos la lista vacía.
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [demo]);

  function handleAdded(movement: Movement) {
    setMovements((previous) => [movement, ...previous]);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Transferencias</h1>
        <p className="text-sm text-gray-400">Recibí dinero y enviá transferencias</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Recibir dinero" subtitle="Registrá un ingreso a tu cuenta">
          <CashInForm demo={demo} onAdded={handleAdded} />
        </SectionCard>
        <SectionCard title="Enviar dinero" subtitle="Realizá una transferencia">
          <CashOutForm demo={demo} onAdded={handleAdded} />
        </SectionCard>
      </div>

      <Card>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-200">
          Movimientos
        </h2>
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Spinner size="sm" />
            Cargando movimientos…
          </div>
        ) : movements.length === 0 ? (
          <p className="text-sm text-gray-400">Todavía no tenés movimientos.</p>
        ) : (
          <ul className="divide-y divide-white/10">
            {movements.map((movement) => {
              const positive = movement.kind === "cashin";
              const label = movement.destination || movement.source || movement.description || "";
              return (
                <li key={movement.id} className="flex items-center justify-between gap-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-white">
                      {movement.description || (positive ? "Cash-In" : "Cash-Out")}
                    </p>
                    <p className="truncate text-sm text-gray-400">
                      {positive ? "Recibido" : "Enviado"} · {label || "—"} ·{" "}
                      {formatDate(movement.created_at)}
                    </p>
                  </div>
                  <p
                    className={
                      positive
                        ? "shrink-0 font-semibold text-green-400"
                        : "shrink-0 font-semibold text-red-400"
                    }
                  >
                    {positive ? "+" : "−"}
                    {formatMoney(Math.abs(movement.amount))}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}