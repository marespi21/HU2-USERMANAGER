import Link from "next/link";
import AppHeader from "@/components/AppHeader";

export default function Home() {
  return (
    <div className="page-bg flex min-h-full flex-1 flex-col">
      <AppHeader />

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-6 py-16">
        <div className="animate-fade-in text-center">
          <span className="mb-6 inline-block rounded-full border border-indigo-400/30 bg-indigo-500/10 px-4 py-1.5 text-sm font-medium text-indigo-300">
            Gestión de usuarios con Next.js
          </span>

          <h1 className="bg-gradient-to-r from-white via-indigo-100 to-purple-200 bg-clip-text text-5xl font-bold tracking-tight text-transparent sm:text-6xl">
            User Manager
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg text-zinc-400">
            Administra usuarios, roles y accesos con autenticación segura.
            Login, dashboard protegido y panel de administración.
          </p>

          <nav className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/login" className="btn-primary w-full px-8 py-3 sm:w-auto">
              Iniciar sesión
            </Link>
            <Link href="/register" className="btn-secondary w-full px-8 py-3 sm:w-auto">
              Crear cuenta
            </Link>
            <Link href="/dashboard" className="btn-secondary w-full px-8 py-3 sm:w-auto">
              Dashboard
            </Link>
            <Link
              href="/admin/users"
              className="btn-secondary w-full border-indigo-400/30 bg-indigo-500/10 px-8 py-3 text-indigo-200 sm:w-auto"
            >
              Admin usuarios
            </Link>
          </nav>
        </div>

        <section className="mt-20 grid w-full gap-4 sm:grid-cols-3">
          {[
            {
              icon: "🔐",
              titulo: "Autenticación",
              texto: "Login seguro con bcrypt y sesión en localStorage.",
            },
            {
              icon: "👥",
              titulo: "CRUD completo",
              texto: "Crea, edita y elimina usuarios desde el panel admin.",
            },
            {
              icon: "✉️",
              titulo: "Email de bienvenida",
              texto: "Correo automático al registrar un usuario nuevo.",
            },
          ].map((item) => (
            <div key={item.titulo} className="glass-card animate-fade-in p-6">
              <span className="text-2xl">{item.icon}</span>
              <h2 className="mt-3 font-semibold text-white">{item.titulo}</h2>
              <p className="mt-2 text-sm text-zinc-400">{item.texto}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
