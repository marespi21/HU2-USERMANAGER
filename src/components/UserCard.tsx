import type { UserRole } from "@/types/user";

// Props que recibe UserCard desde el componente padre
type UserCardProps = {
  nombre: string;
  cc: string;
  email: string;
  role: UserRole;
  onEdit: () => void;   // Función al presionar ✏️
  onDelete: () => void; // Función al presionar 🗑️
};

// Saca las iniciales del nombre para el avatar (ej: "Ana López" → "AL")
function obtenerIniciales(nombre: string): string {
  return nombre
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((palabra) => palabra[0]?.toUpperCase() ?? "")
    .join("");
}

// Componente reutilizable — cada usuario se muestra en una tarjeta
export default function UserCard({
  nombre,
  cc,
  email,
  role,
  onEdit,
  onDelete,
}: UserCardProps) {
  const esAdmin = role === "admin";

  return (
    <article
      className={`group animate-fade-in rounded-2xl border p-5 transition hover:scale-[1.01] ${
        esAdmin
          ? "border-indigo-400/30 bg-gradient-to-br from-indigo-500/20 to-purple-600/10" // Azul = admin
          : "border-white/10 bg-white/5" // Gris = user
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-4">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white ${
              esAdmin
                ? "bg-gradient-to-br from-indigo-500 to-purple-600"
                : "bg-gradient-to-br from-zinc-600 to-zinc-700"
            }`}
          >
            {obtenerIniciales(nombre)}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white">{nombre}</h3>
            <p className="mt-1 text-sm text-zinc-400">CC: {cc}</p>
            <p className="text-sm text-zinc-400">{email}</p>
            <span
              className={`mt-3 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                esAdmin
                  ? "bg-indigo-500/30 text-indigo-200"
                  : "bg-zinc-700/50 text-zinc-300"
              }`}
            >
              {role}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onEdit}
            title="Editar usuario"
            aria-label="Editar usuario"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-lg"
          >
            ✏️
          </button>
          <button
            type="button"
            onClick={onDelete}
            title="Eliminar usuario"
            aria-label="Eliminar usuario"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-lg"
          >
            🗑️
          </button>
        </div>
      </div>
    </article>
  );
}
