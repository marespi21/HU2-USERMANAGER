"use client"; // Esta página usa hooks (useState, useRouter), por eso va en el cliente

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation"; // Para redirigir a otras páginas
import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import { login } from "@/services/authService"; // Capa de servicios (no fetch directo)
import { saveSession } from "@/lib/session"; // Guarda usuario en localStorage

export default function LoginPage() {
  const router = useRouter();

  // Estados del formulario y mensajes
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  // Se ejecuta al presionar "Iniciar sesión"
  async function handleSubmit(event: FormEvent) {
    event.preventDefault(); // Evita que la página se recargue
    setError("");
    setCargando(true);

    try {
      const usuario = await login(email, password); // Valida contra MongoDB
      saveSession(usuario); // Guarda en localStorage con clave "user"
      router.push("/dashboard"); // Redirige al dashboard
    } catch {
      setError("Email o contraseña incorrectos.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="page-bg flex min-h-full flex-1 flex-col">
      <AppHeader titulo="Iniciar sesión" />

      <main className="flex flex-1 items-center justify-center p-6">
        <form
          onSubmit={handleSubmit}
          className="glass-card animate-fade-in w-full max-w-md p-8"
        >
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-2xl shadow-lg shadow-indigo-500/30">
              👋
            </div>
            <h1 className="text-2xl font-bold text-white">Bienvenido</h1>
            <p className="mt-2 text-sm text-zinc-400">
              Ingresa tus credenciales para continuar
            </p>
          </div>

          {/* Muestra error si el login falla */}
          {error && <p className="alert-error mb-6">{error}</p>}

          <div className="space-y-5">
            <div>
              <label className="input-label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="tu@email.com"
                className="input-field"
              />
            </div>

            <div>
              <label className="input-label" htmlFor="password">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="input-field"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="btn-primary mt-8 w-full py-3"
          >
            {cargando ? "Iniciando sesión..." : "Iniciar sesión"}
          </button>

          <p className="mt-6 text-center text-sm text-zinc-500">
            ¿No tienes cuenta?{" "}
            <Link
              href="/register"
              className="font-medium text-indigo-400 hover:text-indigo-300"
            >
              Regístrate aquí
            </Link>
          </p>

          <p className="mt-3 text-center text-sm text-zinc-500">
            <Link href="/" className="text-zinc-400 hover:text-zinc-300">
              ← Volver al inicio
            </Link>
          </p>
        </form>
      </main>
    </div>
  );
}
