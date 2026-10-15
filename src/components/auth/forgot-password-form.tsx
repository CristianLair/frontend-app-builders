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
        <h1 className="bg-gradient-to-r from-pink-400 via-blue-400 to-indigo-400 bg-clip-text text-xl font-semibold text-transparent">Recuperar contraseña</h1>
        <p className="text-sm text-gray-400">
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
      <p className="mt-4 text-center text-sm text-gray-400">
        <Link href="/login" className="text-pink-400 hover:text-pink-300">
          Volver a iniciar sesión
        </Link>
      </p>
    </Card>
  );
}