import mongoose, { Schema, models, model } from "mongoose";

// Define cómo se guarda un usuario en la colección "users" de MongoDB
const userSchema = new Schema(
  {
    nombre: { type: String, required: true },
    cc: { type: String, required: true },
    email: { type: String, required: true, unique: true }, // No se repite el email
    password: { type: String, required: true }, // Se guarda hasheada con bcrypt
    role: {
      type: String,
      enum: ["admin", "user"], // Solo estos dos roles
      default: "user",
    },
  },
  { timestamps: true } // Agrega createdAt y updatedAt automáticamente
);

// Evita crear el modelo dos veces (problema común en Next.js)
export const User = models.User || model("User", userSchema);
