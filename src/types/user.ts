// Tipos de TypeScript — describen la forma de los datos

export type UserRole = "admin" | "user";

// Lo que guardamos en localStorage después del login (sin contraseña)
export interface UserSession {
  _id: string;
  nombre: string;
  cc: string;
  email: string;
  role: UserRole;
}

// Datos del formulario del panel admin (crear/editar)
export interface UserFormData {
  nombre: string;
  cc: string;
  email: string;
  password: string;
  role: UserRole;
}

// Datos del formulario de registro público (sin rol, siempre es "user")
export interface RegisterFormData {
  nombre: string;
  cc: string;
  email: string;
  password: string;
}
