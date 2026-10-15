"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";

const ACTIONS = [
  {
    href: "/transferencias",
    title: "Transferir",
    description: "Enviá o recibí dinero",
  },
  {
    href: "/creditos",
    title: "Pedir crédito",
    description: "Solicitá un préstamo en cuotas",
  },
  {
    href: "/inversiones",
    title: "Invertir",
    description: "Hacé crecer tu dinero",
  },
  {
    href: "/perfil",
    title: "Mi perfil",
    description: "Datos y tarjeta",
  },
] as const;

export function QuickActions() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {ACTIONS.map((action) => (
        <Link key={action.href} href={action.href} className="group">
          <Card className="h-full transition-all group-hover:border-brand-coral/30 group-hover:shadow-lg group-hover:shadow-brand-coral/10">
            <p className="text-sm font-semibold text-foreground">{action.title}</p>
            <p className="mt-1 text-xs text-muted-soft">{action.description}</p>
          </Card>
        </Link>
      ))}
    </div>
  );
}