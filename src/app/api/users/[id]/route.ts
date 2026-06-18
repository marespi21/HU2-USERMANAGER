import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";

// Devuelve usuario sin contraseña
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

type RouteParams = { params: Promise<{ id: string }> };

// PUT /api/users/[id] — editar usuario
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    await connectDB();
    const { id } = await params; // id viene de la URL
    const body = await request.json();

    const datos: Record<string, string> = {};

    if (body.nombre) datos.nombre = body.nombre.trim();
    if (body.cc) datos.cc = body.cc.trim();
    if (body.email) datos.email = body.email.trim().toLowerCase();
    if (body.role === "admin" || body.role === "user") datos.role = body.role;

    // Solo cambia contraseña si escribieron una nueva
    if (body.password && body.password.length > 0) {
      const salt = await bcrypt.genSalt(10);
      datos.password = await bcrypt.hash(body.password, salt);
    }

    const usuarioActualizado = await User.findByIdAndUpdate(id, datos, {
      new: true, // Devuelve el documento ya actualizado
    });

    if (!usuarioActualizado) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(userSinPassword(usuarioActualizado));
  } catch (error) {
    console.error("Error PUT user:", error);
    return NextResponse.json(
      { error: "Error al actualizar usuario" },
      { status: 500 }
    );
  }
}

// DELETE /api/users/[id] — eliminar usuario
export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    await connectDB();
    const { id } = await params;

    const usuarioEliminado = await User.findByIdAndDelete(id);

    if (!usuarioEliminado) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Usuario eliminado" });
  } catch (error) {
    console.error("Error DELETE user:", error);
    return NextResponse.json(
      { error: "Error al eliminar usuario" },
      { status: 500 }
    );
  }
}
