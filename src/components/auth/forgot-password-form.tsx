"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { authApi } from "@/lib/api/auth";
import { isApiError } from "@/lib/api/error";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setIsSubmitting(true);
    try {
      const { data } = await authApi.forgotPassword({ email });
      setMessage(data.message ?? "Si el correo existe, recibirás instrucciones para restablecer tu contraseña.");
    } catch (err) {
      setError(isApiError(err) ? err.message : "Ocurrió un error inesperado");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <div className="mb-6 space-y-1">
        <h1 className="text-xl font-semibold text-zinc-900">Recuperar contraseña</h1>
        <p className="text-sm text-zinc-500">
          Ingresa tu correo y te enviaremos un enlace para restablecerla
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Alert variant="error">{error}</Alert>}
        {message && <Alert variant="success">{message}</Alert>}
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
        <Button type="submit" isLoading={isSubmitting} className="w-full">
          Enviar enlace
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-zinc-500">
        <Link href="/login" className="text-emerald-600 hover:text-emerald-700">
          Volver a iniciar sesión
        </Link>
      </p>
    </Card>
  );
}