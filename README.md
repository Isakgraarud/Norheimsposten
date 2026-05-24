# Norheimsposten React

Norheimsposten is a full-stack news app built as a pnpm monorepo.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, React Router — **Cloudflare Pages** |
| Backend | Hono — **Cloudflare Workers** |
| Database | **Cloudflare D1** (SQLite) |
| Object storage | **Cloudflare R2** (image uploads) |
| Auth | JWT ([jose](https://github.com/panva/jose)) + PBKDF2 (Web Crypto API) |
| Tooling | pnpm workspaces |

## Workspace Structure

```
Norheimsposten_React/
├── client/                        # React + Vite frontend
└── worker/                        # Cloudflare Worker (Hono API)
    ├── src/
    │   ├── index.js               # Entry point, CORS, R2 file serving
    │   ├── routes/                # auth, articles, uploads, users, health
    │   ├── middleware/auth.js     # JWT verification + role guards
    │   ├── utils/                 # PBKDF2 crypto, displayName
    │   └── db/migrations/         # D1 SQL schema
    └── wrangler.toml
```

## Live URLs

| | URL |
|---|---|
| Frontend | https://norheimsposten-client.pages.dev |
| API | https://norheimsposten-worker.isak-graarud.workers.dev |

## Local Development

```bash
pnpm install
cp worker/.dev.vars.example worker/.dev.vars
# fill in JWT_SECRET in worker/.dev.vars
pnpm dev:cf
```

- Client: http://localhost:5173
- Worker: http://localhost:8787

Set `VITE_API_BASE_URL=http://localhost:8787` in `client/.env.local`.

## Deploying

### Automatic (recommended)

Push to the `deployed` branch — GitHub Actions deploys both the Worker and frontend automatically:

```bash
git checkout deployed
git merge main          # or your feature branch
git push origin deployed
```

### Manual

```bash
cd worker

# Deploy backend
pnpm exec wrangler deploy

# Deploy frontend (from repo root, then worker/)
cd .. && VITE_API_BASE_URL=https://norheimsposten-worker.isak-graarud.workers.dev pnpm --filter client build
cd worker && pnpm exec wrangler pages deploy ../client/dist --project-name=norheimsposten-client --branch=main
```

## First-time Cloudflare Setup

```bash
cd worker
pnpm exec wrangler login

# Create D1 database — copy the database_id into wrangler.toml
pnpm exec wrangler d1 create norheimsposten-db

# Create R2 bucket
pnpm exec wrangler r2 bucket create norheimsposten-uploads

# Run DB migration
pnpm exec wrangler d1 execute norheimsposten-db --remote --file=src/db/migrations/0001_initial.sql

# Set secrets
openssl rand -base64 48 | tr -d '\n' | pnpm exec wrangler secret put JWT_SECRET
echo "https://norheimsposten-client.pages.dev" | pnpm exec wrangler secret put ALLOWED_ORIGINS

pnpm exec wrangler deploy
```

Add `CLOUDFLARE_API_TOKEN` to GitHub repo secrets (Settings → Secrets → Actions) to enable automatic deploys.

## Promoting a user to admin

```bash
cd worker && pnpm exec wrangler d1 execute norheimsposten-db --remote \
  --command="UPDATE users SET role='admin' WHERE email='your@email.com'"
```

## API Overview

Base URL: `https://norheimsposten-worker.isak-graarud.workers.dev/api`

| Method | Path | Auth |
|---|---|---|
| GET | `/health` | — |
| POST | `/auth/register` | — |
| POST | `/auth/login` | — |
| GET | `/articles` | — |
| GET | `/articles/:id` | — |
| POST | `/articles` | editor, admin |
| PUT | `/articles/:id` | editor, admin |
| DELETE | `/articles/:id` | admin |
| POST | `/uploads` | editor, admin |
| GET | `/uploads/:filename` | — |
| GET | `/users` | admin |
| PATCH | `/users/:id/role` | admin |
