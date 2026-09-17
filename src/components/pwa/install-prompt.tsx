"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export function InstallPrompt() {
  const [hint, setHint] = useState<"installable" | "ios" | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const deferred = useRef<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const smallScreen = window.innerWidth <= 768;
    const isMobile = coarsePointer || smallScreen;
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true;

    if (!isMobile || standalone) return;

    const isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
      !(window as Window & { MSStream?: unknown }).MSStream;

    function onPrompt(event: Event) {
      event.preventDefault();
      deferred.current = event as BeforeInstallPromptEvent;
      setHint((current) => current ?? "installable");
    }

    function onInstalled() {
      setDismissed(true);
      setHint(null);
    }

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);

    if (isIOS) {
      const timer = window.setTimeout(() => {
        setHint((current) => current ?? "ios");
      }, 2500);
      return () => {
        window.clearTimeout(timer);
        window.removeEventListener("beforeinstallprompt", onPrompt);
        window.removeEventListener("appinstalled", onInstalled);
      };
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (dismissed || !hint) return null;

  async function install() {
    try {
      await deferred.current?.prompt();
      await deferred.current?.userChoice;
      setDismissed(true);
      setHint(null);
    } catch {
      setDismissed(true);
    }
  }

  return (
    <div className="fixed inset-x-4 bottom-4 z-[60] mx-auto max-w-sm">
      <div className="flex items-center gap-4 rounded-2xl border border-white/15 bg-[#1b0f3f]/95 p-4 shadow-2xl shadow-purple-950/50 backdrop-blur">
        <Image
          src="/icons/icon-192.png"
          alt="Presto"
          width={48}
          height={48}
          className="size-12 shrink-0 rounded-2xl"
        />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-white">Instalá Presto</p>
          {hint === "ios" ? (
            <p className="text-xs text-gray-300">
              En Safari, tocá <span className="text-pink-300">Compartir</span> →{" "}
              <span className="text-pink-300">Añadir a pantalla de inicio</span>.
            </p>
          ) : (
            <p className="text-xs text-gray-300">
              Tené la app en tu teléfono, accesible como una app nativa.
            </p>
          )}
        </div>
        {hint === "installable" ? (
          <Button onClick={() => void install()} className="h-9 shrink-0 px-3">
            Instalar
          </Button>
        ) : (
          <Button variant="secondary" onClick={() => setDismissed(true)} className="h-9 shrink-0 px-3">
            Entendido
          </Button>
        )}
        <button
          type="button"
          aria-label="Cerrar"
          onClick={() => setDismissed(true)}
          className="absolute -right-2 -top-2 flex size-6 items-center justify-center rounded-full border border-white/15 bg-[#1b0f3f] text-gray-400 transition-colors hover:text-white"
        >
          ✕
        </button>
      </div>
    </div>
  );
}