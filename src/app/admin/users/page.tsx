"use client"; // Usa useEffect, useState y useRouter

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import LoadingScreen from "@/components/LoadingScreen";
import UserCard from "@/components/UserCard";
import { getSession } from "@/lib/session";
import type { UserFormData, UserRole } from "@/types/user";
import {
  createUser,
  deleteUser,
  getUsers,
  updateUser,
  type UserPublic,
} from "@/services/userService";

// Valores iniciales del formulario de crear usuario
const formularioVacio: UserFormData = {
  nombre: "",
  cc: "",
  email: "",
  password: "",
  role: "user",
};

export default function AdminUsersPage() {
  const router = useRouter();
  const [usuarios, setUsuarios] = useState<UserPublic[]>([]);
  const [formulario, setFormulario] = useState<UserFormData>(formularioVacio);
  const [editandoId, setEditandoId] = useState<string | null>(null); // null = crear, id = editar
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [listo, setListo] = useState(false);

  // Protección: solo admins pueden ver esta página
  useEffect(() => {
    const sesion = getSession();

    if (!sesion) {
      router.replace("/login");
      return;
    }

    if (sesion.role !== "admin") {
      router.replace("/dashboard"); // User normal no puede entrar
      return;
    }

    cargarUsuarios();
  }, [router]);

  // Trae la lista de usuarios desde la API
  async function cargarUsuarios() {
    try {
      const lista = await getUsers();
      setUsuarios(lista);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar");
    } finally {
      setListo(true);
    }
  }

  function resetFormulario() {
    setFormulario(formularioVacio);
    setEditandoId(null);
  }

  // Crear o editar usuario según editandoId
  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setMensaje("");

    try {
      if (editandoId) {
        await updateUser(editandoId, formulario); // PUT
        setMensaje("Usuario actualizado correctamente");
      } else {
        await createUser(formulario); // POST
        setMensaje("Usuario creado (se envió email si está configurado)");
      }

      resetFormulario();
      await cargarUsuarios(); // Refresca la lista
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error en la operación");
    }
  }

  // Carga datos del usuario en el formulario para editar
  function handleEdit(usuario: UserPublic) {
    setEditandoId(usuario._id);
    setFormulario({
      nombre: usuario.nombre,
      cc: usuario.cc,
      email: usuario.email,
      password: "", // Contraseña vacía = no cambiar
      role: usuario.role,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Pide confirmación antes de eliminar
  async function handleDelete(id: string) {
    const confirmar = window.confirm("¿Eliminar este usuario?");
    if (!confirmar) return;

    try {
      await deleteUser(id); // DELETE
      setMensaje("Usuario eliminado");
      await cargarUsuarios();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al eliminar");
    }
  }

  if (!listo) {
    return <LoadingScreen mensaje="Cargando usuarios..." />;
  }

  const totalAdmins = usuarios.filter((u) => u.role === "admin").length;
  const totalUsers = usuarios.filter((u) => u.role === "user").length;

  return (
    <div className="page-bg flex min-h-full flex-1 flex-col">
      <AppHeader
        titulo="Administración"
        acciones={
          <Link href="/dashboard" className="btn-secondary text-sm">
            ← Dashboard
          </Link>
        }
      />

      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-8">
        <div className="animate-fade-in mb-8">
          <h1 className="text-3xl font-bold text-white">Usuarios</h1>
          <p className="mt-2 text-zinc-400">
            Gestiona el acceso y los permisos de la plataforma
          </p>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="glass-card p-5">
            <p className="text-sm text-zinc-400">Total</p>
            <p className="mt-1 text-3xl font-bold text-white">{usuarios.length}</p>
          </div>
          <div className="glass-card p-5">
            <p className="text-sm text-zinc-400">Administradores</p>
            <p className="mt-1 text-3xl font-bold text-indigo-300">{totalAdmins}</p>
          </div>
          <div className="glass-card p-5">
            <p className="text-sm text-zinc-400">Usuarios</p>
            <p className="mt-1 text-3xl font-bold text-zinc-300">{totalUsers}</p>
          </div>
        </div>

        {mensaje && <p className="alert-success mb-6">{mensaje}</p>}
        {error && <p className="alert-error mb-6">{error}</p>}

        {/* Formulario crear / editar */}
        <form onSubmit={handleSubmit} className="glass-card mb-10 p-6 sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <span className="text-2xl">{editandoId ? "✏️" : "➕"}</span>
            <h2 className="text-xl font-semibold text-white">
              {editandoId ? "Editar usuario" : "Crear usuario"}
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="input-label">Nombre</label>
              <input
                placeholder="Nombre completo"
                value={formulario.nombre}
                onChange={(e) =>
                  setFormulario({ ...formulario, nombre: e.target.value })
                }
                required
                className="input-field"
              />
            </div>
            <div>
              <label className="input-label">Cédula (CC)</label>
              <input
                placeholder="123456789"
                value={formulario.cc}
                onChange={(e) =>
                  setFormulario({ ...formulario, cc: e.target.value })
                }
                required
                className="input-field"
              />
            </div>
            <div>
              <label className="input-label">Email</label>
              <input
                type="email"
                placeholder="correo@ejemplo.com"
                value={formulario.email}
                onChange={(e) =>
                  setFormulario({ ...formulario, email: e.target.value })
                }
                required
                className="input-field"
              />
            </div>
            <div>
              <label className="input-label">Contraseña</label>
              <input
                type="password"
                placeholder={
                  editandoId ? "Nueva contraseña (opcional)" : "Contraseña"
                }
                value={formulario.password}
                onChange={(e) =>
                  setFormulario({ ...formulario, password: e.target.value })
                }
                required={!editandoId}
                className="input-field"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="input-label">Rol</label>
              <select
                value={formulario.role}
                onChange={(e) =>
                  setFormulario({
                    ...formulario,
                    role: e.target.value as UserRole,
                  })
                }
                className="input-field"
              >
                <option value="user">user</option>
                <option value="admin">admin</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button type="submit" className="btn-primary">
              {editandoId ? "Guardar cambios" : "Crear usuario"}
            </button>
            {editandoId && (
              <button
                type="button"
                onClick={resetFormulario}
                className="btn-secondary"
              >
                Cancelar edición
              </button>
            )}
          </div>
        </form>

        {/* Lista de usuarios con UserCard */}
        <section>
          <h2 className="mb-4 text-lg font-semibold text-white">
            Lista de usuarios
            <span className="ml-2 rounded-full bg-white/10 px-2.5 py-0.5 text-sm font-normal text-zinc-400">
              {usuarios.length}
            </span>
          </h2>

          {usuarios.length === 0 ? (
            <div className="glass-card flex flex-col items-center justify-center p-12 text-center">
              <span className="text-4xl">👤</span>
              <p className="mt-4 text-lg text-zinc-300">
                No hay usuarios registrados. ¡Crea el primero!
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {usuarios.map((usuario) => (
                <UserCard
                  key={usuario._id}
                  nombre={usuario.nombre}
                  cc={usuario.cc}
                  email={usuario.email}
                  role={usuario.role}
                  onEdit={() => handleEdit(usuario)}
                  onDelete={() => handleDelete(usuario._id)}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
