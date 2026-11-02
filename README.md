# KERP - Sistema ERP & Modern Frontend

Plataforma empresarial integral basada en el framework **PXP** (PHP 7.4 + PostgreSQL 11) con contenedores Docker y una interfaz moderna desacoplada en **Next.js 14+ (App Router)** con **TypeScript** y **Tailwind CSS**.

---

## 🏗️ Arquitectura del Sistema

```
kerp/
├── docker/                 # Configuraciones de Apache, PHP y scripts de arranque
├── Dockerfile              # Imagen personalizada de PHP 7.4 con drivers PostgreSQL
├── docker-compose.yml      # Orquestación de servicios (Base de datos y Backend Web)
├── iniciar_bd.sh           # Script de inicialización y restauración de base de datos
│
├── pxp/                    # Núcleo del framework ERP PXP (PHP 7.4)
│   ├── lib/                # Librerías centrales e Intermediario REST/BFF
│   ├── sis_seguridad/      # Autenticación, usuarios y permisos
│   ├── sis_organigrama/    # Estructura organizacional y funcionarios
│   ├── sis_parametros/     # Parámetros y catálogos generales
│   └── sis_workflow/       # Motor de flujos de trabajo
│
├── sis_asistencia/         # Módulo de control de asistencia, marcaciones y licencias
│
├── frontend/               # Aplicación moderna desacoplada en Next.js 14+
│   ├── src/app/api/        # BFF Proxy transparente hacia PXP (sin problemas de CORS)
│   ├── src/modules/        # Módulos de negocio (asistencia, organigrama, etc.)
│   └── src/components/     # Componentes de UI reutilizables (Tailwind + Radix)
│
├── reportes_generados/     # Directorio para salida de reportes PDF/Excel
└── uploaded_files/         # Almacenamiento de archivos adjuntos subidos
```

---

## ⚡ Requisitos Previos

- [Docker](https://www.docker.com/) y **Docker Compose**
- [Node.js](https://nodejs.org/) v18+ y **npm**
- [Git](https://git-scm.com/)

---

## 🚀 Puesta en Marcha Rápida

### 1. Iniciar los servicios Docker (Backend y Base de Datos)

Desde la raíz del proyecto:

```bash
docker compose up -d
```

Esto iniciará:
- **Base de datos (PostgreSQL 11):** Puerto `5432`
- **Backend PXP (Apache / PHP 7.4):** `http://localhost:8080/kerp/`

### 2. Inicializar la Base de Datos (Solo primera vez)

Si es la primera vez que configuras el entorno, ejecuta el script de inicialización:

```bash
./iniciar_bd.sh
```

### 3. Iniciar el Frontend (Next.js)

En una nueva terminal, ingresa al directorio `frontend`:

```bash
cd frontend
npm install
npm run dev
```

La aplicación estará disponible en: **[http://localhost:3000](http://localhost:3000)**

---

## 🌐 Servicios y Puertos

| Servicio | Tecnología | URL / Conexión | Credenciales por Defecto |
| :--- | :--- | :--- | :--- |
| **Frontend Web** | Next.js 14 + Tailwind | [http://localhost:3000](http://localhost:3000) | Usuario PXP del sistema |
| **PXP Backend** | PHP 7.4 + Apache | [http://localhost:8080/kerp/](http://localhost:8080/kerp/) | `admin` / `admin` |
| **PostgreSQL** | PostgreSQL 11 Alpine | `localhost:5432` | DB: `dbkerp` \| User: `conexion` \| Pass: `dbkerp_conexion` |

---

## 💻 Características del Frontend (Next.js)

- **Patrón BFF (Backend-For-Frontend):** Las peticiones van a `/api/pxp` y `/api/auth/login`, evitando bloqueos por CORS y manejando de forma segura las cookies de sesión PHP (`PHPSESSID`).
- **Autenticación Integrada:** Compatible con el hashing y validación de sesiones de `ACTAuten` de PXP.
- **Módulo de Asistencia:** Consulta de registros de asistencia, estado de marcaciones y reportes.
- **Módulo de Funcionarios:** Visualización de planilla, búsqueda predictiva y detalles del personal.

---

## 📦 Scripts Disponibles

### Backend / Docker
- `docker compose up -d`: Inicia los contenedores en segundo plano.
- `docker compose down`: Detiene y apaga los contenedores.
- `docker compose logs -f web`: Visualiza los logs del servidor Apache/PHP en tiempo real.

### Frontend
- `npm run dev`: Inicia el servidor de desarrollo en `http://localhost:3000`.
- `npm run build`: Genera el compilado optimizado de producción.
- `npm run start`: Inicia el servidor de producción.
- `npm run lint`: Ejecuta el análisis estático de código con ESLint.

---

## 📄 Licencia

Este proyecto está bajo los términos de licencia establecidos por la organización.

