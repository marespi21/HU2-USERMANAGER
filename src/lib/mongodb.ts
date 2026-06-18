import mongoose from "mongoose";

// URI de conexión (está en el archivo .env)
const MONGODB_URI = process.env.MONGODB_URI;

// Caché para no abrir muchas conexiones cuando Next.js recarga en desarrollo
type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cache: MongooseCache = global.mongooseCache ?? {
  conn: null,
  promise: null,
};

global.mongooseCache = cache;

// Todas las API Routes llaman esto antes de leer o guardar en MongoDB
export async function connectDB() {
  if (!MONGODB_URI) {
    throw new Error(
      "Falta MONGODB_URI en .env.local. Revisa la guía en README.md."
    );
  }

  // Si ya hay conexión abierta, la reutiliza
  if (cache.conn) {
    return cache.conn;
  }

  // Si no, crea una nueva conexión
  if (!cache.promise) {
    cache.promise = mongoose.connect(MONGODB_URI);
  }

  cache.conn = await cache.promise;
  return cache.conn;
}
