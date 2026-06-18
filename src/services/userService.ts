import type { UserFormData, UserSession } from "@/types/user";

// Capa de servicios para el CRUD de usuarios (panel admin)

export type UserPublic = UserSession; // Usuario sin contraseña

/** GET — trae todos los usuarios de MongoDB */
export async function getUsers(): Promise<UserPublic[]> {
  const response = await fetch("/api/users");
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "No se pudieron cargar los usuarios");
  }

  return data as UserPublic[];
}

/** POST — crea un usuario nuevo */
export async function createUser(user: UserFormData): Promise<UserPublic> {
  const response = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "No se pudo crear el usuario");
  }

  return data as UserPublic;
}

/** PUT — actualiza un usuario por su id */
export async function updateUser(
  id: string,
  user: Partial<UserFormData>
): Promise<UserPublic> {
  const response = await fetch(`/api/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "No se pudo actualizar el usuario");
  }

  return data as UserPublic;
}

/** DELETE — elimina un usuario por su id */
export async function deleteUser(id: string): Promise<void> {
  const response = await fetch(`/api/users/${id}`, {
    method: "DELETE",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "No se pudo eliminar el usuario");
  }
}
