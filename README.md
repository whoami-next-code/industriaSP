# IndustriaSP Monorepo

Este repositorio contiene los proyectos de IndustriaSP:

- frontend/ — Sitio público en Next.js (puerto 3000)
- admin/ — Panel de administración en Next.js (puerto 3003)
- backend/ — API en NestJS (puerto 3001)

## Desarrollo

- Frontend: `cd frontend && npm run dev -- -p 3000`
- Admin: `cd admin && npm run dev -- -p 3003`
- Backend: `cd backend && npm run start:dev`

## Configuración

- `backend/.env` — variables del backend (DB_TYPE, JWT, STRIPE, etc.)
- `frontend/.env.local` — variables del frontend (NEXT_PUBLIC_API_BASE, STRIPE, etc.)

## Notas

- Los directorios de build, dependencias, archivos binarios y credenciales locales están excluidos mediante `.gitignore`.
- La base de datos de desarrollo usa SQLite (`backend/dev.sqlite`). Para producción, configurar MySQL y sanear datos únicos.

