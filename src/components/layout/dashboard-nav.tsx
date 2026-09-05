"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/use-auth-store";

export function DashboardNav() {
  const router = useRouter();
  const user = useAuthStore((store) => store.user);
  const logout = useAuthStore((store) => store.logout);

  function handleLogout() {
    logout();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <span className="font-semibold text-zinc-900">Frontend App</span>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-zinc-500 sm:inline">
            {user?.email ?? user?.name}
          </span>
          <Button variant="ghost" onClick={handleLogout}>
            Cerrar sesión
          </Button>
        </div>
      </div>
    </header>
  );
}