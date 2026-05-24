# Norheimsposten React

Norheimsposten is a full-stack news app built as a pnpm workspace with:

- React + Vite client
- Cloudflare Worker API (Hono)
- JWT-based authentication with role-based access (`reader`, `editor`, `admin`)

## Tech Stack

- Frontend: React 18, Vite, React Router — deployed on **Cloudflare Pages**
- Backend: Hono on **Cloudflare Workers**
- Database: **Cloudflare D1** (SQLite)
- Object storage: **Cloudflare R2** (image uploads)
- Auth: JSON Web Tokens (jose) + PBKDF2 (Web Crypto API)
- Tooling: pnpm workspaces

## Workspace Structure

```text
Norheimsposten_React/
├── client/                    # React app (Vite)
├── server/                    # Legacy Express + MongoDB server (not deployed)
├── worker/                    # Cloudflare Worker (Hono API)
│   ├── src/
│   │   ├── index.js           # Entry point, CORS, R2 file serving
│   │   ├── routes/            # auth, articles, uploads, users, health
│   │   ├── middleware/        # JWT auth + role guards
│   │   ├── utils/             # PBKDF2 crypto, displayName
│   │   └── db/migrations/     # D1 SQL schema
│   └── wrangler.toml
├── package.json               # Root workspace scripts
└── pnpm-workspace.yaml
```

## Prerequisites

- Node.js 18+
- pnpm 9+
- Cloudflare account (free tier is sufficient)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/) (`pnpm exec wrangler`)

## Local Development

Install dependencies from the project root:

```bash
pnpm install
```

Copy the worker secrets file and fill in values:

```bash
cp worker/.dev.vars.example worker/.dev.vars
```

`worker/.dev.vars`:

```env
JWT_SECRET=any-local-secret-at-least-32-characters
ALLOWED_ORIGINS=http://localhost:5173
```

Start client + worker together:

```bash
pnpm dev:cf
```

Default local URLs:

- Client: `http://localhost:5173`
- Worker: `http://localhost:8787`

The client dev server picks up `VITE_API_BASE_URL` from `client/.env.local`:

```env
VITE_API_BASE_URL=http://localhost:8787
```

## Available Scripts

### Root

| Script | Description |
|---|---|
| `pnpm dev:cf` | Run Worker + client together (Cloudflare stack) |
| `pnpm dev` | Run legacy Express server + client |

### Worker (`worker/`)

| Script | Description |
|---|---|
| `pnpm --filter worker dev` | Start Worker locally with wrangler |
| `pnpm --filter worker deploy` | Deploy Worker to Cloudflare |
| `pnpm --filter worker db:migrate:local` | Apply SQL migration to local D1 |
| `pnpm --filter worker db:migrate:remote` | Apply SQL migration to remote D1 |

### Client

| Script | Description |
|---|---|
| `pnpm --filter client dev` | Start Vite dev server |
| `pnpm --filter client build` | Build production assets |

## First-time Cloudflare Setup

```bash
cd worker

# Log in to Cloudflare
pnpm exec wrangler login

# Create D1 database — copy the database_id into wrangler.toml
pnpm exec wrangler d1 create norheimsposten-db

# Create R2 bucket
pnpm exec wrangler r2 bucket create norheimsposten-uploads

# Run migration on remote DB
pnpm exec wrangler d1 execute norheimsposten-db --remote --file=src/db/migrations/0001_initial.sql

# Set secrets
openssl rand -base64 48 | tr -d '\n' | pnpm exec wrangler secret put JWT_SECRET
pnpm exec wrangler secret put ALLOWED_ORIGINS   # e.g. https://your-site.pages.dev

# Deploy
pnpm exec wrangler deploy
```

## Deploying the Frontend

Build and deploy to Cloudflare Pages:

```bash
# From project root
VITE_API_BASE_URL=https://norheimsposten-worker.isak-graarud.workers.dev \
  pnpm --filter client build

# From worker/
pnpm exec wrangler pages deploy ../client/dist \
  --project-name=norheimsposten-client \
  --branch=main
```

## Live URLs

| Service | URL |
|---|---|
| Frontend | https://norheimsposten-client.pages.dev |
| Worker API | https://norheimsposten-worker.isak-graarud.workers.dev |

## API Overview

Base URL: `/api`

### Health

- `GET /health`

### Auth

- `POST /auth/register`
- `POST /auth/login`

### Articles

- `GET /articles` — published articles (optional `?category=` filter)
- `GET /articles/:id`
- `POST /articles` — requires `editor` or `admin`
- `PUT /articles/:id` — requires `editor` or `admin`
- `DELETE /articles/:id` — requires `admin`

### Uploads

- `POST /uploads` — multipart image upload to R2, requires `editor` or `admin`
- `GET /uploads/:filename` — serve image from R2

### Users

- `GET /users` — requires `admin`
- `PATCH /users/:id/role` — requires `admin`

## Notes

- Passwords are hashed with PBKDF2 (Web Crypto API). Existing bcrypt hashes from the legacy Express server are not compatible — users must re-register.
- Login returns a JWT stored in `localStorage` under `np_auth`.
- The first user to register gets the `reader` role. Promote to `admin` via:
  ```bash
  cd worker && pnpm exec wrangler d1 execute norheimsposten-db --remote \
    --command="UPDATE users SET role='admin' WHERE email='your@email.com'"
  ```
