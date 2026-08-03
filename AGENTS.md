# Amena — AGENTS.md

## Project structure

- `frontend/` — React 19 + Vite 8 + TypeScript 6 + Tailwind CSS 4
- `backend/` — Spring Boot 3.2.4 + Java 21 + Maven + PostgreSQL + Liquibase
- `openapi/schema.yaml` — single source of truth for both sides

## Commands

### Frontend
- `npm run dev` — Vite dev server (`:5173`), proxies `/api` and `/uploads` to `localhost:8081`
- `npm run build` — production build to `dist/`
- `npm run preview` — preview production build locally
- `npm run lint` — ESLint flat config (`eslint.config.js`), JS-only (`.js,.jsx`), no TS plugin
- `npm run generate:api` — deletes + regenerates `src/generated/` from `../openapi/schema.yaml` via `openapi-typescript-codegen` with `--useOptions`

### Backend
- `mvn compile` — compiles + runs OpenAPI codegen (`generate-sources` phase)
- `mvn package -DskipTests` — builds jar (skip slow Testcontainers tests)
- `mvn test` — runs tests (requires Docker daemon for Testcontainers)

### Docker (full stack)
- `docker compose up` — starts PostgreSQL, backend (`:8081`), frontend nginx (`:3000`)

## Code generation

- **Both sides** generated from `openapi/schema.yaml`. After schema changes, regenerate both.
- Backend: Maven `openapi-generator-maven-plugin` → `target/generated-sources/openapi/` (interfaces + DTOs only, `interfaceOnly=true`)
- Frontend: `npm run generate:api` → `src/generated/` (models, services, schemas, core). **Dir is gitignored** — must be regenerated after clone.
- Frontend OpenAPI client uses `fetch` with `useOptions` (named params object, not positional args).

## Architecture

### Backend layers
`Controller` → `Service` → `Repository` (Spring Data JPA) → `Entity` (JPA)
Cross-cutting: `Mapper` (MapStruct), `GlobalExceptionHandler` (`@RestControllerAdvice`)

### Frontend API calls
`Page/Component` → hand-written `src/services/*.ts` (type conversion, image URL resolution) → generated `src/generated/services/*.ts` (static classes) → `src/generated/core/request.ts` (fetch) → backend

### Routing
All routes in `src/main.tsx` via `createBrowserRouter` (`react-router-dom` v7). `App.tsx` is **unused legacy** — do not modify. Admin panel uses state-based section switching.

### State
- `StoreContext` — global: products, categories, banners, static pages, config. Fetched on mount.
- `CartContext` — cart persisted to `localStorage` (`amena-cart` key), supports promo codes.

## Database

- PostgreSQL with Liquibase (`ddl-auto: validate` — schema changes need a Liquibase changeset).
- 20 migration files in `backend/src/main/resources/db/changelog/changes/` (19 in master changelog; `016-seed-demo-commandes.yaml` is excluded).
- Dev defaults: `amena/amena123` on `localhost:5432/amena`.

## Key gotchas

- Auth token: read from `localStorage` key `auth_token` for every API request (set in `src/api.ts`).
- Frontend env: `VITE_API_URL` defaults to `http://localhost:8081`. Actual `.env` and Vite proxy both target `:8081`.
- TypeScript strict: `noUnusedLocals`, `noUnusedParameters`, `noUncheckedSideEffectImports` are enabled — unused imports/vars cause build errors.
- No test framework on frontend; backend tests use Testcontainers (require Docker daemon).
- Image uploads: admin uses separate endpoints (`productImageService.ts`, `bannerService.ts`) from product/banner create/update.
- Upload dir is `backend/uploads/` (`.gitignore`d), served at `/uploads` path.
- `src/pages/AddUser.tsx` and `src/pages/Forum.tsx` are unused legacy files.
