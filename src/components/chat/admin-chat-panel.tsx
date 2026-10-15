"use client";

import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { chatApi } from "@/lib/api/chat";
import { isApiError } from "@/lib/api/error";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "¿Cómo viene el negocio este mes?",
  "Resumime las transacciones de hoy",
  "¿Quiénes tienen créditos vencidos?",
];

interface AdminChatPanelProps {
  className?: string;
  onClose?: () => void;
}

export function AdminChatPanel({ className, onClose }: AdminChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [quickOptions, setQuickOptions] = useState<string[] | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, sending]);

  async function handleSend(raw?: string) {
    const text = (raw ?? input).trim();
    if (!text || sending) return;

    setInput("");
    setError(null);
    setMessages((previous) => [...previous, { role: "user", content: text }]);
    setSending(true);

    try {
      const { data } = await chatApi.send(text, conversationId ?? undefined);
      setMessages((previous) => [...previous, { role: "assistant", content: data.reply }]);
      setQuickOptions(data.options ?? null);
      if (data.conversation_id) setConversationId(data.conversation_id);
    } catch (caught) {
      setError(
        isApiError(caught)
          ? caught.message
          : "No pude obtener respuesta del asistente. Intentá de nuevo.",
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-3xl border border-border bg-panel shadow-2xl shadow-black/20",
        className,
      )}
    >
      <div className="on-dark relative flex items-center justify-between gap-3 bg-gradient-to-r from-[#0b1f3a] via-[#142e52] to-[#0b1f3a] px-4 py-3.5">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-coral/20 text-brand-coral">
            <SparkIcon className="size-5" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">Asistente IA</p>
            <p className="flex items-center gap-1.5 text-xs text-white/60">
              <span className="inline-block size-1.5 rounded-full bg-emerald-400" />
              Solo administrador
            </p>
          </div>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar asistente"
            title="Cerrar asistente"
            className="inline-flex size-8 shrink-0 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
          >
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.length === 0 && (
          <div className="space-y-3">
            <div className="max-w-[92%] whitespace-pre-line rounded-2xl rounded-tl-sm border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground">
              Hola. Soy el asistente de IA de Presto, con acceso de solo lectura a
              los datos de la plataforma. Preguntame lo que necesites.
            </div>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => void handleSend(suggestion)}
                  disabled={sending}
                  className="rounded-full border border-brand-coral/40 bg-brand-coral/10 px-3 py-1.5 text-xs font-medium text-brand-coral transition-colors hover:bg-brand-coral/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}
          >
            <div
              className={cn(
                "max-w-[88%] whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-sm",
                message.role === "user"
                  ? "rounded-br-sm bg-brand-coral text-white"
                  : "rounded-bl-sm border border-border bg-surface text-foreground",
              )}
            >
              {message.content}
            </div>
          </div>
        ))}

        {sending && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 rounded-2xl rounded-bl-sm border border-border bg-surface px-3.5 py-2.5 text-sm text-muted">
              <Spinner size="sm" />
              Escribiendo…
            </div>
          </div>
        )}

        <div ref={endRef} />
      </div>

      {quickOptions && quickOptions.length > 0 && (
        <div className="flex flex-wrap gap-2 border-t border-border px-4 py-2.5">
          {quickOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => void handleSend(option)}
              disabled={sending}
              className="rounded-full border border-brand-coral/40 px-3 py-1 text-xs font-medium text-brand-coral transition-colors hover:bg-brand-coral/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {option}
            </button>
          ))}
        </div>
      )}

      {error && (
        <div className="border-t border-border bg-red-500/10 px-4 py-2 text-xs text-red-400">
          {error}
        </div>
      )}

      <form
        className="flex items-center gap-2 border-t border-border px-3 py-3"
        onSubmit={(event) => {
          event.preventDefault();
          void handleSend();
        }}
      >
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Escribí tu mensaje…"
          aria-label="Mensaje para el asistente"
          className="h-10 flex-1 rounded-xl border border-border bg-surface px-3 text-sm text-foreground outline-none placeholder:text-muted-soft focus:border-brand-coral"
        />
        <Button type="submit" isLoading={sending} className="h-10 px-4">
          Enviar
        </Button>
      </form>
    </div>
  );
}

function SparkIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
      <path d="m6.3 6.3 2.4 2.4M15.3 15.3l2.4 2.4M17.7 6.3l-2.4 2.4M8.7 15.3l-2.4 2.4" />
    </svg>
  );
}
