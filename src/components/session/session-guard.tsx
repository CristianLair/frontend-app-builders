"use client";

import { type PropsWithChildren, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { useHydrated } from "@/hooks/use-hydrated";
import { useAuthStore } from "@/store/use-auth-store";

export function SessionGuard({ children }: PropsWithChildren) {
  const router = useRouter();
  const hydrated = useHydrated();
  const status = useAuthStore((store) => store.status);

  useEffect(() => {
    if (hydrated && status === "unauthenticated") {
      router.replace("/login");
    }
  }, [hydrated, status, router]);

  if (!hydrated) {
    return (
      <div className="flex flex-1 items-center justify-center py-24">
        <Spinner size="lg" />
      </div>
    );
  }

  if (status !== "authenticated") {
    return (
      <div className="flex flex-1 items-center justify-center py-24">
        <Spinner size="lg" />
      </div>
    );
  }

  return <>{children}</>;
}