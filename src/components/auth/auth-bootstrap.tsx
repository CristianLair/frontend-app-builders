"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/use-auth-store";

/**
 * Resuelve el estado de sesión apenas la app se monta en el cliente:
 * - Si hay un token guardado, lo valida con el backend (fetchMe).
 * - Si no hay token, marca la sesión como "unauthenticated".
 *
 * Sin esto, el `status` del store se queda en "idle" y las pantallas que
 * dependen de la sesión muestran un spinner de forma indefinida.
 */
export function AuthBootstrap() {
  useEffect(() => {
    const bootstrap = () => useAuthStore.getState().bootstrap();
    const unsubscribe = useAuthStore.persist.onFinishHydration(bootstrap);
    bootstrap();
    return unsubscribe;
  }, []);

  return null;
}
