# KERP / PXP - Frontend en Next.js

Este proyecto es una interfaz moderna construida con **Next.js 14+ (App Router)**, **TypeScript** y **Tailwind CSS**, conectada directamente al ERP **PXP** (PHP 7.4 + PostgreSQL 11) como backend headless.

---

## 🚀 Cómo Iniciar

### 1. Asegúrate de que el backend Docker esté corriendo
Desde la raíz del proyecto (`kerp/`):
```bash
docker compose up -d
```
Esto levanta PXP en `http://localhost:8080/kerp/`.

### 2. Inicia el servidor de desarrollo de Next.js
Desde la carpeta `frontend/`:
```bash
cd frontend
npm run dev
```

Abre en tu navegador: **[http://localhost:3000](http://localhost:3000)**

---

## 📁 Estructura del Proyecto

* **`src/app/api/auth/login/route.ts`**: Endpoint de login que realiza el hash MD5 y autentica contra `ACTAuten` de PXP, manteniendo las cookies de sesión PHP (`PHPSESSID`).
* **`src/app/api/auth/logout/route.ts`**: Cierra la sesión en PXP y limpia las cookies locales.
* **`src/app/api/pxp/route.ts`**: Proxy BFF transparente. Reenvía cualquier petición de controlador a `Intermediario.php` de PXP sin problemas de CORS.
* **`src/lib/pxp-client.ts`**: Cliente tipado con funciones listas para usar (`login`, `logout`, `pxpQuery`, `listarFuncionarios`, etc.).
* **`src/app/login/page.tsx`**: Pantalla de Login moderna con feedback visual y validaciones.
* **`src/app/dashboard/page.tsx`**: Panel principal con métricas y resumen de conexión.
* **`src/app/dashboard/funcionarios/page.tsx`**: Módulo de funcionarios con búsqueda en tiempo real, paginación y tabla estilizada.

---

## 🛠️ Cómo consumir un nuevo controlador de PXP

Para agregar cualquier otro módulo de PXP (por ejemplo, `sis_seguridad/control/Usuario/listarUsuario`):

```typescript
import { pxpQuery } from "@/lib/pxp-client";

const response = await pxpQuery(
  "../../sis_seguridad/control/Usuario/listarUsuario",
  {
    start: 0,
    limit: 50,
    sort: "cuenta",
    dir: "ASC"
  }
);

console.log(response.datos); // Registros devueltos por PXP
```
