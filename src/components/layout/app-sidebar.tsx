"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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

function ActivityIcon() {
  return (
    <svg {...iconProps} className="size-5" aria-hidden="true">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
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

function MenuIcon() {
  return (
    <svg {...iconProps} className="size-5" aria-hidden="true">
      <path d="M3 6h18" />
      <path d="M3 12h18" />
      <path d="M3 18h18" />
    </svg>
  );
}

const NAV_ITEMS = [
  { href: "/dashboard", label: "Inicio", icon: HomeIcon },
  { href: "/actividad", label: "Actividad", icon: ActivityIcon },
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

  const [menuOpen, setMenuOpen] = useState(true);

  useEffect(() => {
    if (window.localStorage.getItem("presto-sidebar") === "closed") {
      setMenuOpen(false);
    }
  }, []);

  function setOpen(next: boolean) {
    setMenuOpen(next);
    window.localStorage.setItem("presto-sidebar", next ? "open" : "closed");
  }

  function handleExit() {
    if (demoMode) disableDemo();
    else logout();
    router.push("/login");
    router.refresh();
  }

  const contact = user?.email ?? user?.name ?? "demo@presto.app";

  const desktopNav = (
    <>
      <div className="flex items-center justify-between gap-2 px-4 py-5">
        <Link href="/dashboard">
          <p className="bg-gradient-to-r from-pink-400 via-blue-400 to-indigo-400 bg-clip-text text-lg font-bold tracking-tight text-transparent">
            Presto
          </p>
        </Link>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Ocultar menú"
          title="Ocultar menú"
          className="inline-flex size-9 items-center justify-center rounded-lg text-gray-300 transition-colors hover:bg-white/10 hover:text-pink-400"
        >
          <MenuIcon />
        </button>
      </div>
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
      <aside
        className={cn(
          "sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-white/10 lg:flex",
          !menuOpen && "lg:hidden",
        )}
      >
        {desktopNav}
      </aside>

      {!menuOpen && (
        <div className="sticky top-0 hidden h-screen shrink-0 flex-col items-center border-r border-white/10 px-2 py-4 lg:flex">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Mostrar menú"
            title="Mostrar menú"
            className="inline-flex size-10 items-center justify-center rounded-lg text-gray-300 transition-colors hover:bg-white/10 hover:text-pink-400"
          >
            <MenuIcon />
          </button>
        </div>
      )}

      <div className="sticky top-0 z-20 border-b border-white/10 lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <p className="bg-gradient-to-r from-pink-400 via-blue-400 to-indigo-400 bg-clip-text font-bold tracking-tight text-transparent">
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

export function BottomNav() {
  const pathname = usePathname();

  function isActive(href: string) {
    return pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
  }

  const leftItems = NAV_ITEMS.filter((item) =>
    ["/inversiones", "/perfil"].includes(item.href),
  );
  const rightItems = NAV_ITEMS.filter((item) =>
    ["/actividad", "/creditos"].includes(item.href),
  );
  const homeItem = NAV_ITEMS.find((item) => item.href === "/dashboard");

  function renderItem({ href, label, icon: Icon }: (typeof NAV_ITEMS)[number]) {
    const active = isActive(href);
    return (
      <li key={href} className="min-w-0 flex-1">
        <Link
          href={href}
          aria-current={active ? "page" : undefined}
          className={cn(
            "flex flex-col items-center gap-1 rounded-lg px-0.5 py-1.5 text-[10px] font-medium leading-none transition-colors",
            active ? "text-brand-coral" : "text-gray-400 hover:text-brand-coral",
          )}
        >
          <Icon />
          <span className="max-w-full truncate">{label}</span>
        </Link>
      </li>
    );
  }

  return (
    <nav className="shrink-0 border-t border-white/10 bg-surface/95 backdrop-blur">
      <ul className="flex items-center justify-around px-1 py-2">
        {leftItems.map(renderItem)}

        {homeItem && (
          <li className="min-w-0 flex-1">
            <Link
              href={homeItem.href}
              aria-current={isActive(homeItem.href) ? "page" : undefined}
              className="flex flex-col items-center gap-1"
            >
              <span
                className={cn(
                  "flex size-11 items-center justify-center rounded-full text-white shadow-lg shadow-brand-coral/30 transition-colors",
                  isActive(homeItem.href)
                    ? "bg-brand-coral"
                    : "bg-brand-coral/75 hover:bg-brand-coral",
                )}
              >
                <homeItem.icon />
              </span>
              <span
                className={cn(
                  "max-w-full truncate text-[10px] font-semibold leading-none",
                  isActive(homeItem.href) ? "text-brand-coral" : "text-gray-300",
                )}
              >
                {homeItem.label}
              </span>
            </Link>
          </li>
        )}

        {rightItems.map(renderItem)}
      </ul>
    </nav>
  );
}