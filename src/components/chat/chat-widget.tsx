"use client";

import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useHydrated } from "@/hooks/use-hydrated";
import { chatApi } from "@/lib/api/chat";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/use-auth-store";

interface Bubble {
  role: "user" | "assistant";
  content: string;
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
      setBubbles((previous) => [...previous, { role: "assistant", content: data.reply }]);
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
              Hola, soy tu asistente financiero. Puedo ayudarte a simular inversiones
              y a revisar tu situación de créditos.
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