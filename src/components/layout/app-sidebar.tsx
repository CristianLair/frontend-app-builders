"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/use-auth-store";
import { useDemoStore } from "@/store/use-demo-store";

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

function HomeIcon() {
  return (
    <svg {...iconProps} className="size-5" aria-hidden="true">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <path d="M9 22V12h6v10" />
    </svg>
  );
}

function SwapIcon() {
  return (
    <svg {...iconProps} className="size-5" aria-hidden="true">
      <path d="M17 1l4 4-4 4" />
      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <path d="M7 23l-4-4 4-4" />
      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </svg>
  );
}

function CreditCardIcon() {
  return (
    <svg {...iconProps} className="size-5" aria-hidden="true">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
    </svg>
  );
}

function TrendingIcon() {
  return (
    <svg {...iconProps} className="size-5" aria-hidden="true">
      <path d="m23 6-9.5 9.5-5-5L1 18" />
      <path d="M17 6h6v6" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg {...iconProps} className="size-5" aria-hidden="true">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function LogOutIcon() {
  return (
    <svg {...iconProps} className="size-4" aria-hidden="true">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="m16 17 5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  );
}

const NAV_ITEMS = [
  { href: "/dashboard", label: "Inicio", icon: HomeIcon },
  { href: "/transferencias", label: "Transferencias", icon: SwapIcon },
  { href: "/creditos", label: "Créditos", icon: CreditCardIcon },
  { href: "/inversiones", label: "Inversiones", icon: TrendingIcon },
  { href: "/perfil", label: "Perfil", icon: UserIcon },
] as const;

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((store) => store.user);
  const logout = useAuthStore((store) => store.logout);
  const demoMode = useDemoStore((store) => store.mode) === "demo";
  const disableDemo = useDemoStore((store) => store.disableDemo);

  function handleExit() {
    if (demoMode) disableDemo();
    else logout();
    router.push("/login");
    router.refresh();
  }

  const contact = user?.email ?? user?.name ?? "demo@presto.app";

  const desktopNav = (
    <>
      <Link href="/dashboard" className="px-4 py-5">
        <p className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-lg font-bold tracking-tight text-transparent">
          Presto
        </p>
      </Link>
      <nav className="flex flex-1 flex-col gap-1 px-3">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-white/10 text-pink-400"
                  : "text-gray-300 hover:bg-white/10 hover:text-pink-400",
              )}
            >
              <Icon />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="space-y-3 border-t border-white/10 p-4">
        <div className="flex items-center gap-2">
          {demoMode && (
            <span className="rounded-full bg-pink-500/20 px-2.5 py-0.5 text-xs font-medium text-pink-400">
              Modo demo
            </span>
          )}
          <p className="truncate text-sm text-gray-400">{contact}</p>
        </div>
        <button
          type="button"
          onClick={handleExit}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-white/10 hover:text-pink-400"
        >
          <LogOutIcon />
          {demoMode ? "Salir del demo" : "Cerrar sesión"}
        </button>
      </div>
    </>
  );

  return (
    <>
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-white/10 lg:flex">
        {desktopNav}
      </aside>

      <div className="sticky top-0 z-20 border-b border-white/10 lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <p className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text font-bold tracking-tight text-transparent">
            Presto
          </p>
          <div className="flex items-center gap-3">
            {demoMode && (
              <span className="rounded-full bg-pink-500/20 px-2.5 py-0.5 text-xs font-medium text-pink-400">
                Modo demo
              </span>
            )}
            <button
              type="button"
              onClick={handleExit}
              className="flex items-center gap-1.5 text-sm text-gray-300 hover:text-pink-400"
            >
              <LogOutIcon />
              Salir
            </button>
          </div>
        </div>
        <nav className="flex gap-2 overflow-x-auto px-4 pb-3">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  active
                    ? "border-pink-500/40 bg-white/10 text-pink-400"
                    : "border-white/10 text-gray-300 hover:bg-white/10 hover:text-pink-400",
                )}
              >
                <Icon />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}