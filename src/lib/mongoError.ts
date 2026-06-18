// Traduce errores técnicos de MongoDB a mensajes fáciles de entender
export function mensajeErrorMongo(error: unknown): string {
  const mensaje =
    error instanceof Error ? error.message : String(error);

  if (mensaje.includes("bad auth") || mensaje.includes("authentication failed")) {
    return "No se pudo conectar a MongoDB: usuario o contraseña incorrectos en MONGODB_URI";
  }

  if (mensaje.includes("Falta MONGODB_URI")) {
    return "Falta MONGODB_URI en .env";
  }

  return "Error al conectar con la base de datos. Revisa MONGODB_URI en .env";
}
