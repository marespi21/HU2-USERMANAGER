"use client"; // Usa hooks de React en el navegador

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import { register } from "@/services/authService"; // Envía datos a la API de registro
import { saveSession } from "@/lib/session";

export default function RegisterPage() {
  const router = useRouter();

  // Un estado por cada campo del formulario
  const [nombre, setNombre] = useState("");
  const [cc, setCc] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");

    // Validaciones antes de llamar a la API
    if (password !== confirmarPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setCargando(true);

    try {
      const usuario = await register({ nombre, cc, email, password }); // Guarda en MongoDB
      saveSession(usuario); // Entra automáticamente
      router.push("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo crear la cuenta."
      );
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="page-bg flex min-h-full flex-1 flex-col">
      <AppHeader titulo="Crear cuenta" />

      <main className="flex flex-1 items-center justify-center p-6">
        <form
          onSubmit={handleSubmit}
          className="glass-card animate-fade-in w-full max-w-md p-8"
        >
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-2xl shadow-lg shadow-indigo-500/30">
              ✨
            </div>
            <h1 className="text-2xl font-bold text-white">Crear cuenta</h1>
            <p className="mt-2 text-sm text-zinc-400">
              Regístrate para acceder al dashboard
            </p>
          </div>

          {error && <p className="alert-error mb-6">{error}</p>}

          <div className="space-y-4">
            <div>
              <label className="input-label" htmlFor="nombre">
                Nombre completo
              </label>
              <input
                id="nombre"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                placeholder="Tu nombre"
                className="input-field"
              />
            </div>

            <div>
              <label className="input-label" htmlFor="cc">
                Cédula (CC)
              </label>
              <input
                id="cc"
                type="text"
                value={cc}
                onChange={(e) => setCc(e.target.value)}
                required
                placeholder="123456789"
                className="input-field"
              />
            </div>

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
                minLength={6}
                placeholder="Mínimo 6 caracteres"
                className="input-field"
              />
            </div>

            <div>
              <label className="input-label" htmlFor="confirmar">
                Confirmar contraseña
              </label>
              <input
                id="confirmar"
                type="password"
                value={confirmarPassword}
                onChange={(e) => setConfirmarPassword(e.target.value)}
                required
                minLength={6}
                placeholder="Repite tu contraseña"
                className="input-field"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="btn-primary mt-8 w-full py-3"
          >
            {cargando ? "Creando cuenta..." : "Registrarse"}
          </button>

          <p className="mt-6 text-center text-sm text-zinc-500">
            ¿Ya tienes cuenta?{" "}
            <Link
              href="/login"
              className="font-medium text-indigo-400 hover:text-indigo-300"
            >
              Iniciar sesión
            </Link>
          </p>
        </form>
      </main>
    </div>
  );
}
