"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { cardsApi } from "@/lib/api/cards";
import { isApiError } from "@/lib/api/error";
import { demoUser } from "@/lib/demo/data";
import { cn, formatDate, formatMoney } from "@/lib/utils";
import type { Card as CardType, CardPayload } from "@/types/card";
import { useAuthStore } from "@/store/use-auth-store";
import { useDemoStore } from "@/store/use-demo-store";
import { useMobileMode } from "@/components/viewport/mobile-mode-provider";

const DEMO_CARD: CardType = {
  id: "demo-card",
  first_name: "Usuario",
  last_name: "Demo",
  email: "demo@presto.app",
  phone: "555-0100",
  bin: "411111",
  sub_bin: "111",
  salary_monthly: 200000,
  suspicious: false,
  created_at: null,
};

function CardSummary({ card }: { card: CardType }) {
  const { mobileMode } = useMobileMode();
  return (
    <dl className={cn("grid gap-3 text-sm", !mobileMode && "sm:grid-cols-2")}>
      <div>
        <dt className="text-gray-400">Titular</dt>
        <dd className="font-medium text-gray-100">
          {card.first_name} {card.last_name}
        </dd>
      </div>
      <div>
        <dt className="text-gray-400">Tarjeta</dt>
        <dd className="font-mono text-gray-100">
          •••• •••• •••• {card.bin ? card.bin.slice(-4) : "—"}
        </dd>
      </div>
      <div>
        <dt className="text-gray-400">Email</dt>
        <dd className="font-medium text-gray-100">{card.email}</dd>
      </div>
      <div>
        <dt className="text-gray-400">Teléfono</dt>
        <dd className="font-medium text-gray-100">{card.phone}</dd>
      </div>
      <div>
        <dt className="text-gray-400">Salario mensual</dt>
        <dd className="font-medium text-gray-100">{formatMoney(card.salary_monthly)}</dd>
      </div>
      <div>
        <dt className="text-gray-400">Registrada</dt>
        <dd className="font-medium text-gray-100">{formatDate(card.created_at)}</dd>
      </div>
    </dl>
  );
}

function RegisterCardForm({ onSuccess }: { onSuccess: (card: CardType) => void }) {
  const user = useAuthStore((store) => store.user);
  const { mobileMode } = useMobileMode();
  const [form, setForm] = useState<CardPayload>({
    card_number: "",
    cvv: "",
    first_name: user?.name ?? "",
    last_name: "",
    email: user?.email ?? "",
    phone: "",
    salary_monthly: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function update<K extends keyof CardPayload>(key: K, value: CardPayload[K]) {
    setForm((previous) => ({ ...previous, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const { data } = await cardsApi.register(form);
      onSuccess(data.card);
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
        label="Número de tarjeta"
        name="card_number"
        inputMode="numeric"
        required
        placeholder="4111 1111 1111 1111"
        value={form.card_number}
        onChange={(event) => update("card_number", event.target.value.replace(/[^\d]/g, ""))}
        maxLength={19}
      />
      <Input
        label="CVV"
        name="cvv"
        inputMode="numeric"
        required
        placeholder="123"
        value={form.cvv}
        onChange={(event) => update("cvv", event.target.value.replace(/[^\d]/g, ""))}
        maxLength={4}
      />
      <div className={cn("grid gap-4", !mobileMode && "sm:grid-cols-2")}>
        <Input
          label="Nombre"
          name="first_name"
          required
          value={form.first_name}
          onChange={(event) => update("first_name", event.target.value)}
        />
        <Input
          label="Apellido"
          name="last_name"
          required
          value={form.last_name}
          onChange={(event) => update("last_name", event.target.value)}
        />
      </div>
      <Input
        label="Email"
        name="email"
        type="email"
        required
        value={form.email}
        onChange={(event) => update("email", event.target.value)}
      />
      <div className={cn("grid gap-4", !mobileMode && "sm:grid-cols-2")}>
        <Input
          label="Teléfono"
          name="phone"
          required
          value={form.phone}
          onChange={(event) => update("phone", event.target.value)}
        />
        <Input
          label="Salario mensual"
          name="salary_monthly"
          type="number"
          min={1}
          required
          value={form.salary_monthly || ""}
          onChange={(event) => update("salary_monthly", Number(event.target.value))}
        />
      </div>
      <Button type="submit" isLoading={submitting} className="w-full">
        Registrar tarjeta
      </Button>
    </form>
  );
}

export default function PerfilPage() {
  const user = useAuthStore((store) => store.user);
  const demoMode = useDemoStore((store) => store.mode) === "demo";
  const { mobileMode } = useMobileMode();

  const [card, setCard] = useState<CardType | null>(demoMode ? DEMO_CARD : null);
  const [cardLoading, setCardLoading] = useState(!demoMode);
  const [cardError, setCardError] = useState<string | null>(null);

  useEffect(() => {
    if (demoMode) return;
    let cancelled = false;
    const load = async () => {
      setCardLoading(true);
      try {
        const { data } = await cardsApi.get();
        if (cancelled) return;
        setCard(data.card);
        setCardError(null);
      } catch (err) {
        if (cancelled) return;
        setCard(null);
        if (!isApiError(err) || err.status !== 404) {
          setCardError("No pudimos consultar tu tarjeta.");
        }
      } finally {
        if (!cancelled) setCardLoading(false);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [demoMode]);

  const profile = user ?? demoUser;

  return (
    <div className="space-y-6">
      <div>
        <h1 className={cn("font-semibold text-white", mobileMode ? "text-xl" : "text-2xl")}>
          Mi perfil
        </h1>
        <p className="text-sm text-gray-400">Tus datos personales y tu tarjeta</p>
      </div>

      <Card>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-200">
          Datos de la cuenta
        </h2>
        <dl className={cn("grid gap-3 text-sm", !mobileMode && "sm:grid-cols-2")}>
          <div>
            <dt className="text-gray-400">Nombre</dt>
            <dd className="font-medium text-gray-100">{profile.name ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-gray-400">Correo</dt>
            <dd className="font-medium text-gray-100">{profile.email}</dd>
          </div>
          <div>
            <dt className="text-gray-400">Rol</dt>
            <dd className="font-medium text-gray-100">{profile.role ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-gray-400">Usuario ID</dt>
            <dd className="break-all font-mono text-gray-100">{profile.id}</dd>
          </div>
        </dl>
      </Card>

      <Card>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-200">
          Tarjeta
        </h2>
        {cardLoading ? (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Spinner size="sm" />
            Consultando tarjeta…
          </div>
        ) : card ? (
          <CardSummary card={card} />
        ) : (
          <>
            {cardError ? (
              <Alert variant="error" className="mb-4">
                {cardError}
              </Alert>
            ) : (
              <Alert variant="info" className="mb-4">
                Para pedir créditos e invertir necesitás registrar tu tarjeta.
              </Alert>
            )}
            <RegisterCardForm onSuccess={setCard} />
          </>
        )}
      </Card>
    </div>
  );
}