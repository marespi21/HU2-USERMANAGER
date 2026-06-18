import type { RegisterFormData, UserSession } from "@/types/user";

// Capa de servicios: las vistas llaman estas funciones, no fetch directo

/** Login — valida email y contraseña en la API */
export async function login(
  email: string,
  password: string
): Promise<UserSession> {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Email o contraseña incorrectos");
  }

  return data as UserSession;
}

/** Registro — crea usuario en MongoDB con rol "user" */
export async function register(datos: RegisterFormData): Promise<UserSession> {
  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "No se pudo crear la cuenta");
  }

  return data as UserSession;
}
