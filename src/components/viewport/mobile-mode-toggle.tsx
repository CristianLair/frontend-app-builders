"use client";

import { useMobileMode } from "@/components/viewport/mobile-mode-provider";

export function MobileModeToggle() {
  const { mobileMode, toggleMobileMode } = useMobileMode();

  return (
    <button
      type="button"
      onClick={toggleMobileMode}
      aria-pressed={mobileMode}
      aria-label={mobileMode ? "Salir del modo celular" : "Activar modo celular"}
      title={mobileMode ? "Salir del modo celular" : "Modo celular (iPhone)"}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-foreground transition-colors hover:bg-surface-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="6" y="2" width="12" height="20" rx="3" />
        <path d="M11 18h2" />
      </svg>
    </button>
  );
}
