"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { isApiError } from "@/lib/api/error";
import { useAuthStore } from "@/store/use-auth-store";
import { useDemoStore } from "@/store/use-demo-store";

export function LoginForm() {
  const router = useRouter();
  const login = useAuthStore((store) => store.login);
  const enableDemo = useDemoStore((store) => store.enableDemo);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login({ email, password });
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(isApiError(err) ? err.message : "Ocurrió un error inesperado");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleDemo() {
    enableDemo();
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <Card>
      <div className="mb-6 space-y-1">
        <h1 className="bg-gradient-to-r from-pink-400 via-blue-400 to-indigo-400 bg-clip-text text-xl font-semibold text-transparent">Iniciar sesión</h1>
        <p className="text-sm text-gray-400">Accede con tu cuenta para continuar</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Alert variant="error">{error}</Alert>}
        <Input
          label="Correo electrónico"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="tu@email.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <Input
          label="Contraseña"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <Button type="submit" isLoading={isSubmitting} className="w-full">
          Ingresar
        </Button>
      </form>
      <div className="mt-4 flex items-center justify-between text-sm">
        <Link href="/register" className="text-pink-400 hover:text-pink-300">
          Crear cuenta
        </Link>
        <Link href="/forgot-password" className="text-gray-400 hover:text-pink-400">
          ¿Olvidaste tu contraseña?
        </Link>
      </div>
      <div className="mt-6 border-t border-white/10 pt-4 text-center">
        <button
          type="button"
          onClick={handleDemo}
          className="text-sm font-medium text-pink-400 hover:text-pink-300"
        >
          Explorar el modo demo sin backend →
        </button>
      </div>
      <p className="mt-3 text-center text-xs text-gray-500">
        <Link href="/presentacion" className="hover:text-pink-400">
          Ver la presentación para inversores →
        </Link>
      </p>
    </Card>
  );
}