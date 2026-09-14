"use client";

import type { HTMLAttributes } from "react";
import { Alert } from "@/components/ui/alert";

export function DemoBanner({ ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <Alert
      variant="info"
      className="border-pink-500/30 bg-pink-500/10 text-pink-100"
      {...props}
    >
      <strong>Modo demo.</strong> Estás viendo datos de ejemplo: el backend no está
      disponible. Levantá los microservicios y el api-gateway, e iniciá sesión, para
      ver tu información real.
    </Alert>
  );
}