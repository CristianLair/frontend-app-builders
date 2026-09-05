# Frontend App

Aplicación frontend en **Next.js 16 (App Router) + TypeScript** que consume el **API Gateway** (`../api-gateway`, Flask proxy en `http://127.0.0.1:8080`).

## Requisitos

- Node.js 20.9+ (Next.js 16)
- npm
- El API Gateway corriendo en `http://127.0.0.1:8080` (ver `../api-gateway`)

## Instalación

```bash
npm install
```

## Configuración de entorno

Copiar `.env.example` a `.env.local` (ya creado por defecto):

```
NEXT_PUBLIC_API_URL=http://127.0.0.1:8080
```

`NEXT_PUBLIC_API_URL` es la base del gateway. Todos los clientes de API lo leen desde `src/config/env.ts`.

## Comandos

```bash
npm run dev      # servidor de desarrollo (http://localhost:3000)
npm run build    # build de producción
npm run start    # servir el build
npm run lint     # eslint
```

## Rutas del API Gateway consumidas

| Endpoint              | Uso                  | Cliente API        |
| --------------------- | -------------------- | ------------------ |
| `POST /api/register`  | Registro             | `src/lib/api/auth.ts` |
| `POST /api/login`     | Inicio de sesión     | `src/lib/api/auth.ts` |
| `POST /api/forgot-password` | Solicitar reset | `src/lib/api/auth.ts` |
| `POST /api/reset-password`  | Resetear contraseña | `src/lib/api/auth.ts` |
| `GET /api/me`         | Perfil del usuario   | `src/lib/api/auth.ts` |
| `/api/*` (transacciones) | Servicio de transacciones | `src/lib/api/transactions.ts` |

El gateway resuelve internamente cada ruta hacia el servicio `auth` o `transactions`.

## Estructura del proyecto

```
src/
├── app/
│   ├── layout.tsx                  # layout raíz (fonts + metadata)
│   ├── page.tsx                    # redirige a /dashboard
│   ├── globals.css                 # Tailwind v4 (config en CSS)
│   ├── (auth)/
│   │   ├── layout.tsx              # centra las tarjetas y redirige si hay sesión
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   └── reset-password/page.tsx # lee ?token= de la URL
│   └── (dashboard)/
│       ├── layout.tsx              # SessionGuard + navbar
│       └── dashboard/page.tsx      # perfil desde GET /api/me
├── components/
│   ├── auth/                       # LoginForm, RegisterForm, ForgotPasswordForm, ResetPasswordForm
│   ├── layout/dashboard-nav.tsx    # navbar con logout
│   ├── session/session-guard.tsx   # protege rutas (cliente): no autenticado → /login
│   └── ui/                         # Button, Input, Card, Alert, Spinner
├── config/env.ts                   # env tipado (apiUrl)
├── hooks/use-hydrated.ts           # evita hydration mismatch con el store persistido
├── lib/
│   ├── api/
│   │   ├── client.ts               # fetch wrapper: inyecta Bearer token, normaliza errores del gateway
│   │   ├── error.ts                # ApiError + isApiError()
│   │   ├── auth.ts                 # register, login, forgotPassword, resetPassword, me
│   │   └── transactions.ts         # base del servicio de transacciones (extender)
│   └── utils.ts                    # cn() para combinar clases
├── store/use-auth-store.ts         # Zustand + persist: sesión, login, register, logout, fetchMe
└── types/                          # api.ts, auth.ts, transaction.ts
```

## Flujo de autenticación

1. `LoginForm`/`RegisterForm` llaman a las acciones del `useAuthStore`.
2. El store llama a `src/lib/api/auth.ts` contra el gateway.
3. En éxito, se guarda `token` + `user` (Zustand **persist** en `localStorage`) y se inyecta el token en `client.ts` vía `setAuthToken`.
4. `SessionGuard` (en `(dashboard)/layout`) redirige a `/login` si no hay sesión; `(auth)/layout` redirige a `/dashboard` si ya la hay.
5. `logout()` limpia token y estado; `fetchMe()` refresca el perfil desde `GET /api/me`.

> El token se persiste en `localStorage`. El gateway es stateless y no setea cookies; para protección server-side se puede migrar el token a cookie + `proxy.ts` (en Next 16, `middleware` se renombró a `proxy`).

## Consumir el servicio de transacciones

```ts
import { transactionsApi } from "@/lib/api/transactions";

const { data } = await transactionsApi.list({ page: 1, limit: 20 });
```

Los endpoints y tipos reales (`src/types/transaction.ts`) dependen del contrato del backend `transactions`; ajustar ahí cuando esté definido.

## Errores del gateway

El gateway responde errores normalizados (`{"error": "..."}` con 404/405/502/504). `client.ts` los convierte en `ApiError` con `status` y mensaje legible; los formularios los muestran con `Alert`.