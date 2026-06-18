import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { mensajeErrorMongo } from "@/lib/mongoError";
import { User } from "@/models/User";
import { sendWelcomeEmail } from "@/lib/email";

// Quita la contraseña antes de enviar datos al navegador
function userSinPassword(user: {
  _id: { toString(): string };
  nombre: string;
  cc: string;
  email: string;
  role: string;
}) {
  return {
    _id: user._id.toString(),
    nombre: user.nombre,
    cc: user.cc,
    email: user.email,
    role: user.role,
  };
}

// GET /api/users — lista todos los usuarios
export async function GET() {
  try {
    await connectDB();
    const users = await User.find().select("-password").sort({ createdAt: -1 }); // -password = no traer contraseña
    return NextResponse.json(users.map(userSinPassword));
  } catch (error) {
    console.error("Error GET users:", error);
    return NextResponse.json(
      { error: mensajeErrorMongo(error) },
      { status: 500 }
    );
  }
}

// POST /api/users — crea usuario (lo usa el panel admin)
export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();
    const nombre = body.nombre?.trim();
    const cc = body.cc?.trim();
    const email = body.email?.trim().toLowerCase();
    const password = body.password;
    const role = body.role === "admin" ? "admin" : "user";

    if (!nombre || !cc || !email || !password) {
      return NextResponse.json(
        { error: "Todos los campos son obligatorios" },
        { status: 400 }
      );
    }

    const existe = await User.findOne({ email });
    if (existe) {
      return NextResponse.json(
        { error: "Ya existe un usuario con ese email" },
        { status: 400 }
      );
    }

    // Hashea la contraseña (Fase 2 de seguridad)
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const nuevoUsuario = await User.create({
      nombre,
      cc,
      email,
      password: passwordHash,
      role,
    });

    // Correo de bienvenida con credenciales
    try {
      await sendWelcomeEmail(email, nombre, password);
    } catch (emailError) {
      console.error("Error enviando correo:", emailError);
    }

    return NextResponse.json(userSinPassword(nuevoUsuario), { status: 201 });
  } catch (error) {
    console.error("Error POST users:", error);
    return NextResponse.json(
      { error: mensajeErrorMongo(error) },
      { status: 500 }
    );
  }
}
