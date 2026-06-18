// Pantalla de carga mientras se verifica sesión o se cargan datos
export default function LoadingScreen({ mensaje = "Cargando..." }: { mensaje?: string }) {
  return (
    <main className="page-bg flex min-h-full flex-1 flex-col items-center justify-center gap-4 p-8">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
      <p className="text-sm text-zinc-400">{mensaje}</p>
    </main>
  );
}
