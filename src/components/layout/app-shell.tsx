"use client";

import type { PropsWithChildren } from "react";
import { useEffect } from "react";
import { DemoBanner } from "@/components/demo/demo-banner";
import { AppSidebar, BottomNav } from "@/components/layout/app-sidebar";
import { SessionGuard } from "@/components/session/session-guard";
import { Spinner } from "@/components/ui/spinner";
import { useHydrated } from "@/hooks/use-hydrated";
import { useDemoStore } from "@/store/use-demo-store";
import { useMobileMode } from "@/components/viewport/mobile-mode-provider";

export function AppShell({ children }: PropsWithChildren) {
  const hydrated = useHydrated();
  const mode = useDemoStore((store) => store.mode);
  const check = useDemoStore((store) => store.check);
  const { mobileMode } = useMobileMode();

  useEffect(() => {
    if (hydrated && mode === "checking") void check();
  }, [hydrated, mode, check]);

  if (!hydrated || mode === "checking") {
    return (
      <div className="flex min-h-full items-center justify-center py-24">
        <Spinner size="lg" />
      </div>
    );
  }

  const isDemo = mode === "demo";

  const body = (
    <>
      {isDemo && <DemoBanner className="mb-6" />}
      {children}
    </>
  );

  const layout = mobileMode ? (
    <div className="flex min-h-screen w-full items-center justify-center bg-neutral-200/70 p-4 dark:bg-black/50">
      <div className="relative flex h-[844px] max-h-[92vh] w-[390px] max-w-full flex-col overflow-hidden rounded-[2.75rem] border-[10px] border-neutral-900 bg-background shadow-2xl">
        <div className="pointer-events-none absolute left-1/2 top-2 z-20 h-6 w-28 -translate-x-1/2 rounded-full bg-neutral-900" />
        <div className="flex-1 overflow-y-auto">
          <main className="px-4 pb-6 pt-9">{body}</main>
        </div>
        <BottomNav />
      </div>
    </div>
  ) : (
    <div className="flex min-h-full flex-col lg:flex-row">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 lg:px-8">{body}</main>
      </div>
    </div>
  );

  if (isDemo) return layout;

  return <SessionGuard>{layout}</SessionGuard>;
}
