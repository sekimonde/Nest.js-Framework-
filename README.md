# TP1 NestJS – Todos API

A clean NestJS 11 REST API for managing todos with PostgreSQL, TypeORM, DTO validation, pagination/filtering, and soft-delete/restore. Includes a demo `users` endpoint with a UUID provider.

## Tech Stack

- NestJS 11
- TypeScript
- TypeORM (PostgreSQL)
- Class Validator / Transformer
- Jest (unit/e2e ready)
- ESLint + Prettier

## Architecture

- `src/app.module.ts`: Root module wiring `CommonModule`, `UsersModule`, `TodoModule`, `TypeOrmModule.forRoot(...)`
- `src/main.ts`: Bootstraps app, sets global `ValidationPipe` (whitelist, forbidNonWhitelisted, transform)
- `src/config/database.config.ts`: Reads DB config from `.env` using `dotenv`
- `src/todo/`: Controller, Service, DTOs, Entity
- `src/users/`: Simple demo create endpoint using a UUID provider
- `src/generics/timestamp.entity.ts`: Base entity with `createdAt`, `updatedAt`, `deletedAt`
- `src/types/pagination.interface.ts`: `PaginationResult<T>` response shape

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 13+
- npm

### Installation

```bash
npm install
```

### Environment

Create a `.env` at project root:

```env
# Server
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=tp1_nest
```

Notes:
- TypeORM `synchronize: true` is enabled for developer convenience.
- Ensure the database exists or that your user can create it.

### Running

```bash
# development
npm run start

# watch mode
npm run dev

# production build
npm run build
npm run start:prod
```

### Lint & Format

```bash
npm run lint
npm run format
```

### Tests

```bash
# unit tests
npm run test

# watch
npm run test:watch

# coverage
npm run test:cov

# e2e tests
npm run test:e2e
```

## API

Base URL: `http://localhost:${PORT:-3000}`

### Health

- `GET /` → `"Hello World!"` from `AppService`

### Users

- `POST /users` → returns a generated UUID and a fixed name:
  ```json
  { "id": "c8b3a184-...", "name": "Helmi" }
  ```

### Todos

Entity: `TodoEntity` (`todos` table)

```ts
{
  id: number
  name: string
  description: string
  status: 'pending' | 'in_progress' | 'done'
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}
```

Statuses (`src/enum/todoStatus.enum.ts`):
- `pending`
- `in_progress`
- `done`

Validation messages in `src/constants/messages.ts` (French).

#### List with Pagination & Filters

- `GET /todos`
- Query params (`searchfilter.dto`):
  - `page` number (required)
  - `limit` number (required)
  - `search` string (optional, matches `name` OR `description`, ILIKE)
  - `status` enum (optional: `pending|in_progress|done`)
- Response (`PaginationResult<TodoEntity>`):
  ```json
  {
    "page": 1,
    "limit": 10,
    "total": 42,
    "pageCount": 5,
    "hasPreviousPage": false,
    "hasNextPage": true,
    "dataLength": 10,
    "data": [ ]
  }
  ```

Examples:
```bash
curl "http://localhost:3000/todos?page=1&limit=10"
curl "http://localhost:3000/todos?page=1&limit=10&search=home"
curl "http://localhost:3000/todos?page=1&limit=10&status=in_progress"
```

#### Get by ID

- `GET /todos/:id`

#### Create

- `POST /todos`
- Body (`CreateTodoDto`):
  ```json
  { "name": "Task 1", "description": "At least 10 characters" }
  ```
- Validation:
  - `name`: required, length 3–10
  - `description`: required, min length 10

#### Update

- `PUT /todos/:id`
- Body (`UpdateTodoDto` – all fields optional, plus `status` enum):
  ```json
  { "name": "New name", "description": "New description", "status": "done" }
  ```

#### Delete Variants

- Hard delete by `Repository.delete`:
  - `DELETE /todos/delete/:id` → string message
- Hard remove by `Repository.remove` (requires fetch first):
  - `DELETE /todos/remove/:id` → removed entity
- Soft delete by `Repository.softDelete`:
  - `DELETE /todos/softdelete/:id`
- Soft remove by `Repository.softRemove` (validates not already soft-deleted):
  - `DELETE /todos/softremove/:id`
- Restore soft-deleted:
  - `DELETE /todos/restore/:id` (uses `Repository.restore`)
  - Note: Semantically this could be `POST /todos/:id/restore`, but implemented as above.

#### Aggregation

- `GET /todos/count` → count by status:
  ```json
  { "pending": 10, "in_progress": 5, "done": 27 }
  ```

## Error Handling & Validation

  - `whitelist: true` → strips unknown fields
  - `forbidNonWhitelisted: true` → rejects unknown fields
  - `transform: true` → transforms payloads to DTO types

Typical validation error response:
```json
{
  "statusCode": 400,
  "message": [
    "Le champ name est obligatoire.",
    "La description doit contenir au moins 10 caractères."
  ],
  "error": "Bad Request"
}
```

## Project Structure

```bash
src/
  app.module.ts
  main.ts
  common/
    common.module.ts
    common.providers.ts        # UUID generator token
  config/
    database.config.ts         # TypeORM & dotenv
  constants/
    messages.ts                # French validation messages
  enum/
    todoStatus.enum.ts
  generics/
    timestamp.entity.ts        # createdAt, updatedAt, deletedAt
  types/
    pagination.interface.ts
  todo/
    dto/
      create-todo.dto.ts
      update-todo.dto.ts
      searchfilter.dto.ts
    entities/
      todo.entity.ts
    todo.controller.ts
    todo.service.ts
  users/
    users.controller.ts
    users.service.ts
```

## Database

Configured via `TypeOrmModule.forRoot(typeOrmConfig)`.

```ts
// src/config/database.config.ts
{
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  autoLoadEntities: true,
  synchronize: true
}
```

- Entities auto-loaded from modules
- Soft delete supported via `DeleteDateColumn` and TypeORM soft operations

## Scripts

- `npm run start` – dev
- `npm run dev` – watch mode
- `npm run start:prod` – run compiled app
- `npm run build` – compile TS to `dist/`
- `npm run lint` – ESLint fix
- `npm run format` – Prettier
- `npm run test*` – Jest suite

## License

This project is marked `"license": "UNLICENSED"` in `package.json`.
---
