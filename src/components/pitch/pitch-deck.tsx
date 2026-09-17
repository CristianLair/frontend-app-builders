"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { SLIDES } from "@/components/pitch/slides";
import type { SlideProps } from "@/components/pitch/slides";
import { cn } from "@/lib/utils";

const KEY_BLOCKLIST = ["INPUT", "TEXTAREA", "SELECT"];

function PrevIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4" aria-hidden="true">
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function NextIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4" aria-hidden="true">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

export function PitchDeck() {
  const [index, setIndex] = useState(0);
  const total = SLIDES.length;

  const go = useCallback(
    (next: number) => setIndex(Math.min(total - 1, Math.max(0, next))),
    [total],
  );
  const next = useCallback(() => go(index + 1), [go, index]);
  const prev = useCallback(() => go(index - 1), [go, index]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (target && KEY_BLOCKLIST.includes(target.tagName)) return;
      if (event.key === "ArrowRight") go(index + 1);
      if (event.key === "ArrowLeft") go(index - 1);
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, index]);

  const slide = SLIDES[index];
  const slideProps = useMemo<SlideProps>(
    () => ({ go, next }),
    [go, next],
  );

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0f0728]/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-3">
          <p className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-base font-bold tracking-tight text-transparent">
            Presto
          </p>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-gray-300 transition-colors hover:border-pink-500/40 hover:text-white"
            >
              Abrir la app
            </Link>
            <span className="hidden rounded-full border border-pink-500/30 bg-pink-500/10 px-3 py-1 text-xs font-semibold text-pink-400 sm:block">
              Presentación · {slide.label}
            </span>
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col justify-center py-6">
        <div key={index} className="deck-slide">
          {slide.render(slideProps)}
        </div>
      </main>

      <footer className="sticky bottom-0 z-40 border-t border-white/10 bg-[#0f0728]/80 backdrop-blur">
        <div className="mx-auto w-full max-w-6xl px-6 py-3">
          <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-pink-500 to-violet-500 transition-all duration-300"
              style={{ width: `${((index + 1) / total) * 100}%` }}
            />
          </div>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={prev}
              disabled={index === 0}
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-white/10 px-3 text-sm font-medium text-white transition-colors hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <PrevIcon />
              Anterior
            </button>

            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {SLIDES.map((item, i) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Ir a ${item.label}`}
                  title={item.label}
                  className={cn(
                    "h-2 rounded-full transition-all",
                    i === index
                      ? "w-6 bg-gradient-to-r from-pink-500 to-violet-500"
                      : "w-2 bg-white/20 hover:bg-white/40",
                  )}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={next}
              disabled={index === total - 1}
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-pink-500 to-violet-600 px-3 text-sm font-medium text-white shadow-lg shadow-pink-500/20 transition-all hover:from-pink-400 hover:to-violet-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Siguiente
              <NextIcon />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}