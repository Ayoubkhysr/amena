# Amena — AGENTS.md

## Project structure

- `frontend/` — React 19 + Vite 8 + TypeScript 6 + Tailwind CSS 4
- `backend/` — Spring Boot 3.2.4 + Java 21 + Maven + PostgreSQL + Liquibase
- `openapi/schema.yaml` — single source of truth for both `frontend/src/generated/` and backend OpenAPI codegen

## Commands

### Frontend
- `npm run dev` — Vite dev server (`:5173`), proxies `/api` and `/uploads` to `localhost:8081`
- `npm run build` — production build to `dist/`
- `npm run lint` — ESLint (flat config, JS-only, no TS plugin)
- `npm run generate:api` — regenerates `src/generated/` from `../openapi/schema.yaml` via `openapi-typescript-codegen`

### Backend
- `mvn compile` — compiles + runs OpenAPI codegen (generate-sources phase)
- `mvn package -DskipTests` — builds jar (skip slow Testcontainers tests)
- `mvn test` — runs tests (requires PostgreSQL via Testcontainers)

### Docker (full stack)
- `docker compose up` — starts PostgreSQL, backend (port 8080→8081), frontend (nginx, port 3000)
- `deployment/dev/docker-compose.yml` — same stack, relative paths for out-of-tree use

## Architecture

### Backend layers
`Controller` → `Service` → `Repository` (Spring Data JPA) → `Entity` (JPA)
Cross-cutting: `Mapper` (MapStruct), `GlobalExceptionHandler` (`@RestControllerAdvice`)

### Frontend API calls
`Page/Component` → hand-written `src/services/*.ts` (type conversion, image URL resolution) → generated `src/generated/services/*.ts` (static classes) → `src/generated/core/request.ts` (fetch) → backend

### Routing
All routes defined in `src/main.tsx` via `createBrowserRouter`. `App.tsx` is **unused legacy** — do not modify. Admin panel uses state-based section switching (not route params).

### State
- `StoreContext` — global: products, categories, banners, static pages, config. Fetched on mount.
- `CartContext` — cart persisted to `localStorage` (`amena-cart` key), supports promo codes.

## Code generation

- **Both sides** generated from `openapi/schema.yaml`.
- Backend: Maven plugin in `generate-sources` phase → `target/generated-sources/openapi/` (interfaces + DTOs only, `interfaceOnly=true`)
- Frontend: `npm run generate:api` → `src/generated/` (models, services, schemas, core)
- **After schema changes**, regenerate both sides.

## Database

- PostgreSQL with Liquibase (`ddl-auto: validate`, not `update`).
- 19 migration files in `backend/src/main/resources/db/changelog/changes/`.
- Dev defaults: `amena/amena123` on `localhost:5432/amena`.

## Key gotchas

- `ddl-auto: validate` — schema changes require a Liquibase changeset, not just entity changes.
- Backend server.port is `8080` in `application.yml`, mapped to `8081` in Docker Compose. Vite proxy expects `localhost:8081`.
- No test framework on frontend; backend tests use Testcontainers (require Docker daemon).
- Auth token read from `localStorage` key `auth_token` for every API request.
- Frontend env: `VITE_API_URL` (defaults to `http://localhost:8081`).
- `src/pages/AddUser.tsx` and `src/pages/Forum.tsx` are unused legacy files.
- Admin image uploads handled via `productImageService.ts` (separate endpoint from product create/update).
- Upload dir is `backend/uploads/` (`.gitignore`d), served at `/uploads` path.
