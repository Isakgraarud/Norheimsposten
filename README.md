# Norheimsposten React

Norheimsposten is a full-stack news app built as a pnpm workspace with:

- React + Vite client
- Express + MongoDB API server
- JWT-based authentication with role-based access (`reader`, `editor`, `admin`)

## Tech Stack

- Frontend: React 18, Vite, React Router
- Backend: Node.js, Express 5, Mongoose
- Database: MongoDB
- Auth: JSON Web Tokens + bcrypt
- Tooling: pnpm workspaces

## Workspace Structure

```text
Norheimsposten_React/
├── client/                    # React app (Vite)
├── server/                    # Express API + MongoDB models/routes
├── package.json               # Root workspace scripts
└── pnpm-workspace.yaml
```

## Prerequisites

- Node.js 18+
- pnpm 9+
- MongoDB running locally or remotely

## Installation

```bash
pnpm install
```

## Environment Variables

There is no `.env.example` in this repository, so create env files manually.

### Server env file

Create `server/.env`:

```env
PORT=5001
MONGO_URI=mongodb://127.0.0.1:27017/norheimsposten
JWT_SECRET=replace_with_a_long_random_secret
```

### Client env file (optional)

The client proxies `/api` requests to `http://localhost:5001` by default.
If your API runs on a different URL, create `client/.env`:

```env
VITE_API_PROXY_TARGET=http://localhost:5001
```

## Running Locally

Start client and server together from the project root:

```bash
pnpm dev
```

Default local URLs:

- Client: `http://localhost:5173`
- API: `http://localhost:5001`

## Available Scripts

### Root (`package.json`)

- `pnpm dev`: Run both server and client concurrently

### Server (`server/package.json`)

- `pnpm --filter server dev`: Start API with nodemon
- `pnpm --filter server start`: Start API in production mode

### Client (`client/package.json`)

- `pnpm --filter client dev`: Start Vite dev server
- `pnpm --filter client build`: Build production assets
- `pnpm --filter client preview`: Preview production build

## API Overview

Base URL: `/api`

### Health

- `GET /health`

### Auth

- `POST /auth/register`
- `POST /auth/login`

### Articles

- `GET /articles` (published articles)
- `GET /articles/:id`
- `POST /articles` (requires `editor` or `admin` token)

### Movies

- `GET /movies`
- `POST /movies`

## Notes

- The API will exit on startup if `MONGO_URI` is missing or MongoDB cannot be reached.
- Login returns a JWT stored by the client in `localStorage` (`np_auth`).
- Article creation requires a valid bearer token in `Authorization` header.
