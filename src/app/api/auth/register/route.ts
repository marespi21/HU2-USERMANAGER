import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { mensajeErrorMongo } from "@/lib/mongoError";
import { User } from "@/models/User";
import { sendWelcomeEmail } from "@/lib/email";

// API Route: POST /api/auth/register
// Registro público — siempre crea rol "user"

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();
    const nombre = body.nombre?.trim();
    const cc = body.cc?.trim();
    const email = body.email?.trim().toLowerCase();
    const password = body.password;

    if (!nombre || !cc || !email || !password) {
      return NextResponse.json(
        { error: "Todos los campos son obligatorios" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "La contraseña debe tener al menos 6 caracteres" },
        { status: 400 }
      );
    }

    // No permitir emails duplicados
    const existe = await User.findOne({ email });
    if (existe) {
      return NextResponse.json(
        { error: "Ya existe un usuario con ese email" },
        { status: 400 }
      );
    }

    // Hashea la contraseña antes de guardar
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const nuevoUsuario = await User.create({
      nombre,
      cc,
      email,
      password: passwordHash,
      role: "user", // Nadie se registra como admin
    });

    // Envía correo de bienvenida (si Gmail está configurado)
    try {
      await sendWelcomeEmail(email, nombre, password);
    } catch (emailError) {
      console.error("Error enviando correo:", emailError);
    }

    return NextResponse.json(
      {
        _id: nuevoUsuario._id.toString(),
        nombre: nuevoUsuario.nombre,
        cc: nuevoUsuario.cc,
        email: nuevoUsuario.email,
        role: nuevoUsuario.role,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error en registro:", error);
    return NextResponse.json(
      { error: mensajeErrorMongo(error) },
      { status: 500 }
    );
  }
}
