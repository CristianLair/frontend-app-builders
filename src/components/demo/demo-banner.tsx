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
      <strong>Modo presentación.</strong> Estás viendo la app con datos de ejemplo, sin
      necesidad de backend: la arquitectura real corre sobre microservicios detrás de un
      API Gateway.
    </Alert>
  );
}