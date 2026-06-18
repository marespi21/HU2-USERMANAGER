import Link from "next/link";

type AppHeaderProps = {
  titulo?: string;
  acciones?: React.ReactNode; // Botones extra a la derecha (ej: cerrar sesión)
};

// Barra superior compartida en todas las páginas
export default function AppHeader({ titulo, acciones }: AppHeaderProps) {
  return (
    <header className="border-b border-white/10 bg-black/20 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="group flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-bold text-white">
            UM
          </span>
          <div>
            <p className="text-sm font-semibold text-white">User Manager</p>
            {titulo && <p className="text-xs text-zinc-400">{titulo}</p>}
          </div>
        </Link>

        {acciones && <nav className="flex items-center gap-3">{acciones}</nav>}
      </div>
    </header>
  );
}
