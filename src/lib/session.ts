import type { UserSession } from "@/types/user";

// Clave que usa localStorage (igual que en el ejemplo de la HU)
export const SESSION_KEY = "user";

// Guarda el usuario después del login o registro
export function saveSession(user: UserSession): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

// Lee si hay alguien logueado. Devuelve null si no hay sesión
export function getSession(): UserSession | null {
  if (typeof window === "undefined") return null; // localStorage solo existe en el navegador

  const datosGuardados = localStorage.getItem(SESSION_KEY);
  if (!datosGuardados) return null;

  try {
    return JSON.parse(datosGuardados) as UserSession;
  } catch {
    return null;
  }
}

// Borra la sesión al cerrar sesión
export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}
