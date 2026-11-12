# 🎰 Puesto de Chance API

> API REST para la gestión de un puesto de venta de chance y Baloto: autenticación de usuarios, creación de sorteos, venta y anulación de tiquetes, liquidación de premios y cierre de caja diario.

![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=flat-square&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat-square&logo=express&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-F7B731?style=flat-square&logo=jsonwebtokens&logoColor=white)
![Jest](https://img.shields.io/badge/Tests-Jest-C21325?style=flat-square&logo=jest&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)

---

## Tabla de Contenido

- [Descripción general](#descripción-general)
- [Prerrequisitos](#prerrequisitos)
- [Instalación local](#instalación-local)
- [Variables de entorno](#variables-de-entorno)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Ejecución](#ejecución)
- [Pruebas](#pruebas)
- [Endpoints de la API](#endpoints-de-la-api)
- [Roles y permisos](#roles-y-permisos)
- [Contribución](#contribución)

---

## Descripción general

La **Puesto de Chance API** es un backend construido con **Node.js + Express** que simula el sistema transaccional de un puesto de apuestas. Gestiona dos productos:

| Producto | Descripción |
|----------|-------------|
| **Chance** | Apuesta a 1–4 dígitos en modalidad Directa o Combinada |
| **Baloto** | Selección de 5 números (1–43) y una Superbalota (1–16) |

Los datos se almacenan **en memoria** (sin base de datos persistente), lo que hace el proyecto ideal para entornos de demostración, pruebas de integración y actividades académicas.

---

## Prerrequisitos

| Herramienta | Versión mínima | Verificación |
|-------------|----------------|--------------|
| **Node.js** | 18.x LTS | `node -v` |
| **npm** | 9.x | `npm -v` |
| **Git** | 2.x | `git --version` |

> **Windows:** se recomienda usar PowerShell o Git Bash.  
> **macOS/Linux:** funciona directamente en la terminal del sistema.

---

## Instalación local

Siga estos pasos en orden:

### 1. Clonar el repositorio

```bash
git clone <URL-del-repositorio>
cd documentacionApi
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

```bash
# Copie el archivo de ejemplo
cp .env.example .env
```

Abra el archivo `.env` y ajuste los valores según su entorno (ver sección [Variables de entorno](#variables-de-entorno)).

### 4. Iniciar el servidor

```bash
# Modo producción
npm start

# Modo desarrollo (recarga automática con nodemon)
npm run dev
```

El servidor queda disponible en: `http://localhost:3000`

Puede verificar que funciona llamando al endpoint de salud:

```bash
curl http://localhost:3000/health
# {"estado":"ok","hora":"2026-11-12T..."}
```

---

## Variables de entorno

Cree el archivo `.env` en la raíz del proyecto basándose en `.env.example`:

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `PORT` | Puerto HTTP del servidor | `3000` |
| `JWT_SECRET` | Clave secreta para firmar tokens JWT | `cambiar-este-secreto` |
| `JWT_EXPIRES_IN` | Duración del token JWT | `8h` |
| `ZONA_HORARIA` | Zona horaria IANA para fechas | `America/Bogota` |
| `MINUTOS_ANULACION` | Ventana de tiempo para anular tiquetes | `10` |
| `MINUTOS_CIERRE_VENTAS` | Minutos antes del sorteo que cierran ventas | `15` |
| `APUESTA_MIN_CHANCE` | Valor mínimo por apuesta de chance (COP) | `500` |
| `APUESTA_MAX_CHANCE` | Valor máximo por apuesta de chance (COP) | `50000` |
| `VALOR_BALOTO` | Precio fijo por jugada de Baloto (COP) | `5700` |
| `DIAS_CADUCIDAD_PREMIO` | Días de vigencia para reclamar un premio | `365` |

> ⚠️ **Nunca suba el archivo `.env` al repositorio.** Ya está incluido en `.gitignore`.

---

## Estructura del proyecto

```
documentacionApi/
├── src/
│   ├── app.js               # Configuración de Express (middlewares, rutas)
│   ├── server.js            # Punto de entrada: arranca el servidor HTTP
│   ├── config/
│   │   └── index.js         # Carga y exporta todas las variables de entorno
│   ├── controllers/
│   │   ├── authController.js    # Endpoints de autenticación
│   │   ├── sorteoController.js  # Endpoints de sorteos
│   │   ├── ticketController.js  # Endpoints de tiquetes
│   │   └── cajaController.js    # Endpoints de caja
│   ├── data/
│   │   └── store.js         # Base de datos en memoria y datos semilla
│   ├── middlewares/
│   │   ├── auth.js          # Verificación JWT y control de roles
│   │   └── errorHandler.js  # Manejador centralizado de errores
│   ├── routes/
│   │   └── index.js         # Definición de todas las rutas /api/v1
│   ├── services/
│   │   ├── authService.js       # Lógica de autenticación
│   │   ├── sorteoService.js     # Lógica de sorteos
│   │   ├── ticketService.js     # Lógica de tiquetes
│   │   ├── cajaService.js       # Lógica de caja
│   │   ├── chanceService.js     # Reglas de negocio del chance
│   │   └── balotoService.js     # Reglas de negocio del Baloto
│   └── utils/
│       ├── AppError.js      # Clase de error con código HTTP
│       └── fechas.js        # Utilidades de fecha/hora localizadas
├── tests/
│   ├── helpers.js           # Funciones auxiliares para pruebas
│   ├── auth.test.js         # Pruebas de autenticación
│   ├── chance.test.js       # Pruebas de reglas de chance
│   ├── baloto.test.js       # Pruebas de reglas de Baloto
│   ├── tickets.test.js      # Pruebas de venta y ciclo de vida de tiquetes
│   └── caja.test.js         # Pruebas de resumen y cierre de caja
├── .env.example             # Plantilla de variables de entorno
├── package.json
└── README.md
```

---

## Ejecución

```bash
# Iniciar en modo producción
npm start

# Iniciar en modo desarrollo (hot-reload)
npm run dev
```

---

## Pruebas

```bash
# Ejecutar todos los tests
npm test
```

La suite usa **Jest** y **Supertest**. Cada prueba reinicia la base de datos en memoria para garantizar aislamiento total.

```
 PASS  tests/auth.test.js
 PASS  tests/chance.test.js
 PASS  tests/baloto.test.js
 PASS  tests/tickets.test.js
 PASS  tests/caja.test.js
```

---

## Endpoints de la API

Base URL: `http://localhost:3000/api/v1`

> Todos los endpoints (excepto `/auth/login` y `/health`) requieren el encabezado:  
> `Authorization: Bearer <token>`

### Autenticación

| Método | Ruta | Descripción | Roles |
|--------|------|-------------|-------|
| `POST` | `/auth/login` | Iniciar sesión, retorna JWT | Público |
| `GET` | `/auth/perfil` | Obtener perfil del usuario autenticado | Todos |

#### Ejemplo: Login

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "usuario": "vendedor1",
  "password": "vende123"
}
```

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "usuario": { "id": 2, "usuario": "vendedor1", "nombre": "Ana Pérez", "rol": "VENDEDOR" }
}
```

---

### Sorteos

| Método | Ruta | Descripción | Roles |
|--------|------|-------------|-------|
| `GET` | `/sorteos` | Listar sorteos (filtros: `?tipo=CHANCE&estado=ABIERTO`) | Todos |
| `GET` | `/sorteos/:id` | Obtener sorteo por ID | Todos |
| `POST` | `/sorteos` | Crear nuevo sorteo | ADMIN |
| `POST` | `/sorteos/:id/resultado` | Registrar resultado y liquidar premios | ADMIN |

#### Ejemplo: Crear sorteo

```http
POST /api/v1/sorteos
Authorization: Bearer <token-admin>
Content-Type: application/json

{
  "tipo": "CHANCE",
  "nombre": "Lotería del Valle",
  "fecha": "2026-11-13T22:00:00.000Z"
}
```

---

### Tiquetes

| Método | Ruta | Descripción | Roles |
|--------|------|-------------|-------|
| `POST` | `/tickets/chance` | Vender tiquete de chance (1–5 apuestas) | VENDEDOR |
| `POST` | `/tickets/baloto` | Vender tiquete de Baloto (1–10 jugadas) | VENDEDOR |
| `GET` | `/tickets` | Listar tiquetes (filtros: `?fecha=&estado=`) | Todos |
| `GET` | `/tickets/:codigo` | Consultar tiquete y resultado | Todos |
| `POST` | `/tickets/:codigo/anular` | Anular tiquete (ventana: 10 min) | Todos |
| `POST` | `/tickets/:codigo/pagar` | Pagar premio de tiquete ganador | VENDEDOR |

#### Ejemplo: Vender chance

```http
POST /api/v1/tickets/chance
Authorization: Bearer <token-vendedor>
Content-Type: application/json

{
  "sorteoId": 1,
  "cliente": "Carlos Ruiz",
  "apuestas": [
    { "numero": "1234", "valor": 2000 },
    { "numero": "56", "modalidad": "DIRECTO", "valor": 1000 }
  ]
}
```

#### Ejemplo: Vender Baloto

```http
POST /api/v1/tickets/baloto
Authorization: Bearer <token-vendedor>
Content-Type: application/json

{
  "sorteoId": 3,
  "jugadas": [
    { "numeros": [3, 15, 22, 37, 41], "superbalota": 9 },
    { "aleatoria": true }
  ]
}
```

---

### Caja

| Método | Ruta | Descripción | Roles |
|--------|------|-------------|-------|
| `GET` | `/caja/resumen` | Resumen de ventas y premios del día | Todos |
| `POST` | `/caja/cierre` | Registrar cierre de caja con efectivo reportado | VENDEDOR |

#### Ejemplo: Cierre de caja

```http
POST /api/v1/caja/cierre
Authorization: Bearer <token-vendedor>
Content-Type: application/json

{
  "efectivoReportado": 45000
}
```

```json
{
  "estado": "FALTANTE",
  "totalVendido": 50000,
  "efectivoReportado": 45000,
  "diferencia": -5000
}
```

---

### Health Check

```http
GET /health
```

```json
{ "estado": "ok", "hora": "2026-11-12T14:30:00.000Z" }
```

---

## Roles y permisos

| Acción | ADMIN | VENDEDOR |
|--------|:-----:|:--------:|
| Login / Ver perfil | ✅ | ✅ |
| Listar/Consultar sorteos y tiquetes | ✅ | ✅ (solo propios) |
| Crear sorteo / Registrar resultado | ✅ | ❌ |
| Vender tiquetes | ❌ | ✅ |
| Anular tiquete ajeno | ✅ | ❌ |
| Pagar premio | ❌ | ✅ |
| Ver resumen de caja | ✅ (todos) | ✅ (propia) |
| Cerrar caja | ❌ | ✅ |

---

## Usuarios de prueba (datos semilla)

| Usuario | Contraseña | Rol |
|---------|------------|-----|
| `admin` | `admin123` | ADMIN |
| `vendedor1` | `vende123` | VENDEDOR |
| `vendedor2` | `vende456` | VENDEDOR |

---

## Contribución

1. Crea un fork del repositorio.
2. Crea una rama descriptiva: `git checkout -b feature/nombre-de-la-funcionalidad`
3. Haz tus cambios y ejecuta las pruebas: `npm test`
4. Envía un Pull Request con una descripción clara de los cambios.

---

> Proyecto académico desarrollado con fines educativos — SENA 2026.
