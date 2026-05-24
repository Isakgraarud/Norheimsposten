# Local Development Setup

Follow these steps in order. By the end you will have the frontend and API running locally on your machine, with a working admin account.

---

## Step 1 — Install dependencies

From the root of the repo, run:

```bash
pnpm install
```

This installs packages for all workspaces (root, client, worker).

---

## Step 2 — Create the worker secrets file

The worker needs a secret key for signing JWTs. Copy the example file:

```bash
cp worker/.dev.vars.example worker/.dev.vars
```

Now generate a random secret:

```bash
openssl rand -base64 48 | tr -d '\n'
```

Copy the output. Open `worker/.dev.vars` and replace `your-dev-secret-min-32-chars-long` with what you just copied:

```
JWT_SECRET=<paste your generated secret here>
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174
```

Save the file. This file is gitignored — it will never be committed.

---

## Step 3 — Create the frontend environment file

Create a new file at `client/.env.local` with this content:

```
VITE_API_BASE_URL=http://localhost:8787
```

This tells the frontend where to find the local API. This file is also gitignored.

---

## Step 4 — Set up the local database

The worker uses Cloudflare D1 (a SQLite database). Wrangler emulates it locally. Run this once to create the tables:

```bash
pnpm --filter worker db:migrate:local
```

You should see: `2 commands executed successfully.`

If you ever need to start fresh, delete `worker/.wrangler/state/` and run this command again.

---

## Step 5 — Start the dev server

```bash
pnpm dev:cf
```

This starts both the frontend and the worker API at the same time. Wait until you see both of these lines in the output:

```
VITE v5.x.x  ready in ...ms
  ➜  Local:   http://localhost:5173/

[wrangler:inf] Ready on http://localhost:8787
```

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Worker API | http://localhost:8787 |

> If port 5173 is already taken, Vite will use 5174 instead. Make sure `ALLOWED_ORIGINS` in `worker/.dev.vars` includes whichever port Vite picks, then restart the server.

---

## Step 6 — Create a local admin account

The local database starts empty, so you need to register and then grant yourself admin access.

**1.** Open http://localhost:5173 and register a new account using any email and password.

**2.** Run this command (replace the email with the one you just registered):

```bash
cd worker && pnpm exec wrangler d1 execute norheimsposten-db --local \
  --command="UPDATE users SET role='admin' WHERE email='your@email.com'"
```

**3.** Log out of the app and log back in. You now have admin access.

---

## Troubleshooting

**The frontend loads but API calls fail**
Check that `VITE_API_BASE_URL` in `client/.env.local` matches the port Wrangler is running on (should be `8787`). Also check that the frontend port is listed in `ALLOWED_ORIGINS` in `worker/.dev.vars`, then restart with `pnpm dev:cf`.

**Port already in use**
Find and kill the process using the port:
```bash
# find what's on port 8787
lsof -ti :8787

# kill it
kill $(lsof -ti :8787)
```

**Database errors / missing tables**
Re-run the migration: `pnpm --filter worker db:migrate:local`

**wrangler: command not found**
Run `pnpm install` from the repo root first.