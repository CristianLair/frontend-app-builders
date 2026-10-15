"use client";

import { Suspense, useEffect, useState, type FormEvent, type PropsWithChildren } from "react";
import { useSearchParams } from "next/navigation";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { cashApi } from "@/lib/api/cash";
import { isApiError } from "@/lib/api/error";
import { cn, formatDate, formatMoney } from "@/lib/utils";
import type { CashItem } from "@/types/cash";
import { useDemoStore } from "@/store/use-demo-store";
import { useMobileMode } from "@/components/viewport/mobile-mode-provider";

interface Movement extends CashItem {
  kind: "cashin" | "cashout";
}

interface CashPoint {
  id: string;
  name: string;
  address: string;
  distance: number;
  hours: string;
}

const CASH_POINTS: CashPoint[] = [
  {
    id: "p1",
    name: "Kiosco 24hs",
    address: "Av. Corrientes 1234, CABA",
    distance: 0.4,
    hours: "Abierto 24 horas",
  },
  {
    id: "p2",
    name: "Pago Fácil - Centro",
    address: "Av. Rivadavia 8500, CABA",
    distance: 1.2,
    hours: "8:00 a 20:00 h",
  },
  {
    id: "p3",
    name: "Banco Nación - Caja",
    address: "Av. Santa Fe 2000, CABA",
    distance: 2.1,
    hours: "10:00 a 15:00 h",
  },
];

const POINTS_BY_DISTANCE = [...CASH_POINTS].sort((a, b) => a.distance - b.distance);
const NEAREST_POINT = POINTS_BY_DISTANCE[0];

interface TransferHistoryItem {
  id: string;
  alias: string;
  name: string;
  amount: number;
  created_at: string;
}

interface CashPointHistoryItem {
  id: string;
  point: CashPoint;
  amount: number;
  created_at: string;
}

const DEMO_TRANSFERS: TransferHistoryItem[] = [
  {
    id: "t1",
    alias: "juan.perez.mp",
    name: "Juan Pérez",
    amount: 45000,
    created_at: "2026-09-28T14:20:00.000Z",
  },
  {
    id: "t2",
    alias: "maria.lopez.ars",
    name: "María López",
    amount: 80000,
    created_at: "2026-09-22T10:05:00.000Z",
  },
  {
    id: "t3",
    alias: "cafe.martinez",
    name: "Café Martínez",
    amount: 12500,
    created_at: "2026-09-15T18:40:00.000Z",
  },
  {
    id: "t4",
    alias: "lucas.gomez",
    name: "Lucas Gómez",
    amount: 30000,
    created_at: "2026-09-09T09:00:00.000Z",
  },
];

const DEMO_CASH_HISTORY: CashPointHistoryItem[] = [
  {
    id: "k1",
    point: CASH_POINTS[0],
    amount: 20000,
    created_at: "2026-09-27T20:10:00.000Z",
  },
  {
    id: "k2",
    point: CASH_POINTS[1],
    amount: 50000,
    created_at: "2026-09-18T11:30:00.000Z",
  },
  {
    id: "k3",
    point: CASH_POINTS[0],
    amount: 15000,
    created_at: "2026-09-12T19:45:00.000Z",
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

interface HistoryRowProps {
  badge: string;
  title: string;
  subtitle: string;
  amount: number;
  date: string;
  onClick: () => void;
}

function HistoryRow({ badge, title, subtitle, amount, date, onClick }: HistoryRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-xl border border-white/10 px-3 py-2.5 text-left transition-colors hover:bg-white/5"
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-coral/15 text-xs font-bold uppercase text-brand-coral">
        {badge}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-white">{title}</span>
        <span className="block truncate text-xs text-gray-400">{subtitle}</span>
      </span>
      <span className="shrink-0 text-right">
        <span className="block text-sm font-semibold text-white">{formatMoney(amount)}</span>
        <span className="block text-[11px] text-gray-500">{formatDate(date)}</span>
      </span>
    </button>
  );
}

type CashMethod = "transferencia" | "efectivo";

interface CashInFormProps {
  demo: boolean;
  onAdded: (movement: Movement) => void;
  history: CashPointHistoryItem[];
}

function CashInForm({ demo, onAdded, history }: CashInFormProps) {
  const [amount, setAmount] = useState("");
  const [source, setSource] = useState("");
  const [description, setDescription] = useState("");
  const [method, setMethod] = useState<CashMethod>("transferencia");
  const [pointId, setPointId] = useState<string>(NEAREST_POINT.id);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const selectedPoint = POINTS_BY_DISTANCE.find((point) => point.id === pointId) ?? NEAREST_POINT;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = Number(amount);
    if (!value || value <= 0) {
      setError("Ingresá un monto mayor a 0");
      return;
    }
    setError(null);
    setSubmitting(true);
    const resolvedSource =
      method === "efectivo" ? `Efectivo · ${selectedPoint.name}` : source;
    try {
      if (demo) {
        onAdded({
          id: crypto.randomUUID(),
          kind: "cashin",
          amount: value,
          currency: "ARS",
          source: resolvedSource,
          description,
          status: method === "efectivo" ? "pending" : "completed",
          created_at: new Date().toISOString(),
        });
      } else {
        const { data } = await cashApi.createIn({ amount: value, source: resolvedSource, description });
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

      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-200">¿Cómo querés recibir el dinero?</p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setMethod("transferencia")}
            aria-pressed={method === "transferencia"}
            className={cn(
              "rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors",
              method === "transferencia"
                ? "border-brand-coral bg-brand-coral/10 text-white"
                : "border-white/10 text-gray-300 hover:bg-white/5",
            )}
          >
            Transferencia
          </button>
          <button
            type="button"
            onClick={() => setMethod("efectivo")}
            aria-pressed={method === "efectivo"}
            className={cn(
              "rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors",
              method === "efectivo"
                ? "border-brand-coral bg-brand-coral/10 text-white"
                : "border-white/10 text-gray-300 hover:bg-white/5",
            )}
          >
            Efectivo en un punto
          </button>
        </div>
      </div>

      {method === "transferencia" ? (
        <Input
          label="Origen (opcional)"
          name="cashin_source"
          placeholder="Cuenta bancaria, alias…"
          value={source}
          onChange={(event) => setSource(event.target.value)}
        />
      ) : (
        <div className="space-y-2">
          <p className="text-sm text-gray-400">
            Elegí el punto más conveniente para cargar el efectivo:
          </p>
          <div className="space-y-2">
            {POINTS_BY_DISTANCE.map((point, index) => {
              const selected = point.id === selectedPoint.id;
              const recommended = index === 0;
              return (
                <button
                  key={point.id}
                  type="button"
                  onClick={() => setPointId(point.id)}
                  aria-pressed={selected}
                  className={cn(
                    "flex w-full items-start justify-between gap-3 rounded-xl border p-3 text-left transition-colors",
                    selected
                      ? "border-brand-coral bg-brand-coral/10"
                      : "border-white/10 hover:bg-white/5",
                  )}
                >
                  <span className="min-w-0">
                    <span className="flex flex-wrap items-center gap-2 font-medium text-white">
                      {point.name}
                      {recommended && (
                        <span className="rounded-full bg-brand-coral/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand-coral">
                          Más conveniente
                        </span>
                      )}
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-gray-400">
                      {point.address} · {point.hours}
                    </span>
                  </span>
                  <span className="shrink-0 text-xs text-gray-400">
                    {point.distance.toFixed(1)} km
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <Input
        label="Descripción (opcional)"
        name="cashin_description"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      />

      <Button type="submit" isLoading={submitting} className="w-full">
        {method === "efectivo" ? "Confirmar retiro en efectivo" : "Registrar cash-in"}
      </Button>

      {history.length > 0 && (
        <div className="space-y-2 border-t border-white/10 pt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Últimos lugares donde cargaste efectivo
          </p>
          <div className="space-y-1.5">
            {history.map((item) => (
              <HistoryRow
                key={item.id}
                badge={item.point.name.slice(0, 2)}
                title={item.point.name}
                subtitle={`${item.point.address} · ${item.point.distance.toFixed(1)} km`}
                amount={item.amount}
                date={item.created_at}
                onClick={() => {
                  setMethod("efectivo");
                  setPointId(item.point.id);
                }}
              />
            ))}
          </div>
        </div>
      )}
    </form>
  );
}

interface CashOutFormProps {
  demo: boolean;
  onAdded: (movement: Movement) => void;
  history: TransferHistoryItem[];
}

function CashOutForm({ demo, onAdded, history }: CashOutFormProps) {
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

      {history.length > 0 && (
        <div className="space-y-2 border-t border-white/10 pt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Alias a los que transferiste
          </p>
          <div className="space-y-1.5">
            {history.map((item) => (
              <HistoryRow
                key={item.id}
                badge={item.alias.slice(0, 2)}
                title={item.name}
                subtitle={item.alias}
                amount={item.amount}
                date={item.created_at}
                onClick={() => setDestination(item.alias)}
              />
            ))}
          </div>
        </div>
      )}
    </form>
  );
}

function TransferenciasContent() {
  const searchParams = useSearchParams();
  const modo = searchParams.get("modo");
  const showRecibir = modo !== "enviar";
  const showEnviar = modo !== "ingresar";
  const soloRecibir = showRecibir && !showEnviar;
  const soloEnviar = showEnviar && !showRecibir;

  const demo = useDemoStore((store) => store.mode) === "demo";
  const { mobileMode } = useMobileMode();
  const [transfers, setTransfers] = useState<TransferHistoryItem[]>(demo ? DEMO_TRANSFERS : []);
  const [cashHistory, setCashHistory] = useState<CashPointHistoryItem[]>(
    demo ? DEMO_CASH_HISTORY : [],
  );

  useEffect(() => {
    if (demo) return;
    let cancelled = false;
    const load = async () => {
      try {
        const [inRes, outRes] = await Promise.all([cashApi.listIn(), cashApi.listOut()]);
        if (cancelled) return;
        const outHistory: TransferHistoryItem[] = (outRes.data.cashout ?? [])
          .filter((item) => Boolean(item.destination))
          .slice(0, 6)
          .map((item) => ({
            id: item.id,
            alias: item.destination as string,
            name: item.destination as string,
            amount: item.amount,
            created_at: item.created_at ?? new Date().toISOString(),
          }));
        const cashInHistory: CashPointHistoryItem[] = (inRes.data.cashin ?? [])
          .filter((item) => (item.source ?? "").startsWith("Efectivo · "))
          .slice(0, 6)
          .map((item) => {
            const name = (item.source ?? "").replace("Efectivo · ", "");
            const point = CASH_POINTS.find((entry) => entry.name === name) ?? NEAREST_POINT;
            return {
              id: item.id,
              point,
              amount: item.amount,
              created_at: item.created_at ?? new Date().toISOString(),
            };
          });
        setTransfers(outHistory);
        setCashHistory(cashInHistory);
      } catch {
        // Si el backend falla, dejamos el historial vacío.
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [demo]);

  function handleCashOutAdded(movement: Movement) {
    const alias = movement.destination;
    if (!alias) return;
    setTransfers((previous) =>
      [
        {
          id: movement.id,
          alias,
          name: alias,
          amount: movement.amount,
          created_at: movement.created_at ?? new Date().toISOString(),
        },
        ...previous,
      ].slice(0, 6),
    );
  }

  function handleCashInAdded(movement: Movement) {
    const source = movement.source ?? "";
    if (!source.startsWith("Efectivo · ")) return;
    const name = source.replace("Efectivo · ", "");
    const point = CASH_POINTS.find((entry) => entry.name === name) ?? NEAREST_POINT;
    setCashHistory((previous) =>
      [
        {
          id: movement.id,
          point,
          amount: movement.amount,
          created_at: movement.created_at ?? new Date().toISOString(),
        },
        ...previous,
      ].slice(0, 6),
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className={cn("font-semibold text-white", mobileMode ? "text-xl" : "text-2xl")}>
          {soloRecibir ? "Ingresar dinero" : soloEnviar ? "Transferir dinero" : "Transferencias"}
        </h1>
        <p className="text-sm text-gray-400">
          {soloRecibir
            ? "Recibí dinero en tu cuenta"
            : soloEnviar
              ? "Enviá dinero a otra cuenta"
              : "Recibí dinero y enviá transferencias"}
        </p>
      </div>

      <div className={cn("grid gap-6", showRecibir && showEnviar && !soloRecibir && !mobileMode && "lg:grid-cols-2")}>
        {showRecibir && (
          <SectionCard title="Recibir dinero" subtitle="Registrá un ingreso a tu cuenta">
            <CashInForm demo={demo} onAdded={handleCashInAdded} history={cashHistory} />
          </SectionCard>
        )}
        {showEnviar && (
          <SectionCard title="Enviar dinero" subtitle="Realizá una transferencia">
            <CashOutForm demo={demo} onAdded={handleCashOutAdded} history={transfers} />
          </SectionCard>
        )}
      </div>
    </div>
  );
}

export default function TransferenciasPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-24">
          <Spinner size="lg" />
        </div>
      }
    >
      <TransferenciasContent />
    </Suspense>
  );
}
