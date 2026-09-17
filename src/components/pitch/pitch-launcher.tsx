"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useDemoStore } from "@/store/use-demo-store";
import { cn } from "@/lib/utils";

type DemoModule = "dashboard" | "transferencias" | "creditos" | "inversiones" | "perfil";

const ROUTES: Record<DemoModule, string> = {
  dashboard: "/dashboard",
  transferencias: "/transferencias",
  creditos: "/creditos",
  inversiones: "/inversiones",
  perfil: "/perfil",
};

const ACCENTS: Record<DemoModule, string> = {
  dashboard: "from-violet-500 to-indigo-600",
  transferencias: "from-sky-500 to-indigo-600",
  creditos: "from-amber-500 to-orange-600",
  inversiones: "from-pink-500 to-violet-600",
  perfil: "from-teal-500 to-emerald-600",
};

interface PitchLauncherProps {
  module: DemoModule;
  title: string;
  description: string;
}

export function PitchLauncher({ module, title, description }: PitchLauncherProps) {
  const router = useRouter();
  const enableDemo = useDemoStore((store) => store.enableDemo);

  function launch() {
    enableDemo();
    router.push(ROUTES[module]);
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={launch}
      className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 text-left transition-all hover:border-pink-500/40 hover:bg-white/10"
    >
      <span
        className={cn(
          "flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-lg font-bold text-white",
          ACCENTS[module],
        )}
      >
        {title.slice(0, 1)}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-semibold text-white">{title}</span>
        <span className="block text-sm text-gray-400">{description}</span>
      </span>
      <span className="text-sm font-medium text-pink-400 opacity-0 transition-opacity group-hover:opacity-100">
        Probar →
      </span>
    </button>
  );
}

export function PitchLauncherLine({ module, title, description }: PitchLauncherProps) {
  const router = useRouter();
  const enableDemo = useDemoStore((store) => store.enableDemo);

  function launch() {
    enableDemo();
    router.push(ROUTES[module]);
    router.refresh();
  }

  return (
    <Button onClick={launch} variant="secondary" className="h-9">
      <span>{title}</span>
      <span className="text-xs text-gray-400">· {description}</span>
    </Button>
  );
}