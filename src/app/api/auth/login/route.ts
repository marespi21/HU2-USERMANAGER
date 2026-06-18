import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";

// API Route: POST /api/auth/login
// Recibe email y contraseña, valida contra MongoDB

export async function POST(request: Request) {
  try {
    await connectDB(); // Conecta a MongoDB

    const body = await request.json();
    const email = body.email?.trim().toLowerCase();
    const password = body.password;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email y contraseña son obligatorios" },
        { status: 400 }
      );
    }

    // Busca el usuario por email
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: "Email o contraseña incorrectos" },
        { status: 401 }
      );
    }

    // Compara la contraseña escrita con el hash guardado en la BD
    const passwordCorrecta = await bcrypt.compare(password, user.password);

    if (!passwordCorrecta) {
      return NextResponse.json(
        { error: "Email o contraseña incorrectos" },
        { status: 401 }
      );
    }

    // Devuelve datos del usuario SIN la contraseña
    return NextResponse.json({
      _id: user._id.toString(),
      nombre: user.nombre,
      cc: user.cc,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error("Error en login:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
