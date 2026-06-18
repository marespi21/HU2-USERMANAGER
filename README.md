# User Manager

App web para la historia de usuario de gestión de usuarios.  
Login, dashboard protegido, CRUD de usuarios y correo de bienvenida.

Stack: **Next.js** (App Router), **MongoDB Atlas**, **Mongoose**, **bcrypt** y **Nodemailer**.

---

## Qué incluye

- `/login` — inicio de sesión (valida contra MongoDB, guarda sesión en `localStorage`)
- `/register` — registro de usuarios nuevos (rol `user`)
- `/dashboard` — datos del usuario logueado
- `/admin/users` — crear, listar, editar y eliminar usuarios (solo `admin`)
- API Routes en `src/app/api/`
- Capa de servicios en `src/services/` (las vistas no llaman `fetch` directo)

---

## Requisitos

- Node.js 18 o superior
- Cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Gmail con App Password (opcional, para los correos)

---

## Instalación

```bash
npm install
cp env.example .env
```

Edita `.env` con tus datos. Si te pierdes con Atlas o Gmail, revisa `GUIA.md`.

Variables que necesitas:

```
MONGODB_URI=...
EMAIL_USER=...
EMAIL_PASS=...
```

Levantar el proyecto:

```bash
npm run dev
```

Abre http://localhost:3000

---

## Primer usuario admin

Registrarte en `/register` crea un `user`, no un admin.  
Para el panel de administración, crea un admin así (con el servidor corriendo):

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Admin",
    "cc": "123456789",
    "email": "admin@test.com",
    "password": "admin123",
    "role": "admin"
  }'
```

Después entra en `/login` con ese email y contraseña.

---

## Estructura

```
src/
  app/           páginas y rutas de API
  components/    UserCard, etc.
  services/      authService, userService
  lib/           mongodb, session, email
  models/        User (Mongoose)
  types/         tipos de TypeScript
```

---

## Deploy en Vercel

1. Subir el repo a GitHub
2. Importar en [vercel.com](https://vercel.com)
3. Poner las mismas variables del `.env` en Environment Variables
4. Deploy
5. Crear el admin con el mismo `curl` pero apuntando a tu URL de Vercel

---

## Notas

- Las contraseñas se guardan hasheadas con bcrypt
- La sesión del login va en `localStorage` con la clave `user`
- No subir el `.env` al repositorio
