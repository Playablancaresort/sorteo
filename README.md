# 🏖️ Sorteo Playa Blanca Resort · Monte Tabor 2026

App completa de sorteo con formulario de inscripción, base de datos y panel del anfitrión.

---

## URLs

- **Formulario inscripción (público):** `https://TU-APP.vercel.app/`
- **Panel del anfitrión (clave):** `https://TU-APP.vercel.app/sorteo`

---

## Setup paso a paso

### 1. Supabase — Base de datos

1. Entra a [supabase.com](https://supabase.com) y crea un proyecto nuevo
2. Espera que el proyecto termine de configurarse (~2 min)
3. Ve a **SQL Editor** y ejecuta TODO el contenido del archivo `lib/schema.sql`
4. Ve a **Settings → API** y copia:
   - `Project URL` → esto es `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → esto es `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → esto es `SUPABASE_SERVICE_KEY`

### 2. Resend — Envío de correos

1. Entra a [resend.com](https://resend.com) y crea una cuenta gratis
2. Ve a **API Keys** → crear nueva key
3. Copia la key → esto es `RESEND_API_KEY`
4. Verifica el dominio `playablanca.cl` en Resend (sección Domains)
   - Si no tienes el dominio aún, cambia el `from` en `app/api/ganador/route.js` a `onboarding@resend.dev` para pruebas

### 3. GitHub — Subir el código

1. Entra a tu cuenta [github.com/Playablancaresort](https://github.com/Playablancaresort)
2. Crea un repositorio nuevo llamado `sorteo`
3. Sube todos los archivos de esta carpeta al repositorio

### 4. Vercel — Desplegar la app

1. Entra a [vercel.com](https://vercel.com) con tu cuenta de GitHub
2. Click en **Add New Project**
3. Selecciona el repositorio `sorteo`
4. Antes de hacer deploy, agrega las **variables de entorno**:

```
NEXT_PUBLIC_SUPABASE_URL = https://TU_PROYECTO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = TU_ANON_KEY
SUPABASE_SERVICE_KEY = TU_SERVICE_KEY
RESEND_API_KEY = TU_RESEND_KEY
ADMIN_PASSWORD = montatabor2026
```

5. Click en **Deploy**
6. En ~2 minutos tienes tu app en vivo en `playablanca-resort.vercel.app`

---

## El día del evento

### Para los participantes
Comparte el QR que apunta a: `https://TU-APP.vercel.app/`

### Para el anfitrión
1. Abre en el teléfono o pantalla: `https://TU-APP.vercel.app/sorteo`
2. Ingresa la clave: `montatabor2026`
3. Actualiza la lista justo antes del sorteo
4. Aprieta **"Iniciar Sorteo"**
5. La pantalla indica exactamente qué verificar
6. Confirmar ganador → el certificado llega solo al mail del ganador

---

## Estructura del proyecto

```
sorteo-app/
├── app/
│   ├── page.js              ← Formulario de inscripción (público)
│   ├── sorteo/page.js       ← Panel del anfitrión (con clave)
│   ├── api/
│   │   ├── inscribir/       ← Guarda en Supabase
│   │   ├── sorteo/          ← Lee participantes
│   │   └── ganador/         ← Confirma ganador + envía mail
│   ├── layout.js
│   └── globals.css
├── lib/
│   ├── supabase.js          ← Cliente Supabase
│   └── schema.sql           ← SQL para crear la tabla
├── .env.example             ← Variables de entorno necesarias
└── package.json
```

---

## Cómo funciona el sistema de tickets

| Situación | Tickets en tómbola |
|---|---|
| No sigue ninguna cuenta | 1 ticket |
| Sigue @playablancaresort | 2 tickets |
| Sigue ambas cuentas | 3 tickets |

El sistema duplica/triplica automáticamente. Si el ganador tiene doble o triple chance, la app indica al anfitrión que debe verificar el teléfono. Si no puede demostrar, el botón "Nuevo sorteo" lo excluye y sortea de nuevo.
