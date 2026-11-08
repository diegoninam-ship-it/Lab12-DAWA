<div align="center">

# 📚 Sistema de Biblioteca - Lab 12 DAWA

### API Routes Integradas con Next.js 15, Prisma y PostgreSQL

[![Next.js](https://img.shields.io/badge/Next.js-16.4.5-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22.0-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://neon.tech/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

**Desarrollo de Aplicaciones Web Avanzado • Sección C24 • Tecsup 2026-I**

[Ver Demo en Vivo 🚀](#-despliegue) • [Reportar Bug 🐛](https://github.com/diegoninam-ship-it/Lab12-DAWA/issues) • [Documentación 📖](#-endpoints-de-la-api)

</div>

---

## 📋 Tabla de Contenidos

- [📖 Descripción](#-descripción)
- [✨ Características](#-características)
- [🛠️ Stack Tecnológico](#️-stack-tecnológico)
- [📸 Capturas de Pantalla](#-capturas-de-pantalla)
- [⚙️ Requisitos Previos](#️-requisitos-previos)
- [🚀 Instalación Local](#-instalación-local)
- [🗂️ Estructura del Proyecto](#️-estructura-del-proyecto)
- [🔌 Endpoints de la API](#-endpoints-de-la-api)
- [🌐 Despliegue](#-despliegue)
- [🎓 Conclusiones](#-conclusiones)
- [👨‍💻 Autor](#-autor)

---

## 📖 Descripción

Sistema completo de gestión de biblioteca desarrollado como parte del **Laboratorio 12** del curso de **Desarrollo de Aplicaciones Web Avanzado**. La aplicación implementa una arquitectura moderna full-stack con **Next.js 15+ (App Router)**, **API Routes**, **Prisma ORM** y una base de datos **PostgreSQL en la nube (Neon)**.

El sistema permite gestionar **autores** y **libros** mediante operaciones CRUD completas, búsqueda avanzada con paginación, filtros dinámicos y cálculo de estadísticas literarias en tiempo real.

> 💡 **Nota:** Aunque el laboratorio original indicaba Supabase, se utilizó **Neon** como proveedor de PostgreSQL en la nube por compatibilidad total con Prisma y mejores características para desarrollo.

---

## ✨ Características

### 🔧 Backend (API Routes)
- ✅ **5 Endpoints CRUD base** para autores y libros
- ✅ **Búsqueda avanzada** con paginación, filtros y ordenamiento dinámico
- ✅ **Estadísticas literarias** calculadas en tiempo real por autor
- ✅ **Validaciones** y manejo de errores robusto
- ✅ **Tipado completo** con TypeScript
- ✅ **Relaciones** entre modelos (Author ↔ Book) con Prisma

### 🎨 Frontend (Next.js App Router)
- ✅ **Dashboard principal** con CRUD completo de autores y estadísticas generales
- ✅ **Búsqueda de libros** con filtros en tiempo real, paginación y ordenamiento
- ✅ **Página de detalle** de autor con estadísticas y gestión de libros
- ✅ **Diseño responsive** con Tailwind CSS
- ✅ **Loading states** y manejo de errores en la UI
- ✅ **Navegación fluida** entre secciones

---

## 🛠️ Stack Tecnológico

<table>
<tr>
<td align="center"><img src="https://cdn.simpleicons.org/next.js/black" width="60"><br><b>Next.js 16</b><br><sub>App Router</sub></td>
<td align="center"><img src="https://cdn.simpleicons.org/typescript/3178C6" width="60"><br><b>TypeScript</b><br><sub>Tipado estático</sub></td>
<td align="center"><img src="https://cdn.simpleicons.org/prisma/2D3748" width="60"><br><b>Prisma</b><br><sub>ORM</sub></td>
<td align="center"><img src="https://cdn.simpleicons.org/postgresql/4169E1" width="60"><br><b>PostgreSQL</b><br><sub>Neon Cloud</sub></td>
<td align="center"><img src="https://cdn.simpleicons.org/tailwindcss/38B2AC" width="60"><br><b>Tailwind CSS</b><br><sub>Estilos</sub></td>
<td align="center"><img src="https://cdn.simpleicons.org/vercel/black" width="60"><br><b>Vercel</b><br><sub>Deploy</sub></td>
</tr>
</table>

---

## 📸 Capturas de Pantalla

> 📌 *Reemplaza estas imágenes con tus propias capturas*

<details>
<summary><b>🏠 Dashboard Principal</b></summary>
<br>
<img src="./public/screenshots/dashboard.png" alt="Dashboard" width="100%">
</details>

<details>
<summary><b>🔍 Búsqueda de Libros</b></summary>
<br>
<img src="./public/screenshots/books-search.png" alt="Búsqueda de Libros" width="100%">
</details>

<details>
<summary><b>👤 Detalle de Autor</b></summary>
<br>
<img src="./public/screenshots/author-detail.png" alt="Detalle de Autor" width="100%">
</details>

<details>
<summary><b>🧪 Pruebas de API en Postman</b></summary>
<br>
<img src="./public/screenshots/postman-tests.png" alt="Postman Tests" width="100%">
</details>

---

## ⚙️ Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- [x] **Node.js** v18+ → [Descargar](https://nodejs.org/)
- [x] **Git** → [Descargar](https://git-scm.com/)
- [x] **Cuenta en Neon** → [Registrarse](https://neon.tech/)
- [x] **TablePlus** (opcional) → [Descargar](https://tableplus.com/download)
- [x] **Postman** o **Thunder Client** → [Descargar](https://www.postman.com/)

---

## 🚀 Instalación Local

### 1. Clonar el repositorio

```bash
git clone https://github.com/diegoninam-ship-it/Lab12-DAWA.git
cd Lab12-DAWA