<div align="center">

# 📚 Laboratorio 12 — Desarrollo de Aplicaciones Web Avanzado

### API Routes integradas — Sistema de Biblioteca con Next.js, Prisma y PostgreSQL

![Next.js](https://img.shields.io/badge/Next.js-App_Router-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Status](https://img.shields.io/badge/status-completado-brightgreen?style=for-the-badge)

*Tecsup · Diseño y Desarrollo de Software · 5 - C24 - Sección A-B*

</div>

---

## 📖 Tabla de contenidos

- [Descripción general](#-descripción-general)
- [Stack técnico](#-stack-técnico)
- [Estructura del proyecto](#-estructura-del-proyecto)
- [Modelo de datos](#-modelo-de-datos)
- [API Routes — CRUD base](#-api-routes--crud-base)
- [Tarea — Búsqueda, paginación y estadísticas](#-tarea--búsqueda-paginación-y-estadísticas)
- [Frontend — Páginas consumiendo las APIs](#-frontend--páginas-consumiendo-las-apis)
- [Configuración y ejecución](#-configuración-y-ejecución)
- [Conclusiones](#-conclusiones)
- [Autor](#-autor)

---

## 📌 Descripción general

Sistema de gestión de una biblioteca (autores y libros) construido enteramente con **API Routes de Next.js (App Router)**, usando **Prisma ORM** sobre una base de datos **PostgreSQL** alojada en la nube. El laboratorio cubre desde el CRUD básico hasta endpoints avanzados con filtros dinámicos, paginación y estadísticas, consumidos por un frontend propio en React.

---

## 🧰 Stack técnico

<div align="center">

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)
![Postman](https://img.shields.io/badge/Postman-FF6C37?style=flat-square&logo=postman&logoColor=white)

</div>

> **Nota de infraestructura:** el laboratorio guiado usa **Supabase** como proveedor de PostgreSQL. En este proyecto se migró a **Neon**, manteniendo exactamente el mismo esquema de Prisma — demuestra que el ORM desacopla la lógica de la app del proveedor de base de datos subyacente.

---

## 🗂 Estructura del proyecto

```
next-api-routes/
├── prisma/
│   └── schema.prisma               # Modelos Author y Book
│
├── lib/
│   └── prisma.ts                    # Cliente Prisma singleton
│
├── app/
│   ├── api/
│   │   ├── authors/
│   │   │   ├── route.ts               # GET (listar) · POST (crear)
│   │   │   └── [id]/
│   │   │       ├── route.ts            # GET · PUT · DELETE por id
│   │   │       ├── books/
│   │   │       │   └── route.ts         # GET — libros de un autor
│   │   │       └── stats/
│   │   │           └── route.ts         # GET — estadísticas del autor
│   │   └── books/
│   │       ├── route.ts               # GET (listar + filtro género) · POST (crear)
│   │       ├── [id]/
│   │       │   └── route.ts            # GET · PUT · DELETE por id
│   │       └── search/
│   │           └── route.ts            # GET — búsqueda + filtros + paginación
│   │
│   ├── page.tsx                      # Dashboard — autores
│   ├── books/
│   │   └── page.tsx                   # Búsqueda de libros
│   └── authors/
│       └── [id]/
│           └── page.tsx                # Detalle de autor
│
└── .env                               # DATABASE_URL (no se sube)
```

---

## 🧬 Modelo de datos

<details open>
<summary>📖 <b>Author</b></summary>
<br>

| Campo | Tipo |
|---|---|
| `id` | String (cuid) |
| `name` | String |
| `email` | String, único |
| `nationality` | String |
| `birthYear` | Int |
| `bio` | String |
| `books` | Relación 1\:N con `Book` |

</details>

<details open>
<summary>📘 <b>Book</b></summary>
<br>

| Campo | Tipo |
|---|---|
| `id` | String (cuid) |
| `title` | String |
| `description` | String |
| `isbn` | String, único |
| `publishedYear` | Int |
| `genre` | String |
| `pages` | Int |
| `authorId` | Relación N\:1 con `Author` |
| `createdAt` | DateTime |

</details>

---

## 🧭 API Routes — CRUD base

| Método | Ruta | Descripción |
|:---:|---|---|
| `GET` | `/api/authors` | Lista todos los autores |
| `POST` | `/api/authors` | Crea un nuevo autor |
| `GET` | `/api/authors/:id` | Obtiene un autor por id |
| `PUT` | `/api/authors/:id` | Actualiza un autor |
| `DELETE` | `/api/authors/:id` | Elimina un autor |
| `GET` | `/api/authors/:id/books` | Libros de un autor específico |
| `GET` | `/api/books` | Lista todos los libros (`?genre=` filtra por género) |
| `POST` | `/api/books` | Crea un nuevo libro |
| `GET` | `/api/books/:id` | Obtiene un libro por id |
| `PUT` | `/api/books/:id` | Actualiza un libro |
| `DELETE` | `/api/books/:id` | Elimina un libro |

**Parámetros dinámicos como Promesas:** siguiendo el modelo de Next.js 15+, cada handler con `[id]` resuelve `params` con `await`, en vez de acceder a la propiedad directamente — un cambio de comportamiento clave respecto a versiones anteriores del framework.

---

## 🎯 Tarea — Búsqueda, paginación y estadísticas

### 1. `GET /api/books/search` — búsqueda avanzada

<details open>
<summary>🔍 <b>Query parameters soportados</b></summary>
<br>

| Parámetro | Descripción | Default |
|---|---|---|
| `search` | Búsqueda parcial por título (case-insensitive) | — |
| `genre` | Filtro por género exacto | — |
| `authorName` | Búsqueda parcial por nombre de autor | — |
| `page` | Número de página | `1` |
| `limit` | Resultados por página (máx. 50) | `10` |
| `sortBy` | `title` \| `publishedYear` \| `createdAt` | `createdAt` |
| `order` | `asc` \| `desc` | `desc` |

</details>

```http
GET /api/books/search?search=amor&genre=Novela&page=1&limit=10&sortBy=publishedYear&order=desc
```

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

Construye cláusulas `WHERE` dinámicas en Prisma según los filtros presentes, y calcula los metadatos de paginación con `Promise.all` (conteo total + página de resultados en paralelo).

### 2. `GET /api/authors/:id/stats` — estadísticas del autor

Devuelve, calculado a partir de los libros del autor: total publicados, primer y último libro, promedio de páginas, géneros únicos, y el libro más largo / más corto.

```json
{
  "authorId": "...",
  "authorName": "Gabriel García Márquez",
  "totalBooks": 15,
  "firstBook": { "title": "La hojarasca", "year": 1955 },
  "latestBook": { "title": "Memoria de mis putas tristes", "year": 2004 },
  "averagePages": 285,
  "genres": ["Novela", "Cuento", "Periodismo"],
  "longestBook": { "title": "Cien años de soledad", "pages": 417 },
  "shortestBook": { "title": "Relato de un náufrago", "pages": 110 }
}
```

---

## 🖥️ Frontend — Páginas consumiendo las APIs

| Página | Ruta | Contenido |
|---|---|---|
| **Dashboard** | `/` | Crear/listar/editar/eliminar autores, acceso a sus libros, estadísticas generales |
| **Búsqueda de libros** | `/books` | Formulario de creación, búsqueda en vivo, filtros por género y autor, ordenamiento, paginación funcional, loading states |
| **Detalle de autor** | `/authors/[id]` | Info completa + estadísticas (vía endpoint de stats) + lista de libros + edición + alta de nuevo libro |

Implementado con `useState`, `useEffect`, `useParams` y `useRouter`, manejando estados de carga y error en cada vista.

---

## ⚙️ Configuración y ejecución

```bash
git clone https://github.com/diegoninam-ship-it/Lab12-DAWA.git
cd Lab12-DAWA
npm install
```

Crea `.env` en la raíz con la cadena de conexión de tu base de datos (Neon/Supabase):

```dotenv
DATABASE_URL="postgresql://usuario:contraseña@host/basededatos?sslmode=require"
```

```bash
npx prisma generate
npx prisma db push
npm run dev
```

Visita `http://localhost:3000`.

---

## 📝 Conclusiones

1. **API Routes en Next.js:** se aprendió a crear rutas con el App Router, manejando parámetros dinámicos como Promesas (`await params`) — un cambio clave frente a versiones anteriores del framework.
2. **Prisma + PostgreSQL en la nube:** el ORM facilitó enormemente la interacción con la base de datos. Migrar la configuración original (Supabase) a Neon demostró la flexibilidad de los ORMs modernos frente al proveedor subyacente.
3. **Endpoints complejos con paginación:** el mayor reto fue construir cláusulas `WHERE` dinámicas según los filtros presentes, y calcular los metadatos de paginación de forma eficiente con `Promise.all`.
4. **Consumo de APIs desde el frontend:** implementar las tres páginas permitió dominar `useEffect`, `useState`, `useParams` y `useRouter`, junto con el manejo correcto de estados de carga y error.
5. **Despliegue y variables de entorno:** el proceso en Vercel reforzó la importancia de gestionar credenciales de forma segura, separando estrictamente la configuración de desarrollo local y producción.

---

## 👤 Autor

**Diego Nina Malqui** — Estudiante de Diseño y Desarrollo de Software, Tecsup
📍 Laboratorio 12 · Desarrollo de Aplicaciones Web Avanzado

<div align="center">

⭐ *Si este repo te sirvió de guía, no olvides dejar una estrella* ⭐

</div>