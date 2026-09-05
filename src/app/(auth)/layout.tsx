"use client";

import type { PropsWithChildren } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { useHydrated } from "@/hooks/use-hydrated";
import { useAuthStore } from "@/store/use-auth-store";

export default function AuthLayout({ children }: PropsWithChildren) {
  const router = useRouter();
  const hydrated = useHydrated();
  const status = useAuthStore((store) => store.status);

  useEffect(() => {
    if (hydrated && status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [hydrated, status, router]);

  if (!hydrated || status === "loading") {
    return (
      <div className="flex flex-1 items-center justify-center py-24">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <main className="flex flex-1 items-center justify-center p-4">
      <div className="w-full max-w-md">{children}</div>
    </main>
  );
}