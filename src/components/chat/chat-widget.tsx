"use client";

import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useHydrated } from "@/hooks/use-hydrated";
import { chatApi } from "@/lib/api/chat";
import { cn, formatMoney } from "@/lib/utils";
import { useAuthStore } from "@/store/use-auth-store";
import type { MarketQuote, PaperPosition, PortfolioSummary } from "@/types/chat";

interface Bubble {
  role: "user" | "assistant";
  content: string;
  quote?: MarketQuote | null;
  position?: PaperPosition | null;
  positions?: PaperPosition[] | null;
  portfolio?: PortfolioSummary | null;
}

function formatAssetPrice(price: number, currency: string) {
  return currency === "ARS"
    ? formatMoney(price)
    : `US$ ${price.toLocaleString("es-AR", { maximumFractionDigits: 6, minimumFractionDigits: 2 })}`;
}

function PnLValue({ value }: { value: number }) {
  const positive = value >= 0;
  return (
    <span className={cn("font-semibold", positive ? "text-emerald-400" : "text-pink-400")}>
      {positive ? "+" : ""}
      {formatMoney(value)}
    </span>
  );
}

function PositionCard({ position }: { position: PaperPosition }) {
  return (
    <div className="mt-2 rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-gray-300">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-white">
          {position.name} · {position.symbol}
        </p>
        <span className={cn("font-semibold", position.pl_pct >= 0 ? "text-emerald-400" : "text-pink-400")}>
          {position.pl_pct >= 0 ? "+" : ""}
          {position.pl_pct.toFixed(2)}%
        </span>
      </div>
      <div className="mt-1 flex items-center justify-between">
        <span>Cotiza {formatAssetPrice(position.current_price, position.currency)}</span>
        <PnLValue value={position.pl_ars} />
      </div>
      <div className="mt-1 flex items-center justify-between text-gray-500">
        <span>Invertiste {formatMoney(position.invested_ars)}</span>
        <span>Vale {formatMoney(position.current_value_ars)}</span>
      </div>
      {position.change_24h_pct != null && (
        <p className="mt-1 text-gray-500">Variación 24h: {position.change_24h_pct.toFixed(2)}%</p>
      )}
    </div>
  );
}

function QuoteChip({ quote }: { quote: MarketQuote }) {
  return (
    <div className="mt-2 flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-gray-300">
      <span className="font-semibold text-white">{quote.name} · {quote.symbol}</span>
      <span>
        {formatAssetPrice(quote.price, quote.currency)}
        {quote.change_24h_pct != null && (
          <span className={cn("ml-2", quote.change_24h_pct >= 0 ? "text-emerald-400" : "text-pink-400")}>
            {quote.change_24h_pct >= 0 ? "+" : ""}
            {quote.change_24h_pct.toFixed(2)}%
          </span>
        )}
      </span>
    </div>
  );
}

function StructuredPayload({ bubble }: { bubble: Bubble }) {
  if (bubble.position) return <PositionCard position={bubble.position} />;
  if (bubble.positions && bubble.positions.length > 0) {
    const portfolio = bubble.portfolio;
    return (
      <div>
        <div className={cn("mt-2 rounded-xl border border-white/10 bg-white/5 p-2")}>
          {bubble.positions.map((position) => (
            <PositionCard key={position.id} position={position} />
          ))}
        </div>
        {portfolio && (
          <p className="mt-2 text-xs text-gray-400">
            Total: {formatMoney(portfolio.invested_ars)} invertidos · valen{" "}
            {formatMoney(portfolio.current_value_ars)} ·{" "}
            <span className={cn("font-semibold", portfolio.pl_ars >= 0 ? "text-emerald-400" : "text-pink-400")}>
              {portfolio.pl_ars >= 0 ? "ganancia" : "pérdida"} {portfolio.pl_ars >= 0 ? "+" : ""}
              {formatMoney(portfolio.pl_ars)} ({portfolio.pl_pct.toFixed(2)}%)
            </span>
          </p>
        )}
      </div>
    );
  }
  if (bubble.quote) return <QuoteChip quote={bubble.quote} />;
  return null;
}

export function ChatWidget() {
  const hydrated = useHydrated();
  const status = useAuthStore((store) => store.status);

  const [open, setOpen] = useState(false);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [input, setInput] = useState("");
  const [quickOptions, setQuickOptions] = useState<string[] | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [bubbles, sending, open]);

  if (!hydrated || status !== "authenticated") return null;

  async function handleSend(raw?: string) {
    const text = (raw ?? input).trim();
    if (!text || sending) return;

    setInput("");
    setError(null);
    setBubbles((previous) => [...previous, { role: "user", content: text }]);
    setSending(true);

    try {
      const { data } = await chatApi.send(text, conversationId ?? undefined);
      const bubble: Bubble = { role: "assistant", content: data.reply };
      if (data.quote) bubble.quote = data.quote;
      if (data.position) bubble.position = data.position;
      if (data.positions && data.positions.length > 0) bubble.positions = data.positions;
      if (data.portfolio) bubble.portfolio = data.portfolio;
      setBubbles((previous) => [...previous, bubble]);
      setQuickOptions(data.options ?? null);
      if (data.conversation_id) setConversationId(data.conversation_id);
    } catch {
      setError("Lo siento, no pude obtener una respuesta. Intentá de nuevo.");
    } finally {
      setSending(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Abrir asistente financiero"
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-violet-600 text-white shadow-lg shadow-pink-500/20 transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-400"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-6"
          aria-hidden="true"
        >
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      </button>
    );
  }

  return (
    <div className="fixed inset-x-4 bottom-4 z-50 flex h-[min(560px,80vh)] flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#1b0f3f] shadow-2xl shadow-purple-950/50 sm:inset-x-auto sm:bottom-5 sm:right-5 sm:w-[400px]">
      <div className="flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-purple-900 to-indigo-900 px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-white">Asistente financiero</p>
          <p className="text-xs text-purple-200">Tu asistente financiero inteligente</p>
        </div>
        <Button variant="ghost" className="h-8 px-2 text-white hover:text-pink-400" onClick={() => setOpen(false)}>
          Cerrar
        </Button>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {bubbles.length === 0 && (
          <div className="flex justify-start">
            <div className="max-w-[85%] whitespace-pre-line rounded-2xl rounded-tl-sm bg-white/10 px-3 py-2 text-sm text-gray-100">
              Hola, soy tu asistente financiero. Puedo ayudarte a simular
              inversiones, operar en mercados (crypto, acciones o dólar) y
              revisar tu situación de créditos.
            </div>
          </div>
        )}

        {bubbles.map((bubble, index) => (
          <div
            key={index}
            className={cn("flex", bubble.role === "user" ? "justify-end" : "justify-start")}
          >
            <div
              className={cn(
                "max-w-[85%] whitespace-pre-line rounded-2xl px-3 py-2 text-sm",
                bubble.role === "user"
                  ? "rounded-br-sm bg-gradient-to-r from-pink-500 to-violet-600 text-white"
                  : "rounded-bl-sm bg-white/10 text-gray-100",
              )}
            >
              {bubble.content}
              {bubble.role === "assistant" && <StructuredPayload bubble={bubble} />}
            </div>
          </div>
        ))}

        {sending && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 rounded-2xl rounded-bl-sm bg-white/10 px-3 py-2 text-sm text-gray-400">
              <Spinner size="sm" />
              Escribiendo…
            </div>
          </div>
        )}

        <div ref={endRef} />
      </div>

      {quickOptions && quickOptions.length > 0 && (
        <div className="flex flex-wrap gap-2 border-t border-white/10 px-4 py-2">
          {quickOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => void handleSend(option)}
              disabled={sending}
              className="rounded-full border border-pink-500/30 px-3 py-1 text-xs font-medium text-pink-400 transition-colors hover:bg-pink-500/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {option}
            </button>
          ))}
        </div>
      )}

      <form
        className="flex items-center gap-2 border-t border-white/10 px-3 py-3"
        onSubmit={(event) => {
          event.preventDefault();
          void handleSend();
        }}
      >
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Escribí tu mensaje…"
          className="h-9 flex-1 rounded-lg border border-white/15 bg-white/10 px-3 text-sm text-white caret-pink-400 placeholder:text-gray-500 focus:border-pink-500/40 focus:outline-2 focus:outline-pink-500/30"
        />
        <Button type="submit" isLoading={sending} className="h-9 px-3">
          Enviar
        </Button>
      </form>

      {error && (
        <div className="border-t border-white/10 px-4 py-2 text-sm text-red-400">{error}</div>
      )}
    </div>
  );
}