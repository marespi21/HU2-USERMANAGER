"use client"; // Necesita useEffect y useState en el navegador

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import LoadingScreen from "@/components/LoadingScreen";
import type { UserSession } from "@/types/user";
import { clearSession, getSession } from "@/lib/session";

export default function DashboardPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<UserSession | null>(null);

  // Protección de ruta: solo entra si hay sesión en localStorage
  useEffect(() => {
    const sesion = getSession(); // Lee localStorage clave "user"

    if (!sesion) {
      router.replace("/login"); // Sin sesión → login
      return;
    }

    setUsuario(sesion); // Guarda datos para mostrarlos en pantalla
  }, [router]);

  // Cierra sesión: borra localStorage y va al login
  function handleLogout() {
    clearSession();
    router.push("/login");
  }

  // Mientras verifica la sesión, muestra cargando
  if (!usuario) {
    return <LoadingScreen mensaje="Verificando sesión..." />;
  }

  const esAdmin = usuario.role === "admin";

  return (
    <div className="page-bg flex min-h-full flex-1 flex-col">
      <AppHeader
        titulo="Dashboard"
        acciones={
          <button type="button" onClick={handleLogout} className="btn-danger text-sm">
            Cerrar sesión
          </button>
        }
      />

      <main className="mx-auto flex w-full max-w-lg flex-1 items-center justify-center p-6">
        <div className="glass-card animate-fade-in w-full overflow-hidden">
          {/* Color de cabecera según el rol */}
          <div
            className={`px-8 py-10 text-center ${
              esAdmin
                ? "bg-gradient-to-r from-indigo-600 to-purple-600"
                : "bg-gradient-to-r from-zinc-700 to-zinc-800"
            }`}
          >
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 text-3xl font-bold text-white backdrop-blur-sm">
              {usuario.nombre.charAt(0).toUpperCase()}
            </div>
            <h1 className="mt-4 text-2xl font-bold text-white">{usuario.nombre}</h1>
            <span
              className={`mt-2 inline-block rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-wider ${
                esAdmin ? "bg-white/20 text-white" : "bg-black/20 text-zinc-200"
              }`}
            >
              {usuario.role}
            </span>
          </div>

          {/* Información básica del usuario logueado */}
          <div className="space-y-4 p-8">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                Email
              </p>
              <p className="mt-1 text-white">{usuario.email}</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                Cédula
              </p>
              <p className="mt-1 text-white">{usuario.cc}</p>
            </div>

            {/* Solo admins ven el enlace al panel de administración */}
            {esAdmin && (
              <Link
                href="/admin/users"
                className="btn-primary flex w-full justify-center py-3"
              >
                Ir a administración de usuarios →
              </Link>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
