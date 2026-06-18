import nodemailer from "nodemailer";

// Envía correo de bienvenida al crear un usuario
export async function sendWelcomeEmail(
  email: string,
  nombre: string,
  password: string
): Promise<void> {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  // Si no hay Gmail configurado, no rompe la app
  if (!emailUser || !emailPass) {
    console.warn("EMAIL_USER o EMAIL_PASS no configurados. No se envió el correo.");
    return;
  }

  // Configura Gmail con App Password (no la contraseña normal)
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });

  await transporter.sendMail({
    from: `"User Manager" <${emailUser}>`,
    to: email,
    subject: "Bienvenido a User Manager",
    text: `Hola ${nombre},\n\nTu cuenta fue creada.\n\nEmail: ${email}\nContraseña: ${password}`,
    html: `<p>Hola <strong>${nombre}</strong>,</p><p>Tu cuenta fue creada.</p><p>Email: ${email}<br/>Contraseña: ${password}</p>`,
  });
}
