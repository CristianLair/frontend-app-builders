"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminChatPanel } from "@/components/chat/admin-chat-panel";
import { DemoDashboard } from "@/components/demo/demo-dashboard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useHydrated } from "@/hooks/use-hydrated";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/use-auth-store";
import { useDemoStore } from "@/store/use-demo-store";
import { useMobileMode } from "@/components/viewport/mobile-mode-provider";

const SECTIONS = [
  { label: "Inicio", href: "/dashboard" },
  { label: "Actividad", href: "/actividad" },
  { label: "Transferencias", href: "/transferencias" },
  { label: "Créditos", href: "/creditos" },
  { label: "Inversiones", href: "/inversiones" },
  { label: "Perfil", href: "/perfil" },
];

export default function DashboardPage() {
  const hydrated = useHydrated();
  const user = useAuthStore((store) => store.user);
  const status = useAuthStore((store) => store.status);
  const fetchMe = useAuthStore((store) => store.fetchMe);
  const demoMode = useDemoStore((store) => store.mode) === "demo";
  const { mobileMode } = useMobileMode();

  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [chatOpen, setChatOpen] = useState(true);

  // El asistente de IA solo puede usarlo el administrador (dueño del app).
  // El backend ya lo exige; acá controlamos qué se muestra en el front.
  const isAdmin = demoMode || user?.role === "admin";

  useEffect(() => {
    if (hydrated && status === "authenticated") void fetchMe();
  }, [hydrated, status, fetchMe]);

  const displayName = demoMode ? "Samuel" : user?.name ?? user?.email ?? "Samuel";
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  const filteredSections = SECTIONS.filter((section) =>
    section.label.toLowerCase().includes(query.trim().toLowerCase()),
  );

  const topBar = (
    <div className="flex items-center justify-between gap-4">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-brand-coral/20 text-lg font-bold text-brand-coral">
          {initials || "S"}
        </span>
        <p className="truncate text-base font-semibold text-foreground sm:text-lg">
          Hola de nuevo {displayName.toLowerCase()}
        </p>
      </div>

      <div className="relative flex items-center gap-2">
        {isAdmin && (
          <button
            type="button"
            aria-label="Asistente IA"
            title="Asistente IA (solo administrador)"
            aria-pressed={chatOpen}
            onClick={() => setChatOpen((open) => !open)}
            className={cn(
              "inline-flex size-10 items-center justify-center rounded-full border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-coral",
              chatOpen
                ? "border-brand-coral/50 bg-brand-coral/15 text-brand-coral"
                : "border-border bg-surface text-foreground hover:bg-surface-strong",
            )}
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
              <path d="m6.3 6.3 2.4 2.4M15.3 15.3l2.4 2.4M17.7 6.3l-2.4 2.4M8.7 15.3l-2.4 2.4" />
            </svg>
          </button>
        )}

        <button
          type="button"
          aria-label="Notificaciones"
          title="Notificaciones"
          className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-surface text-foreground transition-colors hover:bg-surface-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-coral"
        >
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </button>

        <button
          type="button"
          aria-label="Buscar secciones"
          title="Buscar secciones"
          onClick={() => setSearchOpen((open) => !open)}
          className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-surface text-foreground transition-colors hover:bg-surface-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-coral"
        >
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </button>

        {searchOpen && (
          <div className="absolute right-0 top-12 z-20 w-64 rounded-xl border border-border bg-surface-strong p-2 shadow-lg">
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar sección…"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-soft focus:border-brand-coral"
            />
            <ul className="mt-2 max-h-56 overflow-auto">
              {filteredSections.map((section) => (
                <li key={section.href}>
                  <Link
                    href={section.href}
                    onClick={() => {
                      setSearchOpen(false);
                      setQuery("");
                    }}
                    className="block rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-surface"
                  >
                    {section.label}
                  </Link>
                </li>
              ))}
              {filteredSections.length === 0 && (
                <li className="px-3 py-2 text-sm text-muted-soft">Sin resultados</li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );

  const balanceCard = (
    <Card className="on-dark relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0b1f3a] via-[#142e52] to-[#0b1f3a] p-6 shadow-xl shadow-[#0b1f3a]/50">
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#3b6fb8]/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-12 h-56 w-56 rounded-full bg-[#08203f]/70 blur-3xl" />
      <div className="relative">
        <p className="text-sm text-white/70">Saldo disponible</p>
        <p className={cn("mt-1 font-extrabold tracking-tight text-white", mobileMode ? "text-3xl" : "text-4xl")}>
          $ 250.000
        </p>

        <div className={cn("mt-6 grid gap-3", mobileMode ? "grid-cols-1" : "sm:grid-cols-3")}>
          <Button
            variant="secondary"
            size="lg"
            className="w-full bg-white/10 text-white ring-1 ring-inset ring-white/20 hover:bg-white/20 focus-visible:outline-white/60"
            asChild
          >
            <Link href="/transferencias?modo=ingresar">Ingresar dinero</Link>
          </Button>
          <Button size="lg" className="w-full" asChild>
            <Link href="/creditos">Pedir crédito</Link>
          </Button>
          <Button
            variant="secondary"
            size="lg"
            className="w-full bg-white/10 text-white ring-1 ring-inset ring-white/20 hover:bg-white/20 focus-visible:outline-white/60"
            asChild
          >
            <Link href="/transferencias?modo=enviar">Transferir dinero</Link>
          </Button>
        </div>
      </div>
    </Card>
  );

  const activityCard = (
    <Card className="relative overflow-hidden rounded-2xl border border-border bg-surface p-5">
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand-coral/20 blur-3xl" />
      <div className="relative flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p
            className={cn(
              "heading-gradient font-extrabold uppercase leading-tight",
              mobileMode ? "text-lg tracking-[0.14em]" : "text-2xl tracking-[0.2em]",
            )}
          >
            Actividad
          </p>
          <p className="mt-1 text-sm leading-tight text-muted">
            Mirá tu historial de transacciones y créditos
          </p>
        </div>
        <Link
          href="/actividad"
          className="group inline-flex shrink-0 items-center gap-1.5 rounded-full border border-brand-coral/40 bg-brand-coral/10 px-4 py-2 text-sm font-semibold text-brand-coral transition-colors hover:bg-brand-coral/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-coral"
        >
          Consultar
          <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </Link>
      </div>
    </Card>
  );

  const content = (
    <>
      {topBar}
      {balanceCard}
      {activityCard}
      {demoMode && <DemoDashboard />}
    </>
  );

  // En modo celular no hay lugar "a la derecha": el asistente ocupa la sección.
  if (mobileMode) {
    if (isAdmin && chatOpen) {
      return (
        <AdminChatPanel className="h-[620px] max-h-full" onClose={() => setChatOpen(false)} />
      );
    }
    return <div className="space-y-6">{content}</div>;
  }

  // En PC el asistente flota en el extremo inferior derecho para no tapar la interfaz.
  return (
    <div className="space-y-6">
      {content}
      {isAdmin && chatOpen && (
        <AdminChatPanel
          className="fixed bottom-5 right-5 z-40 h-[min(560px,80vh)] w-[380px] max-w-[calc(100vw-2.5rem)]"
          onClose={() => setChatOpen(false)}
        />
      )}
    </div>
  );
}
