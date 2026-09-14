"use client";

import type { PropsWithChildren } from "react";
import { useEffect } from "react";
import { ChatWidget } from "@/components/chat/chat-widget";
import { DemoBanner } from "@/components/demo/demo-banner";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SessionGuard } from "@/components/session/session-guard";
import { Spinner } from "@/components/ui/spinner";
import { useHydrated } from "@/hooks/use-hydrated";
import { useDemoStore } from "@/store/use-demo-store";

export function AppShell({ children }: PropsWithChildren) {
  const hydrated = useHydrated();
  const mode = useDemoStore((store) => store.mode);
  const check = useDemoStore((store) => store.check);

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

  if (mode === "demo") {
    return (
      <div className="flex min-h-full">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 lg:px-8">
            <DemoBanner className="mb-6" />
            {children}
          </main>
        </div>
      </div>
    );
  }

  return (
    <SessionGuard>
      <div className="flex min-h-full">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 lg:px-8">{children}</main>
        </div>
        <ChatWidget />
      </div>
    </SessionGuard>
  );
}